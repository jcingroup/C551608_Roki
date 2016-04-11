using System.Web.Mvc;
using DotWeb.Controller;
using ProcCore.Business.DB0;
using System.Collections.Generic;
using System.Linq;

namespace DotWeb.Controllers
{
    public class PartnerController : WebUserController
    {
        public ActionResult Index()
        {
            Edit item = new Edit();
            using (var db0 = getDB0())
            {
                #region get content
                item = db0.Edit.Find((int)EditorState.Recruit);
                #endregion
            }
            ViewBag.content = item.edit_content;
            return View("Partner");
        }
    }

}
