using System;
using System.Globalization;
using System.Numerics;
using System.Text.RegularExpressions;
using NewWorldMinimap.Core.Util;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using TesserNet;

namespace NewWorldMinimap.Core
{
    /// <summary>
    /// Provides logic for performing OCR to find the position of the player.
    /// </summary>
    /// <seealso cref="IDisposable" />
    public class PositionDetector : IDisposable
    {
        private const int XOffset = 277;
        private const int YOffset = 18;
        private const int TextWidth = 277;
        private const int TextHeight = 18;

        private static readonly Regex PosRegex = new Regex(@"(\d{4,5} \d{3}) (\d{3,4} \d{3}) (\d{2,3} \d{3})", RegexOptions.Compiled);

        private readonly ITesseract tesseract = new TesseractPool(new TesseractOptions
        {
            PageSegmentation = PageSegmentation.Line,
            Numeric = true,
            Whitelist = "[]0123456789 ,.",
            //Language = "engrestrict_best_int"
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
        private Image<Rgba32> GetString(Image<Rgba32> img)
        {
            Image<Rgba32> combined = new Image<Rgba32>(Characters * CharWidth * Scale, CharHeight * Scale);
            combined.Mutate(c =>
            {
                c.BackgroundColor(Color.Black);

                for (int i = 0; i < Characters; i++)
                {
                    using Image<Rgba32> charImg = GetChar(img, i);
                    c.DrawImage(charImg, new Point(CharWidth * Scale * i), 0, 1);
                }
            });

            return combined;
        }

        private const int Characters = 33;
        private const int CharHeight = 14;
        private const int CharWidth = 9;
        private const int Scale = 4;

        private static readonly Hsl Upper = Hsl.FromRgb(255, 255, 239);
        private static readonly Hsl Lower = Hsl.FromRgb(182, 182, 171);
        private static readonly Hsl Mid = new Hsl((Upper.Hue + Lower.Hue) / 2, (Upper.Saturation + Lower.Saturation) / 2, (Upper.Lightness + Lower.Lightness) / 2);
        private static readonly float SaturationRange = Math.Abs(Upper.Saturation - Lower.Saturation);
        private static readonly float LightnessRange = Math.Abs(Upper.Saturation - Lower.Saturation);

        private Image<Rgba32> GetChar(Image<Rgba32> img, int index)
        {
            int invertedIndex = Characters - index;
            int y = 21;

            int x = img.Width - 4 - (CharWidth * invertedIndex);

            Image<Rgba32> tex = img.Clone(c => c
                .Crop(x, y, CharWidth, CharHeight)
                .Resize(CharWidth * (Scale / 2), CharHeight * (Scale / 2)));

            Image<Rgba32> cimg = tex.Clone(c => c
                .HistogramEqualization()
                .WhiteFilter(0.8f)
                .Dilate(1));

            tex.Mask(cimg);

            //cimg.SaveAsPng($"c-{index}-1.png");
            //tex.SaveAsPng($"c-{index}-2.png");
            /*
            //tex.Mutate(c => c.HistogramEqualization().WhiteFilter(0.8f));
            //Console.WriteLine(Upper);
            //Console.WriteLine(Lower);

            tex.Mutate(c => c.HslFilter(Mid, 30, SaturationRange * 1.2f, LightnessRange * 1.2f));

            tex.SaveAsPng($"c-{index}-3.png");

            cimg.Mutate(c => c.Pad(cimg.Width * 3, cimg.Height * 3).BackgroundColor(Color.White));

            cimg.SaveAsPng($"c-{index}-4.png");

            string found = tesseract.Read(cimg).Trim();
            cimg.Mutate(c => c.Invert());
            string found2 = tesseract.Read(cimg).Trim();

            Console.WriteLine($"GUESS 1: {found}");
            Console.WriteLine($"GUESS 2: {found2}");
            */
            return tex;
        }

        /// <summary>
        /// Tries to get the position from the provided image.
        /// </summary>
        /// <param name="bmp">The image.</param>
        /// <param name="position">The position.</param>
        /// <returns>The found position.</returns>
        public bool TryGetPosition(Image<Rgba32> bmp, out Vector3 position)
        {
            bmp.Mutate(x => x
                .Crop(bmp.Width - XOffset, YOffset, TextWidth, TextHeight)
                .Resize(TextWidth * 4, TextHeight * 4)
                .HistogramEqualization()
                .Crop(0, 2 * 4, TextWidth * 4, 16 * 4)
                .WhiteFilter(0.9f)
                .Dilate(2)
                .Pad(TextWidth * 8, TextHeight * 16, Color.White));

            bmp.SaveAsPng($"a-{Guid.NewGuid()}.png");

            if (TryGetPositionInternal(bmp, out position))
            {
                return true;
            }
            

            /*
            using Image<Rgba32> input = GetString(bmp);
            input.SaveAsPng($"a-{Guid.NewGuid()}.png");

            if (TryGetPositionInternal(input, out position))
            {
                return true;
            }
            */
            /*
            string name = Guid.NewGuid().ToString();

            using Image<Rgba32> input = GetString(bmp);
            input.SaveAsPng($"a-{name}-0.png");
            input.Mutate(c => c.Pad(TextWidth * 8, TextHeight * 16, Color.Black).Invert().Contrast(100));
            input.SaveAsPng($"a-{name}-1.png");

            Console.WriteLine("Running for: " + name);

            if (TryGetPositionInternal(input, out position))
            {
                return true;
            }

            Console.WriteLine();
            */

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
