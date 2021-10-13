using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;

namespace NewWorldMinimap
{
    /// <summary>
    /// Custom picture box for rendering as a circle.
    /// </summary>
    /// <seealso cref="PictureBox" />
    public class MapControl : PictureBox
    {
        /// <summary>
        /// Gets or sets a value indicating whether the image should be rendered as an ellipse.
        /// </summary>
        public bool IsCircular { get; set; }

        /// <inheritdoc/>
        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);

            if (e is null)
            {
                return;
            }

            if (this.Parent is MapForm mapParent)
            {
                using var path = new GraphicsPath();

                if (IsCircular)
                {
                    path.AddEllipse(0, 0, mapParent.DisplayRectangle.Width, mapParent.DisplayRectangle.Height - 1);
                }
                else
                {
                    path.AddRectangle(new Rectangle(0, 0, Parent.Width, Parent.Height));
                }

                Region = new Region(path);
                e.Graphics.SmoothingMode = SmoothingMode.AntiAlias;
                using Brush brush = new SolidBrush(this.BackColor);
                using Pen pen = new Pen(brush, 1);
                e.Graphics.DrawRectangle(pen, 0, 0, this.Width, this.Height);
            }
        }
    }
}
