using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DotWeb.Controller;
using ProcCore.Business.DB0;

namespace DotWeb.WebApp.Controllers
{
    public class ProductsController : WebUserController
    {
        // GET: Products
        public ActionResult Index()
        {
            var lang = System.Threading.Thread.CurrentThread.CurrentCulture.Name;

            db0 = getDB0();

            var items = db0.Product_Category_L1
                .OrderBy(x => x.l1_sort)
                .Where(x => x.i_Lang == lang && x.Product.Count() > 0)
                .Select(x => new NewProduct
                {
                    category_id = x.product_category_l1_id,
                    category_name = x.l1_name,
                    count = x.Product.Count(),
                    products = x.Product.OrderBy(y => y.sort).Take(2).Select(z => new ProductIntro()
                    {
                        product_id = z.product_id,
                        category_l2_name = z.Product_Category_L2.l2_name,
                        standard = z.standard,
                        modal = z.modal
                    })
                }).ToList();

            foreach (var item in items)
            {
                foreach (var list in item.products)
                {
                    list.src = ImgSrc("Active", "ProductData", list.product_id, "img1", "origin");
                }
            }

            return View("NewProduct", items);
        }
        public ActionResult list(int? id, int? id2)
        {
            var lang = System.Threading.Thread.CurrentThread.CurrentCulture.Name;

            db0 = getDB0();

            var menus = (IEnumerable<CategoryL1Data>)ViewBag.CategoryStroe;

            //取得Menu 第一項目

            int main_category_id = 0;
            int sub_category_id = 0;
            string main_category_name = "";
            string sub_category_name = "";
            int main_category_count = 0;
            int sub_category_count = 0;

            if (id == null)
            {
                var main_category = menus.FirstOrDefault();
                var sub_category = menus.FirstOrDefault().categoryL2Data.FirstOrDefault();
                main_category_id = main_category.id;
                main_category_name = main_category.name;
                sub_category_name = sub_category.name;
                sub_category_id = sub_category.id;
            }
            else
            {
                main_category_id = (int)id;
                var find_category_l1 = menus.First(x => x.id == main_category_id);
                main_category_name = find_category_l1.name;

                if (id2 == null)
                {
                    var find_category_l2 = find_category_l1.categoryL2Data.FirstOrDefault();
                    sub_category_id = find_category_l2.id;
                    sub_category_name = find_category_l2.name;
                }
                else
                {
                    var find_category_l2 = find_category_l1.categoryL2Data.FirstOrDefault(x => x.id == id2);
                    sub_category_id = find_category_l2.id;
                    sub_category_name = find_category_l2.name;
                }
            }

            ViewBag.main_category_id = main_category_id;
            ViewBag.sub_category_id = sub_category_id;
            ViewBag.CategoryStroe = menus;

            main_category_count = db0.Product.Where(x => x.l1_id == main_category_id).Count();
            sub_category_count = db0.Product.Where(x => x.l2_id == sub_category_id).Count();

            CategoryStroe categoryStroe = new CategoryStroe();
            categoryStroe.categoryL1Data = menus;
            categoryStroe.now_category_l1 = main_category_id;
            categoryStroe.now_category_l2 = sub_category_id;


            var items = db0
                .Product
                .Where(x => x.i_Lang == lang && x.l1_id == main_category_id && x.l2_id == sub_category_id)
                .Select(x => new ProductIntro()
                {
                    product_id = x.product_id,
                    modal = x.modal,
                    standard = x.standard,
                    category_l2_name = x.Product_Category_L2.l2_name

                }).ToList();

            foreach (var item in items)
            {
                item.src = ImgSrc("Active", "ProductData", item.product_id, "img1", "origin");
            }

            ProductList md = new ProductList();
            md.products = items;
            md.menuStroe = categoryStroe;
            md.name_category_l1 = main_category_name;
            md.name_category_l2 = sub_category_name;
            md.count_category_l1 = main_category_count;
            md.count_category_l2 = sub_category_count;

            return View(md);
        }
        public ActionResult content(int id)
        {
            var lang = System.Threading.Thread.CurrentThread.CurrentCulture.Name;
            db0 = getDB0();

            var menus = (IEnumerable<CategoryL1Data>)ViewBag.CategoryStroe;

            int main_category_id = 0;
            int sub_category_id = 0;
            string main_category_name = "";
            string sub_category_name = "";
            int main_category_count = 0;
            int sub_category_count = 0;


            var item = db0.Product.Find(id);

            var get_category_l1 = item.Product_Category_L1;
            var get_category_l2 = item.Product_Category_L2;

            main_category_id = get_category_l1.product_category_l1_id;
            sub_category_id = get_category_l2.product_category_l2_id;
            main_category_name = get_category_l1.l1_name;
            sub_category_name = get_category_l2.l2_name;

            ViewBag.main_category_id = main_category_id;
            ViewBag.sub_category_id = sub_category_id;
            ViewBag.CategoryStroe = menus;

            main_category_count = db0.Product.Where(x => x.l1_id == main_category_id).Count();
            sub_category_count = db0.Product.Where(x => x.l2_id == sub_category_id).Count();


            CategoryStroe categoryStroe = new CategoryStroe();
            categoryStroe.categoryL1Data = menus;
            categoryStroe.now_category_l1 = main_category_id;
            categoryStroe.now_category_l2 = sub_category_id;

            ProductContent md = new ProductContent();
            md.product = item;
            md.menuStroe = categoryStroe;
            md.name_category_l1 = main_category_name;
            md.name_category_l2 = sub_category_name;
            md.count_category_l1 = main_category_count;
            md.count_category_l2 = sub_category_count;
            md.src = ImgSrc("Active", "ProductData", item.product_id, "img1", "origin");

            return View(md);
        }
        public ActionResult search(string keyword)
        {
            var w = keyword.Trim();

            db0 = getDB0();
            IList<ProductIntro> items = null;
            if (keyword != null)
            {
                items = db0.Product
                    .Where(x => x.modal.Contains(w) || x.standard.Contains(w))
                    .OrderByDescending(x => x.sort)
                    .Select(x => new ProductIntro()
                    {
                        product_id = x.product_id,
                        modal = x.modal,
                        standard = x.standard,
                        category_l2_name = x.Product_Category_L2.l2_name

                    }).ToList();
            }

            foreach (var item in items)
            {
                item.src = ImgSrc("Active", "ProductData", item.product_id, "img1", "origin");
            }

            return View(items);
        }
    }

    public class NewProduct
    {
        public string category_name { get; set; }
        public int category_id { get; set; }
        public int count { get; set; }
        public IEnumerable<ProductIntro> products { get; set; }
    }
    public class ProductList
    {
        public IEnumerable<ProductIntro> products { get; set; }
        public CategoryStroe menuStroe { get; set; }
        public string name_category_l1 { get; set; }
        public string name_category_l2 { get; set; }

        public int count_category_l1 { get; set; }
        public int count_category_l2 { get; set; }
    }

    public class ProductIntro
    {
        public int product_id { get; set; }
        public string category_l2_name { get; set; }
        public string modal { get; set; }
        public string standard { get; set; }

        public string power { get; set; }
        public string feature { get; set; }
        public string technical_specification { get; set; }
        public string src { get; set; }
    }
    public class ProductContent
    {
        public Product product { get; set; }
        public CategoryStroe menuStroe { get; set; }
        public string name_category_l1 { get; set; }
        public string name_category_l2 { get; set; }
        public int count_category_l1 { get; set; }
        public int count_category_l2 { get; set; }
        public string src { get; set; }

    }
}