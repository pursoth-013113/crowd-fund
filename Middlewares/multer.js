const multer = require('multer');

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const multiUpload = multer({
    storage: storage
}).fields([
    { name: 'bannerImage', maxCount: 1 },
    { name: 'profileImage', maxCount: 1 },
    { name: 'patientImages', maxCount: 10 } 
]);

module.exports = multiUpload;
