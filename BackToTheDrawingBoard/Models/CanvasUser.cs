using System;
using System.Collections.Generic;

namespace BackToTheDrawingBoard.Models
{
    public partial class CanvasUser
    {
        public int Id { get; set; }
        public int CanvasId { get; set; }
        public string UserId { get; set; }
    }
}
