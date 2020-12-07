
namespace TogetherService.Model
{
    using System;
    using System.Threading.Tasks;

    public interface IDataAcess<Data>
        where Data: class, IModelData
    {
        Task<Data> CreateAsync(Data item);

        Task<Data> ReadAsync(string id);

        Task<Data> UpdateAsync(Data item);

        Task DeleteAsync(Data item);
    }
}
