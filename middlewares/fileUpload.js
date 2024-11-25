// require modules
const path = require('path')
const multer = require('multer')


// set where the file will be saved to and its name
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images')
    },
    filename: (req, file, cb) => {
        const suffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const name = 'upload-' + file.fieldname + '-' + suffix + path.extname(file.originalname)
        cb(null, name)
    }
})

// filter file types
const fileFilter = (req, file, cb) => {
    const mimeTypes = ['image/jpeg', 'image/png', 'image/gif']

    if (mimeTypes.includes(file.mimetype)) {
        return cb(null, true)
    } else {
        cb(new Error('invalid file type. only jpeg, jpg, png, and gif files are allowed.'))
    }
}

// upload function
const upload = multer({
    storage: storage,
    limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
    fileFilter: fileFilter
}).single('image')


// export
exports.fileUpload = (req, res, next) => {
    upload(req, res, err => {
        if (err) {
            err.status = 400
            next(err)
        } else {
            next()
        }
    })
}
