const cloudinary = require('./cloudinary');

/**
 * Extracts public_id from a Cloudinary URL
 * Example: https://res.cloudinary.com/dvcjqpq4d/image/upload/v12345/roadx/products/my_image.png
 * Public ID: roadx/products/my_image
 */
const getPublicIdFromUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) return null;
  const parts = url.split('/');
  const lastPart = parts.pop(); // my_image.png
  const folderParts = parts.slice(parts.indexOf('upload') + 2); // [roadx, products]
  const fileName = lastPart.split('.')[0]; // my_image
  return [...folderParts, fileName].join('/');
};

const deleteFromCloudinary = async (url) => {
  const publicId = getPublicIdFromUrl(url);
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log(`Deleted from Cloudinary: ${publicId}`);
  } catch (err) {
    console.error(`Failed to delete from Cloudinary: ${publicId}`, err.message);
  }
};

module.exports = { deleteFromCloudinary, getPublicIdFromUrl };
