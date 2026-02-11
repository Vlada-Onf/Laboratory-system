using MediatR;
using Microsoft.Extensions.Logging;
using LanguageExt;

namespace Infrastructure.BlobStorage
{
   /* public class BlobStorageService : IFileStorage
    {
        private readonly ILogger<BlobStorageService> _logger;
        private readonly string _storagePath;

        public BlobStorageService(ILogger<BlobStorageService> logger)
        {
            _logger = logger;

            _storagePath = Path.Combine(Directory.GetCurrentDirectory(), "uploads");

            if (!Directory.Exists(_storagePath))
            {
                Directory.CreateDirectory(_storagePath);
            }
        }

        public async Task<Unit> UploadAsync(
            Stream stream,
            string fileFullPath,
            CancellationToken cancellationToken)
        {
            try
            {
                var localFilePath = Path.Combine(_storagePath, fileFullPath);

                var directory = Path.GetDirectoryName(localFilePath);
                if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }

                await using var fileStream = new FileStream(
                    localFilePath,
                    FileMode.Create,
                    FileAccess.Write);

                await stream.CopyToAsync(fileStream, cancellationToken);

                _logger.LogInformation(
                    "File uploaded successfully: {FilePath}",
                    localFilePath);

                return Unit.Default;
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Failed to upload file: {FilePath}",
                    fileFullPath);

                throw;
            }
        }
    }*/
}