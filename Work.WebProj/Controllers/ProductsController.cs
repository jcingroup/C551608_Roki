using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DotWeb.Controller;

namespace DotWeb.WebApp.Controllers
{
    public class ProductsController : WebUserController
    {
        // GET: Products
        public ActionResult Index()
        {
            return View("NewProduct");
        }
        public ActionResult list()
        {
            return View();
        }
        public ActionResult content()
        {
            return View();
        }
        public ActionResult search()
        {
            return View();
        }
    }
}