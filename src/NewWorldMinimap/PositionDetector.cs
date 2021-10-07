using System;
using System.Globalization;
using System.Numerics;
using System.Text.RegularExpressions;
using NewWorldMinimap.Util;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using TesserNet;

namespace NewWorldMinimap
{
    /// <summary>
    /// Provides logic for performing OCR to find the position of the player.
    /// </summary>
    /// <seealso cref="IDisposable" />
    public class PositionDetector : IDisposable
    {
        private const int XOffset = 277;
        private const int YOffset = 0;
        private const int TextWidth = 277;
        private const int TextHeight = 36;

        private static readonly Regex PosRegex = new Regex(@"(\d{4,5} \d{3}) (\d{3,4} \d{3}) (\d{2,3} \d{3})", RegexOptions.Compiled);

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
        public bool TryGetPosition(Image<Rgba32> bmp, out Vector3 position)
        {
            bmp.Mutate(x => x
                .Crop(new Rectangle(bmp.Width - XOffset, YOffset, TextWidth, TextHeight))
                .HistogramEqualization()
                .Crop(new Rectangle(0, 20, TextWidth, 16))
                .ProcessPixelRowsAsVector4(r =>
                {
                    for (int x = 0; x < r.Length; x++)
                    {
                        r[x] = r[x].X < 0.9 ? new Vector4(1, 1, 1, 1) : new Vector4(0, 0, 0, 1);
                    }
                })
                .Pad(TextWidth * 3, TextHeight * 3, Color.White));

            bmp.SaveAsPng("a.png");

            if (TryGetPositionInternal(bmp, out position))
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

        private bool TryGetPositionInternal(Image<Rgba32> bmp, out Vector3 position)
        {
            bmp.Metadata.HorizontalResolution = 300;
            bmp.Metadata.VerticalResolution = 300;

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
