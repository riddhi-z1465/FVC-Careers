const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String,
        required: true,
        default: 'FVC'
    },
    location: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Intern', 'Temporary'],
        required: true
    },
    experience: {
        type: String,
        enum: ['Intern', 'Early', 'Mid', 'Advanced', 'Director+'],
        required: true
    },
    qualifications: [{
        type: String,
        enum: ['Ongoing Study', 'Associate', 'Bachelors', 'Masters', 'Ph.D.']
    }],
    skills: [{
        type: String,
        trim: true
    }],
    description: {
        type: String,
        required: true
    },
    responsibilities: [{
        type: String
    }],
    requirements: [{
        type: String
    }],
    benefits: [{
        type: String
    }],
    salary: {
        min: Number,
        max: Number,
        currency: {
            type: String,
            default: 'USD'
        }
    },
    department: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    postedDate: {
        type: Date,
        default: Date.now
    },
    applicationDeadline: {
        type: Date
    },
    applicationsCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Indexes for search optimization
jobSchema.index({ title: 'text', description: 'text', skills: 'text' });
jobSchema.index({ location: 1, jobType: 1, experience: 1 });

module.exports = mongoose.model('Job', jobSchema);
