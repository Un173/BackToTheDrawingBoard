using System;
using System.Collections.Generic;

namespace BackToTheDrawingBoard.Models
{
    public partial class UserTypeTable
    {
        public UserTypeTable()
        {
            LoginTable = new HashSet<LoginTable>();
        }

        public int Id { get; set; }
        public string Name { get; set; }

        public ICollection<LoginTable> LoginTable { get; set; }
    }
}
