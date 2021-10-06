using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using Newtonsoft.Json.Linq;

namespace NewWorldMinimap
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
        /// Gets the map radius.
        /// </summary>
        public int Radius { get; private set; }

        /// <summary>
        /// Populates the specified map cache.
        /// </summary>
        /// <param name="mapCache">The map cache.</param>
        public void Populate(MapImageCache mapCache)
        {
            markers.Clear();
            Radius = mapCache.Radius;
            string stringData = http.GetAsync("https://www.newworld-map.com/markers.json").Result.Content.ReadAsStringAsync().Result;
            JObject data = JObject.Parse(stringData);

            PopulateResource(mapCache, data, "ores");
            PopulateResource(mapCache, data, "woods");
            PopulateResource(mapCache, data, "chests");
            PopulateResource(mapCache, data, "plants");
        }

        /// <summary>
        /// Gets the markers for the given tile coordinates.
        /// </summary>
        /// <param name="x">The x coordinate.</param>
        /// <param name="y">The y coordinate.</param>
        /// <returns>The list of markers.</returns>
        public IEnumerable<Marker> Get(int x, int y)
        {
            IEnumerable<Marker> result = Array.Empty<Marker>();

            for (int dx = x - Radius; dx <= x + Radius; dx++)
            {
                for (int dy = y - Radius; dy <= y + Radius; dy++)
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

        private void PopulateResource(MapImageCache mapCache, JObject data, string resourceName)
        {
            JToken? category = data.GetValue(resourceName);

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
                    (int tileX, int tileY) = mapCache.GetTileCoordinatesForCoordinate(x, y);
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
