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
        private static readonly Regex PosRegex = new Regex(@"(\d{7,8}) (\d{6,7}) (\d{5,6})", RegexOptions.Compiled);
        private static readonly Color TextColor = Color.FromArgb(169, 169, 125);

        private readonly ITesseract tesseract = new TesseractPool();
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
            using Bitmap cut = bmp.Crop(0.856, 0.017, 0.143, 0.017);
            using Bitmap scaled = new Bitmap(cut, cut.Width * 4, cut.Height * 4);

            using Bitmap segmented = scaled.Segment(TextColor, 25);
            using Bitmap dilated1 = segmented.Dilate();
            using Bitmap dilated2 = dilated1.Dilate();

            if (TryGetPositionInternal(dilated2, out position))
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
            bmp.Save("a.png");
            string text = tesseract.Read(bmp);
            text = Regex.Replace(text, @"[^0-9 ]+", string.Empty);
            text = Regex.Replace(text, @"\s+", " ").Trim();

            Match m = PosRegex.Match(text);

            if (m.Success && m.Length == text.Length)
            {
                float x = float.Parse(Regex.Replace(m.Groups[1].Value, @"\s+", string.Empty), CultureInfo.InvariantCulture) / 1000;
                float y = float.Parse(Regex.Replace(m.Groups[2].Value, @"\s+", string.Empty), CultureInfo.InvariantCulture) / 1000;
                float z = float.Parse(Regex.Replace(m.Groups[3].Value, @"\s+", string.Empty), CultureInfo.InvariantCulture) / 1000;
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
