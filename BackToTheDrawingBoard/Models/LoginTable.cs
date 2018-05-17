using System;
using System.Collections.Generic;

namespace BackToTheDrawingBoard.Models
{
    public partial class LoginTable
    {
        public LoginTable()
        {
            CavasUser = new HashSet<CavasUser>();
        }

        public int Id { get; set; }
        public string Login { get; set; }
        public int UserType { get; set; }

        public UserTypeTable UserTypeNavigation { get; set; }
        public ICollection<CavasUser> CavasUser { get; set; }
    }
}
