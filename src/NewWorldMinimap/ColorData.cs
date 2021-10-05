using System.Drawing;

namespace NewWorldMinimap
{
    public class ColorData
    {
        private readonly byte[] data;

        public ColorData(byte[] data, int width, int height)
            => (this.data, Width, Height) = (data, width, height);

        public int Width { get; }
        public int Height { get; }

        public Color this[int x, int y]
        {
            get => GetColor(x, y);
            set => SetColor(x, y, value);
        }

        private Color GetColor(int x, int y)
        {
            int i = GetIndexFromXY(x, y);
            return Color.FromArgb(data[i + 1], data[i], data[i - 1], data[i - 2]);
        }

        private void SetColor(int x, int y, Color c)
        {
            int i = GetIndexFromXY(x, y);
            data[i] = c.R;
            data[i - 1] = c.G;
            data[i - 2] = c.B;
            data[i + 1] = c.A;
        }

        private int GetIndexFromXY(int x, int y)
            => 2 + (y * Width + x) * 4;
    }
}
