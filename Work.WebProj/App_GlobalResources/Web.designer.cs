//------------------------------------------------------------------------------
// <auto-generated>
//     這段程式碼是由工具產生的。
//     執行階段版本:4.0.30319.42000
//
//     對這個檔案所做的變更可能會造成錯誤的行為，而且如果重新產生程式碼，
//     變更將會遺失。
// </auto-generated>
//------------------------------------------------------------------------------

namespace Resources {
    using System;
    
    
    /// <summary>
    ///   用於查詢當地語系化字串等的強型別資源類別。
    /// </summary>
    // 這個類別是自動產生的，是利用 StronglyTypedResourceBuilder
    // 類別透過 ResGen 或 Visual Studio 這類工具產生。
    // 若要加入或移除成員，請編輯您的 .ResX 檔，然後重新執行 ResGen
    // (利用 /str 選項)，或重建 Visual Studio 專案。
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.VisualStudio.Web.Application.StronglyTypedResourceProxyBuilder", "14.0.0.0")]
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
    [global::System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
    internal class Web {
        
        private static global::System.Resources.ResourceManager resourceMan;
        
        private static global::System.Globalization.CultureInfo resourceCulture;
        
        [global::System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        internal Web() {
        }
        
        /// <summary>
        ///   傳回這個類別使用的快取的 ResourceManager 執行個體。
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Resources.ResourceManager ResourceManager {
            get {
                if (object.ReferenceEquals(resourceMan, null)) {
                    global::System.Resources.ResourceManager temp = new global::System.Resources.ResourceManager("Resources.Web", global::System.Reflection.Assembly.Load("App_GlobalResources"));
                    resourceMan = temp;
                }
                return resourceMan;
            }
        }
        
        /// <summary>
        ///   覆寫目前執行緒的 CurrentUICulture 屬性，對象是所有
        ///   使用這個強型別資源類別的資源查閱。
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Globalization.CultureInfo Culture {
            get {
                return resourceCulture;
            }
            set {
                resourceCulture = value;
            }
        }
        
        /// <summary>
        ///   查詢類似 詳細介紹 的當地語系化字串。
        /// </summary>
        internal static string product_description {
            get {
                return ResourceManager.GetString("product_description", resourceCulture);
            }
        }
        
        /// <summary>
        ///   查詢類似 產品介紹 的當地語系化字串。
        /// </summary>
        internal static string product_introd {
            get {
                return ResourceManager.GetString("product_introd", resourceCulture);
            }
        }
        
        /// <summary>
        ///   查詢類似 產品選單 的當地語系化字串。
        /// </summary>
        internal static string product_menu {
            get {
                return ResourceManager.GetString("product_menu", resourceCulture);
            }
        }
        
        /// <summary>
        ///   查詢類似 產品型號 的當地語系化字串。
        /// </summary>
        internal static string product_modal {
            get {
                return ResourceManager.GetString("product_modal", resourceCulture);
            }
        }
        
        /// <summary>
        ///   查詢類似 最新產品 的當地語系化字串。
        /// </summary>
        internal static string product_new {
            get {
                return ResourceManager.GetString("product_new", resourceCulture);
            }
        }
        
        /// <summary>
        ///   查詢類似 產品搜尋結果 [搜尋關鍵字] 的當地語系化字串。
        /// </summary>
        internal static string product_search_result {
            get {
                return ResourceManager.GetString("product_search_result", resourceCulture);
            }
        }
        
        /// <summary>
        ///   查詢類似 規格描述 的當地語系化字串。
        /// </summary>
        internal static string product_standard {
            get {
                return ResourceManager.GetString("product_standard", resourceCulture);
            }
        }
    }
}
