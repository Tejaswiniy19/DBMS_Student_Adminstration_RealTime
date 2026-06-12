const express = require('express');
const multer = require('multer');
const path = require('path');
const { requireAuth, requireRole } = require('../middleware/auth');
const prisma = require('../prismaClient');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`)
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    cb(null, allowed.includes(file.mimetype));
  }
});

router.post('/upload', requireAuth, upload.fields([
  { name: 'photograph' },
  { name: 'aadhaar' },
  { name: 'sscMemo' },
  { name: 'intermediateMemo' },
  { name: 'transferCertificate' },
  { name: 'incomeCertificate' },
  { name: 'casteCertificate' },
  { name: 'DOBCertificate' },
  { name: 'rankCard' },
  { name: 'signature' },
  { name: 'sportsCertificate' },
  { name: 'academicCertificate' }
]), async (req, res, next) => {
 try {
  console.log("FILES RECEIVED:");
  console.log(req.files);

  const uploads = Object.entries(req.files).flatMap(
    ([documentType, items]) =>
      items.map((item) => ({
        documentType,
        fileName: item.filename,
        filePath: `/uploads/${item.filename}`
      }))
  );

  console.log("UPLOADS:");
  console.log(uploads);

  const records = await Promise.all(
    uploads.map((record) =>
      prisma.uploadedDocument.create({
        data: {
          ...record,
          studentId: req.user.id
        }
      })
    )
  );

  await prisma.admissionStatus.upsert({
    where: { studentId: req.user.id },
    update: {
      documentStatus: 'uploaded'
    },
    create: {
      studentId: req.user.id,
      applicationStatus: 'submitted',
      documentStatus: 'uploaded'
    }
  });

  res.json({
    success: true,
    documents: records
  });
} catch (error) {
  next(error);
}
});

router.get('/my-list', requireAuth, async (req, res, next) => {
  try {
    const documents = await prisma.uploadedDocument.findMany({ where: { studentId: req.user.id } });
    res.json({ success: true, documents });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const document = await prisma.uploadedDocument.findUnique({ where: { id: Number(req.params.id) } });
    if (!document) return res.status(404).json({ success: false, error: 'Document not found' });
    res.json({ success: true, document });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/verify', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const document = await prisma.uploadedDocument.update({
      where: { id: Number(req.params.id) },
      data: { verified: status === 'approved', verificationNotes: notes || null }
    });
    res.json({ success: true, document });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
