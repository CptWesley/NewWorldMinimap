using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
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
    }
}
