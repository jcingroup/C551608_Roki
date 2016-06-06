using DotWeb.WebApp.Models;
using ProcCore.Business.LogicConect;
using ProcCore.HandleResult;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Runtime.Caching;
using System.Threading.Tasks;
using System.Web.Http;
using Newtonsoft.Json;
using System.IO;
using ProcCore.Business.DB0;
using ProcCore;
using DotWeb.CommSetup;
using System.Web;
using ProcCore.WebCore;
using DotWeb.Helpers;
using ProcCore.Business;

namespace DotWeb.Api
{
    public class GetActionController : ajaxBaseApi
    {
        public async Task<IHttpActionResult> GetInsertRoles()
        {
            var system_roles = await roleManager.Roles.Where(x => x.Name != "Admins").ToListAsync();
            IList<UserRoleInfo> obj = new List<UserRoleInfo>();
            foreach (var role in system_roles)
            {
                obj.Add(new UserRoleInfo() { role_id = role.Id, role_name = role.Name, role_use = false });
            }
            return Ok(obj);
        }
        public async Task<IHttpActionResult> GetMenuQuery()
        {
            if (UserId == null)
                return null;

            ObjectCache cache = MemoryCache.Default;
            string cache_name = "m." + UserId;
            string json_context = (string)cache[cache_name];
            string path = System.Web.Hosting.HostingEnvironment.MapPath(string.Format("/_code/cache/m.{0}.json", UserId));

            if (json_context == null)
            {
                #region data access
                db0 = getDB0();
                IList<MenuDef> m1 = new List<MenuDef>();
                var menus = await db0.Menu.Where(x => x.is_use == true).ToListAsync();
                foreach (var menu in menus)
                {
                    var menu_roles = menu.AspNetRoles.Select(x => x.Id).ToList();
                    bool exits;
                    if (UserRoles.Any(x => x == "7b556351-4072-465b-8cf1-f02fa28ba3ca"))
                    {
                        exits = true;
                    }
                    else
                    {
                        exits = menu_roles.Intersect(UserRoles).Any(); //檢查 User roles是否與 menu roles是否有交集
                    }

                    if (exits)
                    {
                        var o = new MenuDef();
                        o.Area = menu.area == null ? string.Empty : menu.area;
                        o.Controller = menu.controller == null ? string.Empty : menu.controller;
                        o.Action = menu.action == null ? string.Empty : menu.action;

                        o.Title = menu.menu_name;
                        o.Clickable = !menu.is_folder;
                        o.Key = menu.menu_id;
                        o.ParentKey = menu.parent_menu_id;
                        o.sort = menu.sort;
                        o.Checked = false;
                        o.IconClass = menu.icon_class;
                        m1.Add(o);
                    }
                }
                db0.Dispose();
                #endregion

                //樹狀處理
                //var t1 = m1.Where(x => x.ParentKey == 0).OrderBy(x => x.sort);
                //foreach (var t2 in t1)
                //{
                //    t2.sub = ReMarkMenuTree(t2, m1);
                //}
                var result_obj = m1.OrderBy(x => x.sort);

                json_context = JsonConvert.SerializeObject(result_obj,
                    new JsonSerializerSettings()
                    {
                        NullValueHandling = NullValueHandling.Ignore
                    }
                    );
                File.WriteAllText(path, json_context);

                IList<string> paths = new List<string>();
                paths.Add(path);

                CacheItemPolicy policy = new CacheItemPolicy();
                policy.AbsoluteExpiration = DateTimeOffset.Now.AddHours(1);
                policy.ChangeMonitors.Add(new HostFileChangeMonitor(paths));
                cache.Set(cache_name, json_context, policy);

                return Ok(result_obj);
            }
            else
            {
                var result_obj = JsonConvert.DeserializeObject<IList<MenuDef>>(json_context);
                return Ok(result_obj);
            }
        }

        public async Task<IHttpActionResult> GetPorductCategoryL1(string lang)
        {
            db0 = getDB0();
            var items = await db0.Product_Category_L1
                .Where(x => x.i_Lang == lang)
                .OrderBy(x => x.l1_sort)
                .Select(x => new { x.product_category_l1_id, x.l1_name })
                .ToListAsync();
            return Ok(items);
        }
        public async Task<IHttpActionResult> GetPorductCategoryL2(string lang, int id)
        {
            db0 = getDB0();
            var items = await db0.Product_Category_L2
                .Where(x => x.i_Lang == lang && x.l1_id == id)
                .OrderBy(x => x.l2_sort)
                .Select(x => new { x.product_category_l2_id, x.l2_name })
                .ToListAsync();
            return Ok(items);
        }
        public async Task<IHttpActionResult> GetCategoryStruc()
        {
            db0 = getDB0();
            var items = await db0.Product_Category_L1
                .OrderBy(x => x.l1_sort)
                .Select(x => new CategoryL1
                {
                    id = x.product_category_l1_id,
                    name = x.l1_name,
                    lang = x.i_Lang,
                    l2 = x.Product_Category_L2.OrderBy(y => y.l2_sort).Select(y => new CategoryL2 { id = y.product_category_l2_id, name = y.l2_name })
                })
                .ToListAsync();
            return Ok(items);
        }
        public async Task<IHttpActionResult> copyToNewItemProduct(int id)
        {
            db0 = getDB0();
            int new_id=0;
            var item = await db0.Product.FindAsync(id);
            if (item != null) {
                new_id = GetNewId(CodeTable.Product);

                var md = new Product();
                md.product_id = new_id;
                md.product_name = item.product_name;
                md.modal = item.modal;
                md.description = item.description;
                md.l1_id = item.l1_id;
                md.l2_id = item.l2_id;
                md.sort = item.sort;
                md.is_new = item.is_new;
                md.i_Hide = item.i_Hide;
                md.i_Lang = item.i_Lang;
                db0.Product.Add(md);
                await db0.SaveChangesAsync();



            }

            return Ok(new_id);
        }


        public class CategoryL1
        {
            public int id { get; set; }
            public string name { get; set; }
            public string lang { get; set; }
            public IEnumerable<CategoryL2> l2 { get; set; }
        }

        public class CategoryL2
        {
            public int id { get; set; }
            public string name { get; set; }
        }

        #region 後台-參數設定
        [HttpPost]
        public ResultInfo PostAboutUs([FromBody]AboutUsParm md)
        {
            ResultInfo rAjaxResult = new ResultInfo();
            try
            {
                var open = openLogic();
                md.aboutus = RemoveScriptTag(md.aboutus);//移除script標籤

                open.setParmValue(ParmDefine.AboutUs, md.aboutus);

                rAjaxResult.result = true;
            }
            catch (Exception ex)
            {
                rAjaxResult.result = false;
                rAjaxResult.message = ex.Message;
            }
            return rAjaxResult;
        }

        #endregion

    }
    #region Parm

    public class AboutUsParm
    {
        public string aboutus { get; set; }
    }
    #endregion
}
