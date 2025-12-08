const mongoose = require('mongoose');
const Job = require('./models/Job');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fvc-careers';

const sampleJobs = [
    {
        title: 'UX Designer, YouTube Paid Digital Goods',
        company: 'YouTube',
        location: 'Mumbai, India',
        jobType: 'Full-time',
        experience: 'Mid',
        qualifications: ['Bachelors', 'Masters'],
        skills: ['UX Design', 'UI Design', 'Figma', 'User Research', 'Prototyping'],
        description: 'At Google, we follow a simple and well-proven "Focus on the user and all else will follow." Google\'s Interaction Designers take complex tasks and make them intuitive and easy-to-use for billions of people around the globe. Throughout the design process—from creating user flows and wireframes to building user interface mockups and prototypes—you\'ll envision how people will experience our products, and bring that vision to life in a way that feels inspired, refined, and even magical.',
        responsibilities: [
            'Design user interfaces for YouTube\'s paid digital goods platform',
            'Conduct user research and usability testing',
            'Create wireframes, prototypes, and high-fidelity mockups',
            'Collaborate with product managers and engineers'
        ],
        requirements: [
            '3+ years of UX design experience',
            'Strong portfolio demonstrating UX/UI skills',
            'Proficiency in Figma or similar design tools',
            'Understanding of user-centered design principles'
        ],
        benefits: [
            'Competitive salary',
            'Health insurance',
            'Flexible work hours',
            'Learning and development budget'
        ],
        department: 'Design',
        salary: {
            min: 80000,
            max: 120000,
            currency: 'USD'
        }
    },
    {
        title: 'Staff UX Designer, Google Ad Sales CRM',
        company: 'Google',
        location: 'Mumbai, India',
        jobType: 'Part-time',
        experience: 'Advanced',
        qualifications: ['Bachelors', 'Masters'],
        skills: ['UX Design', 'CRM', 'Enterprise Software', 'Design Systems'],
        description: 'Google User Experience (UX) is made up of multi-disciplinary teams of UX Designers, Researchers, Writers, Content Strategists, Program Managers, and Engineers. We care deeply about the people who use our products. The UX team plays an integral part in gathering insights about the attitudes, emotions, and behaviors of people who use our products to inspire and inform design. We collaborate closely with each other and with engineering and product management to create industry-leading products that deliver value for the people who use them, and for Google\'s businesses.',
        responsibilities: [
            'Lead UX design for Google Ad Sales CRM platform',
            'Mentor junior designers',
            'Define design strategy and vision',
            'Collaborate with stakeholders across the organization'
        ],
        requirements: [
            '7+ years of UX design experience',
            'Experience with enterprise software design',
            'Strong leadership and communication skills',
            'Portfolio showcasing complex product design'
        ],
        benefits: [
            'Competitive salary',
            'Stock options',
            'Health and wellness programs',
            'Remote work options'
        ],
        department: 'Design',
        salary: {
            min: 120000,
            max: 180000,
            currency: 'USD'
        }
    },
    {
        title: 'UX Designer, Google Home Experience',
        company: 'Google',
        location: 'Mumbai, India',
        jobType: 'Intern',
        experience: 'Intern',
        qualifications: ['Ongoing Study', 'Bachelors'],
        skills: ['UX Design', 'UI Design', 'Sketch', 'Adobe XD'],
        description: 'At Google, we follow a simple and well-proven "Focus on the user and all else will follow." Google\'s Interaction Designers take complex tasks and make them intuitive and easy-to-use for billions of people around the globe. Throughout the design process—from creating user flows and wireframes to building user interface mockups and prototypes—you\'ll envision how people will experience our products, and bring that vision to life in a way that feels inspired, refined, and even magical.',
        responsibilities: [
            'Assist in designing Google Home user interfaces',
            'Create wireframes and mockups',
            'Participate in design reviews',
            'Support user research activities'
        ],
        requirements: [
            'Currently pursuing degree in Design or related field',
            'Basic knowledge of UX/UI principles',
            'Familiarity with design tools',
            'Strong communication skills'
        ],
        benefits: [
            'Internship stipend',
            'Mentorship program',
            'Networking opportunities',
            'Potential for full-time conversion'
        ],
        department: 'Design',
        salary: {
            min: 20000,
            max: 30000,
            currency: 'USD'
        }
    },
    {
        title: 'AI/ML Engineer',
        company: 'FVC',
        location: 'Bangalore, India',
        jobType: 'Full-time',
        experience: 'Mid',
        qualifications: ['Bachelors', 'Masters'],
        skills: ['Python', 'TensorFlow', 'Machine Learning', 'Deep Learning', 'NLP'],
        description: 'Develop smart models that help automate decisions and unlock new insights. Work on cutting-edge AI/ML projects that impact millions of users.',
        responsibilities: [
            'Design and implement machine learning models',
            'Optimize model performance and scalability',
            'Collaborate with data scientists and engineers',
            'Deploy models to production'
        ],
        requirements: [
            '3+ years of ML engineering experience',
            'Strong Python programming skills',
            'Experience with TensorFlow or PyTorch',
            'Understanding of ML algorithms and statistics'
        ],
        benefits: [
            'Competitive salary',
            'Health insurance',
            'Stock options',
            'Flexible work arrangements'
        ],
        department: 'Engineering',
        salary: {
            min: 90000,
            max: 140000,
            currency: 'USD'
        }
    },
    {
        title: 'Product Manager',
        company: 'FVC',
        location: 'Delhi, India',
        jobType: 'Full-time',
        experience: 'Mid',
        qualifications: ['Bachelors', 'Masters'],
        skills: ['Product Management', 'Agile', 'Data Analysis', 'Roadmapping'],
        description: 'Drive product direction, align teams, and ensure every feature solves a real problem. Lead cross-functional teams to deliver exceptional products.',
        responsibilities: [
            'Define product vision and strategy',
            'Manage product roadmap and backlog',
            'Work with engineering, design, and business teams',
            'Analyze metrics and user feedback'
        ],
        requirements: [
            '4+ years of product management experience',
            'Strong analytical and communication skills',
            'Experience with agile methodologies',
            'Technical background preferred'
        ],
        benefits: [
            'Competitive salary',
            'Performance bonuses',
            'Health and wellness benefits',
            'Professional development opportunities'
        ],
        department: 'Product',
        salary: {
            min: 100000,
            max: 150000,
            currency: 'USD'
        }
    },
    {
        title: 'Frontend Developer',
        company: 'FVC',
        location: 'Hyderabad, India',
        jobType: 'Full-time',
        experience: 'Early',
        qualifications: ['Bachelors'],
        skills: ['React', 'JavaScript', 'HTML', 'CSS', 'TypeScript'],
        description: 'Build beautiful, responsive web applications using modern frontend technologies. Join our engineering team to create amazing user experiences.',
        responsibilities: [
            'Develop responsive web applications',
            'Write clean, maintainable code',
            'Collaborate with designers and backend engineers',
            'Optimize application performance'
        ],
        requirements: [
            '2+ years of frontend development experience',
            'Strong knowledge of React and JavaScript',
            'Understanding of web standards and best practices',
            'Experience with version control (Git)'
        ],
        benefits: [
            'Competitive salary',
            'Learning budget',
            'Flexible hours',
            'Modern tech stack'
        ],
        department: 'Engineering',
        salary: {
            min: 60000,
            max: 90000,
            currency: 'USD'
        }
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('✅ Connected to MongoDB');

        // Clear existing jobs
        await Job.deleteMany({});
        console.log('🗑️  Cleared existing jobs');

        // Insert sample jobs
        await Job.insertMany(sampleJobs);
        console.log(`✅ Inserted ${sampleJobs.length} sample jobs`);

        console.log('\n📊 Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
