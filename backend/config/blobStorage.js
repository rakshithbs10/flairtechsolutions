// config/blobStorage.js
const { BlobServiceClient } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');

const CONTAINER_NAME = process.env.AZURE_BLOB_CONTAINER_NAME || 'resumes';

function getBlobServiceClient() {
  const connectionString = process.env.AZURE_BLOB_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error('AZURE_BLOB_CONNECTION_STRING is not set');
  }
  return BlobServiceClient.fromConnectionString(connectionString);
}

async function ensureContainerExists() {
  const blobServiceClient = getBlobServiceClient();
  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
  await containerClient.createIfNotExists();
  console.log(`✅ Blob container '${CONTAINER_NAME}' ready`);
  return containerClient;
}

async function uploadResume(fileBuffer, originalFileName, mimeType) {
  const containerClient = await ensureContainerExists();

  // Generate unique blob name
  const ext = originalFileName.split('.').pop();
  const blobName = `${uuidv4()}-${Date.now()}.${ext}`;

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.upload(fileBuffer, fileBuffer.length, {
    blobHTTPHeaders: {
      blobContentType: mimeType,
      blobContentDisposition: `attachment; filename="${originalFileName}"`,
    },
  });

  return {
    blobName,
    url: blockBlobClient.url,
    originalFileName,
  };
}

async function deleteResume(blobName) {
  const blobServiceClient = getBlobServiceClient();
  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.deleteIfExists();
}

module.exports = { uploadResume, deleteResume, ensureContainerExists };
