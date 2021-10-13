using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using Newtonsoft.Json.Linq;

namespace NewWorldMinimap.Caches
{
    /// <summary>
    /// Provides logic for keeping track of markers.
    /// </summary>
    /// <seealso cref="IDisposable" />
    public class MarkerCache : IDisposable
    {
        private bool disposedValue;
        private HttpClient http = new HttpClient();
        private Dictionary<string, List<Marker>> markers = new Dictionary<string, List<Marker>>();

        /// <summary>
        /// Finalizes an instance of the <see cref="MarkerCache"/> class.
        /// </summary>
        ~MarkerCache()
            => Dispose(false);

        /// <summary>
        /// Populates the specified map cache.
        /// </summary>
        /// <param name="mapCache">The map cache.</param>
        public void Populate(MapImageCache mapCache)
        {
            if (mapCache is null)
            {
                throw new ArgumentNullException(nameof(mapCache));
            }

            markers.Clear();
            string stringData = http.GetAsync("https://www.newworld-map.com/markers.json").Result.Content.ReadAsStringAsync().Result;
            JObject data = JObject.Parse(stringData);

            PopulateResource(data, "ores");
            PopulateResource(data, "woods");
            PopulateResource(data, "chests");
            PopulateResource(data, "plants");
            PopulateResource(data, "documents");
            PopulateResource(data, "fishing");
            PopulateResource(data, "monsters");
            PopulateResource(data, "essences");
        }

        /// <summary>
        /// Gets the markers for the given tile coordinates.
        /// </summary>
        /// <param name="x">The x coordinate.</param>
        /// <param name="y">The y coordinate.</param>
        /// <param name="screenWidth">The width of the render target.</param>
        /// <param name="screenHeight">The height of the render target.</param>
        /// <returns>The list of markers.</returns>
        public IEnumerable<Marker> Get(int x, int y, int screenWidth, int screenHeight)
        {
            (int xDimension, int yDimension) = MapImageCache.GetDimensions(screenWidth, screenHeight);
            int xRadius = xDimension / 2;
            int yRadius = yDimension / 2;
            IEnumerable<Marker> result = Array.Empty<Marker>();

            for (int dx = x - xRadius; dx <= x + xRadius; dx++)
            {
                for (int dy = y - yRadius; dy <= y + yRadius; dy++)
                {
                    result = result.Concat(GetInternal(dx, dy));
                }
            }

            return result.Distinct();
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
                    markers.Clear();
                    markers = null!;
                    http.Dispose();
                    http = null!;
                }

                disposedValue = true;
            }
        }

        private void PopulateResource(JObject data, string resourceName)
        {
            JToken? category = data.GetValue(resourceName, StringComparison.InvariantCulture);

            if (category is null)
            {
                throw new ArgumentException($"Category not found.", nameof(resourceName));
            }

            foreach (JProperty type in category)
            {
                foreach (JProperty marker in type.Value)
                {
                    double x = marker.Value["x"]!.ToObject<double>();
                    double y = marker.Value["y"]!.ToObject<double>();
                    (int tileX, int tileY) = MapImageCache.GetTileCoordinatesForCoordinate(x, y);
                    Marker m = new Marker(x, y, resourceName, type.Name);

                    string tileName = $"{tileX}-{tileY}";
                    if (!markers.TryGetValue(tileName, out List<Marker> l))
                    {
                        l = new List<Marker>();
                        markers[tileName] = l;
                    }

                    l.Add(m);
                }
            }
        }

        private IEnumerable<Marker> GetInternal(int x, int y)
        {
            string name = $"{x}-{y}";

            if (markers.TryGetValue(name, out List<Marker> res))
            {
                return res;
            }

            return Array.Empty<Marker>();
        }
    }

    /// <summary>
    /// Represents a marker.
    /// </summary>
    public record Marker(double X, double Y, string Category, string Type);
}
