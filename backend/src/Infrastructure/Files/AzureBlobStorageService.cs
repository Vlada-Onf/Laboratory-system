using Application.Common.Interfaces;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace Infrastructure.Files
{
    public sealed class AzureBlobStorageService : IFileStorageService
    {
        private readonly BlobContainerClient _container;

        public AzureBlobStorageService(IConfiguration configuration)
        {
            var connectionString = configuration["AzureBlob:ConnectionString"]
                ?? throw new InvalidOperationException("AzureBlob:ConnectionString is missing");

            var containerName = configuration["AzureBlob:Container"]
                ?? throw new InvalidOperationException("AzureBlob:Container is missing");

            var serviceClient = new BlobServiceClient(connectionString);
            _container = serviceClient.GetBlobContainerClient(containerName);
        }

        public async Task<string> UploadAsync(
            Stream stream,
            string fileName,
            string contentType,
            CancellationToken cancellationToken)
        {
            await _container.CreateIfNotExistsAsync(cancellationToken: cancellationToken);

            var uniqueName = $"{Guid.NewGuid():N}_{fileName}";
            var blobClient = _container.GetBlobClient(uniqueName);

            var options = new BlobUploadOptions
            {
                HttpHeaders = new BlobHttpHeaders { ContentType = contentType }
            };

            await blobClient.UploadAsync(stream, options, cancellationToken);

            return blobClient.Uri.ToString();
        }
    }
}
