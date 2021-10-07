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

        private int scanCount = 0;
        private Vector3 currentPosition = Vector3.Zero;
        private Vector3 lastPosition = Vector3.Zero;
        private Vector3 direction = Vector3.Zero;

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
            string name = $"New World Minimap {pos.ToString("#.000", CultureInfo.InvariantCulture)}";
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
            //currentPosition = new Vector3(9620.743f, 6300.072f, 252.559f);
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

        private Bitmap DrawPlayer(Bitmap baseMap)
        {

            (int imageX, int imageY) = map.ToMinimapCoordinate(currentPosition.X, currentPosition.Y, currentPosition.X, currentPosition.Y);
            Bitmap updatedMap = baseMap.Recenter(imageX, imageY);

            using Graphics drawingGraphics = Graphics.FromImage(updatedMap);
            var imageToDraw = icons.Get("player");
            drawingGraphics.DrawImage(imageToDraw, (updatedMap.Width / 2) - (imageToDraw.Width / 2), (updatedMap.Height / 2) - (imageToDraw.Height / 2));

            return updatedMap;
        }

        private void DrawMapMarkers(Bitmap baseMap)
        {
            (int tileX, int tileY) = map.GetTileCoordinatesForCoordinate(currentPosition.X, currentPosition.Y);
            IEnumerable<Marker> visibleMarkers = markers.Get(tileX, tileY);

            using Graphics drawingGraphics = Graphics.FromImage(baseMap);

            foreach (Marker marker in visibleMarkers)
            {
                (int markerX, int markerY) = map.ToMinimapCoordinate(currentPosition.X, currentPosition.Y, marker.X, marker.Y);
                drawingGraphics.DrawImage(icons.Get(marker), markerX, markerY);
            }
        }

        private void DrawMap(Bitmap baseMap)
        {
            SafeInvoke(() =>
            {
                picture.Image = baseMap;
                UpdateSize();
            });
        }

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
                currentPosition.X += 2;
                UpdateView();
            }
        }

        private void UpdateView()
        {
            using Bitmap baseMap = map.GetTileForCoordinate(currentPosition.X, currentPosition.Y);

            GetPosition();
            DrawMapMarkers(baseMap);
            var updatedMap = DrawPlayer(baseMap);
            DrawMap(updatedMap);
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
