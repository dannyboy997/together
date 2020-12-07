
namespace TogetherService.Model
{
    using Azure.Storage.Blobs;
    using Newtonsoft.Json;
    using System;
    using System.IO;
    using System.Text;
    using System.Threading.Tasks;

    public class AzureBlobDataAccess<Data> : IDataAcess<Data> 
        where Data : class, IModelData
    {
        private string connectionString = "BlobEndpoint=https://togethersa01.blob.core.windows.net/;QueueEndpoint=https://togethersa01.queue.core.windows.net/;FileEndpoint=https://togethersa01.file.core.windows.net/;TableEndpoint=https://togethersa01.table.core.windows.net/;SharedAccessSignature=sv=2019-12-12&ss=b&srt=sco&sp=rwlacx&se=2020-12-31T13:30:33Z&st=2020-12-07T05:30:33Z&spr=https&sig=YbwVRHtkKIrg7Uw%2FJ5WsfnMX3VMS4%2B%2FnTf5hpKUIwb4%3D";
        private BlobContainerClient container;

        private readonly IDataAcess<Data> BackingDataAccess;

        public AzureBlobDataAccess(string containerName)
        {
            container = new BlobContainerClient(connectionString, containerName);
        }

        public AzureBlobDataAccess(IDataAcess<Data> backingDataAccess, string containerName) : this(containerName)
        {
            BackingDataAccess = backingDataAccess;
        }

        public async Task<Data> CreateAsync(Data item)
        {
            if (BackingDataAccess != null)
            {
                item = await BackingDataAccess.CreateAsync(item);
            }

            BlobClient blob = container.GetBlobClient(item.Key);

            if (blob.Exists())
            {
                await blob.DeleteAsync();
            }

            byte[] byteArray = Encoding.ASCII.GetBytes(JsonConvert.SerializeObject(item));
            MemoryStream stream = new MemoryStream(byteArray);

            await blob.UploadAsync(stream);

            return item;
        }

        public async Task<Data> ReadAsync(string id)
        {
            BlobClient blob = container.GetBlobClient(id);

            if (blob.Exists())
            {
                using (StreamReader reader = new StreamReader(await blob.OpenReadAsync(), Encoding.UTF8))
                {
                    return JsonConvert.DeserializeObject<Data>(reader.ReadToEnd());
                }
            }

            if (BackingDataAccess != null)
            {
                var item = await BackingDataAccess.ReadAsync(id);

                if (item != null)
                {
                    await CreateAsync(item);

                    return item;
                }
            }

            return null;
        }

        public async Task<Data> UpdateAsync(Data item)
        {
            if (BackingDataAccess != null)
            {
                item = await BackingDataAccess.UpdateAsync(item);
            }

            BlobClient blob = container.GetBlobClient(item.Key);

            byte[] byteArray = Encoding.ASCII.GetBytes(JsonConvert.SerializeObject(item));
            MemoryStream stream = new MemoryStream(byteArray);

            await blob.UploadAsync(stream, true);

            return item;
        }

        public async Task DeleteAsync(Data item)
        {
            BlobClient blob = container.GetBlobClient(item.Key);

            if (blob.Exists())
            {
                await blob.DeleteAsync();
            }

            if (BackingDataAccess != null)
            {
                await BackingDataAccess.DeleteAsync(item);
            }
        }
    }
}
