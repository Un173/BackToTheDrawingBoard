using System;
using System.Collections.Generic;

namespace BackToTheDrawingBoard.Models
{
    public partial class Canvas
    {
        public Canvas()
        {
            CavasUser = new HashSet<CavasUser>();
        }

        public int Id { get; set; }
        public string String { get; set; }
        public string Name { get; set; }

        public ICollection<CavasUser> CavasUser { get; set; }
    }
}
