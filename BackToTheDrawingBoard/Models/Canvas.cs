using System;
using System.Collections.Generic;

namespace BackToTheDrawingBoard.Models
{
    public partial class Canvas
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string String { get; set; }
        public string CreatorId { get; set; }
    }
}
