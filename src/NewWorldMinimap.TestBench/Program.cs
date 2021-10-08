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

            Console.WriteLine($"Correct: {totalSuccess}/{totalRuns} ({((float)totalSuccess / totalRuns * 100).ToString("#.00", CultureInfo.InvariantCulture)}%)");
            Console.WriteLine($"Average success time: {((float)totalTimeSuccess / totalRuns).ToString("#.00", CultureInfo.InvariantCulture)}ms");
            Console.WriteLine($"Average failure time: {((float)totalTimeFail / totalRuns).ToString("#.00", CultureInfo.InvariantCulture)}ms");
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
            Vector3 expected = ToVector(txtContent);

            using Image<Rgba32> img = Image.Load<Rgba32>(fileName);

            Stopwatch sw = Stopwatch.StartNew();
            pd.TryGetPosition(img, out Vector3 found);
            sw.Stop();

            return new Result(cat, name, found, expected, (ulong)sw.ElapsedMilliseconds);
        }

        private static Vector3 ToVector(string coords)
        {
            string[] parts = coords.Split(' ');

            float x = float.Parse(parts[0], CultureInfo.InvariantCulture);
            float y = float.Parse(parts[1], CultureInfo.InvariantCulture);
            float z = float.Parse(parts[2], CultureInfo.InvariantCulture);

            return new Vector3(x, y, z);
        }
    }

    /// <summary>
    /// Used for passing around results of the test benchmark.
    /// </summary>
    public record Result(string Category, string Name, Vector3 Found, Vector3 Expected, ulong Time)
    {
        /// <summary>
        /// Gets a value indicating whether the result was correct.
        /// </summary>
        public bool Success => Found == Expected;
    }
}
