
namespace TogetherService.Model
{
    using Azure.Storage.Blobs;
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.Configuration;
    using System.IO;
    using System.Text;
    using System.Threading.Tasks;

    public class AzureBlobDataAccess<Data> : IDataAcess<Data> 
        where Data : class, IModelData
    {
        private string connectionString;
        private BlobContainerClient container;

        private readonly IDataAcess<Data> BackingDataAccess;

        public AzureBlobDataAccess(string containerName)
        {
            connectionString = ReadSetting("ConnectionString");
            container = new BlobContainerClient(connectionString, containerName);
        }
        static string ReadSetting(string key)
        {
            string result = null;

            try
            {
                result = Environment.GetEnvironmentVariable(key);
                Console.WriteLine(result);
            }
            catch (ConfigurationErrorsException)
            {
                Console.WriteLine("Error reading app settings");
            }

            return result;
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

        public async Task<IEnumerable<Data>> ReadAllAsync()
        {
            var items = new List<Data>();

            var blobs = container.GetBlobsAsync();

            await foreach(var blob in blobs)
            {
                items.Add(await ReadAsync(blob.Name));
            }

            return items;
        }
    }
}
