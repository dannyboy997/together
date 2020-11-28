

namespace TogetherService.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using System.Collections.Generic;

    [ApiController]
    [Route("[controller]")]
    public class PaintController : ControllerBase
    {
        private static readonly Dictionary<string, List<PaintData>> Rooms = new Dictionary<string, List<PaintData>>();
        
        private readonly ILogger<PaintController> _logger;

        public PaintController(ILogger<PaintController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public List<PaintData> Get(string roomId, string userId)
        {
            SetHeaders();

            if (string.IsNullOrWhiteSpace(roomId))
            {
                return null;
            }

            if (Rooms.ContainsKey(roomId))
            {
                return Rooms[roomId];
            }

            return null;
        }

        [HttpOptions]
        public void Options()
        {
            SetHeaders();
        }

        [HttpPost]
        public void Post(string roomId, string userId, PaintData data)
        {
            SetHeaders();

            if (Rooms.ContainsKey(roomId))
            {
                Rooms[roomId].Add(data);
            }
            else
            {
                Rooms.Add(roomId, new List<PaintData>() { data });
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
