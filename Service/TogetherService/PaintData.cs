using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TogetherService.Model;

namespace TogetherService
{
    public class Drawing : IModelData
    {
        public string Key { get; set; }

        public List<PaintData> PaintData { get;set;}
    }

    public class PaintData
    {
        public string Color { get; set; }

        public PaintLine[] Line { get; set; }

        public string UserId { get; set; }
    }

    public class PaintLine
    {
        public PaintCoordinate Start { get; set; }

        public PaintCoordinate Stop { get; set; }

        public string Color { get; set; }
    }

    public class PaintCoordinate
    {
        public float OffsetX { get; set; }

        public float OffsetY { get; set; }
    }
}
