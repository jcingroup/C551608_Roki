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
                        product_name = z.product_name,
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
        public ActionResult list(int? id)
        {
            var lang = System.Threading.Thread.CurrentThread.CurrentCulture.Name;

            db0 = getDB0();

            var menus = db0.Product_Category_L1
                .Where(x => x.i_Lang == lang).OrderBy(x => x.l1_sort)
                .Select(x => new CategoryL1Data()
                {
                    id = x.product_category_l1_id,
                    name = x.l1_name,
                    categoryL2Data = x.Product_Category_L2.OrderBy(y => y.l2_sort).Select(y => new CategoryL2Data()
                    {
                        id = y.l1_id,
                        name = y.l2_name,
                        count = y.Product.Count()
                    }),
                    count = x.Product.Count()
                });

            int main_category_id = 0;
            int sub_category_id = 0;

            string main_category_name = "";
            string sub_category_name = "";

            int main_category_count = 0;
            int sub_category_count = 0;

            var main_category = menus.FirstOrDefault();
            var sub_category = menus.FirstOrDefault().categoryL2Data.FirstOrDefault();

            if (id == null)
                main_category_id = main_category.id;
            else
                main_category_id = (int)id;

            sub_category_id = sub_category.id;

            main_category_name = main_category.name;
            sub_category_name = sub_category.name;

            main_category_count = db0.Product_Category_L1.Where(x => x.product_category_l1_id == main_category_id).Count();
            sub_category_count = db0.Product_Category_L2.Where(x => x.product_category_l2_id == main_category_id).Count();

            CategoryStroe categoryStroe = new CategoryStroe();
            categoryStroe.categoryL1Data = menus;
            categoryStroe.now_category_l1 = main_category_id;
            categoryStroe.now_category_l2 = sub_category_id;


            var items = db0
                .Product
                .Where(x => x.i_Lang == lang)
                .Select(x => new ProductIntro()
                {
                    product_id = x.product_id,
                    modal = x.modal,
                    standard = x.standard,
                    product_name = x.product_name

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

            var menus = db0.Product_Category_L1
                .Where(x => x.i_Lang == lang).OrderBy(x => x.l1_sort)
                .Select(x => new CategoryL1Data()
                {
                    id = x.product_category_l1_id,
                    name = x.l1_name,
                    categoryL2Data = x.Product_Category_L2.OrderBy(y => y.l2_sort).Select(y => new CategoryL2Data()
                    {
                        id = y.l1_id,
                        name = y.l2_name,
                        count = y.Product.Count()
                    }),
                    count = x.Product.Count()
                });

            int main_category_id = 0;
            int sub_category_id = 0;

            string main_category_name = "";
            string sub_category_name = "";

            int main_category_count = 0;
            int sub_category_count = 0;

            var main_category = menus.FirstOrDefault();
            var sub_category = menus.FirstOrDefault().categoryL2Data.FirstOrDefault();

            main_category_id = main_category.id;
            sub_category_id = sub_category.id;

            main_category_name = main_category.name;
            sub_category_name = sub_category.name;

            CategoryStroe categoryStroe = new CategoryStroe();
            categoryStroe.categoryL1Data = menus;
            categoryStroe.now_category_l1 = main_category_id;
            categoryStroe.now_category_l2 = sub_category_id;

            var item = db0.Product.Find(id);

            main_category_count = db0.Product_Category_L1.Where(x => x.product_category_l1_id == item.l1_id).Count();
            sub_category_count = db0.Product_Category_L2.Where(x => x.product_category_l2_id == item.l2_id).Count();

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
        public ActionResult search()
        {
            return View();
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
    public class CategoryStroe
    {
        public IEnumerable<CategoryL1Data> categoryL1Data { get; set; }
        public int? now_category_l1 { get; set; }
        public int? now_category_l2 { get; set; }
    }
    public class CategoryL1Data
    {
        public int id { get; set; }
        public string name { get; set; }
        public int count { get; set; }
        public IEnumerable<CategoryL2Data> categoryL2Data { get; set; }
    }
    public class CategoryL2Data
    {
        public int id { get; set; }
        public string name { get; set; }
        public int count { get; set; }
    }
    public class ProductIntro
    {
        public int product_id { get; set; }
        public string product_name { get; set; }
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