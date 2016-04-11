using System.Web.Mvc;
using DotWeb.Controller;
using ProcCore.Business.DB0;
using System.Collections.Generic;
using System.Linq;

namespace DotWeb.Controllers
{
    public class NeighborController : WebUserController
    {
        public ActionResult Index()
        {
            return View("Neighbor");
        }
        public ActionResult List()
        {
            return View("Neighbor_list");
        }
        public ActionResult Content()
        {
            return View("Neighbor_content");
        }
    }

}
