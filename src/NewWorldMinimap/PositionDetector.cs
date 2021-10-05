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
        private static readonly ITesseract tesseract = new TesseractPool();
        private static readonly Regex posRegex = new Regex(@"(\d{7,8}) (\d{6,7}) (\d{5,6})", RegexOptions.Compiled);
        private static readonly Color textColor = Color.FromArgb(169, 169, 125);

        public bool TryGetPosition(Bitmap bmp, out Vector3 position)
        {
            using Bitmap cut = bmp.Crop(0.856, 0.017, 0.143, 0.017);
            using Bitmap scaled = new Bitmap(cut, cut.Width * 4, cut.Height * 4);

            using Bitmap segmented = scaled.Segment(textColor, 25);
            using Bitmap dilated1 = segmented.Dilute();
            using Bitmap dilated2 = dilated1.Dilute();

            if (TryGetPositionInternal(dilated2, out position))
            {
                return true;
            }

            position = default;
            return false;
        }

        private bool TryGetPositionInternal(Bitmap bmp, out Vector3 position)
        {
            bmp.SetResolution(300, 300);
            string text = tesseract.Read(bmp);
            text = Regex.Replace(text, @"[^0-9 ]+", string.Empty);
            text = Regex.Replace(text, @"\s+", " ").Trim();

            Match m = posRegex.Match(text);

            if (m.Success && m.Length == text.Length)
            {
                float x = float.Parse(Regex.Replace(m.Groups[1].Value, @"\s+", string.Empty), CultureInfo.InvariantCulture) / 1000;
                float y = float.Parse(Regex.Replace(m.Groups[2].Value, @"\s+", string.Empty), CultureInfo.InvariantCulture) / 1000;
                float z = float.Parse(Regex.Replace(m.Groups[3].Value, @"\s+", string.Empty), CultureInfo.InvariantCulture) / 1000;
                position = CorrectPosition(new Vector3(x, y, z));

                return IsSensiblePosition(position);
            }

            position = default;
            return false;
        }

        private Vector3 CorrectPosition(Vector3 pos)
            => new Vector3(pos.X > 14260 ? pos.X - 10000 : pos.X, pos.Y, pos.Z);

        private bool IsSensiblePosition(Vector3 pos)
            => pos.X >= 4468 && pos.X <= 14260 && pos.Y >= 84 && pos.Y <= 9999;
    }
}
