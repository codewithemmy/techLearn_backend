const multer = require("multer")
const cloudinary = require("cloudinary").v2
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const { config } = require("../core/config")
const fs = require("fs")

cloudinary.config({
  cloud_name: config.CLOUDINARY_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
})

const uploadManager = (destination) => {
  return multer({
    storage: new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: `TechLearn/${destination}`,
        quality: "auto:best",
      },
    }),
  })
}

const videoManager = (destination) => {
  return multer({
    storage: new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: `TechLearn/module-video/${destination}`,
        format: "mp4",
        resource_type: "video",
        eager_async: true, // Enable eager transformation asynchronously
      },
    }),
    fileFilter,
  })
}

function fileFilter(req, file, cb) {
  if (req.get("Authorization") !== undefined) {
    cb(null, true)
  } else {
    cb(null, true)
  }
}

// Multer configuration
const multerConfig = multer({ dest: "uploads/" }) // Define Multer destination folder

// Middleware to handle uploading large video files to Cloudinary
const videoChunkUpload = async (destination, req) => {
  try {
    const { file } = req // Assuming file is added to the request by Multer

    // Create a promise to upload the large video file to Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      cloudinary.uploader.upload_large(
        file.path,
        {
          folder: `TechLearn/module-video/${destination}`,
          resource_type: "video",
          chunk_size: 6000000,
          eager_async: true, // Enable eager transformation asynchronously
        },
        (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        }
      )
    })
    // Wait for the upload to complete and get the result
    const result = await uploadPromise
    if (!result.secure_url) {
      return res
        .status(400)
        .json({ msg: `Error uploading large video: ${error}`, status: 400 })
    }
    // Define the path to the uploads directory
    const uploadDir = path.join(__dirname, "..", "uploads")
    const resolvedPath = path.join(uploadDir, file.filename)

    // Asynchronously delete the file after upload
    fs.unlink(resolvedPath, (unlinkError) => {
      if (unlinkError) {
        console.error(`Error deleting file: ${unlinkError.message}`)
      }
    })
    return result.secure_url
  } catch (error) {
    // Handle any errors
    return res.json({
      msg: `Error uploading large video: ${error}`,
      status: 500,
    })
  }
}

module.exports = {
  uploadManager,
  videoManager,
  multerConfig,
  videoChunkUpload,
}
