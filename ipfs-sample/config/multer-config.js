const multer = require('multer');

// Configure multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Generate a unique filename for the uploaded file
        const data = file.originalname.split('.');
        cb(null, data[0] + '-' + Date.now() + '.' + data[1]);
    }
});

const fileFilter = function (req, file, cb) {
    // Accept only certain file types
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG and PNG files are allowed'));
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Export the multer middleware
module.exports = upload.single('avatar');
