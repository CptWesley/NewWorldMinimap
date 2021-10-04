using System;
using System.Collections.Generic;
using System.Drawing;
using System.Globalization;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using TesserNet;

namespace NewWorldMinimap
{
    public class PositionDetector
    {
        private static readonly ITesseract tesseract = new TesseractPool(new TesseractOptions()
        {
            Language = "engrestrict_best_int",
        });
        private static readonly Regex posRegex = new Regex(@"(\d+\.\d+)\.(\d+\.\d+)\.(\d+\.\d+)", RegexOptions.Compiled);
        private static readonly Color textColor = Color.FromArgb(244, 255, 232);

        public bool TryGetPosition(Bitmap bmp, out Vector3 position)
        {
            using Bitmap temp = bmp.Crop(0.8, 0.015, 0.2, 0.02);

            if (TryGetPositionInternal(temp, out position))
            {
                return true;
            }

            using Bitmap segmented1 = temp.Segment(textColor, 80);

            if (TryGetPositionInternal(segmented1, out position))
            {
                return true;
            }

            using Bitmap segmented2 = temp.Segment(textColor, 120);

            if (TryGetPositionInternal(segmented2, out position))
            {
                return true;
            }

            using Bitmap red = temp.Walk(c => Color.FromArgb(255, c.G, c.B));

            if (TryGetPositionInternal(red, out position))
            {
                return true;
            }

            using Bitmap green = temp.Walk(c => Color.FromArgb(c.R, 255, c.B));

            if (TryGetPositionInternal(green, out position))
            {
                return true;
            }

            using Bitmap blue = temp.Walk(c => Color.FromArgb(c.R, c.G, 255));

            if (TryGetPositionInternal(blue, out position))
            {
                return true;
            }

            position = default;
            return false;
        }

        private bool TryGetPositionInternal(Bitmap bmp, out Vector3 position)
        {
            bmp.Save($"last.png");
            string text = tesseract.Read(bmp);
            text = Regex.Replace(text, @"[^\u0000-\u007F]+", string.Empty);
            text = Regex.Replace(text, @"[^0-9\.,]", string.Empty);
            text = Regex.Replace(text, @"\s+", ".").Trim();
            text = text.Replace(",", ".");
            text = Regex.Replace(text, @"\.+", ".");
            text = text.TrimEnd('.').TrimStart('.');
            Match m = posRegex.Match(text);

            if (m.Success && m.Length == text.Length)
            {
                float x = float.Parse(Regex.Replace(m.Groups[1].Value, @"\s+", string.Empty), CultureInfo.InvariantCulture);
                float y = float.Parse(Regex.Replace(m.Groups[2].Value, @"\s+", string.Empty), CultureInfo.InvariantCulture);
                float z = float.Parse(Regex.Replace(m.Groups[3].Value, @"\s+", string.Empty), CultureInfo.InvariantCulture);
                position = new Vector3(x, y, z);
                return true;
            }

            position = default;
            return false;
        }
    }
}
