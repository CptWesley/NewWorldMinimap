using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace NewWorldMinimap
{
    public class MarkerCache : IDisposable
    {
        public record Marker(double X, double Y, string Type);

        private bool disposedValue;
        private HttpClient http = new HttpClient();
        private Dictionary<string, List<Marker>> markers = new Dictionary<string, List<Marker>>();

        public int Radius { get; private set; }

        public void Populate(MapImageCache mapCache)
        {
            markers.Clear();
            Radius = mapCache.Radius;
            string stringData = http.GetAsync("https://www.newworld-map.com/markers.json").Result.Content.ReadAsStringAsync().Result;
            var data = JObject.Parse(stringData);
            var ores = data.GetValue("ores");

            foreach (JProperty ore in ores)
            {
                string typeName = ore.Name;
                foreach (JProperty marker in ore.Value)
                {
                    double x = marker.Value["x"].ToObject<double>();
                    double y = marker.Value["y"].ToObject<double>();
                    (int tileX, int tileY) = mapCache.GetTileCoordinatesForCoordinate(x, y);
                    Marker m = new Marker(x, y, typeName);

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

            if (markers.TryGetValue(name, out List<Marker> res)) {
                return res;
            }

            return Array.Empty<Marker>();
        }

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

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    markers.Clear();
                    markers = null;
                    http.Dispose();
                    http = null;
                }

                disposedValue = true;
            }
        }

        ~MarkerCache()
            => Dispose(false);

        public void Dispose()
        {
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }
    }
}
