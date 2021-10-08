using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Numerics;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Bmp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace NewWorldMinimap.Core.Util
{
    /// <summary>
    /// Provides extensions for images.
    /// </summary>
    public static class ImageExtensions
    {
        private static readonly Vector4 White = new Vector4(1, 1, 1, 1);
        private static readonly Vector4 Black = new Vector4(0, 0, 0, 1);

        private static readonly BmpEncoder BmpEncoder = new BmpEncoder();
        private static readonly BmpDecoder BmpDecoder = new BmpDecoder();

        /// <summary>
        /// Recenters the image around a new center coordinate.
        /// </summary>
        /// <param name="bmp">The image.</param>
        /// <param name="x">The x coordinate.</param>
        /// <param name="y">The y coordinate.</param>
        /// <returns>The new image.</returns>
        public static Image<Rgba32> Recenter(this Image<Rgba32> bmp, int x, int y)
        {
            Image<Rgba32> result = new Image<Rgba32>(bmp.Width, bmp.Height);
            result.Mutate(c => c.DrawImage(bmp, (bmp.Width / 2) - x, (bmp.Height / 2) - y));
            return result;
        }

        /// <summary>
        /// Converts a System.Drawing image to an ImageSharp image.
        /// </summary>
        /// <param name="bmp">The System.Drawing image.</param>
        /// <returns>The ImageSharp image.</returns>
        public static Image<Rgba32> ToImageSharp(this Bitmap bmp)
        {
            using MemoryStream ms = new MemoryStream();
            bmp.Save(ms, ImageFormat.Bmp);
            ms.Position = 0;
            return SixLabors.ImageSharp.Image.Load<Rgba32>(ms, BmpDecoder);
        }

        /// <summary>
        /// Converts an ImageSharp image to a System.Drawing image.
        /// </summary>
        /// <param name="img">The ImageSharp image.</param>
        /// <returns>The System.Drawing image.</returns>
        public static Bitmap ToBitmap(this Image<Rgba32> img)
        {
            using MemoryStream ms = new MemoryStream();
            img.Save(ms, BmpEncoder);
            ms.Position = 0;
            using Bitmap temp = new Bitmap(ms);
            return new Bitmap(temp);
        }

        /// <summary>
        /// Draws an image.
        /// </summary>
        /// <param name="context">The context.</param>
        /// <param name="img">The image to draw.</param>
        /// <param name="x">The x coordinate.</param>
        /// <param name="y">The y coordinate.</param>
        /// <returns>The same context.</returns>
        public static IImageProcessingContext DrawImage(this IImageProcessingContext context, SixLabors.ImageSharp.Image img, int x, int y)
            => context.DrawImage(img, new SixLabors.ImageSharp.Point(x, y), 1);

        /// <summary>
        /// Draws an image.
        /// </summary>
        /// <param name="context">The context.</param>
        /// <param name="x">The x coordinate in pixels.</param>
        /// <param name="y">The y coordinate in pixels.</param>
        /// <param name="width">The width in pixels.</param>
        /// <param name="height">The height in pixels.</param>
        /// <returns>The same context.</returns>
        public static IImageProcessingContext Crop(this IImageProcessingContext context, int x, int y, int width, int height)
            => context.Crop(new SixLabors.ImageSharp.Rectangle(x, y, width, height));

        /// <summary>
        /// Dilates the binary image with the gives radius.
        /// </summary>
        /// <param name="context">The context.</param>
        /// <param name="radius">The radius.</param>
        /// <returns>the same radius.</returns>
        public static IImageProcessingContext Dilate(this IImageProcessingContext context, int radius)
            => context.BoxBlur(radius)
                .ProcessPixelRowsAsVector4(r =>
                {
                    for (int x = 0; x < r.Length; x++)
                    {
                        Vector4 c = r[x];
                        r[x] = c.X == 1 && c.Y == 1 && c.Z == 1 ? White : Black;
                    }
                });

        /// <summary>
        /// Detects white pixels.
        /// </summary>
        /// <param name="context">The context.</param>
        /// <param name="threshold">The threshold.</param>
        /// <returns>The same context.</returns>
        public static IImageProcessingContext WhiteFilter(this IImageProcessingContext context, float threshold)
            => context.ProcessPixelRowsAsVector4(r =>
            {
                for (int x = 0; x < r.Length; x++)
                {
                    r[x] = r[x].X < threshold ? White : Black;
                }
            });

        public static void Mask(this Image<Rgba32> baseImage, Image<Rgba32> mask)
        {
            for (int y = 0; y < baseImage.Height; y++)
            {
                for (int x = 0; x < baseImage.Width; x++)
                {
                    //Console.WriteLine($"m: {mask[x, y]}");
                    if (mask[x, y].R == 255)
                    {
                        baseImage[x, y] = SixLabors.ImageSharp.Color.Black;
                    }
                }
            }
        }

        public static void Erode(this Image<Rgba32> baseImage)
        {
            using Image<Rgba32> copy = baseImage.Clone();

            Vector4[] nb = new Vector4[9];

            for (int y = 1; y < baseImage.Height - 1; y++)
            {
                for (int x = 1; x < baseImage.Width - 1; x++)
                {
                    nb[0] = copy[x - 1, y - 1].ToVector4();
                    nb[1] = copy[x - 1, y].ToVector4();
                    nb[2] = copy[x - 1, y + 1].ToVector4();
                    nb[3] = copy[x, y - 1].ToVector4();
                    nb[4] = copy[x, y].ToVector4();
                    nb[5] = copy[x, y + 1].ToVector4();
                    nb[6] = copy[x + 1, y - 1].ToVector4();
                    nb[7] = copy[x + 1, y].ToVector4();
                    nb[8] = copy[x + 1, y + 1].ToVector4();

                    baseImage[x, y] = nb.Any(v => v == White) ? (SixLabors.ImageSharp.Color)White : (SixLabors.ImageSharp.Color)Black;
                }
            }
        }

        /// <summary>
        /// Detects white pixels.
        /// </summary>
        /// <param name="context">The context.</param>
        /// <param name="threshold">The threshold.</param>
        /// <returns>The same context.</returns>
        public static IImageProcessingContext HslFilter(this IImageProcessingContext context, Hsl color, float hTolerance, float sTolerance, float lTolerance)
            => context.ProcessPixelRowsAsVector4(r =>
            {
                for (int x = 0; x < r.Length; x++)
                {
                    r[x] = color.IsSimilarTo(Hsl.FromRgb(r[x]), hTolerance, sTolerance, lTolerance) ? Black : White;
                }
            });
    }
}
