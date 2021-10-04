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
    public class IconCache
    {
        private readonly Dictionary<string, Bitmap> baseFiles = new Dictionary<string, Bitmap>();
        private readonly Dictionary<string, Bitmap> types = new Dictionary<string, Bitmap>();

        public IconCache()
        {
            Register("ore.png", "iron", Color.SaddleBrown);
            Register("ore.png", "crystal", Color.LightCyan);
            Register("ore.png", "gold", Color.Yellow);
            Register("ore.png", "lodestone", Color.OrangeRed);
            Register("ore.png", "orichalcum", Color.DarkRed);
            Register("ore.png", "saltpeter", Color.White);
            Register("ore.png", "seeping_stone", Color.DarkGray);
            Register("ore.png", "silver", Color.Silver);
            Register("ore.png", "starmetal", Color.Blue);
        }

        private void Register(string baseName, string type, Color color)
        {
            Bitmap b = LoadBase(baseName);
            Bitmap result = b.Walk(c =>
            {
                if (c.A > 0)
                {
                    return color;
                }

                return c;
            });

            types[type] = result;
        }

        private Bitmap LoadBase(string name)
        {
            if (baseFiles.TryGetValue(name, out Bitmap bmp))
            {
                return bmp;
            }

            using Stream stream = Assembly.GetExecutingAssembly().GetManifestResourceStream($"NewWorldMinimap.Resources.{name}");
            using Bitmap temp = new Bitmap(stream);
            bmp = new Bitmap(temp);
            baseFiles[name] = bmp;
            return bmp;
        }

        public Bitmap Get(string type)
        {
            if (types.TryGetValue(type, out Bitmap result))
            {
                return result;
            }

            return types["iron"];
        }
    }
}
