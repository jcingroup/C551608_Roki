using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace ProcCore.Business.DB0
{
    [MetadataType(typeof(CommunityMetadata))]
    public partial class Community
    {
        private class CommunityMetadata
        {
            [JsonIgnore()]
            public virtual ICollection<Matter> Matter { get; set; }
            [JsonIgnore()]
            public virtual ICollection<Community_News> Community_News { get; set; }
        }
    }
}

