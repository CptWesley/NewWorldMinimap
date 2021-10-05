using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace NewWorldMinimap
{
    public class CharacterComparer
    {
        private Dictionary<char, List<Bitmap>> masks = new Dictionary<char, List<Bitmap>>();
        public static readonly IEnumerable<char> Characters = new[]
        {
            '0', '1', '2', '3', '4', '5', '6', '8', '9', '[', ']', ',', '.', ' '
        };

        public CharacterComparer()
        {
            masks = new Dictionary<char, List<Bitmap>>();
            masks['0'] = Load("0.png");
            masks['1'] = Load("1.png");
            masks['2'] = Load("2.png");
            masks['3'] = Load("3.png");
            masks['4'] = Load("4.png");
            masks['5'] = Load("5.png");
            masks['6'] = Load("6.png");
            masks['7'] = Load("7.png");
            masks['8'] = Load("8.png");
            masks['9'] = Load("9.png");
            masks['['] = Load("open.png");
            masks[']'] = Load("close.png");
            masks[','] = Load("comma.png");
            masks['.'] = Load("dot.png");
            masks[' '] = Load("space.png");
        }

        private List<Bitmap> Load(string name)
        {
            using Stream stream = Assembly.GetExecutingAssembly().GetManifestResourceStream($"NewWorldMinimap.Resources.text.{name}");
            using Bitmap temp = new Bitmap(stream);
            Bitmap bmp = new Bitmap(temp);

            List<Bitmap> result = new List<Bitmap>();
            result.Add(bmp);
            result.Add(bmp.MakeCenter(1, 0));
            result.Add(bmp.MakeCenter(2, 0));
            result.Add(bmp.MakeCenter(-1, 0));
            result.Add(bmp.MakeCenter(-2, 0));
            return result;
        }

        public char BestMatch(Bitmap bmp)
        {
            char result = ' ';
            double d = double.PositiveInfinity;

            foreach (char c in Characters)
            {
                double candidate = Distance(bmp, c);

                if (candidate < d)
                {
                    d = candidate;
                    result = c;
                }

                Console.WriteLine($"{c} - {candidate}");
            }

            Console.WriteLine($"Best match: {result}");

            return result;
        }

        public double Distance(Bitmap source, char c)
        {
            double d = double.PositiveInfinity;

            foreach (Bitmap mask in masks[c])
            {
                double candidate = DistanceInternal(source, mask);

                if (candidate < d)
                {
                    d = candidate;
                }
            }

            return d;
        }

        private double DistanceInternal(Bitmap source, Bitmap mask)
        {
            double distance = 0;
            int count = 0;

            mask.Walk((x, y, c) =>
            {
                if (c.R != 255 || c.G != 255 || c.B != 255)
                {
                    return c;
                }

                count++;
                distance += HueDistance(c, source.GetPixel(x, y));

                return c;
            });

            //return count > 0 ? distance / count : double.PositiveInfinity;
            return distance;
        }

        private double HueDistance(Color a, Color b)
        {
            double ah = a.GetHue();
            double bh = b.GetHue();

            double avgHue = (ah + bh) / 2;
            return Math.Abs(bh - avgHue);
        }
    }
}
