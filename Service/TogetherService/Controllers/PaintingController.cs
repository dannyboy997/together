
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
    public class PaintingController : ControllerBase
    {
        private readonly ILogger<PaintingController> _logger;
        private readonly IDataAcess<Drawing> dataAcess;

        public PaintingController(ILogger<PaintingController> logger)
        {
            _logger = logger;
            dataAcess = new AzureBlobDataAccess<Drawing>("drawdata");
        }


        [HttpGet]
        public async Task<IEnumerable<Drawing>> GetAsync()
        {
            return await dataAcess.ReadAllAsync();
        }

        [HttpGet]
        public async Task<Drawing> GetAsync(string roomId)
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
                throw ex;
            }
        }

        [HttpPost]
        public async Task PostAsync(Drawing data)
        {
            SetHeaders();

            data.Key = Guid.NewGuid().ToString();

            try
            {
                Drawing item = await dataAcess.ReadAsync(data.Key);

                if (item != null)
                {
                    throw new InvalidOperationException();
                }

                await dataAcess.CreateAsync(data);
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
