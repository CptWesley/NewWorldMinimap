using System;
using System.Diagnostics.CodeAnalysis;
using System.Net;
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
        [STAThread]
        [SuppressMessage("Security", "CA5386:Avoid hardcoding SecurityProtocolType value", Justification = "See comment below.")]
        public static void Main()
        {
            // Explicitly add TLS 1.2 to the list of protocols that can be used. On some older systems, most notably Windows 7,
            // older versions of the protocol are used. This causes an error when establishing the SSL/TLS connection with the
            // map service, which disallows such (insecure) connections. By adding it here, the protocol may be selected during
            // handshake negotiations, preventing the error from occurring.
            // Note that we are *adding* the protocol as an eligible selection, not replacing any defaults. This is done using
            // the `|=` operator.
            // This line should be removed if we decide to not support older systems, or when TLS 1.2 is no longer supported by
            // the service.
            ServicePointManager.SecurityProtocol |= SecurityProtocolType.Tls12;

            NativeMethods.SetProcessDPIAware();
            Application.EnableVisualStyles();
            using Form map = new MapForm();
            Application.Run(map);
        }

        private static class NativeMethods
        {
            [DllImport("user32")]
            [DefaultDllImportSearchPaths(DllImportSearchPath.System32)]
            public static extern bool SetProcessDPIAware();
        }
    }
}
