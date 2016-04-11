using DotWeb.CommSetup;
using DotWeb.Controller;
using ProcCore.Business.LogicConect;
using ProcCore.HandleResult;
using System;
using System.IO;
using System.Web.Mvc;
using System.Linq;

namespace DotWeb.Areas.Active.Controllers
{
    public class EditController : AdminController
    {
        #region Action and function section
        public ActionResult Main()
        {
            ActionRun();
            return View();
        }
        public ActionResult Aboutus()
        {//公司簡介
            ActionRun();
            return View();
        }
        public ActionResult Program()
        {//社區收益型專案
            ActionRun();
            return View();
        }
        public ActionResult Recruit()
        {//招賢納士
            ActionRun();
            return View();
        }
        public ActionResult VIP()
        {//幸福房仲VIP
            ActionRun();
            return View();
        }
        #endregion

        #region ajax call section
        public string aj_Init()
        {
            using (var db0 = getDB0())
            {
                return defJSON(new
                {
                });
            }
        }
        #endregion

    }
}