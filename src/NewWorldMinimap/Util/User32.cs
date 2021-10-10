using System;
using System.Runtime.InteropServices;

namespace NewWorldMinimap.Util
{
    /// <summary>
    /// Static class to interact with the methods exposed by user32.dll.
    /// </summary>
    public static class User32
    {
        /// <summary>
        /// Get the title of the active window.
        /// </summary>
        /// <returns>Title of the window as a string or null if an error occurs.</returns>
        public static string? GetActiveWindowTitle()
        {
            const int nChars = 256;
            var buff = new char[nChars];
            var handle = SafeNativeMethods.GetForegroundWindow();
            var titleLen = SafeNativeMethods.GetWindowText(handle, buff, nChars);

            if (titleLen > 0)
            {
                return new string(buff, 0, titleLen);
            }

            return null;
        }

        /// <summary>
        /// Inner class of User32 used to contain the extern user32 invokes.
        /// </summary>
        internal static class SafeNativeMethods
        {
            /// <summary>
            /// Retrieves a handle to the foreground window.
            /// </summary>
            /// <returns>
            /// The return value is a handle to the foreground window. The foreground window can be NULL in certain circumstances, such as when a window is losing activation.
            /// </returns>
            [DllImport("user32.dll")]
            [DefaultDllImportSearchPaths(DllImportSearchPath.System32)]
            internal static extern IntPtr GetForegroundWindow();

            /// <summary>
            /// Retreives the title bar text of the specified window.
            /// </summary>
            /// <param name="hWnd">A handle to the window or control containing the text.</param>
            /// <param name="text">The buffer that will receive the text.</param>
            /// <param name="count">The maximum number of characters to copy to the buffer, including the null character. If the text exceeds this limit, it is truncated.</param>
            /// <returns>
            /// If the function succeeds, the return value is the length, in characters, of the copied string, not including
            /// the terminating null character. If the window has no title bar or text, if the title bar is empty, or if the window
            /// or control handle is invalid, the return value is zero.
            /// </returns>
            [DllImport("user32.dll")]
            [DefaultDllImportSearchPaths(DllImportSearchPath.System32)]
            internal static extern int GetWindowText(IntPtr hWnd, [Out] char[] text, int count);
        }
    }
}
