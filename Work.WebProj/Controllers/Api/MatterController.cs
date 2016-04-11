using Microsoft.AspNet.Identity.EntityFramework;
using ProcCore.Business;
using ProcCore.Business.DB0;
using ProcCore.HandleResult;
using ProcCore.WebCore;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using LinqKit;
using System.Data.Entity.Validation;
using System.Data.Entity.Infrastructure;

namespace DotWeb.Api
{
    public class MatterController : ajaxApi<Matter>
    {
        public async Task<IHttpActionResult> Get(int id)
        {
            using (db0 = getDB0())
            {
                Matter item = await db0.Matter.FindAsync(id);
                var r = new ResultInfo<Matter>() { data = item };
                return Ok(r);
            }
        }
        public async Task<IHttpActionResult> Get([FromUri]queryParam q)
        {
            #region 連接BusinessLogicLibary資料庫並取得資料

            db0 = getDB0();
            var predicate = PredicateBuilder.True<Matter>();

            if (q.name != null)
                predicate = predicate.And(x => x.matter_name.Contains(q.name));

            int page = (q.page == null ? 1 : (int)q.page);
            var result = db0.Matter.AsExpandable().Where(predicate);
            var resultCount = await result.CountAsync();

            int startRecord = PageCount.PageInfo(page, defPageSize, resultCount);
            var resultItems = await result
                .OrderBy(x => x.community_id)
                .Skip(startRecord)
                .Take(defPageSize)
                .ToListAsync();

            db0.Dispose();

            return Ok(new
            {
                rows = resultItems,
                total = PageCount.TotalPage,
                page = PageCount.Page,
                records = PageCount.RecordCount,
                startcount = PageCount.StartCount,
                endcount = PageCount.EndCount
            });

            #endregion
        }
        public async Task<IHttpActionResult> Put([FromBody]putBodyParam param)
        {
            ResultInfo rAjaxResult = new ResultInfo();
            try
            {
                db0 = getDB0();

                item = await db0.Matter.FindAsync(param.id);
                var md = param.md;

                item.matter_name = md.matter_name;

                item.zip = md.zip;
                item.city = md.city;
                item.country = md.country;
                item.address = md.address;
                item.bedrooms = md.bedrooms;
                item.livingrooms = md.livingrooms;
                item.bathrooms = md.bathrooms;
                item.rooms = md.rooms;
                item.build_area = md.build_area;
                item.land_area = md.land_area;
                item.house_area = md.house_area;
                item.balcony_area = md.balcony_area;
                item.umbrella_aea = md.umbrella_aea;
                item.public_area = md.public_area;
                item.age = md.age;
                item.buildhouses = md.buildhouses;
                item.typeOfHouse = md.typeOfHouse;
                item.managementFeeOfMonth = md.managementFeeOfMonth;
                item.architecture = md.architecture;
                item.parking = md.parking;
                item.parking = md.parking;
                item.orientation = md.orientation;
                item.guard = md.guard;
                item.is_end = md.is_end;
                item.is_darkroom = md.is_darkroom;
                item.wall_materials = md.wall_materials;
                item.info_type = md.info_type;
                item.state = md.state;
                item.start_date = md.start_date;
                item.end_date = md.end_date;

                await db0.SaveChangesAsync();
                rAjaxResult.result = true;
            }
            catch (Exception ex)
            {
                rAjaxResult.result = false;
                rAjaxResult.message = ex.ToString();
            }
            finally
            {
                db0.Dispose();
            }
            return Ok(rAjaxResult);
        }
        public async Task<IHttpActionResult> Post([FromBody]Matter md)
        {
            md.matter_id = GetNewId(CodeTable.Base);

            r = new ResultInfo<Matter>();
            if (!ModelState.IsValid)
            {
                r.message = ModelStateErrorPack();
                r.result = false;
                return Ok(r);
            }

            try
            {
                #region working
                db0 = getDB0();

                db0.Matter.Add(md);
                await db0.SaveChangesAsync();

                r.result = true;
                r.id = md.matter_id;
                return Ok(r);
                #endregion
            }
            catch (DbEntityValidationException ex) //欄位驗證錯誤
            {
                r.message = getDbEntityValidationException(ex);
                r.result = false;
                return Ok(r);
            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.Message + "\r\n" + getErrorMessage(ex);
                return Ok(r);
            }
            finally
            {
                db0.Dispose();
            }
        }
        public async Task<IHttpActionResult> Delete([FromBody]delParam param)
        {
            try
            {
                db0 = getDB0();
                r = new ResultInfo<Matter>();

                item = await db0.Matter.FindAsync(param.id);
                if (item != null)
                {
                    db0.Matter.Remove(item);
                    await db0.SaveChangesAsync();
                    r.result = true;
                    return Ok(r);
                }
                else {
                    r.result = false;
                    r.message = Resources.Res.Log_Err_Delete_NotFind;
                    return Ok(r);
                }

            }
            catch (DbUpdateException ex)
            {
                r.result = false;
                if (ex.InnerException != null)
                {
                    r.message = Resources.Res.Log_Err_Delete_DetailExist + "\r\n" + getErrorMessage(ex);
                }
                else
                {
                    r.message = ex.Message;
                }
                return Ok(r);
            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.Message;
                return Ok(r);
            }
            finally
            {
                db0.Dispose();
            }
        }

        public class putBodyParam
        {
            public int id { get; set; }
            public Matter md { get; set; }
        }
        public class queryParam : QueryBase
        {
            public string name { set; get; }

        }
        public class delParam
        {
            public int id { get; set; }
        }
    }
}
