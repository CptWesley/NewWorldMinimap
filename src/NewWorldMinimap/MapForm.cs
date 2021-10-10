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
using NewWorldMinimap.Core;
using NewWorldMinimap.Core.Util;
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
        private readonly PositionDetector pd = new PositionDetector();
        private readonly PictureBox picture = new PictureBox();
        private readonly MapImageCache map = new MapImageCache(4);
        private readonly MarkerCache markers = new MarkerCache();
        private readonly IconCache icons = new IconCache();

        private readonly ContextMenu menu = new ContextMenu();
        private readonly MenuItem alwaysOnTopButton;
        private readonly List<MenuItem> screenItems = new List<MenuItem>();
        private readonly List<MenuItem> refreshDelayItems = new List<MenuItem>();
        private readonly MenuItem windowModeButton;
        private readonly MenuItem debugButton;

        private int currentScreen;
        private int refreshDelay;
        private bool windowMode;
        private bool debugEnabled;

        private Thread? scannerThread;

        /// <summary>
        /// Initializes a new instance of the <see cref="MapForm"/> class.
        /// </summary>
        public MapForm()
        {
            alwaysOnTopButton = new MenuItem("Always-on-top", ToggleAlwaysOnTop, Shortcut.None);
            windowModeButton = new MenuItem("Windowed Mode", ToggleWindowMode, Shortcut.None);
            debugButton = new MenuItem("Debug", ToggleDebug, Shortcut.None);
            debugEnabled = false;

            InitializeComponent();
            StartUpdateLoop();
        }

        private static Icon LoadIcon()
        {
            using Stream stream = Assembly.GetExecutingAssembly().GetManifestResourceStream($"NewWorldMinimap.Resources.icons.app.ico");
            return new Icon(stream);
        }

        private void SetName(Vector2 pos)
        {
            string name = $"CptWesley's Minimap {pos.ToString("0.000", CultureInfo.InvariantCulture)}";
            Name = name;
            Text = name;
        }

        private void InitializeComponent()
        {
            SuspendLayout();
            ClientSize = new System.Drawing.Size(512, 512);
            SetName(Vector2.Zero);
            picture.SizeMode = PictureBoxSizeMode.CenterImage;
            Controls.Add(picture);
            ResumeLayout(false);
            Width = 512;
            Height = 512;
            markers.Populate(map);
            Resize += (s, e) => UpdateSize();
            FormClosed += OnClose;
            Icon = LoadIcon();
            BuildMenu();
        }

        private void BuildMenu()
        {
            ContextMenu = menu;
            picture.ContextMenu = menu;

            for (var i = 0; i < ScreenGrabber.ScreenCount; i++)
            {
                var ic = i;
                screenItems.Add(new MenuItem($"Screen {ic}", (s, e) => SelectScreen(ic), Shortcut.None));
            }

            CreateRefreshMenuItem(0);
            CreateRefreshMenuItem(200);
            CreateRefreshMenuItem(350);
            CreateRefreshMenuItem(1000);

            menu.MenuItems.Add(alwaysOnTopButton);
            menu.MenuItems.Add("-");
            menu.MenuItems.AddRange(screenItems.ToArray());
            menu.MenuItems.Add("-");
            menu.MenuItems.AddRange(refreshDelayItems.ToArray());
            menu.MenuItems.Add("-");
            menu.MenuItems.Add(windowModeButton);
            menu.MenuItems.Add(debugButton);

            SelectScreen(ScreenGrabber.GetPrimaryScreenIndex());
            SelectRefreshDelay(2, 350);
        }

        private void CreateRefreshMenuItem(int delay)
        {
            int index = refreshDelayItems.Count;
            refreshDelayItems.Add(new MenuItem($"Refresh delay: {delay}ms.", (s, e) => SelectRefreshDelay(index, delay), Shortcut.None));
        }

        private void SelectScreen(int index)
        {
            screenItems[currentScreen].Checked = false;
            currentScreen = index;
            screenItems[index].Checked = true;
        }

        private void SelectRefreshDelay(int index, int delay)
        {
            refreshDelay = delay;

            foreach (MenuItem mi in refreshDelayItems)
            {
                mi.Checked = false;
            }

            refreshDelayItems[index].Checked = true;
        }

        private void ToggleAlwaysOnTop(object sender, EventArgs e)
        {
            if (alwaysOnTopButton.Checked)
            {
                alwaysOnTopButton.Checked = false;
                TopMost = false;
            }
            else
            {
                alwaysOnTopButton.Checked = true;
                TopMost = true;
            }
        }

        private void ToggleWindowMode(object sender, EventArgs e)
        {
            if (windowModeButton.Checked)
            {
                windowModeButton.Checked = false;
                windowMode = false;
            }
            else
            {
                windowModeButton.Checked = true;
                windowMode = true;
            }
        }

        private void ToggleDebug(object sender, EventArgs e)
        {
            if (debugButton.Checked)
            {
                debugButton.Checked = false;
                debugEnabled = false;
            }
            else
            {
                debugButton.Checked = true;
                debugEnabled = true;
            }
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
            Stopwatch sw = new();

            var lastPos = Vector2.Zero;
            double rotationAngle = 0;
            var i = 0;
            while (true)
            {
                sw.Restart();

                if (!IsActive())
                {
                    Thread.Sleep(refreshDelay);
                    continue;
                }

                var screenshot = ScreenGrabber.TakeScreenshot(currentScreen);
                if (pd.TryGetPosition(screenshot, windowMode, out Vector2 pos, debugEnabled, out Image<Rgba32> debugImage))
                {
                    using Image<Rgba32> baseMap = map.GetTileForCoordinate(pos.X, pos.Y);

                    var (imageX, imageY) = map.ToMinimapCoordinate(pos.X, pos.Y, pos.X, pos.Y);

                    var (tileX, tileY) = MapImageCache.GetTileCoordinatesForCoordinate(pos.X, pos.Y);
                    IEnumerable<Marker> visibleMarkers = markers.Get(tileX, tileY);

                    var pos1 = lastPos;
                    baseMap.Mutate(c =>
                    {
                        using Image<Rgba32> playerTriangle = icons.Get("player").Clone();
                        AffineTransformBuilder builder = new();
                        var posDifference = pos - pos1;

                        if (posDifference != Vector2.Zero)
                        {
                            rotationAngle = Math.Atan2(posDifference.X, posDifference.Y);
                        }

                        builder.AppendRotationRadians((float)rotationAngle);
                        playerTriangle.Mutate(x => x.Transform(builder));
                        c.DrawImage(playerTriangle, imageX, imageY);

                        foreach (Marker marker in visibleMarkers)
                        {
                            var (ix, iy) = map.ToMinimapCoordinate(pos.X, pos.Y, marker.X, marker.Y);
                            c.DrawImage(icons.Get(marker), ix, iy);
                        }

                        if (debugImage != null)
                        {
                            debugImage.Mutate(x => x.Resize(debugImage.Width / 2, debugImage.Height / 2));
                            c.DrawImage(debugImage, imageX - (this.Width / 2), imageY - (this.Height / 2));
                            debugImage.Dispose();
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

                    lastPos = pos;
                }
                else
                {
                    Console.WriteLine($"{i}: Failure");
                }

                i++;

                sw.Stop();
                long elapsed = sw.ElapsedMilliseconds;

                if (elapsed < refreshDelay)
                {
                    Thread.Sleep(refreshDelay - (int)elapsed);
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

        private bool IsActive()
        {
            return User32.GetActiveWindowTitle() == "New World";
        }
    }
}
