using System.Drawing;

namespace NewWorldMinimap.Util
{
    /// <summary>
    /// Represents color data in a bitmap.
    /// </summary>
    public class ColorData
    {
        private readonly byte[] data;

        /// <summary>
        /// Initializes a new instance of the <see cref="ColorData"/> class.
        /// </summary>
        /// <param name="data">The data.</param>
        /// <param name="width">The width.</param>
        /// <param name="height">The height.</param>
        public ColorData(byte[] data, int width, int height)
            => (this.data, Width, Height) = (data, width, height);

        /// <summary>
        /// Gets the width.
        /// </summary>
        public int Width { get; }

        /// <summary>
        /// Gets the height.
        /// </summary>
        public int Height { get; }

        /// <summary>
        /// Gets or sets the <see cref="Color"/> at the specified coordinate.
        /// </summary>
        /// <value>
        /// The <see cref="Color"/>.
        /// </value>
        /// <param name="x">The x coordinate.</param>
        /// <param name="y">The y coordinate.</param>
        /// <returns>The color.</returns>
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
            => 2 + (((y * Width) + x) * 4);
    }
}
