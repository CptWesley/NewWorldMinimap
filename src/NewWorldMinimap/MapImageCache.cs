using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Net.Http;

namespace NewWorldMinimap
{
    /// <summary>
    /// Provides logic for caching background images.
    /// </summary>
    /// <seealso cref="IDisposable" />
    public class MapImageCache : IDisposable
    {
        private const int Width = 224;
        private const int Height = 225;
        private const int TileWidth = 256;
        private const int TileHeight = 256;
        private const int GameMapWidth = 14336;
        private const int GameMapHeight = 14400;
        private const int MaxQueueSize = 2048;

        private bool disposedValue;
        private HttpClient http = new HttpClient();
        private Queue<string> queue = new Queue<string>();
        private Dictionary<string, Bitmap> map = new Dictionary<string, Bitmap>();

        /// <summary>
        /// Initializes a new instance of the <see cref="MapImageCache"/> class.
        /// </summary>
        /// <param name="radius">The radius of tiles around the center tile that are visible.</param>
        public MapImageCache(int radius)
            => Radius = radius;

        /// <summary>
        /// Finalizes an instance of the <see cref="MapImageCache"/> class.
        /// </summary>
        ~MapImageCache()
            => Dispose(false);

        /// <summary>
        /// Gets the radius.
        /// </summary>
        public int Radius { get; }

        /// <summary>
        /// Gets the map tile for the tile coordinates.
        /// </summary>
        /// <param name="x">The x tile coordinate.</param>
        /// <param name="y">The y tile coordinate.</param>
        /// <returns>The map tile.</returns>
        public Bitmap Get(int x, int y)
        {
            if (x < 0 || y < 0 || x >= Width || y >= Height)
            {
                return new Bitmap(TileWidth, TileHeight);
            }

            string name = $"{x}-{y}";
            if (map.TryGetValue(name, out Bitmap cachedInMem))
            {
                return cachedInMem;
            }

            string fileName = ToFileName(x, y);
            Bitmap result;

            if (File.Exists(fileName))
            {
                result = new Bitmap(fileName);
            }
            else
            {
                result = Request(x, y);
                Directory.CreateDirectory("./maps/");
                result.Save(fileName);
            }

            queue.Enqueue(name);
            if (queue.Count > MaxQueueSize)
            {
                string popped = queue.Dequeue();
                Bitmap temp = map[popped];
                map.Remove(popped);
                temp.Dispose();
            }

            map[name] = result;
            return result;
        }

        /// <summary>
        /// Gets the tile for world coordinate.
        /// </summary>
        /// <param name="x">The x world coordinate.</param>
        /// <param name="y">The y world coordinate.</param>
        /// <returns>The joined map.</returns>
        public Bitmap GetTileForCoordinate(double x, double y)
        {
            (int tileX, int tileY) = GetTileCoordinatesForCoordinate(x, y);
            Bitmap result = new Bitmap(TileWidth * (1 + (2 * Radius)), TileHeight * (1 + (2 * Radius)));

            using Graphics g = Graphics.FromImage(result);

            for (int xt = 0; xt < 1 + (Radius * 2); xt++)
            {
                for (int yt = 0; yt < 1 + (Radius * 2); yt++)
                {
                    using Bitmap temp = Get(tileX - Radius + xt, tileY - Radius + yt);
                    g.DrawImage(temp, xt * TileWidth, yt * TileHeight);
                }
            }

            return result;
        }

        /// <summary>
        /// Gets the tile coordinates for world coordinate.
        /// </summary>
        /// <param name="x">The x world coordinate.</param>
        /// <param name="y">The y world coordinate.</param>
        /// <returns>The tile coordinates.</returns>
        public (int X, int Y) GetTileCoordinatesForCoordinate(double x, double y)
        {
            int totalWidth = Width * TileWidth;
            int totalHeight = Height * TileHeight;

            int imageX = (int)(x / GameMapWidth * totalWidth);
            int imageY = (int)((GameMapHeight - y) / GameMapHeight * totalHeight);

            int tileX = imageX / TileWidth;
            int tileY = imageY / TileHeight;

            return (tileX, tileY - 1);
        }

        /// <summary>
        /// Converts to minimap coordinates.
        /// </summary>
        /// <param name="playerX">The player x world coordinate.</param>
        /// <param name="playerY">The player y world coordinate.</param>
        /// <param name="x">The x world coordinate.</param>
        /// <param name="y">The y world coordinate.</param>
        /// <returns>The pixel coordinates.</returns>
        public (int X, int Y) ToMinimapCoordinate(double playerX, double playerY, double x, double y)
        {
            int totalWidth = TileWidth * Width;
            int totalHeight = TileHeight * Height;
            (int tileX, int tileY) = GetTileCoordinatesForCoordinate(playerX, playerY);

            int pixelX = (int)(x / GameMapWidth * totalWidth);
            int pixelY = (int)((GameMapHeight - y) / GameMapHeight * totalHeight);

            int imageX = pixelX - ((tileX - Radius) * TileWidth);
            int imageY = pixelY - ((tileY - Radius + 1) * TileHeight);

            return (imageX, imageY);
        }

        /// <inheritdoc/>
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        /// <summary>
        /// Releases unmanaged and - optionally - managed resources.
        /// </summary>
        /// <param name="disposing"><c>true</c> to release both managed and unmanaged resources; <c>false</c> to release only unmanaged resources.</param>
        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    queue.Clear();
                    queue = null!;
                    map.Clear();
                    map = null!;
                    http.Dispose();
                    http = null!;
                }

                disposedValue = true;
            }
        }

        private static string ToFileName(int x, int y)
            => $"./maps/{x}-{y}.png";

        private Bitmap Request(int x, int y)
        {
            using Stream data = http.GetAsync($"https://cdn.newworldfans.com/newworldmap/8/{x}/{y}.png").Result.Content.ReadAsStreamAsync().Result;
            using Image image = Image.FromStream(data);
            return new Bitmap(image);
        }
    }
}
