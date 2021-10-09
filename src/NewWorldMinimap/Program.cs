using System;
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
            SetProcessDPIAware();
            Application.EnableVisualStyles();
            using Form map = new MapForm();
            Application.Run(map);
        }

        [System.Runtime.InteropServices.DllImport("user32")]
        private static extern bool SetProcessDPIAware();
    }
}
