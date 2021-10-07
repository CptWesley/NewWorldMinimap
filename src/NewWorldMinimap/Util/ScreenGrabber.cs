using System.Drawing;
using System.Drawing.Imaging;
using System.Windows.Forms;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;

namespace NewWorldMinimap.Util
{
    /// <summary>
    /// Provides logic for getting a screenshot of an image.
    /// </summary>
    public static class ScreenGrabber
    {
        /// <summary>
        /// Takes the screenshot.
        /// </summary>
        /// <param name="screenIndex">Index of the screen.</param>
        /// <returns>The taken screenshot.</returns>
        public static Image<Rgba32> TakeScreenshot(int screenIndex = 0)
        {
            Screen[] screens = Screen.AllScreens;
            Screen screen = screenIndex >= 0 && screenIndex < screens.Length ? screens[screenIndex] : Screen.PrimaryScreen;

            using Bitmap bmp = new Bitmap(screen.Bounds.Width, screen.Bounds.Height, PixelFormat.Format32bppRgb);

            using (Graphics g = Graphics.FromImage(bmp))
            {
                g.CopyFromScreen(screen.Bounds.X, screen.Bounds.Y, 0, 0, screen.Bounds.Size, CopyPixelOperation.SourceCopy);
            }

            return bmp.ToImageSharp();
        }
    }
}
