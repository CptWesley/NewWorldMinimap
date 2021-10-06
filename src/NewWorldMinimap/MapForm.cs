using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Drawing;
using System.Drawing.Imaging;
using System.Globalization;
using System.Numerics;
using System.Threading;
using System.Windows.Forms;

namespace NewWorldMinimap
{
    /// <summary>
    /// Provides an interface for rendering the map.
    /// </summary>
    /// <seealso cref="Form" />
    public class MapForm : Form
    {
        private static readonly Screen Screen = Screen.PrimaryScreen;

        private readonly PositionDetector pd = new PositionDetector();
        private readonly PictureBox picture = new PictureBox();
        private readonly MapImageCache map = new MapImageCache(4);
        private readonly MarkerCache markers = new MarkerCache();
        private readonly IconCache icons = new IconCache();

        private Thread? scannerThread;

        /// <summary>
        /// Initializes a new instance of the <see cref="MapForm"/> class.
        /// </summary>
        public MapForm()
        {
            InitializeComponent();
            StartUpdateLoop();
        }

        private static Bitmap TakeScreenshot()
        {
            Bitmap bmp = new Bitmap(Screen.Bounds.Width, Screen.Bounds.Height, PixelFormat.Format24bppRgb);

            using (Graphics g = Graphics.FromImage(bmp))
            {
                g.CopyFromScreen(Screen.Bounds.X, Screen.Bounds.Y, 0, 0, Screen.Bounds.Size, CopyPixelOperation.SourceCopy);
            }

            return bmp;
        }

        private void SetName(Vector3 pos)
        {
            string name = $"CptWesley's Minimap {pos.ToString("#.000", CultureInfo.InvariantCulture)}";
            this.Name = name;
            this.Text = name;
        }

        private void InitializeComponent()
        {
            this.SuspendLayout();
            this.ClientSize = new Size(512, 512);
            SetName(Vector3.Zero);
            picture.SizeMode = PictureBoxSizeMode.CenterImage;
            this.Controls.Add(picture);
            this.ResumeLayout(false);
            this.Width = 512;
            this.Height = 512;
            markers.Populate(map);
            this.Resize += (s, e) => UpdateSize();
            this.FormClosed += OnClose;
        }

        private void UpdateSize()
        {
            if (picture.Width != Width)
            {
                picture.Width = Width;
            }

            if (picture.Height != Height)
            {
                picture.Height = Height;
            }
        }

        private void OnClose(object sender, EventArgs e)
        {
            Environment.Exit(0);
        }

        private Thread StartUpdateLoop()
        {
            scannerThread = new Thread(UpdateLoop);
            scannerThread.Start();
            return scannerThread;
        }

        [SuppressMessage("Reliability", "CA2000", Justification = "Value of 'newmap' is actually disposed.")]
        private void UpdateLoop()
        {
            using Pen pen = new Pen(Color.Red);
            using Pen pen2 = new Pen(Color.Pink);
            Vector3 lastPos = Vector3.Zero;
            int i = 0;
            while (true)
            {
                using Bitmap bmp = TakeScreenshot();
                if (pd.TryGetPosition(bmp, out Vector3 pos))
                {
                    Vector3 dir = lastPos - pos;

                    lastPos = pos;
                    Console.WriteLine($"{i}: {pos}");
                    using Bitmap baseMap = map.GetTileForCoordinate(pos.X, pos.Y);

                    (int imageX, int imageY) = map.ToMinimapCoordinate(pos.X, pos.Y, pos.X, pos.Y);

                    (int tileX, int tileY) = map.GetTileCoordinatesForCoordinate(pos.X, pos.Y);
                    IEnumerable<Marker> visibleMarkers = markers.Get(tileX, tileY);

                    using Graphics g = Graphics.FromImage(baseMap);

                    foreach (Marker marker in visibleMarkers)
                    {
                        (int ix, int iy) = map.ToMinimapCoordinate(pos.X, pos.Y, marker.X, marker.Y);
                        g.DrawImage(icons.Get(marker), ix, iy);
                    }

                    Bitmap newMap = baseMap.Recenter(imageX, imageY);
                    using Graphics g2 = Graphics.FromImage(newMap);
                    g2.DrawImage(icons.Get("player"), newMap.Width / 2, newMap.Height / 2);

                    Image prev = picture.Image;

                    SafeInvoke(() =>
                    {
                        SetName(pos);
                        picture.Image = newMap;
                        UpdateSize();
                    });

                    prev?.Dispose();
                }
                else
                {
                    Console.WriteLine($"{i}: Failure");
                }

                i++;
            }
        }

        private void SafeInvoke(Action act)
        {
            try
            {
                Invoke(act);
            }
            catch (InvalidOperationException)
            {
            }
        }
    }
}
