// cloudinary is a cloud which is used to store images in the cloud
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
});

//Define storages the file in cloud in wanderlust_DEV's Folder
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV', //in cloudinary made the folder clf wanderlust_DEV
      allowedFormats:["png","jpg","jpeg"] //Accept defined file formarts
    },
  });

module.exports = {
    cloudinary,
    storage,
};