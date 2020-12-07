
namespace TogetherService.Model
{
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public class MemoryDataAccess<Data> : IDataAcess<Data> 
        where Data : class, IModelData
    {
        private readonly Dictionary<string, Data> MemoryData = new Dictionary<string, Data>();
        private readonly IDataAcess<Data> BackingDataAccess;

        public MemoryDataAccess()
        {
        }

        public MemoryDataAccess(IDataAcess<Data> backingDataAccess)
        {
            BackingDataAccess = backingDataAccess;
        }

        public async Task<Data> CreateAsync(Data item)
        {
            if (BackingDataAccess != null)
            {
                item = await BackingDataAccess.CreateAsync(item);
            }

            if (MemoryData.ContainsKey(item.Key))
            {
                MemoryData.Remove(item.Key);
            }

            MemoryData.Add(item.Key, item);

            return item;
        }

        public async Task<Data> ReadAsync(string id)
        {
            if (MemoryData.ContainsKey(id))
            {
                return MemoryData[id];
            }

            if (BackingDataAccess != null)
            {
                var item = await BackingDataAccess.ReadAsync(id);

                if (item != null)
                {
                    MemoryData.Add(item.Key, item);

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

            if (MemoryData.ContainsKey(item.Key))
            {
                MemoryData[item.Key] = item;
            }
            else
            {
                MemoryData.Add(item.Key, item);
            }

            return item;
        }

        public async Task DeleteAsync(Data item)
        {
            if (MemoryData.ContainsKey(item.Key))
            {
                MemoryData.Remove(item.Key);
            }

            if (BackingDataAccess != null)
            {
                await BackingDataAccess.DeleteAsync(item);
            }
        }
    }
}
