const compressResume = async (req, res, next) => {
  // Skip if no file uploaded
  if (!req.file || !req.file.buffer) return next();

  try {
    
    const FILE_SIZE_THRESHOLD = 500 * 1024; // 500KB

    if (
      req.file.originalname.toLowerCase().endsWith('.pdf') &&
      req.file.buffer.length > FILE_SIZE_THRESHOLD
    ) {
      console.log(
        `Resume is ${(req.file.buffer.length / 1024).toFixed(1)}KB — skipping server-side compression (use frontend limit instead)`
      );
    }
  } catch (error) {
    console.error("Resume compression error (non-blocking):", error.message);
  }

  next();
};

module.exports = compressResume;
