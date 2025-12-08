const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Application = require('../models/Application');
const Job = require('../models/Job');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/resumes/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const allowedTypes = /pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF and DOC files are allowed!'));
        }
    }
});

// POST submit job application
router.post('/', upload.single('resume'), async (req, res) => {
    try {
        const {
            jobId,
            firstName,
            lastName,
            email,
            phone,
            location,
            coverLetter,
            portfolio,
            linkedin,
            experienceYears,
            currentRole,
            currentCompany,
            degree,
            institution,
            graduationYear
        } = req.body;

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                error: 'Job not found'
            });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            jobId,
            'applicant.email': email
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                error: 'You have already applied for this position'
            });
        }

        // Create application
        const application = new Application({
            jobId,
            applicant: {
                firstName,
                lastName,
                email,
                phone,
                location
            },
            resume: req.file ? {
                filename: req.file.filename,
                path: req.file.path
            } : undefined,
            coverLetter,
            portfolio,
            linkedin,
            experience: {
                years: experienceYears,
                currentRole,
                currentCompany
            },
            education: {
                degree,
                institution,
                graduationYear
            }
        });

        await application.save();

        // Increment applications count
        await Job.findByIdAndUpdate(jobId, {
            $inc: { applicationsCount: 1 }
        });

        res.status(201).json({
            success: true,
            data: application,
            message: 'Application submitted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// GET all applications (admin only)
router.get('/', async (req, res) => {
    try {
        const { jobId, status, page = 1, limit = 20 } = req.query;

        let query = {};
        if (jobId) query.jobId = jobId;
        if (status) query.status = status;

        const applications = await Application.find(query)
            .populate('jobId', 'title company location')
            .sort({ appliedDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Application.countDocuments(query);

        res.json({
            success: true,
            data: applications,
            pagination: {
                total: count,
                page: parseInt(page),
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET single application
router.get('/:id', async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('jobId');

        if (!application) {
            return res.status(404).json({
                success: false,
                error: 'Application not found'
            });
        }

        res.json({
            success: true,
            data: application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// PUT update application status
router.put('/:id/status', async (req, res) => {
    try {
        const { status, note } = req.body;

        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({
                success: false,
                error: 'Application not found'
            });
        }

        application.status = status;

        if (note) {
            application.notes.push({
                content: note,
                addedBy: 'Admin' // In production, use actual user
            });
        }

        await application.save();

        res.json({
            success: true,
            data: application,
            message: 'Application status updated'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// DELETE application
router.delete('/:id', async (req, res) => {
    try {
        const application = await Application.findByIdAndDelete(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                error: 'Application not found'
            });
        }

        // Decrement applications count
        await Job.findByIdAndUpdate(application.jobId, {
            $inc: { applicationsCount: -1 }
        });

        res.json({
            success: true,
            message: 'Application deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
