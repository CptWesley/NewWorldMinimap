using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Linq;
using System.Runtime.InteropServices;

namespace NewWorldMinimap.Util
{
    /// <summary>
    /// Provides extensions for the <see cref="Bitmap"/> class.
    /// </summary>
    public static class BitmapExtensions
    {
        /// <summary>
        /// Crops the specified area.
        /// </summary>
        /// <param name="bmp">The bitmap.</param>
        /// <param name="area">The area to crop.</param>
        /// <returns>A new bitmap containing the provided area.</returns>
        public static Bitmap Crop(this Bitmap bmp, Rectangle area)
        {
            int correctedX = Math.Max(Math.Min(bmp.Width - 1, area.X), 0);
            int correctedY = Math.Max(Math.Min(bmp.Height - 1, area.Y), 0);
            int correctedWidth = Math.Max(Math.Min(bmp.Width - correctedX, area.Width), 0);
            int correctedHeight = Math.Max(Math.Min(bmp.Height - correctedY, area.Height), 0);
            Rectangle correctedArea = new Rectangle(correctedX, correctedY, correctedWidth, correctedHeight);

            return bmp.Clone(correctedArea, PixelFormat.Format24bppRgb);
        }

        /// <summary>
        /// Crops the specified area.
        /// </summary>
        /// <param name="bmp">The bitmap.</param>
        /// <param name="x">The x-coordinate that starts the area.</param>
        /// <param name="y">The y-coordinate that starts the area.</param>
        /// <param name="width">The width of the area.</param>
        /// <param name="height">The height of the area.</param>
        /// <returns>A new bitmap containing the provided area.</returns>
        public static Bitmap Crop(this Bitmap bmp, int x, int y, int width, int height)
            => bmp.Crop(new Rectangle(x, y, width, height));

        /// <summary>
        /// Crops the specified area.
        /// </summary>
        /// <param name="bmp">The bitmap.</param>
        /// <param name="x">The x-coordinate that starts the area in fractions.</param>
        /// <param name="y">The y-coordinate that starts the area in fractions.</param>
        /// <param name="width">The width of the area in fractions.</param>
        /// <param name="height">The height of the area in fractions.</param>
        /// <returns>A new bitmap containing the provided area.</returns>
        public static Bitmap Crop(this Bitmap bmp, double x, double y, double width, double height)
        {
            double correctedX = Math.Max(Math.Min(x, 1), 0);
            double correctedY = Math.Max(Math.Min(y, 1), 0);
            double correctedWidth = Math.Max(Math.Min(width, 1), 0);
            double correctedHeight = Math.Max(Math.Min(height, 1), 0);

            return bmp.Crop((int)(correctedX * bmp.Width), (int)(correctedY * bmp.Height), (int)(correctedWidth * bmp.Width), (int)(correctedHeight * bmp.Height));
        }

        /// <summary>
        /// Segments the image based on the specified colour.
        /// </summary>
        /// <param name="bmp">The bitmap.</param>
        /// <param name="color">The colour.</param>
        /// <param name="hTolerance">The hue tolerance.</param>
        /// <param name="sTolerance">The saturation tolerance.</param>
        /// <param name="lTolerance">The lightness tolerance.</param>
        /// <returns>The segmented image.</returns>
        public static Bitmap Segment(this Bitmap bmp, Color color, double hTolerance, double sTolerance, double lTolerance)
            => bmp.Walk(cur =>
            {
                if (IsSameAs(cur, color, hTolerance, sTolerance, lTolerance))
                {
                    return Color.Black;
                }

                return Color.White;
            });

        /// <summary>
        /// Walks the image and performs a transformation.
        /// </summary>
        /// <param name="bmp">The image.</param>
        /// <param name="func">The function.</param>
        /// <returns>A new image with the transformation applied.</returns>
        public static Bitmap Walk(this Bitmap bmp, Func<int, int, Color, Color> func)
            => bmp.Transform((i, o) =>
            {
                for (int x = 0; x < i.Width; x++)
                {
                    for (int y = 0; y < i.Height; y++)
                    {
                        o[x, y] = func(x, y, i[x, y]);
                    }
                }
            });

        /// <summary>
        /// Performs the given transformation on a copy of the given image.
        /// </summary>
        /// <param name="bmp">The image.</param>
        /// <param name="transformation">The transformation.</param>
        /// <returns>A new image with the transformation applied.</returns>
        public static Bitmap Transform(this Bitmap bmp, Action<ColorData, ColorData> transformation)
        {
            Rectangle rect = new Rectangle(0, 0, bmp.Width, bmp.Height);
            Bitmap result = bmp.Clone(rect, PixelFormat.Format32bppArgb);
            BitmapData bmpData = result.LockBits(rect, ImageLockMode.ReadWrite, result.PixelFormat);

            IntPtr ptr = bmpData.Scan0;
            int bytes = Math.Abs(bmpData.Stride) * bmp.Height;
            byte[] inBytes = new byte[bytes];
            byte[] outBytes = new byte[bytes];
            Marshal.Copy(ptr, inBytes, 0, bytes);

            ColorData dataIn = new ColorData(inBytes, result.Width, result.Height);
            ColorData dataOut = new ColorData(outBytes, result.Width, result.Height);
            transformation(dataIn, dataOut);

            Marshal.Copy(outBytes, 0, ptr, bytes);
            result.UnlockBits(bmpData);

            return result;
        }

        /// <summary>
        /// Recenters the image around a new center coordinate.
        /// </summary>
        /// <param name="bmp">The image.</param>
        /// <param name="x">The x coordinate.</param>
        /// <param name="y">The y coordinate.</param>
        /// <returns>The new image.</returns>
        public static Bitmap Recenter(this Bitmap bmp, int x, int y)
        {
            Bitmap result = new Bitmap(bmp.Width, bmp.Height);
            using Graphics g = Graphics.FromImage(result);

            g.DrawImage(bmp, (bmp.Width / 2) - x, (bmp.Height / 2) - y);

            return result;
        }

        /// <summary>
        /// Erodes the specified image.
        /// </summary>
        /// <param name="bmp">The image.</param>
        /// <returns>The eroded image.</returns>
        public static Bitmap Erode(this Bitmap bmp)
            => bmp.Transform((i, o) =>
            {
                Color[] neighbors = new Color[8];

                for (int x = 0; x < i.Width; x++)
                {
                    for (int y = 0; y < i.Height; y++)
                    {
                        neighbors[0] = bmp.IsValidCoordinate(x - 1, y - 1) ? i[x - 1, y - 1] : Color.White;
                        neighbors[1] = bmp.IsValidCoordinate(x - 1, y) ? i[x - 1, y] : Color.White;
                        neighbors[2] = bmp.IsValidCoordinate(x - 1, y + 1) ? i[x - 1, y + 1] : Color.White;
                        neighbors[3] = bmp.IsValidCoordinate(x, y - 1) ? i[x, y - 1] : Color.White;
                        neighbors[4] = bmp.IsValidCoordinate(x, y + 1) ? i[x, y + 1] : Color.White;
                        neighbors[5] = bmp.IsValidCoordinate(x + 1, y - 1) ? i[x + 1, y - 1] : Color.White;
                        neighbors[6] = bmp.IsValidCoordinate(x + 1, y) ? i[x + 1, y] : Color.White;
                        neighbors[7] = bmp.IsValidCoordinate(x + 1, y + 1) ? i[x + 1, y + 1] : Color.White;

                        o[x, y] = neighbors.Count(x => x.R > 0 || x.G > 0 || x.B > 0) > 1 ? Color.White : Color.Black;
                    }
                }
            });

        /// <summary>
        /// Dilates the specified image.
        /// </summary>
        /// <param name="bmp">The image.</param>
        /// <returns>The dilated image.</returns>
        public static Bitmap Dilate(this Bitmap bmp)
            => bmp.Transform((i, o) =>
            {
                Color[] neighbors = new Color[8];

                for (int x = 0; x < i.Width; x++)
                {
                    for (int y = 0; y < i.Height; y++)
                    {
                        Color cur = o[x, y];
                        if (cur.R == 0 && cur.G == 0 && cur.B == 0)
                        {
                            o[x, y] = Color.Black;
                        }

                        neighbors[0] = bmp.IsValidCoordinate(x - 1, y - 1) ? i[x - 1, y - 1] : Color.White;
                        neighbors[1] = bmp.IsValidCoordinate(x - 1, y) ? i[x - 1, y] : Color.White;
                        neighbors[2] = bmp.IsValidCoordinate(x - 1, y + 1) ? i[x - 1, y + 1] : Color.White;
                        neighbors[3] = bmp.IsValidCoordinate(x, y - 1) ? i[x, y - 1] : Color.White;
                        neighbors[4] = bmp.IsValidCoordinate(x, y + 1) ? i[x, y + 1] : Color.White;
                        neighbors[5] = bmp.IsValidCoordinate(x + 1, y - 1) ? i[x + 1, y - 1] : Color.White;
                        neighbors[6] = bmp.IsValidCoordinate(x + 1, y) ? i[x + 1, y] : Color.White;
                        neighbors[7] = bmp.IsValidCoordinate(x + 1, y + 1) ? i[x + 1, y + 1] : Color.White;

                        o[x, y] = neighbors.Any(x => x.R == 0 && x.G == 0 && x.B == 0) ? Color.Black : Color.White;
                    }
                }
            });

        /// <summary>
        /// Determines whether a coordinate exists on the image.
        /// </summary>
        /// <param name="bmp">The image.</param>
        /// <param name="x">The x coordinate.</param>
        /// <param name="y">The y coordinate.</param>
        /// <returns>
        ///   <c>true</c> if the coordinate lies on the image; otherwise, <c>false</c>.
        /// </returns>
        public static bool IsValidCoordinate(this Bitmap bmp, int x, int y)
            => x >= 0 && x < bmp.Width && y >= 0 && y < bmp.Height;

        /// <summary>
        /// Walks the image and performs a transformation.
        /// </summary>
        /// <param name="bmp">The image.</param>
        /// <param name="func">The function.</param>
        /// <returns>A new image with the transformation applied.</returns>
        public static Bitmap Walk(this Bitmap bmp, Func<Color, Color> func)
            => bmp.Walk((x, y, c) => func(c));

        private static bool IsSameAs(Color a, Color b, double hTolerance, double sTolerance, double lTolerance)
        {
            Hsl x = Hsl.FromRgb(a);
            Hsl y = Hsl.FromRgb(b);

            double hd = Math.Abs(x.Hue - y.Hue);
            double ld = Math.Abs(x.Lightness - y.Lightness);
            double sd = Math.Abs(x.Saturation - y.Saturation);

            return hd <= hTolerance && ld < sTolerance && sd < lTolerance;
        }
    }
}
