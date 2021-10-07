using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Reflection;
using NewWorldMinimap.Util;

namespace NewWorldMinimap.Caches
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
            Register("player.png", "player", Color.Yellow);
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

            Register("chest.png", "chests", Color.SaddleBrown);

            Register("document.png", "documents", Color.LightYellow);

            Register("plant.png", "plants", Color.Green);

            Register("skull.png", "monsters", Color.Green);
            Register("turkey.png", "turkey", Color.Brown);
            Register("turkey.png", "turkey_nest", Color.DodgerBlue);
            Register("wolf.png", "wolf", Color.LightGray);
            Register("wolf.png", "wolf_elemental", Color.DodgerBlue);
            Register("deer.png", "elk", Color.SaddleBrown);
            Register("deer.png", "elk_elemental", Color.DodgerBlue);
            Register("skull.png", "named", Color.Red);
            Register("alligator.png", "alligator", Color.Olive);
            Register("rabbit.png", "rabbit", Color.White);
            Register("bear.png", "bear", Color.SaddleBrown);
            Register("bear.png", "bear_elemental", Color.DodgerBlue);
            Register("pig.png", "pig", Color.LightPink);
            Register("pig.png", "boar", Color.DarkGray);
            Register("cow.png", "cow", Color.WhiteSmoke);
            Register("cow.png", "bison", Color.DarkOrange);
            Register("goat.png", "goat", Color.LightGray);
            Register("sheep.png", "sheep", Color.WhiteSmoke);
            Register("leopard.png", "leopard", Color.DarkOrange);
            Register("leopard.png", "lion", Color.DarkGoldenrod);
            Register("leopard.png", "lynx", Color.SlateGray);

            Register("essence.png", "essences", Color.Green);

            Register("essence.png", "air_boid", Color.WhiteSmoke);
            Register("essence_minus.png", "air_plant", Color.WhiteSmoke);
            Register("essence_plus.png", "air_stone", Color.WhiteSmoke);
            Register("essence.png", "death_boid", Color.DarkViolet);
            Register("essence_minus.png", "death_plant", Color.DarkViolet);
            Register("essence_plus.png", "death_stone", Color.DarkViolet);
            Register("essence.png", "earth_boid", Color.SaddleBrown);
            Register("essence_minus.png", "earth_plant", Color.SaddleBrown);
            Register("essence_plus.png", "earth_stone", Color.SaddleBrown);
            Register("essence.png", "fire_boid", Color.Orange);
            Register("essence_minus.png", "fire_plant", Color.Orange);
            Register("essence_plus.png", "fire_stone", Color.Orange);
            Register("essence.png", "life_boid", Color.Firebrick);
            Register("essence_minus.png", "life_plant", Color.Firebrick);
            Register("essence_plus.png", "life_stone", Color.Firebrick);
            Register("essence.png", "soul_boid", Color.HotPink);
            Register("essence_minus.png", "soul_plant", Color.HotPink);
            Register("essence_plus.png", "soul_stone", Color.HotPink);
            Register("essence.png", "water_boid", Color.DodgerBlue);
            Register("essence_minus.png", "water_plant", Color.DodgerBlue);
            Register("essence_plus.png", "water_stone", Color.DodgerBlue);
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
