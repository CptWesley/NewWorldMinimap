using System;
using System.Drawing;

namespace NewWorldMinimap.Util
{
    /// <summary>
    /// Data type containing a HSL-formatted colour.
    /// </summary>
    public record Hsl(double Hue, double Saturation, double Lightness)
    {
        /// <summary>
        /// Creates an <see cref="Hsl"/> instance from an RGB colour.
        /// </summary>
        /// <param name="rgb">The RGB colour.</param>
        /// <returns>The HSL representation of the given colour.</returns>
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
            double saturation = delta == 0 ? 0 : delta / (1 - Math.Abs((2 * lightness) - 1));

            return new Hsl(hue, saturation, lightness);
        }
    }
}
