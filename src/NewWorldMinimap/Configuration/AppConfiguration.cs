using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NewWorldMinimap.Configuration
{
    public class AppConfiguration
    {
        public bool AutoUpdate { get; set; }

        public float UpdateFrequency { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="AppConfiguration"/> class.
        /// UpdateFrequency will be the milliseconds between ocr scans and position updates
        /// AutoUpdate if true will continue polling the position if false user will need to press 'r' on winforms window, will be set to true if we fail to parse UpdateFrequency or if UpdateFrequency is 0
        /// </summary>
        public AppConfiguration()
        {
            AutoUpdate = true;
            try
            {
                UpdateFrequency = float.Parse(ConfigurationManager.AppSettings.Get("updateFrequency"));
            }
            catch (FormatException)
            {
                UpdateFrequency = 0;
            }

            if (UpdateFrequency == 0)
            {
                AutoUpdate = false;
            }
        }
    }
}
