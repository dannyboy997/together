
namespace TogetherService.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using TogetherService.Model;

    [ApiController]
    [Route("[controller]")]
    public class PaintDataController : ControllerBase
    {        
        private readonly ILogger<PaintingController> _logger;
        private readonly IDataAcess<Drawing> dataAcess;

        public PaintDataController(ILogger<PaintingController> logger)
        {
            _logger = logger;
            dataAcess = new AzureBlobDataAccess<Drawing>("drawdata");
        }

        [HttpGet]
        public async Task<List<PaintData>> GetAsync(string roomId, string userId)
        {
            SetHeaders();

            if (string.IsNullOrWhiteSpace(roomId))
            {
                return null;
            }

            try
            {
                var drawing = await dataAcess.ReadAsync(roomId);

                return drawing.PaintData;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        public async Task PostAsync(string roomId, string userId, List<PaintData> data)
        {
            try
            {
                SetHeaders();

                Drawing item = await dataAcess.ReadAsync(roomId);

                if (item != null)
                {
                    item.PaintData.AddRange(data);

                    await dataAcess.UpdateAsync(item);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpOptions]
        public void Options(string roomId, string userId)
        {
            SetHeaders();
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
