using System;
using System.Collections.Generic;

namespace BackToTheDrawingBoard.Models
{
    public partial class FavoriteCanvases
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int? CanvasId { get; set; }
    }
}
