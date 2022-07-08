const Multer = require('multer');
const mimetypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
const generateUploadImageMulter = path => Multer({
    storage: Multer.diskStorage({
        destination: (req, file, cb) => cb(null, path),
        filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
    }),
    fileFilter: (req, file, cb) => {
        if (mimetypes.includes(file.mimetype)) cb(null, true)
        else cb(null, false)
    },
    limits: { fileSize: 2 * 1024 * 1024 } //esto son 2 megas de límite
});
const uploadUserImages = generateUploadImageMulter('./images/users');
const uploadPostImages = generateUploadImageMulter('./images/posts')
const uploadCommentImages = generateUploadImageMulter('./images/comments')

module.exports = {uploadUserImages, uploadPostImages, uploadCommentImages};