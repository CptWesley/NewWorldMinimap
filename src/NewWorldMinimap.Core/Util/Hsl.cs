using SixLabors.ImageSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace NewWorldMinimap.Core.Util
{
    public record Hsl(float Hue, float Saturation, float Lightness)
    {
        public static Hsl FromRgb(Color c)
            => FromRgb((Vector4)c);

        public static Hsl FromRgb(int r, int g, int b)
            => FromRgb(r / 255f, g / 255f, b / 255f);

        public static Hsl FromRgb(float r, float g, float b)
            => FromRgb(new Vector4(r, g, b, 1));

        public static Hsl FromRgb(Vector4 rgb)
        {
            float rp = rgb.X;
            float gp = rgb.Y;
            float bp = rgb.Z;

            float cMax = Math.Max(rp, Math.Max(gp, bp));
            float cMin = Math.Min(rp, Math.Min(gp, bp));

            float delta = cMax - cMin;

            float hue = 0;
            if (cMax == rp)
            {
                hue = ((gp - bp) / delta) % 6;
            }
            else if (cMax == gp)
            {
                hue = ((bp - rp) / delta) + 2;
            }
            else if (cMax == bp)
            {
                hue = ((rp - gp) / delta) + 4;
            }

            hue *= 60;

            float lightness = (cMax + cMin) / 2;
            float saturation = delta == 0 ? 0 : delta / (1 - Math.Abs(2 * lightness - 1));

            return new Hsl(hue, saturation, lightness);
        }

        public static implicit operator Hsl(Color c)
            => FromRgb(c);

        public static implicit operator Hsl(Vector4 c)
            => FromRgb(c);

        public bool IsSimilarTo(Hsl other, float hTolerance, float sTolerance, float lTolerance)
        {
            float hd = Math.Abs(Hue - other.Hue);
            float ld = Math.Abs(Lightness - other.Lightness);
            float sd = Math.Abs(Saturation - other.Saturation);

            return hd <= hTolerance && sd <= sTolerance && ld <= lTolerance;
        }
    }
}