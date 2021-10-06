using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Reflection;

namespace NewWorldMinimap
{
    /// <summary>
    /// Provides logic for caching icons.
    /// </summary>
    public class IconCache
    {
        private readonly Dictionary<string, Bitmap> baseFiles = new Dictionary<string, Bitmap>();
        private readonly Dictionary<string, Bitmap> types = new Dictionary<string, Bitmap>();

        /// <summary>
        /// Initializes a new instance of the <see cref="IconCache"/> class.
        /// </summary>
        public IconCache()
        {
            Register("player.png", "player", Color.Red);
            Register("unknown.png", "unknown", Color.Red);

            Register("ore.png", "ores", Color.Green);
            Register("ore.png", "iron", Color.SaddleBrown);
            Register("ore.png", "crystal", Color.LightCyan);
            Register("ore.png", "gold", Color.Gold);
            Register("ore.png", "lodestone", Color.OrangeRed);
            Register("ore.png", "orichalcum", Color.DarkRed);
            Register("ore.png", "saltpeter", Color.White);
            Register("ore.png", "seeping_stone", Color.DarkGray);
            Register("ore.png", "silver", Color.Silver);
            Register("ore.png", "starmetal", Color.Blue);

            Register("tree.png", "woods", Color.Green);
            Register("tree.png", "ironwood", Color.Gray);
            Register("tree.png", "wyrdwood", Color.DarkBlue);
            Register("tree.png", "Briar", Color.Brown);

            Register("fish.png", "fishing", Color.Green);
            Register("fish.png", "hotspot_broad", Color.Blue);
            Register("fish.png", "hotspot_rare", Color.Yellow);
            Register("fish.png", "hotspot_secret", Color.Red);

            Register("chest.png", "chests", Color.Brown);

            Register("document.png", "documents", Color.LightYellow);

            Register("plant.png", "plants", Color.Green);
        }

        /// <summary>
        /// Gets the icon for the given marker.
        /// </summary>
        /// <param name="marker">The marker.</param>
        /// <returns>The found icon.</returns>
        public Bitmap Get(Marker marker)
        {
            if (types.TryGetValue(marker.Type, out Bitmap result))
            {
                return result;
            }

            if (types.TryGetValue(marker.Category, out result))
            {
                return result;
            }

            return types["unknown"];
        }

        /// <summary>
        /// Gets the icon for the given type or category name.
        /// </summary>
        /// <param name="name">The type or category name.</param>
        /// <returns>The found icon.</returns>
        public Bitmap Get(string name)
        {
            if (types.TryGetValue(name, out Bitmap result))
            {
                return result;
            }

            return types["unknown"];
        }

        private void Register(string baseName, string type, Color color)
        {
            Bitmap b = LoadBase(baseName);
            Bitmap result = b.Walk(c =>
            {
                if (c.R == 0 && c.B == 0 && c.G == 255)
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

            using Stream stream = Assembly.GetExecutingAssembly().GetManifestResourceStream($"NewWorldMinimap.Resources.icons.{name}");
            using Bitmap temp = new Bitmap(stream);
            bmp = new Bitmap(temp);
            baseFiles[name] = bmp;
            return bmp;
        }
    }
}
