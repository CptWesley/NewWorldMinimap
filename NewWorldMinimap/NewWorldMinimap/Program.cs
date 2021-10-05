using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Numerics;
using System.Text.RegularExpressions;
using TesserNet;
using System.Windows.Forms;
using System.Threading;

namespace NewWorldMinimap
{
    public static class Program
    {
        private static readonly PositionDetector pd = new PositionDetector();
        private static readonly Screen screen = Screen.PrimaryScreen;

        [STAThread]
        public static void Main(string[] args)
        {
            Console.WriteLine(Hsl.FromRgb(Color.Red));

            Application.EnableVisualStyles();
            Console.WriteLine("Hello World!");
            /*
            var x = GetImages();
            int i = 0;
            foreach (Bitmap bmp in x)
            {
                Console.WriteLine($"==== {i++} ====");
                if (pd.TryGetPosition(bmp, out Vector3 coord))
                {
                    Console.WriteLine(coord);
                }
                else
                {
                    Console.WriteLine("FAILURE");
                }
                bmp.Dispose();
                Console.WriteLine("==== FIN ====");
                Console.WriteLine();
            }
            */
            Application.Run(new MapForm());
        }

        public static IEnumerable<Bitmap> GetImages()
        {
            foreach (string fileName in Directory.GetFiles("./images/"))
            {
                Bitmap bmp = new Bitmap(fileName);
                yield return bmp;
            }
        }

        private static Bitmap TakeScreenshot()
        {
            Bitmap bmp = new Bitmap(screen.Bounds.Width, screen.Bounds.Height, PixelFormat.Format24bppRgb);

            using (Graphics g = Graphics.FromImage(bmp))
            {
                g.CopyFromScreen(screen.Bounds.X, screen.Bounds.Y, 0, 0, screen.Bounds.Size, CopyPixelOperation.SourceCopy);
            }

            return bmp;
        }
    }
}
