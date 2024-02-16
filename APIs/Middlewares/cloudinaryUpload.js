var cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const multer = require('multer');

// configure cloudinary
cloudinary.config({
    cloud_name:"madhuvembadi",
    api_key:"396781986163711",
    api_secret:"V_H-k4NmyrqhXtdd9ua_SSlXiVY",
    secure:true
})

// configure cloudinary storage
const cloudinaryStorage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:async (req,file) => {
        return {
            folder:"mini_project",
            public_id:file.fieldname + "-" + Date.now()
        }
    }
});

//configure multer
var upload = multer({storage:cloudinaryStorage}).array('images',5);
function uploadMultipleImages(req, res, next) {
    upload(req, res, function(err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred during file upload
        return res.status(500).json({ message: 'Multer error', error: err });
      } else if (err) {
        // An unknown error occurred
        return res.status(500).json({ message: 'Unknown error', error: err });
      }
      // Files uploaded successfully
      next();
    });
}

module.exports = {uploadMultipleImages}