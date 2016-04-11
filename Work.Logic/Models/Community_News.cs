using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace ProcCore.Business.DB0
{
    [MetadataType(typeof(Community_NewsMetadata))]
    public partial class Community_News
    {
        private class Community_NewsMetadata
        {
            [JsonIgnore()]
            public virtual Community Community { get; set; }
        }
    }
}

