using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Net.Http;

namespace NewWorldMinimap
{
    public class MapImageCache : IDisposable
    {
        public readonly int Width = 224;
        public readonly int Height = 225;
        public readonly int TileWidth = 256;
        public readonly int TileHeight = 256;

        public readonly int GameMapWidth = 14336;
        public readonly int GameMapHeight = 14400;

        private const int MaxQueueSize = 2048;

        private bool disposedValue;
        private HttpClient http = new HttpClient();
        private Queue<string> queue = new Queue<string>();
        private Dictionary<string, Bitmap> map = new Dictionary<string, Bitmap>();

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

        public Bitmap GetTileForCoordinate(double x, double y)
            => GetTileForCoordinate(x, y, 0);

        public Bitmap GetTileForCoordinate(double x, double y, int radius)
        {
            (int tileX, int tileY) = GetTileCoordinatesForCoordinate(x, y);
            Bitmap result = new Bitmap(TileWidth * (1 + 2 * radius), TileHeight * (1 + 2 * radius));

            using Graphics g = Graphics.FromImage(result);

            for (int xt = 0; xt < 1 + radius * 2; xt++)
            {
                for (int yt = 0; yt < 1 + radius * 2; yt++)
                {
                    Bitmap temp = Get(tileX - radius + xt, tileY - radius + yt);
                    g.DrawImage(temp, xt * TileWidth, yt * TileHeight);
                }
            }

            return result;
        }

        public (int X, int Y) GetTileCoordinatesForCoordinate(double x, double y)
        {
            int totalWidth = Width * TileWidth;
            int totalHeight = Height * TileHeight;

            int imageX = (int)((x / GameMapWidth) * totalWidth);
            int imageY = (int)(((GameMapHeight - y) / GameMapHeight) * totalHeight);

            int tileX = imageX / TileWidth;
            int tileY = imageY / TileHeight;

            return (tileX, tileY - 1);
        }

        private Bitmap Request(int x, int y)
        {
            using Stream data = http.GetAsync($"https://cdn.newworldfans.com/newworldmap/8/{x}/{y}.png").Result.Content.ReadAsStreamAsync().Result;
            using Image image = Image.FromStream(data);
            return new Bitmap(image);
        }

        private static string ToFileName(int x, int y)
            => $"./maps/{x}-{y}.png";

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    queue.Clear();
                    queue = null;
                    map.Clear();
                    map = null;
                    http.Dispose();
                    http = null;
                }

                disposedValue = true;
            }
        }

        ~MapImageCache()
            => Dispose(false);

        public void Dispose()
        {
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }

        public (int X, int Y) ToMinimapCoordinate(double playerX, double playerY, double x, double y, int radius)
        {
            int totalWidth = TileWidth * Width;
            int totalHeight = TileHeight * Height;
            (int tileX, int tileY) = GetTileCoordinatesForCoordinate(playerX, playerY);


            int pixelX = (int)(x / GameMapWidth * totalWidth);
            int pixelY = (int)((GameMapHeight - y) / GameMapHeight * totalHeight);

            Console.WriteLine($"PX: {pixelX} PY: {pixelY}");

            int imageX = pixelX - (tileX - radius) * TileWidth;
            int imageY = pixelY - (tileY - radius + 1) * TileHeight;

            Console.WriteLine($"IX: {imageX} IY: {imageY}");


            //int imageX = (int)((x / GameMapWidth) * totalWidth - (tileX - radius) * TileWidth);
            //int imageY = (int)(((GameMapHeight - y) / GameMapHeight) * totalHeight - (tileY - radius) * TileHeight);

            return (imageX, imageY);
        }
    }
}
