const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    applicant: {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        phone: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        }
    },
    resume: {
        filename: String,
        path: String,
        uploadDate: {
            type: Date,
            default: Date.now
        }
    },
    coverLetter: {
        type: String,
        maxlength: 2000
    },
    portfolio: {
        type: String,
        trim: true
    },
    linkedin: {
        type: String,
        trim: true
    },
    experience: {
        years: Number,
        currentRole: String,
        currentCompany: String
    },
    education: {
        degree: String,
        institution: String,
        graduationYear: Number
    },
    status: {
        type: String,
        enum: ['Submitted', 'Under Review', 'Interview Scheduled', 'Rejected', 'Accepted'],
        default: 'Submitted'
    },
    notes: [{
        content: String,
        addedBy: String,
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],
    appliedDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for quick lookups
applicationSchema.index({ jobId: 1, 'applicant.email': 1 });
applicationSchema.index({ status: 1, appliedDate: -1 });

module.exports = mongoose.model('Application', applicationSchema);
