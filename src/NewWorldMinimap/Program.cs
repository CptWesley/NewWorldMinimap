using System;
using System.Windows.Forms;

namespace NewWorldMinimap
{
    /// <summary>
    /// Entry point of the program.
    /// </summary>
    public static class Program
    {
        //https://stackoverflow.com/questions/32438736/taking-a-screenshot-using-graphics-copyfromscreen-with-150-scaling/37800963
        [System.Runtime.InteropServices.DllImport("user32.dll")]
        public static extern bool SetProcessDPIAware();

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
    }
}
