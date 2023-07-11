const multer = require('multer');

const upload = multer({ dest: 'uploads/' })

const storageEngine = multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}--${file.originalname}`);
    }
});
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

module.exports = multer({
    storage: storageEngine,
    fileFilter: multerFilter
});

