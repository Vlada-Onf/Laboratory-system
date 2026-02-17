using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

