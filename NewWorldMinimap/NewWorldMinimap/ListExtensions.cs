using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NewWorldMinimap
{
    public static class ListExtensions
    {
        public static List<T> ToSingletonList<T>(this T obj)
            => new List<T> { obj };
    }
}
