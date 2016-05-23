using System.Web.Mvc;
using DotWeb.Controller;
using ProcCore.Business.DB0;
using System.Collections.Generic;
using System.Linq;
using DotWeb.WebApp.Controllers;

namespace DotWeb.Controllers
{
    public class IndexController : WebUserController
    {
        public ActionResult Index()
        {
            db0 = getDB0();

            var lang = System.Threading.Thread.CurrentThread.CurrentCulture.Name;

            db0 = getDB0();

            var items = db0.Product
                .Where(x => x.i_Lang == lang && x.is_new == true)
                .OrderByDescending(x => x.sort)
                .Take(6)
                .Select(x => new ProductIntro()
                {
                    product_id = x.product_id,
                    modal = x.modal,
                    category_l2_name = x.Product_Category_L2.l2_name
                }).ToList();

            foreach (var item in items)
            {
                item.src = ImgSrc("Active", "ProductData", item.product_id, "img1", "origin");
            }

            return View("Index", items);
        }
        public RedirectResult Login()
        {
            return Redirect("~/Base/Login");
        }
    }

}
