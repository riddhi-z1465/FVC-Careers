const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// GET all jobs with filters and search
router.get('/', async (req, res) => {
    try {
        const {
            search,
            location,
            jobType,
            experience,
            qualifications,
            skills,
            page = 1,
            limit = 10
        } = req.query;

        // Build query
        let query = { isActive: true };

        // Text search
        if (search) {
            query.$text = { $search: search };
        }

        // Location filter
        if (location) {
            query.location = new RegExp(location, 'i');
        }

        // Job Type filter (can be multiple)
        if (jobType) {
            const types = Array.isArray(jobType) ? jobType : [jobType];
            query.jobType = { $in: types };
        }

        // Experience filter (can be multiple)
        if (experience) {
            const levels = Array.isArray(experience) ? experience : [experience];
            query.experience = { $in: levels };
        }

        // Qualifications filter
        if (qualifications) {
            const quals = Array.isArray(qualifications) ? qualifications : [qualifications];
            query.qualifications = { $in: quals };
        }

        // Skills filter
        if (skills) {
            const skillList = Array.isArray(skills) ? skills : [skills];
            query.skills = { $in: skillList.map(s => new RegExp(s, 'i')) };
        }

        // Execute query with pagination
        const jobs = await Job.find(query)
            .sort({ postedDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('-__v');

        // Get total count for pagination
        const count = await Job.countDocuments(query);

        res.json({
            success: true,
            data: jobs,
            pagination: {
                total: count,
                page: parseInt(page),
                pages: Math.ceil(count / limit),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET single job by ID
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                error: 'Job not found'
            });
        }

        res.json({
            success: true,
            data: job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// POST create new job (admin only - add auth middleware in production)
router.post('/', async (req, res) => {
    try {
        const job = new Job(req.body);
        await job.save();

        res.status(201).json({
            success: true,
            data: job,
            message: 'Job created successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// PUT update job
router.put('/:id', async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!job) {
            return res.status(404).json({
                success: false,
                error: 'Job not found'
            });
        }

        res.json({
            success: true,
            data: job,
            message: 'Job updated successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// DELETE job
router.delete('/:id', async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                error: 'Job not found'
            });
        }

        res.json({
            success: true,
            message: 'Job deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET filter options (for dropdown population)
router.get('/meta/filters', async (req, res) => {
    try {
        const locations = await Job.distinct('location', { isActive: true });
        const departments = await Job.distinct('department', { isActive: true });
        const skills = await Job.distinct('skills', { isActive: true });

        res.json({
            success: true,
            data: {
                locations,
                departments,
                skills,
                jobTypes: ['Full-time', 'Part-time', 'Intern', 'Temporary'],
                experienceLevels: ['Intern', 'Early', 'Mid', 'Advanced', 'Director+'],
                qualifications: ['Ongoing Study', 'Associate', 'Bachelors', 'Masters', 'Ph.D.']
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
