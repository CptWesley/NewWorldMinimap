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
        private readonly CharacterComparer cc = new CharacterComparer();
        private static readonly ITesseract tesseract = new TesseractPool(new TesseractOptions()
        {
            //Language = "digits",
            //PixelsPerInch = 300,
        });
        private static readonly Regex posRegex = new Regex(@"(\d{7,8}) (\d{6,7}) (\d{5,6})", RegexOptions.Compiled);
        //private static readonly Color textColor = Color.FromArgb(244, 255, 232);
        private static readonly Color textColor = Color.FromArgb(169, 169, 125);
        //private static readonly Color textColor = Color.FromArgb(247, 244, 189);
        //private static readonly Color textColor = Color.FromArgb(237, 237, 174);
        private static readonly Color textColor2 = Color.FromArgb(243, 0, 182);

        public bool TryGetValue(Bitmap bmp, out float value)
        {
            using Bitmap scaled = new Bitmap(bmp, bmp.Width * 8, bmp.Height * 8);
            using Bitmap segmented = scaled.Segment(textColor, 9);
            using Bitmap diluted = segmented.Dilute();
            using Bitmap eroded = diluted.Erode();
            //eroded.Save("aa.png");
            eroded.Save($"./training_data/{Guid.NewGuid()}.png");

            if (TryGetPositionInternal(eroded, out value))
            {
                return true;
            }

            return false;
        }

        private bool TryGetPositionInternal(Bitmap bmp, out float position)
        {
            string text = tesseract.Read(bmp);
            text = Regex.Replace(text, @"[^\d]+", string.Empty);

            if (text.Length == 4)
            {
                position = float.Parse(text);
                return true;
            }

            position = -1;
            return false;
        }

        private string CutChar(Bitmap bmp, int index)
        {
            int lastIndex = 33;
            int invertedIndex = lastIndex - index;

            double y = 0.019;
            double height = 0.013;

            double width = 0.0047;
            double x = 1 - 0.002 - width * invertedIndex;

            using Bitmap temp = bmp.Crop(x, y, width, height);
            temp.Save($"a{index}.png");

            //Console.WriteLine($"For index: {index}");
            //cc.BestMatch(temp);
            //Console.WriteLine();

            using Bitmap segmented = temp.Segment(textColor, 0);
            segmented.Save($"b{index}.png");

            string s = tesseract.Read(segmented).Trim();
            if (s.Length == 0)
            {
                return ".";
            }

            return s.Length == 1 ? s : "?";
        }

        private string CutChars(Bitmap bmp)
        {
            string result = string.Empty;
            for (int i = 0; i < 32; i++)
            {
                result += CutChar(bmp, i);
            }

            Console.WriteLine(result);
            return result;
        }

        private bool TryGetPositionInternal(string text, out Vector3 position)
        {
            text = Regex.Replace(text, @"[^\u0000-\u007F]+", string.Empty);
            text = Regex.Replace(text, @"[^0-9\.,]", string.Empty);
            text = Regex.Replace(text, @"\s+", ".").Trim();
            text = text.Replace(",", ".");
            text = Regex.Replace(text, @"\.+", ".");
            text = text.TrimEnd('.').TrimStart('.');
            //Console.WriteLine("TEXT: " + text);
            Match m = posRegex.Match(text);

            if (m.Success)
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

        public bool TryGetPosition(Bitmap bmp, out Vector3 position)
        {
            //using Bitmap xCut = bmp.Crop(0.866, 0.019, 0.040, 0.014);
            /*
            using Bitmap xCut = bmp.Crop(0.866, 0.019, 0.02, 0.014);
            using Bitmap yCut = bmp.Crop(0.913, 0.019, 0.02, 0.014);

            if (TryGetValue(xCut, out float x) && TryGetValue(yCut, out float y))
            {
                position = new Vector3(x, y, 1);
                return true;
            }
            */
            /*
            string x = CutChars(bmp);

            if (TryGetPositionInternal(x, out position))
            {
                return true;
            }
            */

            using Bitmap cut = bmp.Crop(0.856, 0.017, 0.143, 0.017);
            using Bitmap scaled = new Bitmap(cut, cut.Width * 4, cut.Height * 4);

            using Bitmap segmented = scaled.Segment(textColor, 25);
            using Bitmap dilated1 = segmented.Dilute();
            using Bitmap dilated2 = dilated1.Dilute();

            if (TryGetPositionInternal(dilated2, out position))
            {
                return true;
            }

            //cut.Save("a.png");

            //if (TryGetPositionInternal(cut, out position))
            {
                //return true;
            }
            /*
            using Bitmap scaled = new Bitmap(cut, cut.Width * 8, cut.Height * 8);

            using Bitmap segmented1 = scaled.Segment(textColor, 3);

            if (TryGetPositionInternal(segmented1, out position))
            {
                return true;
            }

            using Bitmap diluted1 = segmented1.Dilute();
            using Bitmap eroded1 = diluted1.Erode();

            if (TryGetPositionInternal(eroded1, out position))
            {
                return true;
            }

            using Bitmap segmented2 = scaled.Segment(textColor, 6);

            if (TryGetPositionInternal(segmented2, out position))
            {
                return true;
            }

            using Bitmap diluted2 = segmented2.Dilute();
            using Bitmap eroded2 = diluted2.Erode();

            if (TryGetPositionInternal(eroded2, out position))
            {
                return true;
            }

            if (TryGetPositionInternal(cut, out position))
            {
                return true;
            }

            
            /*
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
            */

            position = default;
            return false;
        }

        private bool TryGetPositionInternal(Bitmap bmp, out Vector3 position)
        {
            //bmp.Save($"./training_data2/{Guid.NewGuid()}.png");
            Console.WriteLine($"x: {bmp.HorizontalResolution} y: {bmp.VerticalResolution}");
            bmp.SetResolution(300, 300);
            Console.WriteLine($"x: {bmp.HorizontalResolution} y: {bmp.VerticalResolution}");
            string text = tesseract.Read(bmp);
            Console.WriteLine("TEXTX: " + text);
            /*
            text = Regex.Replace(text, @"[^\u0000-\u007F]+", string.Empty);
            text = Regex.Replace(text, @"[^0-9\.,]", string.Empty);
            text = Regex.Replace(text, @"\s+", ".").Trim();
            text = text.Replace(",", ".");
            text = Regex.Replace(text, @"\.+", ".");
            text = text.TrimEnd('.').TrimStart('.');
            Console.WriteLine("TEXT: " + text);
            */

            text = Regex.Replace(text, @"[^0-9 ]+", string.Empty);
            text = Regex.Replace(text, @"\s+", " ").Trim();
            Console.WriteLine("TEXT: " + text);

            bmp.Save("a.png");
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
