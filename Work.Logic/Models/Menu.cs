using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace ProcCore.Business.DB0 {
    [MetadataType(typeof(MenuMetadata))]
    public partial class Menu
    {
        private class MenuMetadata
        {
            [JsonIgnore()]
            public ICollection<AspNetRoles> AspNetRoles { get; set; }
        }
    }
}

