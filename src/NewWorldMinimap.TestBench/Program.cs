using System;

namespace NewWorldMinimap.TestBench
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
        public static void Main(string[] args)
        {
            string searchPath = args.Length > 0 ? args[0] : "../../data";

            Console.WriteLine(searchPath);
        }
    }
}
