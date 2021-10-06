using System;
using System.Drawing;
using System.Globalization;
using System.Numerics;
using System.Text.RegularExpressions;
using TesserNet;

namespace NewWorldMinimap
{
    /// <summary>
    /// Provides logic for performing OCR to find the position of the player.
    /// </summary>
    /// <seealso cref="IDisposable" />
    public class PositionDetector : IDisposable
    {
        private static readonly Regex PosRegex = new Regex(@"(\d{4,5} \d{3}) (\d{3,4} \d{3}) (\d{2,3} \d{3})", RegexOptions.Compiled);
        private static readonly Color TextColor = Color.FromArgb(169, 169, 125);

        private readonly ITesseract tesseract = new TesseractPool(new TesseractOptions
        {
            PageSegmentation = PageSegmentation.Line,
            Numeric = true,
        });

        private bool disposedValue;

        /// <summary>
        /// Finalizes an instance of the <see cref="PositionDetector"/> class.
        /// </summary>
        ~PositionDetector()
            => Dispose(false);

        /// <summary>
        /// Tries to get the position from the provided image.
        /// </summary>
        /// <param name="bmp">The image.</param>
        /// <param name="position">The position.</param>
        /// <returns>The found position.</returns>
        public bool TryGetPosition(Bitmap bmp, out Vector3 position)
        {
            using Bitmap cut = bmp.Crop(bmp.Width - 277, 18, 277, 18);
            using Bitmap scaled = new Bitmap(cut, cut.Width * 4, cut.Height * 4);

            using Bitmap segmented = scaled.Segment(TextColor, 20, 0.1, 0.1);

            using Graphics g = Graphics.FromImage(segmented);
            g.FillRectangle(Brushes.White, 0, 0, segmented.Width, 8);

            using Bitmap dilated1 = segmented.Dilate();

            using Bitmap input = new Bitmap(dilated1.Width * 3, dilated1.Height * 3);
            using Graphics g2 = Graphics.FromImage(input);
            g2.Clear(Color.White);
            g2.DrawImage(dilated1, dilated1.Width, dilated1.Height);

            if (TryGetPositionInternal(input, out position))
            {
                return true;
            }

            position = default;
            return false;
        }

        /// <inheritdoc/>
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        /// <summary>
        /// Releases unmanaged and - optionally - managed resources.
        /// </summary>
        /// <param name="disposing"><c>true</c> to release both managed and unmanaged resources; <c>false</c> to release only unmanaged resources.</param>
        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    tesseract.Dispose();
                }

                disposedValue = true;
            }
        }

        private bool TryGetPositionInternal(Bitmap bmp, out Vector3 position)
        {
            bmp.SetResolution(300, 300);
            string text = tesseract.Read(bmp).Trim();
            Console.WriteLine("Read: " + text);
            text = Regex.Replace(text, @"[^0-9]+", " ");
            text = Regex.Replace(text, @"\s+", " ").Trim();
            Match m = PosRegex.Match(text);

            if (m.Success && m.Length == text.Length)
            {
                float x = float.Parse(m.Groups[1].Value.Replace(' ', '.'), CultureInfo.InvariantCulture);
                float y = float.Parse(m.Groups[2].Value.Replace(' ', '.'), CultureInfo.InvariantCulture);
                float z = float.Parse(m.Groups[3].Value.Replace(' ', '.'), CultureInfo.InvariantCulture);
                position = CorrectPosition(new Vector3(x, y, z));

                return IsSensiblePosition(position);
            }

            position = default;
            return false;
        }

        private Vector3 CorrectPosition(Vector3 pos)
            => new Vector3(pos.X > 14260 ? pos.X - 10000 : pos.X, pos.Y, pos.Z);

        private bool IsSensiblePosition(Vector3 pos)
            => pos.X >= 4468 && pos.X <= 14260 && pos.Y >= 84 && pos.Y <= 9999;
    }
}
