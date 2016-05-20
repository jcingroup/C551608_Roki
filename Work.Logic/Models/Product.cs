using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace ProcCore.Business.DB0
{
    [MetadataType(typeof(ProductMetadata))]
    public partial class Product
    {
        private class ProductMetadata
        {
            [JsonIgnore()]
            public virtual Product_Category_L1 Product_Category_L1 { get; set; }
            [JsonIgnore()]
            public virtual Product_Category_L2 Product_Category_L2 { get; set; }
        }
    }
}

