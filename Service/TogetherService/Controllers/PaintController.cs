
namespace TogetherService.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using System;
    using System.Threading.Tasks;
    using TogetherService.Model;

    [ApiController]
    [Route("[controller]")]
    public class PaintController : ControllerBase
    {        
        private readonly ILogger<PaintController> _logger;
        private readonly IDataAcess<Drawing> dataAcess;

        public PaintController(ILogger<PaintController> logger)
        {
            _logger = logger;
            dataAcess = new AzureBlobDataAccess<Drawing>("drawdata");
        }

        [HttpGet]
        public async Task<Drawing> GetAsync(string roomId, string userId)
        {
            SetHeaders();

            if (string.IsNullOrWhiteSpace(roomId))
            {
                return null;
            }

            try
            {
                return await dataAcess.ReadAsync(roomId);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        [HttpOptions]
        public void Options(string roomId, string userId)
        {
            SetHeaders();
        }

        [HttpPost]
        public async Task PostAsync(string roomId, string userId, Drawing data)
        {
            try
            {
                SetHeaders();
                Drawing item = await dataAcess.ReadAsync(roomId);

                if (item == null)
                {
                    await dataAcess.CreateAsync(data);
                }
                else
                {
                    item.PaintData.AddRange(data.PaintData);

                    await dataAcess.UpdateAsync(item);
                }
            }
            catch (Exception ex)
            {

            }
        }

        private void SetHeaders()
        {
            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            Response.Headers.Add("Access-Control-Allow-Credentials", "true");
            Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type");
            Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        }
    }
}
