
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
            dataAcess = new MemoryDataAccess<Drawing>(new AzureBlobDataAccess<Drawing>("drawdata"));
        }

        [HttpGet]
        public async Task<IEnumerable<Drawing>> GetAllAsync()
        {
            SetHeaders();

            return await dataAcess.ReadAllAsync();
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<Drawing> GetAsync(string id)
        {
            SetHeaders();

            if (string.IsNullOrWhiteSpace(id))
            {
                return null;
            }

            try
            {
                return await dataAcess.ReadAsync(id);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        public async Task<Drawing> PostAsync(Drawing data)
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

                return await dataAcess.CreateAsync(data);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpOptions]
        public void Options()
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
