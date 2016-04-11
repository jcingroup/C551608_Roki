using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace ProcCore.Business.DB0
{
    [MetadataType(typeof(MatterMetadata))]
    public partial class Matter
    {
        private class MatterMetadata
        {
            [JsonIgnore()]
            public virtual Community Community { get; set; }
        }
    }
}

