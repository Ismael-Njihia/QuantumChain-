const multer = require('multer');
const ipfsService = require('../services/ipfsService');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Upload file to IPFS
exports.uploadFile = [
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: { message: 'No file provided' } });
      }

      const result = await ipfsService.uploadFile(
        req.file.buffer,
        req.file.originalname
      );

      // Pin the file to ensure it stays on IPFS
      await ipfsService.pinFile(result.hash);

      res.json({
        success: true,
        data: {
          hash: result.hash,
          fileName: req.file.originalname,
          size: result.size,
          url: `https://ipfs.io/ipfs/${result.hash}`,
        },
      });
    } catch (error) {
      console.error('Upload file error:', error);
      res.status(500).json({ error: { message: 'Server error during upload' } });
    }
  },
];

// Get file from IPFS
exports.getFile = async (req, res) => {
  try {
    const { hash } = req.params;

    if (!hash) {
      return res.status(400).json({ error: { message: 'Hash is required' } });
    }

    const fileBuffer = await ipfsService.getFile(hash);

    res.json({
      success: true,
      data: {
        hash,
        content: fileBuffer.toString('base64'),
        url: `https://ipfs.io/ipfs/${hash}`,
      },
    });
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ error: { message: 'Server error retrieving file' } });
  }
};
