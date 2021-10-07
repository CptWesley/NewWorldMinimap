using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Numerics;
using System.Reflection;
using System.Threading;
using System.Windows.Forms;
using NewWorldMinimap.Caches;
using NewWorldMinimap.Util;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace NewWorldMinimap
{
    /// <summary>
    /// Provides an interface for rendering the map.
    /// </summary>
    /// <seealso cref="Form" />
    public class MapForm : Form
    {
        private const int SleepTime = 350;

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

        private static Icon LoadIcon()
        {
            using Stream stream = Assembly.GetExecutingAssembly().GetManifestResourceStream($"NewWorldMinimap.Resources.icons.app.ico");
            return new Icon(stream);
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
            this.ClientSize = new System.Drawing.Size(512, 512);
            SetName(Vector3.Zero);
            picture.SizeMode = PictureBoxSizeMode.CenterImage;
            this.Controls.Add(picture);
            this.ResumeLayout(false);
            this.Width = 512;
            this.Height = 512;
            markers.Populate(map);
            this.Resize += (s, e) => UpdateSize();
            this.FormClosed += OnClose;
            this.Icon = LoadIcon();
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

        private void UpdateLoop()
        {
            Stopwatch sw = new Stopwatch();

            Vector3 lastPos = Vector3.Zero;
            int jumpThreshold = int.MaxValue;
            int i = 0;
            while (true)
            {
                sw.Restart();

                if (pd.TryGetPosition(ScreenGrabber.TakeScreenshot(), out Vector3 pos))
                {
                    Vector3 difference = lastPos - pos;
                    Console.WriteLine($"{i}: {pos} [{difference.Length()}]");
                    if (difference.Length() > 20.0)
                    {
                        if (jumpThreshold < 3)
                        {
                            Console.WriteLine($"{i}: Failure due to jump of {difference.Length()}");
                            jumpThreshold++;
                            continue;
                        }
                        else
                        {
                            jumpThreshold = 0;
                        }
                    }

                    lastPos = pos;
                    using Image<Rgba32> baseMap = map.GetTileForCoordinate(pos.X, pos.Y);

                    (int imageX, int imageY) = map.ToMinimapCoordinate(pos.X, pos.Y, pos.X, pos.Y);

                    (int tileX, int tileY) = map.GetTileCoordinatesForCoordinate(pos.X, pos.Y);
                    IEnumerable<Marker> visibleMarkers = markers.Get(tileX, tileY);

                    baseMap.Mutate(c =>
                    {
                        c.DrawImage(icons.Get("player"), imageX, imageY);

                        foreach (Marker marker in visibleMarkers)
                        {
                            (int ix, int iy) = map.ToMinimapCoordinate(pos.X, pos.Y, marker.X, marker.Y);
                            c.DrawImage(icons.Get(marker), ix, iy);
                        }
                    });

                    using Image<Rgba32> newMap = baseMap.Recenter(imageX, imageY);
                    System.Drawing.Image prev = picture.Image;

                    SafeInvoke(() =>
                    {
                        SetName(pos);
                        picture.Image = newMap.ToBitmap();
                        UpdateSize();
                    });

                    prev?.Dispose();
                }
                else
                {
                    Console.WriteLine($"{i}: Failure");
                }

                i++;

                sw.Stop();
                long elapsed = sw.ElapsedMilliseconds;

                if (elapsed < SleepTime)
                {
                    Thread.Sleep(SleepTime - (int)elapsed);
                }
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
