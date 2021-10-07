using NewWorldMinimap.Configuration;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Drawing;
using System.Drawing.Imaging;
using System.Globalization;
using System.IO;
using System.Numerics;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace NewWorldMinimap
{
    /// <summary>
    /// Provides an interface for rendering the map.
    /// </summary>
    /// <seealso cref="Form" />
    public class MapForm : Form
    {
        private readonly AppConfiguration appConfiguration;

        private static readonly Screen Screen = Screen.PrimaryScreen;

        private readonly PositionDetector pd = new PositionDetector();
        private readonly PictureBox picture = new PictureBox();
        private readonly MapImageCache map = new MapImageCache(4);
        private readonly MarkerCache markers = new MarkerCache();
        private readonly IconCache icons = new IconCache();

        private Thread? scannerThread;
        private int scanCount = 0;
        private Vector3 currentPosition = Vector3.Zero;
        private Vector3 lastPosition = Vector3.Zero;
        private Vector3 direction = Vector3.Zero;
        private Bitmap centeredBaseMap;

        /// <summary>
        /// Initializes a new instance of the <see cref="MapForm"/> class.
        /// </summary>
        public MapForm(AppConfiguration appConfiguration)
        {
            this.appConfiguration = appConfiguration;

            InitializeComponent();
            UpdateView(); // call once to get view to show map
            if (appConfiguration.AutoUpdate)
            {
                _ = UpdateViewAutomaticallyAsync();
            }

            Console.WriteLine($"Update Frequency: {appConfiguration.UpdateFrequency}");
            Console.WriteLine($"Auto Update enabled: {appConfiguration.AutoUpdate}");
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
            this.Icon = LoadIcon();
            this.KeyPress += new KeyPressEventHandler(MapForm_KeyPress);
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
            //using Pen pen = new Pen(Color.Red);
            //using Pen pen2 = new Pen(Color.Pink);
            while (true)
            {
                UpdateView();
            }
        }

        private void GetPosition()
        {
            using Bitmap bmp = TakeScreenshot();
            if (pd.TryGetPosition(bmp, out Vector3 position))
            {
                Console.WriteLine($"{scanCount}: {position}");
                lastPosition = currentPosition;
                currentPosition = position;
            }
            else
            {
                Console.WriteLine($"{scanCount}: Failure");
            }

            direction = lastPosition - currentPosition;
            SafeInvoke(() => SetName(currentPosition));
        }

        private void DrawBaseMap()
        {
            using Bitmap baseMap = map.GetTileForCoordinate(currentPosition.X, currentPosition.Y);
            (int imageX, int imageY) = map.ToMinimapCoordinate(currentPosition.X, currentPosition.Y, currentPosition.X, currentPosition.Y);
            centeredBaseMap = baseMap.Recenter(imageX, imageY);

            SafeInvoke(() =>
            {
                picture.Image = centeredBaseMap;
                UpdateSize();
            });
        }

        private void DrawPlayer()
        {
            currentPosition = new Vector3(9620.743f, 6300.072f, 252.559f);
            using Graphics drawingGraphics = Graphics.FromImage(centeredBaseMap);
            var imageToDraw = icons.Get("player");
            drawingGraphics.DrawImage(imageToDraw, centeredBaseMap.Width / 2 - imageToDraw.Width / 2, centeredBaseMap.Height / 2 - imageToDraw.Height / 2);
        }

        private void DrawMapMarkers()
        {
            (int tileX, int tileY) = map.GetTileCoordinatesForCoordinate(currentPosition.X, currentPosition.Y);
            IEnumerable<Marker> visibleMarkers = markers.Get(tileX, tileY);

            using Graphics drawingGraphics = Graphics.FromImage(centeredBaseMap);

            foreach (Marker marker in visibleMarkers)
            {
                (int markerX, int markerY) = map.ToMinimapCoordinate(currentPosition.X, currentPosition.Y, marker.X, marker.Y);
                drawingGraphics.DrawImage(icons.Get(marker), markerX, markerY);
            }
        }

        //private void GetPositionAndDraw()
        //{
        //    using Bitmap bmp = TakeScreenshot();
        //    if (pd.TryGetPosition(bmp, out Vector3 pos))
        //    {
        //        Vector3 dir = lastPosition - pos;

        //        lastPosition = pos;
        //        Console.WriteLine($"{scanCount}: {pos}");
        //        using Bitmap baseMap = map.GetTileForCoordinate(pos.X, pos.Y);

        //        (int imageX, int imageY) = map.ToMinimapCoordinate(pos.X, pos.Y, pos.X, pos.Y);

        //        (int tileX, int tileY) = map.GetTileCoordinatesForCoordinate(pos.X, pos.Y);
        //        IEnumerable<Marker> visibleMarkers = markers.Get(tileX, tileY);

        //        using Graphics g = Graphics.FromImage(baseMap);

        //        foreach (Marker marker in visibleMarkers)
        //        {
        //            (int ix, int iy) = map.ToMinimapCoordinate(pos.X, pos.Y, marker.X, marker.Y);
        //            g.DrawImage(icons.Get(marker), ix, iy);
        //        }

        //        Bitmap newMap = baseMap.Recenter(imageX, imageY);
        //        using Graphics g2 = Graphics.FromImage(newMap);
        //        g2.DrawImage(icons.Get("player"), newMap.Width / 2, newMap.Height / 2);

        //        Image prev = picture.Image;

        //        SafeInvoke(() =>
        //        {
        //            SetName(pos);
        //            picture.Image = newMap;
        //            UpdateSize();
        //        });

        //        prev?.Dispose();
        //    }
        //    else
        //    {
        //        Console.WriteLine($"{scanCount}: Failure");
        //    }

        //    scanCount++;
        //}

        private void SafeInvoke(Action act)
        {
            try
            {
                Invoke(act);
            }
            catch (InvalidOperationException)
            { }
        }

        private void MapForm_KeyPress(object sender, KeyPressEventArgs e)
        {
            // capture 'r' key to reload map manually
            var upperCaseKey = e.KeyChar.ToString().ToUpper();
            if (upperCaseKey == Keys.R.ToString())
            {
                UpdateView();
            }
        }

        private void UpdateView()
        {
            GetPosition();
            DrawBaseMap();
            DrawMapMarkers();
            DrawPlayer();
            //DrawCompany();
        }

        private async Task UpdateViewAutomaticallyAsync()
        {
            while (true)
            {
                await Task.Delay(TimeSpan.FromMilliseconds(appConfiguration.UpdateFrequency));
                UpdateView();
            }
        }
    }
}
