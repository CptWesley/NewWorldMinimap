using System;
using System.Runtime.InteropServices;
using System.Windows.Forms;

namespace NewWorldMinimap
{
    /// <summary>
    /// Entry point of the program.
    /// </summary>
    public static class Program
    {
        /// <summary>
        /// Defines the entry point of the application.
        /// </summary>
        /// <param name="args">The arguments.</param>
        [STAThread]
        public static void Main(string[] args)
        {
            NativeMethods.SetProcessDPIAware();
            Application.EnableVisualStyles();
            using Form map = new MapForm();
            Application.Run(map);
        }

        private static class NativeMethods
        {
            [DllImport("user32")]
            public static extern bool SetProcessDPIAware();
        }
    }
}
