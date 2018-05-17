using System;
using System.Collections.Generic;

namespace BackToTheDrawingBoard.Models
{
    public partial class CavasUser
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int CanvasId { get; set; }

        public Canvas Canvas { get; set; }
        public LoginTable User { get; set; }
    }
}
