using NewWorldMinimap.Configuration;
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
            var appConfiguration = new AppConfiguration();

            Application.EnableVisualStyles();
            using Form map = new MapForm(appConfiguration);
            Application.Run(map);
        }
    }
}
