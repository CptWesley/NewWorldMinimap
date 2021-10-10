using System;
using System.Runtime.InteropServices;
using System.Text;

namespace NewWorldMinimap.Util
{
    public static class User32
    {
        [StructLayout(LayoutKind.Sequential)]
        public struct Rect
        {
            public int Left;
            public int Top;
            public int Right;
            public int Bottom;
        }
        
        [DllImport("user32.dll")]
        private static extern IntPtr GetForegroundWindow();

        [DllImport("user32.dll")]
        private static extern IntPtr GetWindowRect(IntPtr hWnd, ref Rect rect);

        [DllImport("user32.dll")]
        private static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);

        /// <summary>
        /// Get the title of the active window
        /// </summary>
        /// <returns>Title of the window as a string.</returns>
        public static string? GetActiveWindowTitle()
        {
            const int nChars = 256;
            var buff = new StringBuilder(nChars);
            var handle = GetForegroundWindow();

            return GetWindowText(handle, buff, nChars) > 0 ? buff.ToString() : null;
        }

        /// <summary>
        /// Get rect of the active window
        /// </summary>
        /// <returns>Left, Top, Right, Bottom.</returns>
        public static Rect GetActiveWindowRect()
        {
            var rect = default(Rect);
            var handler = GetForegroundWindow();
            GetWindowRect(handler, ref rect);
            return rect;
        }
    }
}