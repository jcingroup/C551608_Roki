using DotWeb.CommSetup;
using DotWeb.Controller;
using ProcCore.Business.LogicConect;
using ProcCore.HandleResult;
using System;
using System.IO;
using System.Web.Mvc;
using System.Linq;
using System.Collections.Generic;

namespace DotWeb.Areas.Active.Controllers
{
    public class MatterController : AdminController
    {
        #region Action and function section
        public ActionResult Main()
        {
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

        #region ajax file section
        [HttpPost]
        public string axFUpload(string id, string filekind, string filename)
        {
            UpFileInfo r = new UpFileInfo();
            #region
            try
            {
                hdlUpImage(filename, filekind, id, ImageFileUpParm.ProductList);
                //代表 圖片
                //if (filekind == "Photo1")
                //    handleImageSave(filename, id, ImageFileUpParm.ProductList, filekind, "Albums", "Photo");

                r.result = true;
                r.file_name = filename;
            }
            catch (LogicError ex)
            {
                r.result = false;
                r.message = getRecMessage(ex.Message);
            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.Message;
            }
            #endregion
            return defJSON(r);
        }

        [HttpPost]
        public string axFList(string id, string filekind)
        {
            SerializeFileList r = new SerializeFileList();
            r.files = lstImgFile(filekind, id);

            r.result = true;
            return defJSON(r);
        }

        [HttpPost]
        public string axFDelete(string id, string filekind, string guid)
        {
            ResultInfo r = new ResultInfo();
            delUpFile(filekind, id, guid);

            r.result = true;
            return defJSON(r);
        }

        [HttpPost]
        public string axFSort(string id, string filekind, IList<string> guids)
        {
            ResultInfo r = new ResultInfo();
            srtUpFile(filekind, id, guids);

            r.result = true;
            return defJSON(r);
        }

        [HttpGet]
        public FileResult axFDown(int id, string filekind, string filename)//下載附件檔案內容用(與圖片上傳無關)
        {
            string up_path_tpl_s = "~/_Code/SysUpFiles/{0}/{1}";
            string path_tpl = string.Format(up_path_tpl_s, "Albums", "Photo", id, filekind, filename);
            string server_path = Server.MapPath(path_tpl);
            FileInfo file_info = new FileInfo(server_path);
            FileStream file_stream = new FileStream(server_path, FileMode.Open, FileAccess.Read);
            string web_path = Url.Content(path_tpl);
            return File(file_stream, "application/*", file_info.Name);
        }
        #endregion
    }
}