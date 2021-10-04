using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace NewWorldMinimap
{
    public static class BitmapExtensions
    {
        public static Bitmap Crop(this Bitmap bmp, Rectangle area)
        {
            int correctedX = Math.Max(Math.Min(bmp.Width - 1, area.X), 0);
            int correctedY = Math.Max(Math.Min(bmp.Height - 1, area.Y), 0);
            int correctedWidth = Math.Max(Math.Min(bmp.Width - correctedX, area.Width), 0);
            int correctedHeight = Math.Max(Math.Min(bmp.Height - correctedY, area.Height), 0);
            Rectangle correctedArea = new Rectangle(correctedX, correctedY, correctedWidth, correctedHeight);

            return bmp.Clone(correctedArea, PixelFormat.Format24bppRgb);
        }

        public static Bitmap Crop(this Bitmap bmp, int x, int y, int width, int height)
            => bmp.Crop(new Rectangle(x, y, width, height));

        public static Bitmap Crop(this Bitmap bmp, double x, double y, double width, double height)
        {
            double correctedX = Math.Max(Math.Min(x, 1), 0);
            double correctedY = Math.Max(Math.Min(y, 1), 0);
            double correctedWidth = Math.Max(Math.Min(width, 1), 0);
            double correctedHeight = Math.Max(Math.Min(height, 1), 0);

            return bmp.Crop((int)(correctedX * bmp.Width), (int)(correctedY * bmp.Height), (int)(correctedWidth * bmp.Width), (int)(correctedHeight * bmp.Height));
        }

        public static Bitmap Segment(this Bitmap bmp, Color color, int tolerance)
            => bmp.Walk(cur =>
            {
                if (IsSameAs(cur, color, tolerance))
                {
                    return Color.Black;
                }

                return Color.White;
            });

        public static Bitmap Walk(this Bitmap bmp, Func<int, int, Color, Color> func)
        {
            Rectangle rect = new Rectangle(0, 0, bmp.Width, bmp.Height);
            Bitmap result = bmp.Clone(rect, PixelFormat.Format24bppRgb);
            BitmapData bmpData = result.LockBits(rect, ImageLockMode.ReadWrite, result.PixelFormat);

            IntPtr ptr = bmpData.Scan0;
            int bytes = Math.Abs(bmpData.Stride) * bmp.Height;
            byte[] rgbValues = new byte[bytes];
            Marshal.Copy(ptr, rgbValues, 0, bytes);

            for (int counter = 2; counter < rgbValues.Length; counter += 3)
            {
                Color current = Color.FromArgb(rgbValues[counter], rgbValues[counter - 1], rgbValues[counter - 2]);
                int i = (counter / 3);
                int y = i / bmp.Width;
                int x = (i - y * bmp.Width);
                Color newColor = func(x, y, current);
                rgbValues[counter - 2] = newColor.B;
                rgbValues[counter - 1] = newColor.G;
                rgbValues[counter] = newColor.R;
            }

            Marshal.Copy(rgbValues, 0, ptr, bytes);
            result.UnlockBits(bmpData);

            return result;
        }

        public static Bitmap MakeCenter(this Bitmap bmp, int x, int y)
        {
            Bitmap result = new Bitmap(bmp.Width, bmp.Height);
            using Graphics g = Graphics.FromImage(result);

            g.DrawImage(bmp, bmp.Width / 2 - x, bmp.Height / 2 - y);

            return result;
        }

        public static Bitmap Walk(this Bitmap bmp, Func<Color, Color> func)
            => bmp.Walk((x, y, c) => func(c));

        private static bool IsSameAs(Color a, Color b, int tolerance)
        {
            if (Math.Abs(a.R - b.R) > tolerance)
            {
                return false;
            }

            if (Math.Abs(a.G - b.G) > tolerance)
            {
                return false;
            }

            if (Math.Abs(a.B - b.B) > tolerance)
            {
                return false;
            }

            return true;
        }
    }
}
