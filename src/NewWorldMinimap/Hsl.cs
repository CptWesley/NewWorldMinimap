using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NewWorldMinimap
{
    public record Hsl(double Hue, double Saturation, double Lightness)
    {
        public static Hsl FromRgb(Color rgb)
        {
            double rp = rgb.R / 255.0;
            double gp = rgb.G / 255.0;
            double bp = rgb.B / 255.0;

            double cMax = Math.Max(rp, Math.Max(gp, bp));
            double cMin = Math.Min(rp, Math.Min(gp, bp));

            double delta = cMax - cMin;

            double hue = 0;
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

            double lightness = (cMax + cMin) / 2;
            double saturation = delta == 0 ? 0 : delta / (1 - Math.Abs(2 * lightness - 1));

            return new Hsl(hue, saturation, lightness);
        }
    }
}
