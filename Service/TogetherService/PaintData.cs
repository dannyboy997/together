using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TogetherService
{
    public class PaintData
    {
        public PaintLine[] Line { get; set; }

        public string UserId { get; set; }
    }

    public class PaintLine
    {
        public PaintCoordinate Start { get; set; }

        public PaintCoordinate Stop { get; set; }
    }

    public class PaintCoordinate
    {
        public int OffsetX { get; set; }

        public int OffsetY { get; set; }
    }
}
