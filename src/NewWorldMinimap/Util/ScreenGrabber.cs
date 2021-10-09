using System.Diagnostics.CodeAnalysis;
using System.Drawing;
using System.Drawing.Imaging;
using System.Windows.Forms;
using NewWorldMinimap.Core.Util;
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
        /// Gets the screen count.
        /// </summary>
        /// <returns>The number of screens.</returns>
        public static int ScreenCount => Screen.AllScreens.Length;

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

        /// <summary>
        /// Gets the index of the primary screen.
        /// </summary>
        /// <returns>The index of the primary screen.</returns>
        [SuppressMessage("Design", "CA1024", Justification = "Performs a computation.")]
        public static int GetPrimaryScreenIndex()
        {
            Screen[] screens = Screen.AllScreens;

            for (int i = 0; i < screens.Length; i++)
            {
                if (screens[i] == Screen.PrimaryScreen)
                {
                    return i;
                }
            }

            return -1;
        }
    }
}
