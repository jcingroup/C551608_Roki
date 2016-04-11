using System.Web.Mvc;
using DotWeb.Controller;
using ProcCore.Business.DB0;
using System.Collections.Generic;
using System.Linq;

namespace DotWeb.Controllers
{
    public class SellController : WebUserController
    {
        public ActionResult Index()
        {
            return View("Sell");
        }
        public ActionResult List()
        {
            return View("Sell_list");
        }
        public ActionResult Content()
        {
            return View("Sell_Content");
        }
    }

}
