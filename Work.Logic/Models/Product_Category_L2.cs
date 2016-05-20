using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace ProcCore.Business.DB0
{
    [MetadataType(typeof(Product_Category_L2Metadata))]
    public partial class Product_Category_L2
    {
        private class Product_Category_L2Metadata
        {
            [JsonIgnore()]
            public virtual ICollection<Product> Product { get; set; }
            [JsonIgnore()]
            public virtual Product_Category_L1 Product_Category_L1 { get; set; }
        }
    }
}

