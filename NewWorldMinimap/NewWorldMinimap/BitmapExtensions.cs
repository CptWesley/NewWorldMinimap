using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Linq;
using System.Numerics;
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

        public static Bitmap Segment(this Bitmap bmp, Color color, double tolerance)
            => bmp.Walk(cur =>
            {
                if (IsSameAs(cur, color, tolerance))
                {
                    return Color.Black;
                }

                return Color.White;
            });

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

        public static Bitmap MakeCenter(this Bitmap bmp, int x, int y)
        {
            Bitmap result = new Bitmap(bmp.Width, bmp.Height);
            using Graphics g = Graphics.FromImage(result);

            g.DrawImage(bmp, bmp.Width / 2 - x, bmp.Height / 2 - y);

            return result;
        }

        public static Bitmap Erode(this Bitmap bmp)
            => bmp.Transform((i, o) =>
            {
                Color[] neighbors = new Color[8];

                for (int x = 0; x < i.Width; x++)
                {
                    for (int y = 0; y < i.Height; y++)
                    {
                        neighbors[0] = bmp.IsValidCoordinate(x - 1, y - 1) ? i[x - 1, y - 1] : Color.Black;
                        neighbors[1] = bmp.IsValidCoordinate(x - 1, y) ? i[x - 1, y] : Color.Black;
                        neighbors[2] = bmp.IsValidCoordinate(x - 1, y + 1) ? i[x - 1, y + 1] : Color.Black;
                        neighbors[3] = bmp.IsValidCoordinate(x, y - 1) ? i[x, y - 1] : Color.Black;
                        neighbors[4] = bmp.IsValidCoordinate(x, y + 1) ? i[x, y + 1] : Color.Black;
                        neighbors[5] = bmp.IsValidCoordinate(x + 1, y - 1) ? i[x + 1, y - 1] : Color.Black;
                        neighbors[6] = bmp.IsValidCoordinate(x + 1, y) ? i[x + 1, y] : Color.Black;
                        neighbors[7] = bmp.IsValidCoordinate(x + 1, y + 1) ? i[x + 1, y + 1] : Color.Black;

                        o[x, y] = neighbors.Count(x => x.R > 0 || x.G > 0 || x.B > 0) > 1 ? Color.White : Color.Black;
                    }
                }
            });

        public static Bitmap Dilute(this Bitmap bmp)
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

                        neighbors[0] = bmp.IsValidCoordinate(x - 1, y - 1) ? i[x - 1, y - 1] : Color.Black;
                        neighbors[1] = bmp.IsValidCoordinate(x - 1, y) ? i[x - 1, y] : Color.Black;
                        neighbors[2] = bmp.IsValidCoordinate(x - 1, y + 1) ? i[x - 1, y + 1] : Color.Black;
                        neighbors[3] = bmp.IsValidCoordinate(x, y - 1) ? i[x, y - 1] : Color.Black;
                        neighbors[4] = bmp.IsValidCoordinate(x, y + 1) ? i[x, y + 1] : Color.Black;
                        neighbors[5] = bmp.IsValidCoordinate(x + 1, y - 1) ? i[x + 1, y - 1] : Color.Black;
                        neighbors[6] = bmp.IsValidCoordinate(x + 1, y) ? i[x + 1, y] : Color.Black;
                        neighbors[7] = bmp.IsValidCoordinate(x + 1, y + 1) ? i[x + 1, y + 1] : Color.Black;

                        o[x, y] = neighbors.Any(x => x.R == 0 && x.G == 0 && x.B == 0) ? Color.Black : Color.White;
                    }
                }
            });

        public static bool IsValidCoordinate(this Bitmap bmp, int x, int y)
            => x >= 0 && x < bmp.Width && y >= 0 && y < bmp.Height;

        public static Bitmap Walk(this Bitmap bmp, Func<Color, Color> func)
            => bmp.Walk((x, y, c) => func(c));

        private static bool IsSameAs(Color a, Color b, double tolerance)
        {
            Hsl x = Hsl.FromRgb(a);
            Hsl y = Hsl.FromRgb(b);

            double avgHue = (x.Hue + y.Hue) / 2;
            double distance = Math.Abs(y.Hue - avgHue);

            return distance < tolerance;
        }

        public static void DrawImage(this Graphics g, Image img, int x, int y, float angle)
        {
            g.TranslateTransform((float)img.Width / 2, (float)img.Height / 2);
            g.RotateTransform(angle);
            g.TranslateTransform(-(float)img.Width / 2, -(float)img.Height / 2);
            g.DrawImage(img, x, y);
            g.ResetTransform();
        }

        public static void DrawImage(this Graphics g, Image img, int x, int y, Vector2 dir)
        {
            float length = dir.Length();
            float angle = 0;

            if (length != 0)
            {
                Vector2 unit = dir / length;
                angle = (float)(Math.Atan2(unit.Y, unit.X) / Math.PI * 180);
            }

            Console.WriteLine(angle);
            g.DrawImage(img, x, y, angle);
        }

        public static void DrawImage(this Graphics g, Image img, int x, int y, Vector3 dir)
            => g.DrawImage(img, x, y, new Vector2(dir.X, dir.Y));
    }
}
