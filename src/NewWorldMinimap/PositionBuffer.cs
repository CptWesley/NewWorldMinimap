using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace NewWorldMinimap
{
    public class PositionBuffer
    {
        private const int BufferSize = 5;
        private const double Freedom = double.PositiveInfinity;
        private readonly Queue<Vector3> positions = new Queue<Vector3>();

        public Vector3 Get()
            => positions.Peek();

        public bool Push(Vector3 pos)
        {
            Vector3 avg = GetAverage();

            double xDist = avg.X - pos.X;
            double yDist = avg.Y - pos.Y;
            double dist = xDist * xDist + yDist * yDist;

            if (positions.Count == 0)
            {
                PushInternal(pos);
                return true;
            }

            if (dist > Freedom)
            {
                Console.WriteLine($"Too big!! ({dist}) for {pos}");
            }

            if (dist > Freedom * 2)
            {
                return false;
            }

            PushInternal(pos);
            return dist <= Freedom;
        }

        private void PushInternal(Vector3 pos)
        {
            positions.Enqueue(pos);

            if (positions.Count > BufferSize)
            {
                positions.Dequeue();
            }
        }

        public Vector3 GetAverage()
        {
            Vector3 result = Vector3.Zero;

            foreach (Vector3 v in positions)
            {
                result += v;
            }

            return positions.Count == 0 ? result : result / positions.Count;
        }
    }
}
