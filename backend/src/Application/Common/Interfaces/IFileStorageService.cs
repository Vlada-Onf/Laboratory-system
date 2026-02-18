using System.Threading;
using System.Threading.Tasks;
using System.IO;

namespace Application.Common.Interfaces
{
    public interface IFileStorageService
    {
        Task<string> UploadAsync(
            Stream stream,
            string fileName,
            string contentType,
            CancellationToken cancellationToken);
    }
}
