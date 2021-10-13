using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Numerics;
using NewWorldMinimap.Core;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;

namespace NewWorldMinimap.TestBench
{
    /// <summary>
    /// Entry point of the program.
    /// </summary>
    public static class Program
    {
        private static PositionDetector pd = new PositionDetector();

        /// <summary>
        /// Defines the entry point of the application.
        /// </summary>
        /// <param name="args">The arguments.</param>
        public static void Main(string[] args)
        {
            if (args is null)
            {
                args = Array.Empty<string>();
            }

            string searchPath = args.Length > 0 ? args[0] : "../../../Data";

            Dictionary<string, List<Result>> results = RunAll(searchPath).GroupBy(x => x.Category).ToDictionary(x => x.Key, x => x.ToList());

            int totalFailures = 0;
            int totalRuns = 0;
            ulong totalTimeFail = 0;
            ulong totalTimeSuccess = 0;

            Console.WriteLine();

            foreach (KeyValuePair<string, List<Result>> group in results)
            {
                Console.WriteLine($"=== Category: {group.Key}");
                int failures = 0;

                foreach (Result result in group.Value)
                {
                    totalRuns++;

                    if (!result.Success)
                    {
                        totalFailures++;
                        failures++;
                        totalTimeFail += result.Time;
                        Console.WriteLine($"[Fail] {result}");
                    }
                    else
                    {
                        totalTimeSuccess += result.Time;
                    }
                }

                Console.WriteLine();
                Console.WriteLine($"Correct: {group.Value.Count - failures} / {group.Value.Count}");
                Console.WriteLine();
            }

            int totalSuccess = totalRuns - totalFailures;

            Console.WriteLine("===== TOTAL =====");

            if (totalRuns == 0)
            {
                Console.WriteLine("No runs were executed. Check your configuration.");
            }

            Console.WriteLine($"Correct: {totalSuccess}/{totalRuns} ({((float)totalSuccess / totalRuns * 100).ToString("0.00", CultureInfo.InvariantCulture)}%)");
            Console.WriteLine($"Average success time: {((float)totalTimeSuccess / totalRuns).ToString("0.00", CultureInfo.InvariantCulture)}ms");
            Console.WriteLine($"Average failure time: {((float)totalTimeFail / totalRuns).ToString("0.00", CultureInfo.InvariantCulture)}ms");
        }

        private static IEnumerable<Result> RunAll(string path)
        {
            foreach (string file in Directory.EnumerateFiles(path, "*", SearchOption.AllDirectories))
            {
                if (Path.GetExtension(file) == ".txt")
                {
                    continue;
                }

                yield return Run(path, file);
            }
        }

        private static Result Run(string root, string fileName)
        {
            string dir = Path.GetDirectoryName(fileName);
            string cat = dir.Replace("\\", "/").Replace(root.Replace("\\", "/"), string.Empty).Substring(1);
            string name = Path.GetFileNameWithoutExtension(fileName);

            string txtFile = Path.Combine(dir, name + ".txt");
            string txtContent = File.ReadAllText(txtFile);
            Vector2 expected = ToVector(txtContent);

            using Image<Rgba32> img = Image.Load<Rgba32>(fileName);

            Stopwatch sw = Stopwatch.StartNew();
            pd.TryGetPosition(img, out Vector2 found, false, out Image<Rgba32> debugImage);
            pd.ResetCounter();
            sw.Stop();

            return new Result(cat, name, found, expected, (ulong)sw.ElapsedMilliseconds);
        }

        private static Vector2 ToVector(string coords)
        {
            string[] parts = coords.Split(' ');

            float x = float.Parse(parts[0], CultureInfo.InvariantCulture);
            float y = float.Parse(parts[1], CultureInfo.InvariantCulture);

            return new Vector2(x, y);
        }
    }

    /// <summary>
    /// Used for passing around results of the test benchmark.
    /// </summary>
    public record Result(string Category, string Name, Vector2 Found, Vector2 Expected, ulong Time)
    {
        /// <summary>
        /// Gets a value indicating whether the result was correct.
        /// </summary>
        public bool Success => Found == Expected;
    }
}
