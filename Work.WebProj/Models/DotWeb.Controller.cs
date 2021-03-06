﻿using DotWeb.CommSetup;
using DotWeb.Controllers;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Newtonsoft.Json;
using ProcCore;
using ProcCore.Business;
using ProcCore.Business.DB0;
using ProcCore.Business.LogicConect;
using ProcCore.HandleResult;
using ProcCore.NetExtension;
using ProcCore.WebCore;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Transactions;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Filters;
using System.Web.Routing;

namespace DotWeb.Controller
{
    #region 基底控制器
    public abstract class SourceController : System.Web.Mvc.Controller
    {
        //protected string IP;
        protected C55A0_RokiEntities db0;
        protected bool isTablet = false;
        protected virtual string getRecMessage(string MsgId)
        {
            String r = Resources.Res.ResourceManager.GetString(MsgId);
            return String.IsNullOrEmpty(r) ? MsgId : r;
        }
        protected string defJSON(object o)
        {
            return JsonConvert.SerializeObject(o, new JsonSerializerSettings() { NullValueHandling = NullValueHandling.Ignore });
        }
        protected TransactionScope defAsyncScope()
        {
            return new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);
        }
        protected virtual LogicCenter openLogic()
        {
            LogicCenter dbLogic = new LogicCenter(CommSetup.CommWebSetup.DB0_CodeString);

            dbLogic.IP = System.Web.HttpContext.Current.Request.UserHostAddress;

            return dbLogic;
        }
        protected string getNowLnag()
        {
            return System.Globalization.CultureInfo.CurrentCulture.Name;
        }
        protected static C55A0_RokiEntities getDB0()
        {
            LogicCenter.SetDB0EntityString(CommSetup.CommWebSetup.DB0_CodeString);
            return LogicCenter.getDB0;
        }
    }
    [Authorize]
    public abstract class AdminController : SourceController
    {
        protected string UserId; //指的是Sales登錄帳號
        protected string LoginUserFlag = string.Empty;//N:管理端登錄 Y:用戶端登錄
        protected int UserRank;//Sales位階
        protected string aspUserId;
        protected int departmentId;
        protected int defPageSize = 0;
        //訂義取得本次執行 Controller Area Action名稱
        protected string getController = string.Empty;
        protected string getArea = string.Empty;
        protected string getAction = string.Empty;

        //訂義檔案上傳路行樣板
        protected string upload_path_tpl_o = "~/_Code/SysUpFiles/{0}/{1}/{2}/{3}/{4}";
        protected string upload_path_tpl_s = "~/_Code/SysUpFiles/{0}/{1}/{2}/{3}";

        //系統認可圖片檔副檔名
        protected string[] imgExtDef = new string[] { ".jpg", ".jpeg", ".gif", ".png", ".bmp" };

        //protected Log.LogPlamInfo plamInfo = new Log.LogPlamInfo() { AllowWrite = true };
        private ApplicationUserManager _userManager;
        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }
        public RoleManager<IdentityRole> roleManager
        {
            get
            {
                ApplicationDbContext context = ApplicationDbContext.Create();
                return new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));
            }
        }
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            base.OnActionExecuting(filterContext);

            var aspnet_user_id = User.Identity.GetUserId(); //一定要有值 無值為系統出問題

            var getUserIdCookie = Request.Cookies[CommWebSetup.WebCookiesId + ".member_id"];
            var getUserName = Request.Cookies[CommWebSetup.WebCookiesId + ".member_name"];
            UserId = getUserIdCookie == null ? null : EncryptString.desDecryptBase64(Server.UrlDecode(getUserIdCookie.Value));

            #region 判斷是管理端、用戶端登入
            var getLoginUserFlag = Request.Cookies["user_login"];
            LoginUserFlag = getLoginUserFlag == null ? "" :
                EncryptString.desDecryptBase64(Server.UrlDecode(getLoginUserFlag.Value));
            ViewBag.user_login = LoginUserFlag;
            #endregion

            ApplicationUser aspnet_user = UserManager.FindById(aspnet_user_id);
            //UserId = aspnet_user.Id;
            if (UserId != null)
            {
                #region Working...
                ViewBag.UserId = UserId;
                ViewBag.UserName = getUserName == null ? "" : Server.UrlDecode(getUserName.Value);


                string asp_net_roles = aspnet_user.Roles.Select(x => x.RoleId).FirstOrDefault();
                var role = roleManager.FindById(asp_net_roles);
                ViewBag.RoleName = role.Name;

                departmentId = aspnet_user.department_id;

                isTablet = (new WebInfo()).isTablet();

                //ViewBag.Caption = Resources.Res.ViewbagCapton;
                //ViewBag.MenuName = Resources.Res.ViewbagMenuName;

                #endregion
            }
        }
        protected override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            base.OnActionExecuted(filterContext);
            Log.WriteToFile();
        }

        protected void ActionRun()
        {

            #region get now area controller & action
            var get_now_area = RouteData.DataTokens["area"].ToString();
            var get_now_controller = RouteData.Values["controller"].ToString();
            var get_now_action = RouteData.Values["action"].ToString();

            var get_route = (Route)RouteData.Route;
            var get_def_action = get_route.Defaults["action"].ToString();
            #endregion

            using (db0 = getDB0())
            {
                if (UserId != null)
                {
                    ViewBag.UserId = this.UserId;
                }

                #region getRoles
                var aspnet_user_id = User.Identity.GetUserId();
                ApplicationUser aspnet_user = UserManager.FindById(aspnet_user_id);
                string asp_net_roles = aspnet_user.Roles.Select(x => x.RoleId).FirstOrDefault();
                var role = roleManager.FindById(asp_net_roles);
                var getRoles = db0.AspNetUsers.FirstOrDefault(x => x.Id == aspnet_user_id).AspNetRoles.Select(x => x.Name);

                ViewBag.RoleName = role.Name;
                #endregion

                ViewBag.Langs = db0.i_Lang.Where(x => x.isuse == true).OrderBy(x => x.sort).ToList();

                Menu m;

                if (get_now_action == null)
                {
                    m = db0.Menu
                        .Where(x =>
                        x.area == get_now_area &&
                        x.controller == get_now_controller &&
                        x.action == get_def_action).FirstOrDefault();
                }
                else
                {
                    m = db0.Menu
                        .Where(x =>
                        x.area == get_now_area &&
                        x.controller == get_now_controller &&
                        x.action == get_now_action).FirstOrDefault();
                }

                if (m == null)
                {
                    ViewBag.Caption = "Not Query";
                    ViewBag.MenuName = "Not Query";
                }
                else
                {
                    var p = db0.Menu.Where(x => x.menu_id == m.parent_menu_id).FirstOrDefault();
                    if (p == null)
                    {
                        ViewBag.Caption = m.menu_name;
                        ViewBag.MenuName = "Not Query";
                    }
                    else
                    {
                        ViewBag.Caption = m.menu_name;
                        ViewBag.MenuName = p.menu_name;
                    }
                }
            }
        }
        public int getNewId()
        {
            return getNewId(CodeTable.Base);
        }
        public int getNewId(CodeTable tab)
        {

            //using (TransactionScope tx = new TransactionScope())
            //{
            var db = getDB0();
            try
            {
                string tab_name = Enum.GetName(typeof(ProcCore.Business.CodeTable), tab);
                var items = db.i_IDX.Where(x => x.table_name == tab_name).FirstOrDefault();

                if (items == null)
                {
                    return 0;
                }
                else
                {
                    //var item = items.FirstOrDefault();
                    items.IDX++;
                    db.SaveChanges();
                    //tx.Complete();
                    return items.IDX;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return 0;
            }
            finally
            {
                db.Dispose();
            }
            //}
        }

        protected void hdlUpImage(string file_name, string file_kind, string id, ImageUpScope fp)
        {
            string up_path_tpl_o = "~/_Code/SysUpFiles/{0}/{1}/{2}";
            string up_path_tpl_s = "~/_Code/SysUpFiles/{0}/{1}";

            BinaryReader binary_read = null;
            string file_ext = Path.GetExtension(file_name); //取得副檔名
            string[] ie_older_ver = new string[] { "6.0", "7.0", "8.0", "9.0" };

            if (Request.Browser.Browser == "IE" && ie_older_ver.Any(x => x == Request.Browser.Version))
            {
                #region IE file stream handle
                HttpPostedFile get_post_file = System.Web.HttpContext.Current.Request.Files[0];
                if (!get_post_file.FileName.Equals(""))
                    binary_read = new BinaryReader(get_post_file.InputStream);
                #endregion
            }
            else
                binary_read = new BinaryReader(Request.InputStream);

            byte[] upload_file = binary_read.ReadBytes(Convert.ToInt32(binary_read.BaseStream.Length));

            string web_path_org = string.Format(up_path_tpl_o, file_kind, id, "origin");
            string server_path_org = Server.MapPath(web_path_org);

            #region 檔案上傳前檢查
            if (fp.limitSize > 0) //檔案大小檢查
                if (binary_read.BaseStream.Length > fp.limitSize)
                    throw new LogicError("Log_Err_FileSizeOver");

            if (fp.limitCount > 0 && Directory.Exists(server_path_org))
            {
                string[] Files = Directory.GetFiles(server_path_org);
                if (Files.Count() >= fp.limitCount) //還沒存檔，因此Selet到等於的數量，再加上現在要存的檔案即算超過
                    throw new LogicError("Log_Err_FileCountOver");
            }

            if (fp.allowExtType != null)
                if (!fp.allowExtType.Contains(file_ext.ToLower()))
                    throw new LogicError("Log_Err_AllowFileType");

            if (fp.limitExtType != null)
                if (fp.limitExtType.Contains(file_ext))
                    throw new LogicError("Log_Err_LimitedFileType");
            #endregion
            #region 存檔區

            string guid = Guid.NewGuid().ToString();
            string guid_file_name = guid + file_ext;

            if (fp.keepOrigin)
            {
                //原始檔
                if (!Directory.Exists(server_path_org)) { Directory.CreateDirectory(server_path_org); }

                FileStream file_stream = new FileStream(server_path_org + "\\" + guid_file_name, FileMode.Create);
                BinaryWriter binary_write = new BinaryWriter(file_stream);
                binary_write.Write(upload_file);

                file_stream.Close();
                binary_write.Close();
            }

            //後台管理的ICON小圖
            string web_path_icon = string.Format(up_path_tpl_o, file_kind, id, "icon");
            string server_path_icon = Server.MapPath(web_path_icon);
            if (!Directory.Exists(server_path_icon)) { Directory.CreateDirectory(server_path_icon); }
            MemoryStream smr = resizeImage(upload_file, 0, 90);
            System.IO.File.WriteAllBytes(server_path_icon + "\\" + Path.GetFileName(guid_file_name), smr.ToArray());
            smr.Dispose();

            //依據參數進行裁圖

            foreach (ImageSizeParm imSize in fp.Parm)
            {
                string web_path_parm = string.Format(up_path_tpl_o, file_kind, id, imSize.folderName);
                string server_path_parm = Server.MapPath(web_path_parm);
                if (!Directory.Exists(server_path_parm)) { Directory.CreateDirectory(server_path_parm); }//找不到路徑
                MemoryStream sm = resizeImage(upload_file, imSize.width, imSize.heigh);
                System.IO.File.WriteAllBytes(server_path_parm + "\\" + Path.GetFileName(guid_file_name), sm.ToArray());
                sm.Dispose();
            }

            #endregion

            #region Handle Json Info
            string file_json_web_path = string.Format(up_path_tpl_s, file_kind, id);
            string file_json_server_path = Server.MapPath(file_json_web_path) + "\\file.json";

            IList<JsonFileInfo> f = null;
            int sort = 0;
            if (System.IO.File.Exists(file_json_server_path))
            {
                var read_json = System.IO.File.ReadAllText(file_json_server_path);
                f = JsonConvert.DeserializeObject<IList<JsonFileInfo>>(read_json);
                if (f.Any(x => x.fileName == file_name))
                {
                    return;
                }

                sort = f.Count + 1;
            }
            else
            {
                f = new List<JsonFileInfo>();
                sort = 1;
            }

            f.Add(new JsonFileInfo()
            {
                guid = guid,
                fileName = guid_file_name,
                originName = file_name,
                sort = sort
            });

            var json_string = JsonConvert.SerializeObject(f);
            System.IO.File.WriteAllText(file_json_server_path, json_string, Encoding.UTF8);
            #endregion
        }
        protected void delUpFile(string file_kind, string id, string guid)
        {
            string up_path_tpl_s = "~/_Code/SysUpFiles/{0}/{1}";

            #region Handle Json Info
            string file_json_web_path = string.Format(up_path_tpl_s, file_kind, id);
            string file_json_server_path = Server.MapPath(file_json_web_path) + "\\file.json";

            IList<JsonFileInfo> get_file_json_object = null;
            if (System.IO.File.Exists(file_json_server_path))
            {
                var read_json = System.IO.File.ReadAllText(file_json_server_path);
                get_file_json_object = JsonConvert.DeserializeObject<IList<JsonFileInfo>>(read_json);
                var get_file_object = get_file_json_object.Where(x => x.guid == guid).FirstOrDefault();
                if (get_file_object != null)
                {
                    get_file_json_object.Remove(get_file_object);
                    int i = 1;
                    foreach (var file_object in get_file_json_object)
                    {
                        file_object.sort = i;
                        i++;
                    }
                    var json_string = JsonConvert.SerializeObject(get_file_json_object);
                    System.IO.File.WriteAllText(file_json_server_path, json_string, Encoding.UTF8);

                    #region 實際刪除檔案
                    string tpl_FolderPath = Server.MapPath(string.Format(up_path_tpl_s, file_kind, id));

                    string handle_delete_file = tpl_FolderPath + "\\" + get_file_object.fileName;
                    if (System.IO.File.Exists(handle_delete_file))
                        System.IO.File.Delete(handle_delete_file);
                    #region Delete Run
                    if (Directory.Exists(tpl_FolderPath))
                    {
                        var folders = Directory.GetDirectories(tpl_FolderPath);
                        foreach (var folder in folders)
                        {
                            string herefile = folder + "\\" + get_file_object.fileName;
                            if (System.IO.File.Exists(herefile))
                                System.IO.File.Delete(herefile);
                        }
                    }
                    #endregion 
                    #endregion
                }
            }
            #endregion

        }
        protected SerializeFile[] lstImgFile(string file_kind, string id)
        {
            string up_path_tpl_o = "~/_Code/SysUpFiles/{0}/{1}/{2}";
            string up_path_tpl_s = "~/_Code/SysUpFiles/{0}/{1}";

            string web_path_org = string.Format(up_path_tpl_o, file_kind, id, "origin");
            string server_path_org = Server.MapPath(web_path_org);
            string web_path_icon = string.Format(up_path_tpl_o, file_kind, id, "icon");

            List<SerializeFile> l_files = new List<SerializeFile>();

            string file_json_web_path = string.Format(up_path_tpl_s, file_kind, id);
            string file_json_server_path = Server.MapPath(file_json_web_path) + "\\file.json";

            string web_path_s = string.Format(up_path_tpl_s, file_kind, id, "origin");
            string server_path_s = Server.MapPath(web_path_s);

            if (System.IO.File.Exists(file_json_server_path))
            {
                var read_json = System.IO.File.ReadAllText(file_json_server_path);
                var get_file_json_object = JsonConvert.DeserializeObject<IList<JsonFileInfo>>(read_json).OrderBy(x => x.sort);
                foreach (var m in get_file_json_object)
                {
                    string get_file = server_path_org + "//" + m.fileName;
                    if (System.IO.File.Exists(get_file))
                    {
                        FileInfo file_info = new FileInfo(get_file);
                        SerializeFile file_object = new SerializeFile()
                        {
                            guid = m.guid,
                            fileName = file_info.Name,
                            fileKind = id,
                            iconPath = Url.Content(web_path_icon + "/" + file_info.Name),
                            originPath = Url.Content(web_path_org + "/" + file_info.Name),
                            size = file_info.Length,
                            isImage = true
                        };
                        l_files.Add(file_object);
                    }
                }
            }

            return l_files.ToArray();
        }
        protected void srtUpFile(string file_kind, string id, IList<string> guids)
        {
            string up_path_tpl_s = "~/_Code/SysUpFiles/{0}/{1}";
            string file_json_web_path = string.Format(up_path_tpl_s, file_kind, id);
            string file_json_server_path = Server.MapPath(file_json_web_path) + "\\file.json";
            if (System.IO.File.Exists(file_json_server_path))
            {
                var read_json = System.IO.File.ReadAllText(file_json_server_path);
                IList<JsonFileInfo> get_file_json_object = JsonConvert.DeserializeObject<IList<JsonFileInfo>>(read_json);

                int i = 1;
                foreach (var guid in guids)
                {
                    var fileJson = get_file_json_object.Where(x => x.guid == guid).FirstOrDefault();
                    if (fileJson != null)
                    {
                        fileJson.sort = i;
                        i++;
                    }
                }

                string json_string = JsonConvert.SerializeObject(get_file_json_object);
                System.IO.File.WriteAllText(file_json_server_path, json_string, Encoding.UTF8);
            }
        }

        protected MemoryStream resizeImage(Byte[] s, int new_width, int new_hight)
        {
            try
            {
                TypeConverter tc = TypeDescriptor.GetConverter(typeof(Bitmap));
                Bitmap im = (Bitmap)tc.ConvertFrom(s);

                if (new_hight == 0)
                    new_hight = (im.Height * new_width) / im.Width;

                if (new_width == 0)
                    new_width = (im.Width * new_hight) / im.Height;

                if (im.Width < new_width)
                    new_width = im.Width;

                if (im.Height < new_hight)
                    new_hight = im.Height;

                EncoderParameter qualityParam = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, 100L);
                EncoderParameters myEncoderParameter = new EncoderParameters(1);
                myEncoderParameter.Param[0] = qualityParam;

                ImageCodecInfo myImageCodecInfo = getEncoder(im.RawFormat);

                Bitmap ImgOutput = new Bitmap(im, new_width, new_hight);

                //ImgOutput.Save();
                MemoryStream ss = new MemoryStream();

                ImgOutput.Save(ss, myImageCodecInfo, myEncoderParameter);
                im.Dispose();
                return ss;
            }
            catch (Exception ex)
            {
                Log.Write("Image Handle Error:" + ex.Message);
                return null;
            }
            //ImgOutput.Dispose(); 
        }
        private ImageCodecInfo getEncoder(ImageFormat format)
        {
            ImageCodecInfo[] codecs = ImageCodecInfo.GetImageDecoders();
            foreach (ImageCodecInfo codec in codecs)
            {
                if (codec.FormatID == format.Guid)
                {
                    return codec;
                }
            }
            return null;
        }
        protected MemoryStream cropCenterImage(Byte[] s, int width, int heigh)
        {
            try
            {
                TypeConverter tc = TypeDescriptor.GetConverter(typeof(Bitmap));

                Bitmap ImgSource = (Bitmap)tc.ConvertFrom(s);
                Bitmap ImgOutput = new Bitmap(width, heigh);

                int x = (ImgSource.Width - width) / 2;
                int y = (ImgSource.Height - heigh) / 2;
                Rectangle cropRect = new Rectangle(x, y, width, heigh);

                using (Graphics g = Graphics.FromImage(ImgOutput))
                {
                    g.DrawImage(ImgSource, new Rectangle() { Height = heigh, Width = width, X = 0, Y = 0 }, cropRect, GraphicsUnit.Pixel);
                }

                MemoryStream ss = new MemoryStream();
                ImgOutput.Save(ss, ImgSource.RawFormat);
                ImgSource.Dispose();
                return ss;
            }
            catch (Exception ex)
            {
                Log.Write("Image Handle Error:" + ex.Message);
                return null;
            }
            //ImgOutput.Dispose(); 
        }

        public RedirectResult SetLanguage(string L, string A)
        {
            HttpCookie WebLang = new HttpCookie(DotWeb.CommSetup.CommWebSetup.WebCookiesId + ".Lang", L);
            System.Threading.Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo(WebLang.Value);
            System.Threading.Thread.CurrentThread.CurrentUICulture = new System.Globalization.CultureInfo(WebLang.Value);
            ViewBag.Lang = System.Threading.Thread.CurrentThread.CurrentCulture.Name;
            Response.Cookies.Add(WebLang);
            return Redirect(A);
        }
        public string ModelStateErrorPack()
        {
            List<string> errMessage = new List<string>();
            foreach (ModelState modelState in ModelState.Values)
                foreach (ModelError error in modelState.Errors)
                    errMessage.Add(error.ErrorMessage);

            return string.Join(":", errMessage);
        }
        protected override LogicCenter openLogic()
        {
            var o = base.openLogic();
            o.AspUserID = aspUserId;
            o.DepartmentId = departmentId;
            o.Lang = getNowLnag();
            return o;
        }
        protected SerializeFile[] listImgFiles(string id, string file_kind, string category1, string category2)
        {
            string web_path_org = string.Format(upload_path_tpl_o, category1, category2, id, file_kind, "origin");
            string server_path_org = Server.MapPath(web_path_org);
            string web_path_icon = string.Format(upload_path_tpl_o, category1, category2, id, file_kind, "icon");

            List<SerializeFile> l_files = new List<SerializeFile>();

            string file_json_web_path = string.Format(upload_path_tpl_s, category1, category2, id, file_kind);
            string file_json_server_path = Server.MapPath(file_json_web_path) + "\\file.json";

            string web_path_s = string.Format(upload_path_tpl_s, category1, category2, id, file_kind, "origin");
            string server_path_s = Server.MapPath(web_path_s);

            if (System.IO.File.Exists(file_json_server_path))
            {
                var read_json = System.IO.File.ReadAllText(file_json_server_path);
                var get_file_json_object = JsonConvert.DeserializeObject<IList<JsonFileInfo>>(read_json).OrderBy(x => x.sort);
                foreach (var m in get_file_json_object)
                {
                    string get_file = server_path_org + "//" + m.fileName;
                    if (System.IO.File.Exists(get_file))
                    {
                        FileInfo file_info = new FileInfo(get_file);
                        SerializeFile file_object = new SerializeFile()
                        {
                            fileName = file_info.Name,
                            fileKind = file_kind,
                            iconPath = Url.Content(web_path_icon + "/" + file_info.Name),
                            originPath = Url.Content(web_path_org + "/" + file_info.Name),
                            size = file_info.Length,
                            isImage = true
                        };
                        l_files.Add(file_object);
                    }
                }
            }

            return l_files.ToArray();
        }
        protected SerializeFile[] listDocFiles(string id, string file_kind, string category1, string category2)
        {
            string tpl_folder_path = string.Empty;
            string server_path = string.Empty;

            tpl_folder_path = string.Format(upload_path_tpl_s, category1, category2, id, file_kind);
            server_path = Server.MapPath(tpl_folder_path);

            List<SerializeFile> ls_files = new List<SerializeFile>();

            if (Directory.Exists(server_path))
            {
                foreach (string fileString in Directory.GetFiles(server_path))
                {
                    FileInfo file_info = new FileInfo(fileString);

                    ls_files.Add(new SerializeFile()
                    {
                        fileName = file_info.Name,
                        fileKind = file_kind,
                        iconPath = Url.Content(tpl_folder_path + "/" + file_info.Name),
                        originPath = Url.Content(tpl_folder_path + "/" + file_info.Name),
                        size = file_info.Length,
                        isImage = false
                    });
                }
            }
            return ls_files.ToArray();
        }
        protected void handleImageSave(string file_name, string id, ImageUpScope fp, string file_kind, string category1, string category2)
        {
            BinaryReader binary_read = null;
            string file_ext = Path.GetExtension(file_name); //取得副檔名
            string[] ie_older_ver = new string[] { "6.0", "7.0", "8.0", "9.0" };

            if (Request.Browser.Browser == "IE" && ie_older_ver.Any(x => x == Request.Browser.Version))
            {
                #region IE file stream handle
                HttpPostedFile get_post_file = System.Web.HttpContext.Current.Request.Files[0];
                if (!get_post_file.FileName.Equals(""))
                    binary_read = new BinaryReader(get_post_file.InputStream);
                #endregion
            }
            else
                binary_read = new BinaryReader(Request.InputStream);

            byte[] upload_file = binary_read.ReadBytes(System.Convert.ToInt32(binary_read.BaseStream.Length));

            string web_path_org = string.Format(upload_path_tpl_o, category1, category2, id, file_kind, "origin");
            string server_path_org = Server.MapPath(web_path_org);

            #region 檔案上傳前檢查
            if (fp.limitSize > 0) //檔案大小檢查
                if (binary_read.BaseStream.Length > fp.limitSize)
                    throw new LogicError("Log_Err_FileSizeOver");

            if (fp.limitCount > 0 && Directory.Exists(server_path_org))
            {
                string[] Files = Directory.GetFiles(server_path_org);
                if (Files.Count() >= fp.limitCount) //還沒存檔，因此Selet到等於的數量，再加上現在要存的檔案即算超過
                    throw new LogicError("Log_Err_FileCountOver");
            }

            if (fp.allowExtType != null)
                if (!fp.allowExtType.Contains(file_ext.ToLower()))
                    throw new LogicError("Log_Err_AllowFileType");

            if (fp.limitExtType != null)
                if (fp.limitExtType.Contains(file_ext))
                    throw new LogicError("Log_Err_LimitedFileType");
            #endregion
            #region 存檔區

            if (fp.keepOrigin)
            {
                //原始檔
                if (!System.IO.Directory.Exists(server_path_org)) { System.IO.Directory.CreateDirectory(server_path_org); }

                FileStream file_stream = new FileStream(server_path_org + "\\" + file_name, FileMode.Create);
                BinaryWriter binary_write = new BinaryWriter(file_stream);
                binary_write.Write(upload_file);

                file_stream.Close();
                binary_write.Close();
            }

            //後台管理的ICON小圖
            string web_path_icon = string.Format(upload_path_tpl_o, category1, category2, id, file_kind, "icon");
            string server_path_icon = Server.MapPath(web_path_icon);
            if (!System.IO.Directory.Exists(server_path_icon)) { System.IO.Directory.CreateDirectory(server_path_icon); }
            MemoryStream smr = resizeImage(upload_file, 0, 90);
            System.IO.File.WriteAllBytes(server_path_icon + "\\" + Path.GetFileName(file_name), smr.ToArray());
            smr.Dispose();

            //依據參數進行裁圖
            if (fp.Parm.Count() > 1)//存兩種以上圖片大小
            {
                foreach (ImageSizeParm imSize in fp.Parm)
                {
                    string web_path_parm = string.Format(upload_path_tpl_o, category1, category2, id, file_kind, imSize.folderName);
                    string server_path_parm = Server.MapPath(web_path_parm);
                    if (!System.IO.Directory.Exists(server_path_parm)) { System.IO.Directory.CreateDirectory(server_path_parm); }//找不到路徑
                    MemoryStream sm = resizeImage(upload_file, imSize.width, imSize.heigh);
                    System.IO.File.WriteAllBytes(server_path_parm + "\\" + Path.GetFileName(file_name), sm.ToArray());
                    sm.Dispose();
                }
            }
            else if (fp.Parm.Count() > 0)
            {//只存一種
                string web_path_parm = string.Format(upload_path_tpl_s, category1, category2, id, file_kind);
                string server_path_parm = Server.MapPath(web_path_parm);
                foreach (ImageSizeParm imSize in fp.Parm)
                {
                    TypeConverter tc = TypeDescriptor.GetConverter(typeof(Bitmap));
                    Bitmap im = (Bitmap)tc.ConvertFrom(upload_file);
                    bool reSize = false;

                    if (imSize.width != 0 & im.Width > imSize.width) { reSize = true; }
                    if (imSize.heigh != 0 & im.Height > imSize.heigh) { reSize = true; }

                    if (reSize)
                    {
                        MemoryStream sm = resizeImage(upload_file, imSize.width, imSize.heigh);
                        System.IO.File.WriteAllBytes(server_path_parm + "\\" + Path.GetFileName(file_name), sm.ToArray());
                        sm.Dispose();
                    }
                    else
                    {
                        FileStream file_stream_p = new FileStream(server_path_parm + "\\" + Path.GetFileName(file_name), FileMode.Create);
                        BinaryWriter binary_write_p = new BinaryWriter(file_stream_p);
                        binary_write_p.Write(upload_file);

                        file_stream_p.Close();
                        binary_write_p.Close();
                    }
                }
            }
            #endregion

            #region Handle Json Info
            string file_json_web_path = string.Format(upload_path_tpl_s, category1, category2, id, file_kind);
            string file_json_server_path = Server.MapPath(file_json_web_path) + "\\file.json";

            IList<JsonFileInfo> f = null;
            int sort = 0;
            if (System.IO.File.Exists(file_json_server_path))
            {
                var read_json = System.IO.File.ReadAllText(file_json_server_path);
                f = JsonConvert.DeserializeObject<IList<JsonFileInfo>>(read_json);
                if (f.Any(x => x.fileName == file_name))
                {
                    return;
                }

                sort = f.Count + 1;
            }
            else
            {
                f = new List<JsonFileInfo>();
                sort = 1;
            }

            f.Add(new JsonFileInfo()
            {
                fileName = file_name,
                sort = sort
            });

            var json_string = JsonConvert.SerializeObject(f);
            System.IO.File.WriteAllText(file_json_server_path, json_string, Encoding.UTF8);
            #endregion
        }
        protected void handleFileSave(string file_name, string id, FilesUpScope fp, string file_kind, string category1, string category2)
        {
            Stream file_stream = Request.InputStream;
            BinaryReader binary_read = new BinaryReader(file_stream);
            string file_ext = System.IO.Path.GetExtension(file_name);

            #region IE file stream handle

            string[] IEOlderVer = new string[] { "6.0", "7.0", "8.0", "9.0" };
            System.Web.HttpPostedFile GetPostFile = null;
            if (Request.Browser.Browser == "IE" && IEOlderVer.Any(x => x == Request.Browser.Version))
            {
                System.Web.HttpFileCollection collectFiles = System.Web.HttpContext.Current.Request.Files;
                GetPostFile = collectFiles[0];
                if (!GetPostFile.FileName.Equals(""))
                {
                    binary_read = new BinaryReader(GetPostFile.InputStream);
                }
            }

            Byte[] fileContents = { };

            while (binary_read.BaseStream.Position < binary_read.BaseStream.Length - 1)
            {
                Byte[] buffer = new Byte[binary_read.BaseStream.Length - 1];
                int read_line = binary_read.Read(buffer, 0, buffer.Length);
                Byte[] dummy = fileContents.Concat(buffer).ToArray();
                fileContents = dummy;
                dummy = null;
            }
            #endregion

            string web_path_org = string.Format(upload_path_tpl_s, category1, category2, id, file_kind);
            string server_path_org = Server.MapPath(web_path_org);

            #region 檔案上傳前檢查
            if (fp.limitSize > 0)
                if (binary_read.BaseStream.Length > fp.limitSize)
                    throw new LogicError("Log_Err_FileSizeOver");

            if (fp.limitCount > 0 && Directory.Exists(server_path_org))
            {
                string[] Files = Directory.GetFiles(server_path_org);
                if (Files.Count() >= fp.limitCount)
                    throw new LogicError("Log_Err_FileCountOver");
            }

            if (fp.allowExtType != null)
                if (!fp.allowExtType.Contains(file_ext.ToLower()))
                    throw new LogicError("Log_Err_AllowFileType");

            if (fp.limitExtType != null)
                if (fp.limitExtType.Contains(file_ext))
                    throw new LogicError("Log_Err_LimitedFileType");
            #endregion

            #region 存檔區

            if (!System.IO.Directory.Exists(server_path_org)) { System.IO.Directory.CreateDirectory(server_path_org); }

            FileStream write_stream = new FileStream(server_path_org + "\\" + file_name, FileMode.Create);
            BinaryWriter binary_write = new BinaryWriter(write_stream);
            binary_write.Write(fileContents);

            file_stream.Close();
            write_stream.Close();
            binary_write.Close();

            #endregion
        }
        protected void DeleteSysFile(string id, string file_kind, string file_name, ImageUpScope im, string category1, string category2)
        {
            string tpl_FolderPath = Server.MapPath(string.Format(upload_path_tpl_s, category1, category2, id, file_kind));

            string handle_delete_file = tpl_FolderPath + "/" + file_name;
            if (System.IO.File.Exists(handle_delete_file))
                System.IO.File.Delete(handle_delete_file);
            #region Delete Run
            if (Directory.Exists(tpl_FolderPath))
            {
                var folders = Directory.GetDirectories(tpl_FolderPath);
                foreach (var folder in folders)
                {
                    string herefile = folder + "\\" + file_name;
                    if (System.IO.File.Exists(herefile))
                        System.IO.File.Delete(herefile);
                }
            }
            #endregion

            #region Handle Json Info
            string file_json_web_path = string.Format(upload_path_tpl_s, category1, category2, id, file_kind);
            string file_json_server_path = Server.MapPath(file_json_web_path) + "\\file.json";

            IList<JsonFileInfo> get_file_json_object = null;
            if (System.IO.File.Exists(file_json_server_path))
            {
                var read_json = System.IO.File.ReadAllText(file_json_server_path);
                get_file_json_object = JsonConvert.DeserializeObject<IList<JsonFileInfo>>(read_json);
                var get_file_object = get_file_json_object.Where(x => x.fileName == file_name).FirstOrDefault();
                if (get_file_object != null)
                {
                    get_file_json_object.Remove(get_file_object);
                    int i = 1;
                    foreach (var file_object in get_file_json_object)
                    {
                        file_object.sort = i;
                        i++;
                    }
                    var json_string = JsonConvert.SerializeObject(get_file_json_object);
                    System.IO.File.WriteAllText(file_json_server_path, json_string, Encoding.UTF8);
                }
            }
            #endregion

        }
        #region 寄信相關
        //將變數套用至信件版面
        public string getMailBody(string EmailView, object md)
        {
            ViewResult resultView = View(EmailView, md);

            StringResult sr = new StringResult();
            sr.ViewName = resultView.ViewName;
            sr.MasterName = resultView.MasterName;
            sr.ViewData = resultView.ViewData;
            sr.TempData = resultView.TempData;
            sr.ExecuteResult(this.ControllerContext);

            return sr.ToHtmlString;
        }

        public bool Mail_Send(string MailFrom, string[] MailTos, string MailSub, string MailBody, bool isBodyHtml)
        {
            try
            {
                //建立MailMessage物件
                MailMessage mms = new MailMessage();
                if (MailFrom != null)
                {
                    var mf = MailFrom.Split(':');
                    if (mf.Length == 2)
                    {
                        mms.From = new MailAddress(mf[1], mf[0]);//寄件人
                    }
                    else if (mf.Length == 1)
                    {
                        mms.From = new MailAddress(mf[0]);//寄件人
                    }
                }
                //mms.From = new MailAddress(MailFrom);//寄件人
                mms.Subject = MailSub;//信件主旨
                mms.Body = MailBody;//信件內容
                mms.IsBodyHtml = isBodyHtml;//判斷是否採用html格式

                if (MailTos != null)//防呆
                {
                    foreach (var str in MailTos)
                    {
                        if (str != "")
                        {
                            var m = str.Split(':');
                            if (m.Length == 2)
                            {
                                mms.To.Add(new MailAddress(m[1], m[0]));
                            }
                            else if (m.Length == 1)
                            {
                                mms.To.Add(new MailAddress(m[0]));
                            }
                        }
                    }
                }//End if (MailTos !=null)//防呆

                //if (Bcc != null) //防呆
                //{
                //    for (int i = 0; i < Bcc.Length; i++)
                //    {
                //        if (!string.IsNullOrEmpty(Bcc[i].Trim()))
                //        {
                //            //加入信件的密件副本(們)address
                //            mms.Bcc.Add(new MailAddress(Bcc[i].Trim()));
                //        }

                //    }
                //}//End if (Ccs!=null) //防呆



                using (SmtpClient client = new SmtpClient(CommWebSetup.MailServer))//或公司、客戶的smtp_server

                    client.Send(mms);//寄出一封信

                //釋放每個附件，才不會Lock住
                if (mms.Attachments != null && mms.Attachments.Count > 0)
                {
                    for (int i = 0; i < mms.Attachments.Count; i++)
                    {
                        mms.Attachments[i].Dispose();
                        mms.Attachments[i] = null;
                    }
                }

                return true;//寄信成功
            }
            catch (Exception)
            {
                return false;//寄信失敗
            }
        }

        #endregion
    }
    public abstract class WebUserController : SourceController
    {
        protected int visitCount = 0;
        //protected Log.LogPlamInfo plamInfo = new Log.LogPlamInfo() { AllowWrite = true };
        //protected readonly string sessionShoppingString = "CestLaVie.Shopping";
        //protected readonly string sessionMemberLoginString = "CestLaVie.loginMail";
        private readonly string sysUpFilePathTpl = "~/_Code/SysUpFiles/{0}/{1}/{2}/{3}/{4}";
        private string getImg_path_tpl = "~/_Code/SysUpFiles/{0}/{1}/{2}/{3}";
        protected WebInfo wi;
        protected string MemberId;
        protected Boolean isLogin;

        protected WebUserController()
        {
            ViewBag.NowHeadMenu = "";
        }

        protected override void Initialize(System.Web.Routing.RequestContext requestContext)
        {
            base.Initialize(requestContext);

            //plamInfo.BroswerInfo = System.Web.HttpContext.Current.Request.Browser.Browser + "." + System.Web.HttpContext.Current.Request.Browser.Version;
            //plamInfo.IP = System.Web.HttpContext.Current.Request.UserHostAddress;
            //plamInfo.UserId = 0;
            //plamInfo.UnitId = 0;

            Log.SetupBasePath = System.Web.HttpContext.Current.Server.MapPath("~\\_Code\\Log\\");
            Log.Enabled = true;

            var getMemberIdCookie = Request.Cookies[CommWebSetup.WebCookiesId + ".member_id"];
            var getMemberName = Request.Cookies[CommWebSetup.WebCookiesId + ".member_name"];
            MemberId = getMemberIdCookie == null ? null : EncryptString.desDecryptBase64(Server.UrlDecode(getMemberIdCookie.Value));
            try
            {
                ViewBag.VisitCount = visitCount;
                ViewBag.IsFirstPage = false; //是否為首頁，請在首頁的Action此值設為True
                ViewBag.CategoryStroe = WebCategory();
                ViewBag.main_category_id = 0;
                ViewBag.sub_category_id = 0;

            }
            catch (Exception ex)
            {
                Log.Write(ex.Message);
            }
        }
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if ((Request.Browser.Type == "IE" || Request.Browser.Type == "MSIE") && Request.Browser.MajorVersion < 10)
            {
                Response.Redirect("~/Content/images/noIE/noIE.html");
            }
        }


        public int GetNewId()
        {
            return GetNewId(ProcCore.Business.CodeTable.Base);
        }
        public int GetNewId(ProcCore.Business.CodeTable tab)
        {
            using (var db = getDB0())
            {
                using (TransactionScope tx = new TransactionScope())
                {
                    try
                    {
                        String tab_name = Enum.GetName(typeof(ProcCore.Business.CodeTable), tab);
                        var items = from x in db.i_IDX where x.table_name == tab_name select x;

                        if (items.Count() == 0)
                        {
                            return 0;
                        }
                        else
                        {
                            var item = items.FirstOrDefault();
                            item.IDX++;
                            db.SaveChanges();
                            tx.Complete();
                            return item.IDX;
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.Message);
                        return 0;
                    }
                }
            }
        }
        private SNObject GetSN(ProcCore.Business.SNType tab)
        {

            SNObject sn = new SNObject();

            using (var db = getDB0())
            {
                using (TransactionScope tx = new TransactionScope())
                {
                    try
                    {
                        String tab_name = Enum.GetName(typeof(ProcCore.Business.SNType), tab);
                        var items = db.i_SN.Single(x => x.sn_type == tab_name);

                        if (items.y == DateTime.Now.Year &&
                            items.m == DateTime.Now.Month &&
                            items.d == DateTime.Now.Day
                            )
                        {
                            int now_max = items.sn_max;
                            now_max++;
                            items.sn_max = now_max;
                        }
                        else
                        {
                            items.y = DateTime.Now.Year;
                            items.m = DateTime.Now.Month;
                            items.d = DateTime.Now.Day;
                            items.sn_max = 1;
                        }

                        db.SaveChanges();
                        tx.Complete();

                        sn.y = items.y;
                        sn.m = items.m;
                        sn.d = items.d;
                        sn.sn_max = items.sn_max;
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.Message);
                    }
                }
            }
            return sn;
        }
        public string Get_Orders_SN()
        {
            String tpl = "SN{0}{1:00}{2:00}-{3:00}{4:00}";
            SNObject sn = GetSN(ProcCore.Business.SNType.Orders);
            return String.Format(tpl, sn.y.ToString().Right(2), sn.m, sn.d, sn.sn_max, (new Random()).Next(99));
        }
        public FileResult DownLoadFile(int Id, string GetArea, string GetController, string FileName, string FilesKind)
        {
            if (FilesKind == null)
                FilesKind = "DocFiles";

            String SystemUpFilePathTpl = "~/_Code/SysUpFiles/{0}.{1}/{2}/{3}/{4}";
            String SearchPath = String.Format(SystemUpFilePathTpl + "\\" + FileName, GetArea, GetController, Id, FilesKind, "OriginFile");
            String DownFilePath = Server.MapPath(SearchPath);

            FileInfo fi = null;
            if (System.IO.File.Exists(DownFilePath))
            {
                fi = new FileInfo(DownFilePath);
            }
            return File(DownFilePath, "application/" + fi.Extension.Replace(".", ""), Url.Encode(fi.Name));
        }
        public string ImgSrc(string AreaName, string ContorllerName, int Id, string FilesKind, int ImageSizeTRype)
        {
            String ImgSizeString = "s_" + ImageSizeTRype;
            String SearchPath = String.Format(sysUpFilePathTpl, AreaName, ContorllerName, Id, FilesKind, ImgSizeString);
            String FolderPth = Server.MapPath(SearchPath);

            if (Directory.Exists(FolderPth))
            {
                String[] SFiles = Directory.GetFiles(FolderPth);

                if (SFiles.Length > 0)
                {
                    FileInfo f = new FileInfo(SFiles[0]);
                    return Url.Content(SearchPath) + "/" + f.Name;
                }
                else
                {
                    return Url.Content("~/Content/images/nopic.png");
                }

            }
            else
                return Url.Content("~/Content/images/nopic.png");
        }
        public string ImgSrc(string AreaName, string ContorllerName, int Id, string FilesKind, string ImageSizeTRype)
        {
            String ImgSizeString = "" + ImageSizeTRype;
            String SearchPath = String.Format(sysUpFilePathTpl, AreaName, ContorllerName, Id, FilesKind, ImgSizeString);
            String FolderPth = Server.MapPath(SearchPath);

            if (Directory.Exists(FolderPth))
            {
                String[] SFiles = Directory.GetFiles(FolderPth);

                if (SFiles.Length > 0)
                {
                    FileInfo f = new FileInfo(SFiles[0]);
                    return Url.Content(SearchPath) + "/" + f.Name;
                }
                else
                {
                    return Url.Content("~/Content/images/nopic.png");
                }

            }
            else
                return Url.Content("~/Content/images/nopic.png");
        }
        public FileResult AudioFile(string FilePath)
        {
            String S = Url.Content(FilePath);
            String DownFilePath = Server.MapPath(S);

            FileInfo fi = null;
            if (System.IO.File.Exists(DownFilePath))
                fi = new FileInfo(DownFilePath);

            return File(DownFilePath, "audio/mp3", Url.Encode(fi.Name));
        }
        public string GetSYSImage(int Id, string GetArea, string GetController)
        {
            String SystemUpFilePathTpl = "~/_Code/SysUpFiles/{0}.{1}/{2}/{3}/{4}";
            String SearchPath = String.Format(SystemUpFilePathTpl, GetArea, GetController, Id, "DefaultKind", "OriginFile");
            String GetFolderPath = Server.MapPath(SearchPath);

            if (System.IO.Directory.Exists(GetFolderPath))
            {
                String fs = Directory.GetFiles(GetFolderPath).FirstOrDefault();
                FileInfo f = new FileInfo(fs);
                return SearchPath + "/" + f.Name;
            }
            else
            {
                return null;
            }
        }
        protected override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            base.OnActionExecuted(filterContext);
            Log.WriteToFile();
        }
        public RedirectResult SetLanguage(string L, string A)
        {
            HttpCookie WebLang = new HttpCookie(CommWebSetup.WebCookiesId + ".Lang", L);
            System.Threading.Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo(WebLang.Value);
            System.Threading.Thread.CurrentThread.CurrentUICulture = new System.Globalization.CultureInfo(WebLang.Value);
            Response.Cookies.Add(WebLang);
            return Redirect(Url.Action(A));
        }
        protected override string getRecMessage(string MsgId)
        {
            return Resources.Res.ResourceManager.GetString(MsgId);
        }
        protected List<SelectListItem> MakeNumOptions(int num, bool FirstIsBlank)
        {

            List<SelectListItem> r = new List<SelectListItem>();
            if (FirstIsBlank)
            {
                SelectListItem sItem = new SelectListItem();
                sItem.Value = "";
                sItem.Text = "";
                r.Add(sItem);
            }

            for (int n = 1; n <= num; n++)
            {
                SelectListItem s = new SelectListItem();
                s.Value = n.ToString();
                s.Text = n.ToString();
                r.Add(s);
            }
            return r;
        }
        /// <summary>
        /// 取得前台每頁左選單內容
        /// </summary>
        protected IEnumerable<CategoryL1Data> WebCategory()
        {
            var lang = System.Threading.Thread.CurrentThread.CurrentCulture.Name;
            db0 = getDB0();

            var menus = db0.Product_Category_L1
                .Where(x => x.i_Lang == lang)
                .OrderByDescending(x => x.l1_sort)
                .Select(x => new CategoryL1Data()
                {
                    id = x.product_category_l1_id,
                    name = x.l1_name,
                    categoryL2Data = x.Product_Category_L2.OrderByDescending(y => y.l2_sort).Select(y => new CategoryL2Data()
                    {
                        id = y.product_category_l2_id,
                        name = y.l2_name,
                        count = y.Product.Where(z => !z.i_Hide).Count()
                    }),
                    count = x.Product.Count()
                });

            return menus;
        }

        #region 前台抓取圖片
        public string[] GetImgs(string id, string file_kind, string category1, string category2, string size)
        {
            string tpl_path = string.Format(getImg_path_tpl, category1, category2, id, file_kind);
            string web_folder = Url.Content(tpl_path);
            if (size != null) { web_folder = Url.Content(tpl_path + "/" + size); }
            string server_folder = Server.MapPath(tpl_path);
            string file_json_server_path = server_folder + "//file.json";
            string[] imgs = { };
            if (System.IO.File.Exists(file_json_server_path))
            {
                var read_json = System.IO.File.ReadAllText(file_json_server_path);
                var f = JsonConvert.DeserializeObject<IList<JsonFileInfo>>(read_json).OrderBy(x => x.sort);
                IList<string> image_path = new List<string>();
                foreach (var fobj in f)
                {
                    image_path.Add(web_folder + "//" + fobj.fileName);
                }
                return image_path.ToArray();
            }
            else
            {
                return imgs;
            }
        }
        public string GetImg(string id, string file_kind, string category1, string category2, string size)
        {
            string tpl_path = string.Format(getImg_path_tpl, category1, category2, id, file_kind);
            if (size != null) { tpl_path = tpl_path + "/" + size; }//有size才增加資料夾目錄
            string img_folder = Server.MapPath(tpl_path);

            if (Directory.Exists(img_folder))
            {
                var get_files = Directory.EnumerateFiles(img_folder)
                    .Where(x => x.EndsWith("jpg") || x.EndsWith("jpeg") || x.EndsWith("png") || x.EndsWith("gif") || x.EndsWith("JPG") || x.EndsWith("JPEG") || x.EndsWith("PNG") || x.EndsWith("GIF"))
                    .FirstOrDefault();

                if (get_files != null)
                {
                    FileInfo file_info = new FileInfo(get_files);
                    return Url.Content(tpl_path + "\\" + file_info.Name);
                }
                else
                {
                    return Url.Content("~/Content/images/no-pic.gif");
                }
            }
            else
            {
                return Url.Content("~/Content/images/no-pic.gif");
            }
        }
        #endregion
        #region 前台抓取檔案
        public string[] GetFiles(string id, string file_kind, string category1, string category2)
        {
            string tpl_path = string.Format(getImg_path_tpl, category1, category2, id, file_kind);
            string web_folder = Url.Content(tpl_path);
            string server_folder = Server.MapPath(tpl_path);

            string[] files = { };
            if (Directory.Exists(server_folder))
            {
                var get_files = Directory.EnumerateFiles(server_folder)
                    .Where(x => x.EndsWith("jpg") || x.EndsWith("jpeg") || x.EndsWith("png") || x.EndsWith("gif") || x.EndsWith("JPG") || x.EndsWith("JPEG") || x.EndsWith("PNG") || x.EndsWith("GIF") ||
                     x.EndsWith("pdf") || x.EndsWith("PDF") || x.EndsWith("doc") || x.EndsWith("DOC") || x.EndsWith("docx") || x.EndsWith("DOCX") ||
                     x.EndsWith("xls") || x.EndsWith("XLS") || x.EndsWith("xlsx") || x.EndsWith("XLSX") || x.EndsWith("TXT") || x.EndsWith("txt"))
                    .ToList();
                IList<string> files_path = new List<string>();
                foreach (var fobj in get_files)
                {
                    FileInfo file_info = new FileInfo(fobj.ToString());
                    files_path.Add(web_folder + "//" + file_info.Name);
                }
                return files_path.ToArray();
            }
            else
            {
                return files;
            }
        }
        public string GetFile(string id, string file_kind, string category1, string category2)
        {
            string tpl_path = string.Format(getImg_path_tpl, category1, category2, id, file_kind);
            string server_folder = Server.MapPath(tpl_path);

            if (Directory.Exists(server_folder))
            {
                var get_files = Directory.EnumerateFiles(server_folder)
                    .Where(x => x.EndsWith("jpg") || x.EndsWith("jpeg") || x.EndsWith("png") || x.EndsWith("gif") || x.EndsWith("JPG") || x.EndsWith("JPEG") || x.EndsWith("PNG") || x.EndsWith("GIF") ||
                     x.EndsWith("pdf") || x.EndsWith("PDF") || x.EndsWith("doc") || x.EndsWith("DOC") || x.EndsWith("docx") || x.EndsWith("DOCX") ||
                     x.EndsWith("xls") || x.EndsWith("XLS") || x.EndsWith("xlsx") || x.EndsWith("XLSX") || x.EndsWith("TXT") || x.EndsWith("txt"))
                    .FirstOrDefault();

                if (get_files != null)
                {
                    FileInfo file_info = new FileInfo(get_files);
                    return Url.Content(tpl_path + "\\" + file_info.Name);
                }
                else
                {
                    return null;
                }
            }
            else
            {
                return null;
            }
        }
        #endregion
        #region 移除html或script標籤
        /// <summary>
        /// 移除html tag
        /// </summary>
        /// <param name="htmlSource"></param>
        /// <returns></returns>
        public static string RemoveHTMLTag(string htmlSource)
        {
            //移除  javascript code.
            //htmlSource = Regex.Replace(htmlSource, @"<script[\d\D]*?>[\d\D]*?</script>", String.Empty);

            //移除html tag.
            htmlSource = Regex.Replace(htmlSource, @"<[^>]*>", String.Empty);
            return htmlSource;
        }
        /// <summary>
        /// 移除Script tag
        /// </summary>
        /// <param name="htmlSource"></param>
        /// <returns></returns>
        public static string RemoveScriptTag(string htmlSource)
        {
            //移除  javascript code.
            htmlSource = Regex.Replace(htmlSource, @"<script[\d\D]*?>[\d\D]*?</script>", String.Empty);

            //移除html tag.
            //htmlSource = Regex.Replace(htmlSource, @"<[^>]*>", String.Empty);
            return htmlSource;
        }
        #endregion
        #region 寄信相關
        //將變數套用至信件版面
        public string getMailBody(string EmailView, object md)
        {
            ViewResult resultView = View(EmailView, md);

            StringResult sr = new StringResult();
            sr.ViewName = resultView.ViewName;
            sr.MasterName = resultView.MasterName;
            sr.ViewData = resultView.ViewData;
            sr.TempData = resultView.TempData;
            sr.ExecuteResult(this.ControllerContext);

            return sr.ToHtmlString;
        }

        public bool Mail_Send(string MailFrom, string[] MailTos, string MailSub, string MailBody, bool isBodyHtml)
        {
            try
            {
                //建立MailMessage物件
                MailMessage mms = new MailMessage();
                if (MailFrom != null)
                {
                    var mf = MailFrom.Split(':');
                    if (mf.Length == 2)
                    {
                        mms.From = new MailAddress(mf[1], mf[0]);//寄件人
                    }
                    else if (mf.Length == 1)
                    {
                        mms.From = new MailAddress(mf[0]);//寄件人
                    }
                }
                //mms.From = new MailAddress(MailFrom);//寄件人
                mms.Subject = MailSub;//信件主旨
                mms.Body = MailBody;//信件內容
                mms.IsBodyHtml = isBodyHtml;//判斷是否採用html格式

                if (MailTos != null)//防呆
                {
                    foreach (var str in MailTos)
                    {
                        if (str != "")
                        {
                            var m = str.Split(':');
                            if (m.Length == 2)
                            {
                                mms.To.Add(new MailAddress(m[1], m[0]));
                            }
                            else if (m.Length == 1)
                            {
                                mms.To.Add(new MailAddress(m[0]));
                            }
                        }
                    }
                }//End if (MailTos !=null)//防呆

                //if (Bcc != null) //防呆
                //{
                //    for (int i = 0; i < Bcc.Length; i++)
                //    {
                //        if (!string.IsNullOrEmpty(Bcc[i].Trim()))
                //        {
                //            //加入信件的密件副本(們)address
                //            mms.Bcc.Add(new MailAddress(Bcc[i].Trim()));
                //        }

                //    }
                //}//End if (Ccs!=null) //防呆



                using (SmtpClient client = new SmtpClient(CommWebSetup.MailServer))//或公司、客戶的smtp_server

                    client.Send(mms);//寄出一封信

                //釋放每個附件，才不會Lock住
                if (mms.Attachments != null && mms.Attachments.Count > 0)
                {
                    for (int i = 0; i < mms.Attachments.Count; i++)
                    {
                        mms.Attachments[i].Dispose();
                        mms.Attachments[i] = null;
                    }
                }

                return true;//寄信成功
            }
            catch (Exception)
            {
                return false;//寄信失敗
            }
        }

        #endregion
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
    #endregion

    #region 泛型控制器擴充
    public abstract class CtrlTSN<M, Q> : AdminController
        where M : new()
        where Q : QueryBase
    {
        protected ResultInfo<M> r;
        protected M item;
        public abstract string aj_Init();
        public abstract Task<string> aj_MasterDel(string[] sns);
        public abstract string aj_MasterSearch(Q sh);
        public abstract Task<string> aj_MasterInsert(M md);
        public abstract Task<string> aj_MasterUpdate(M md);
        public abstract Task<string> aj_MasterGet(string sn);
    }
    #endregion
}