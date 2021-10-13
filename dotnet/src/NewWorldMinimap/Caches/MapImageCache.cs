using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace NewWorldMinimap.Caches
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
        private static readonly object Lock = new object();

        private bool disposedValue;
        private HttpClient http = new HttpClient();
        private Queue<string> queue = new Queue<string>();
        private Dictionary<string, Image<Rgba32>> map = new Dictionary<string, Image<Rgba32>>();

        /// <summary>
        /// Initializes a new instance of the <see cref="MapImageCache"/> class.
        /// </summary>
        public MapImageCache()
        {
            map["blank"] = new Image<Rgba32>(TileWidth, TileHeight);
        }

        /// <summary>
        /// Finalizes an instance of the <see cref="MapImageCache"/> class.
        /// </summary>
        ~MapImageCache()
            => Dispose(false);

        /// <summary>
        /// Gets the tile coordinates for world coordinate.
        /// </summary>
        /// <param name="x">The x world coordinate.</param>
        /// <param name="y">The y world coordinate.</param>
        /// <returns>The tile coordinates.</returns>
        public static (int X, int Y) GetTileCoordinatesForCoordinate(double x, double y)
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
        /// Gets the dimensions in number of tiles per axis.
        /// </summary>
        /// <param name="screenWidth">Width of the screen.</param>
        /// <param name="screenHeight">Height of the screen.</param>
        /// <returns>The dimensions.</returns>
        public static (int X, int Y) GetDimensions(int screenWidth, int screenHeight)
        {
            int x = ((int)Math.Ceiling(screenWidth / (TileWidth * 2f)) * 2) + 1;
            int y = ((int)Math.Ceiling(screenHeight / (TileHeight * 2f)) * 2) + 1;

            return (x, y);
        }

        /// <summary>
        /// Converts to minimap coordinates.
        /// </summary>
        /// <param name="playerX">The player x world coordinate.</param>
        /// <param name="playerY">The player y world coordinate.</param>
        /// <param name="x">The x world coordinate.</param>
        /// <param name="y">The y world coordinate.</param>
        /// <param name="screenWidth">The width of the render target.</param>
        /// <param name="screenHeight">The height of the render target.</param>
        /// <returns>The pixel coordinates.</returns>
        public static (int X, int Y) ToMinimapCoordinate(double playerX, double playerY, double x, double y, int screenWidth, int screenHeight)
        {
            (int xDimension, int yDimension) = GetDimensions(screenWidth, screenHeight);

            int totalWidth = TileWidth * Width;
            int totalHeight = TileHeight * Height;
            (int tileX, int tileY) = GetTileCoordinatesForCoordinate(playerX, playerY);

            int pixelX = (int)(x / GameMapWidth * totalWidth);
            int pixelY = (int)((GameMapHeight - y) / GameMapHeight * totalHeight);

            int imageX = pixelX - ((tileX - (xDimension / 2)) * TileWidth);
            int imageY = pixelY - ((tileY - (yDimension / 2) + 1) * TileHeight);

            return (imageX, imageY);
        }

        /// <summary>
        /// Gets the map tile for the tile coordinates.
        /// </summary>
        /// <param name="x">The x tile coordinate.</param>
        /// <param name="y">The y tile coordinate.</param>
        /// <returns>The map tile.</returns>
        public Image<Rgba32> Get(int x, int y)
        {
            if (x < 0 || y < 0 || x >= Width || y >= Height)
            {
                return map["blank"];
            }

            string name = $"{x}-{y}";
            if (map.TryGetValue(name, out Image<Rgba32> cachedInMem))
            {
                return cachedInMem;
            }

            string fileName = ToFileName(x, y);
            Image<Rgba32> result;

            lock (Lock)
            {
                if (File.Exists(fileName))
                {
                    result = Image.Load<Rgba32>(fileName);
                }
                else
                {
                    result = Request(x, y);
                    Directory.CreateDirectory("./maps/");
                    result.Save(fileName);
                }
            }

            queue.Enqueue(name);
            if (queue.Count > MaxQueueSize)
            {
                string popped = queue.Dequeue();
                Image<Rgba32> temp = map[popped];
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
        /// <param name="screenWidth">The width of the render target.</param>
        /// <param name="screenHeight">The height of the render target.</param>
        /// <returns>The joined map.</returns>
        public Image<Rgba32> GetTileForCoordinate(double x, double y, int screenWidth, int screenHeight)
        {
            (int xDimension, int yDimension) = GetDimensions(screenWidth, screenHeight);
            (int tileX, int tileY) = GetTileCoordinatesForCoordinate(x, y);
            Image<Rgba32> result = new Image<Rgba32>(TileWidth * xDimension, TileHeight * yDimension);

            result.Mutate(c =>
            {
                c.BackgroundColor(Color.LightSteelBlue);

                for (int xt = 0; xt < xDimension; xt++)
                {
                    for (int yt = 0; yt < yDimension; yt++)
                    {
                        int curTileX = tileX - (xDimension / 2) + xt;
                        int curTileY = tileY - (yDimension / 2) + yt;
                        Image<Rgba32> temp = Get(curTileX, curTileY);
                        c.DrawImage(temp, new Point(xt * TileWidth, yt * TileHeight), 1);
                    }
                }
            });

            return result;
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

                    foreach (var pair in map)
                    {
                        pair.Value.Dispose();
                    }

                    map = null!;
                    http.Dispose();
                    http = null!;
                }

                disposedValue = true;
            }
        }

        private static string ToFileName(int x, int y)
            => $"./maps/{x}-{y}.png";

        private Image<Rgba32> Request(int x, int y)
        {
            using Stream data = http.GetAsync($"https://cdn.newworldfans.com/newworldmap/8/{x}/{y}.png").Result.Content.ReadAsStreamAsync().Result;
            return Image.Load<Rgba32>(data);
        }
    }
}
