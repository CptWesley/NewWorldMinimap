using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Numerics;
using System.Threading;
using System.Windows.Forms;
using static NewWorldMinimap.MarkerCache;

namespace NewWorldMinimap
{
    public class MapForm : Form
    {
        private static readonly PositionDetector pd = new PositionDetector();
        private static readonly Screen screen = Screen.PrimaryScreen;
        private PictureBox picture = new PictureBox();
        private Bitmap sourceMap;
        private MapImageCache map = new MapImageCache(4);
        private PositionBuffer posBuf = new PositionBuffer();
        private MarkerCache markers = new MarkerCache();
        private Thread scannerThread;
        private IconCache icons = new IconCache();

        public MapForm()
        {
            InitializeComponent();
            StartUpdateLoop();
        }

        private void InitializeComponent()
        {
            this.SuspendLayout();
            this.ClientSize = new Size(128, 128);
            this.Name = "New World Minimap";
            this.Text = "New World Minimap";
            sourceMap = new Bitmap(512, 512);
            picture.SizeMode = PictureBoxSizeMode.CenterImage;
            picture.Image = sourceMap;
            picture.Width = sourceMap.Width;
            picture.Height = sourceMap.Height;
            this.Controls.Add(picture);
            this.ResumeLayout(false);
            this.Width = picture.Width;
            this.Height = picture.Height;
            markers.Populate(map);
            this.ResizeEnd += OnResize;
            this.FormClosed += OnClose;
        }

        private void OnResize(object sender, EventArgs e)
        {
            picture.Width = this.Width;
            picture.Height = this.Height;
        }

        private void OnClose(object sender, EventArgs e)
        {
            Environment.Exit(0);
        }

        private static Bitmap TakeScreenshot()
        {
            Bitmap bmp = new Bitmap(screen.Bounds.Width, screen.Bounds.Height, PixelFormat.Format24bppRgb);

            using (Graphics g = Graphics.FromImage(bmp))
            {
                g.CopyFromScreen(screen.Bounds.X, screen.Bounds.Y, 0, 0, screen.Bounds.Size, CopyPixelOperation.SourceCopy);
            }

            return bmp;
        }

        private Thread StartUpdateLoop()
        {
            scannerThread = new Thread(UpdateLoop);
            scannerThread.Start();
            return scannerThread;
        }

        private void UpdateLoop()
        {
            using Pen pen = new Pen(Color.Red);
            using Pen pen2 = new Pen(Color.Pink);
            Vector3 lastPos = Vector3.Zero;
            int i = 0;
            while (true)
            {
                using Bitmap bmp = TakeScreenshot();
                if (pd.TryGetPosition(bmp, out Vector3 pos) && posBuf.Push(pos))
                {
                    Vector3 dir = lastPos - pos;

                    lastPos = pos;
                    Console.WriteLine($"{i}: {pos}");
                    sourceMap.Dispose();
                    sourceMap = map.GetTileForCoordinate(pos.X, pos.Y);

                    (int imageX, int imageY) = map.ToMinimapCoordinate(pos.X, pos.Y, pos.X, pos.Y);

                    (int tileX, int tileY) = map.GetTileCoordinatesForCoordinate(pos.X, pos.Y);
                    IEnumerable<Marker> visibleMarkers = markers.Get(tileX, tileY);

                    Bitmap temp = new Bitmap(sourceMap);
                    using Graphics g = Graphics.FromImage(temp);

                    foreach (Marker marker in visibleMarkers)
                    {
                        (int ix, int iy) = map.ToMinimapCoordinate(pos.X, pos.Y, marker.X, marker.Y);
                        g.DrawImage(icons.Get(marker), ix, iy);
                    }

                    Bitmap newMap = temp.MakeCenter(imageX, imageY);
                    using Graphics g2 = Graphics.FromImage(newMap);
                    g2.DrawImage(icons.Get("player"), newMap.Width / 2, newMap.Height / 2);

                    SafeInvoke(() => {
                        Text = $"New World Minimap: {pos}";
                        picture.Image = newMap;
                    });
                }
                else
                {
                    Console.WriteLine($"{i}: Failure");
                }
                i++;
                //Thread.Sleep(50);
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
