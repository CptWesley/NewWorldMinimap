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
        private MapImageCache map = new MapImageCache();
        private PositionBuffer posBuf = new PositionBuffer();
        private MarkerCache markers = new MarkerCache();
        private const int MinimapRadius = 2;

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
            sourceMap = new Bitmap("map.png");
            //sourceMap = map.GetTileForCoordinate(9649.031, 6349.472, 2);
            picture.Image = sourceMap;
            picture.Width = sourceMap.Width;
            picture.Height = sourceMap.Height;
            this.Controls.Add(picture);
            this.ResumeLayout(false);
            this.Width = picture.Width;
            this.Height = picture.Height;
            markers.Populate(map);
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
            Thread t = new Thread(UpdateLoop);
            t.Start();
            return t;
        }

        private void UpdateLoop()
        {
            using Pen pen = new Pen(Color.Red);
            using Pen pen2 = new Pen(Color.Pink);
            Vector3 lastPos = Vector3.Zero;
            int radius = 5;
            int i = 0;
            while (true)
            {
                using Bitmap bmp = TakeScreenshot();
                if (pd.TryGetPosition(bmp, lastPos, out Vector3 pos) && posBuf.Push(pos))
                {
                    lastPos = pos;
                    Console.WriteLine($"{i}: {pos}");
                    sourceMap.Dispose();
                    sourceMap = map.GetTileForCoordinate(pos.X, pos.Y, MinimapRadius);

                    (int imageX, int imageY) = map.ToMinimapCoordinate(pos.X, pos.Y, pos.X, pos.Y, MinimapRadius);

                    (int tileX, int tileY) = map.GetTileCoordinatesForCoordinate(pos.X, pos.Y);
                    IEnumerable<Marker> visibleMarkers = markers.Get(tileX, tileY, MinimapRadius);

                    /*
                    //int imageX = (int)((pos.X / 18416.0) * newMap.Width);
                    //int imageY = newMap.Height - (int)((pos.Y / 10640.0) * newMap.Height);
                    //Console.WriteLine($"Ratio X/Y: {18416.0/10640.0} vs {newMap.Width / (double)newMap.Height}");
                    //Console.WriteLine($"Ratio X/Y: {newMap.Width / 18416.0} and {newMap.Height / 10640.0}");
                    Rectangle rect = new Rectangle(imageX - radius, imageY - radius, radius * 2, radius * 2);
                    g.DrawEllipse(pen, rect);
                    g.DrawRectangle(pen, new Rectangle(map.TileWidth * 2, map.TileHeight * 2, map.TileWidth, map.TileHeight));
                    */

                    Bitmap temp = new Bitmap(sourceMap);
                    using Graphics g = Graphics.FromImage(temp);

                    foreach (Marker marker in visibleMarkers)
                    {
                        Console.WriteLine(marker);
                        (int ix, int iy) = map.ToMinimapCoordinate(pos.X, pos.Y, marker.X, marker.Y, MinimapRadius);
                        Rectangle rect2 = new Rectangle(ix, iy, radius * 2, radius * 2);
                        g.DrawEllipse(pen2, rect2);
                    }

                    Bitmap newMap = temp.MakeCenter(imageX, imageY);
                    //newMap = temp;
                    using Graphics g2 = Graphics.FromImage(newMap);
                    Rectangle rect = new Rectangle(newMap.Width / 2, newMap.Height / 2, radius * 2, radius * 2);
                    g2.DrawEllipse(pen, rect);

                    this.Invoke(new Action(() => {
                        this.Text = $"New World Minimap: {pos}";
                        picture.Image = newMap;
                        picture.Width = sourceMap.Width;
                        picture.Height = sourceMap.Height;
                        this.Width = picture.Width;
                        this.Height = picture.Height;
                    }));
                }
                else
                {
                    Console.WriteLine($"{i}: Failure");
                }
                i++;
                Thread.Sleep(200);
            }
        }
    }
}
