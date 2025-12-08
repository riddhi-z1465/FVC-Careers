// Firebase Data Seeder
// Run this in browser console after Firebase is initialized

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
        },
        isActive: true,
        applicationsCount: 0
    },
    {
        title: 'Staff UX Designer, Google Ad Sales CRM',
        company: 'Google',
        location: 'Mumbai, India',
        jobType: 'Part-time',
        experience: 'Advanced',
        qualifications: ['Bachelors', 'Masters'],
        skills: ['UX Design', 'CRM', 'Enterprise Software', 'Design Systems'],
        description: 'Google User Experience (UX) is made up of multi-disciplinary teams of UX Designers, Researchers, Writers, Content Strategists, Program Managers, and Engineers. We care deeply about the people who use our products.',
        responsibilities: [
            'Lead UX design for Google Ad Sales CRM platform',
            'Mentor junior designers',
            'Define design strategy and vision',
            'Collaborate with stakeholders'
        ],
        requirements: [
            '7+ years of UX design experience',
            'Experience with enterprise software design',
            'Strong leadership skills',
            'Portfolio showcasing complex product design'
        ],
        benefits: [
            'Competitive salary',
            'Stock options',
            'Health programs',
            'Remote work options'
        ],
        department: 'Design',
        salary: {
            min: 120000,
            max: 180000,
            currency: 'USD'
        },
        isActive: true,
        applicationsCount: 0
    },
    {
        title: 'UX Designer, Google Home Experience',
        company: 'Google',
        location: 'Mumbai, India',
        jobType: 'Intern',
        experience: 'Intern',
        qualifications: ['Ongoing Study', 'Bachelors'],
        skills: ['UX Design', 'UI Design', 'Sketch', 'Adobe XD'],
        description: 'Join our team as a UX Design Intern and work on Google Home products. This is a great opportunity to learn from experienced designers.',
        responsibilities: [
            'Assist in designing Google Home interfaces',
            'Create wireframes and mockups',
            'Participate in design reviews',
            'Support user research activities'
        ],
        requirements: [
            'Currently pursuing degree in Design',
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
        },
        isActive: true,
        applicationsCount: 0
    },
    {
        title: 'AI/ML Engineer',
        company: 'FVC',
        location: 'Bangalore, India',
        jobType: 'Full-time',
        experience: 'Mid',
        qualifications: ['Bachelors', 'Masters'],
        skills: ['Python', 'TensorFlow', 'Machine Learning', 'Deep Learning', 'NLP'],
        description: 'Develop smart models that help automate decisions and unlock new insights.',
        responsibilities: [
            'Design and implement ML models',
            'Optimize model performance',
            'Collaborate with data scientists',
            'Deploy models to production'
        ],
        requirements: [
            '3+ years of ML engineering experience',
            'Strong Python programming skills',
            'Experience with TensorFlow or PyTorch',
            'Understanding of ML algorithms'
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
        },
        isActive: true,
        applicationsCount: 0
    },
    {
        title: 'Product Manager',
        company: 'FVC',
        location: 'Delhi, India',
        jobType: 'Full-time',
        experience: 'Mid',
        qualifications: ['Bachelors', 'Masters'],
        skills: ['Product Management', 'Agile', 'Data Analysis', 'Roadmapping'],
        description: 'Drive product direction, align teams, and ensure every feature solves a real problem.',
        responsibilities: [
            'Define product vision and strategy',
            'Manage product roadmap',
            'Work with cross-functional teams',
            'Analyze metrics and feedback'
        ],
        requirements: [
            '4+ years of product management experience',
            'Strong analytical skills',
            'Experience with agile methodologies',
            'Technical background preferred'
        ],
        benefits: [
            'Competitive salary',
            'Performance bonuses',
            'Health benefits',
            'Professional development'
        ],
        department: 'Product',
        salary: {
            min: 100000,
            max: 150000,
            currency: 'USD'
        },
        isActive: true,
        applicationsCount: 0
    },
    {
        title: 'Frontend Developer',
        company: 'FVC',
        location: 'Hyderabad, India',
        jobType: 'Full-time',
        experience: 'Early',
        qualifications: ['Bachelors'],
        skills: ['React', 'JavaScript', 'HTML', 'CSS', 'TypeScript'],
        description: 'Build beautiful, responsive web applications using modern frontend technologies.',
        responsibilities: [
            'Develop responsive web applications',
            'Write clean, maintainable code',
            'Collaborate with designers',
            'Optimize application performance'
        ],
        requirements: [
            '2+ years of frontend development',
            'Strong knowledge of React',
            'Understanding of web standards',
            'Experience with Git'
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
        },
        isActive: true,
        applicationsCount: 0
    }
];

// Function to seed Firebase
async function seedFirebase() {
    console.log('🌱 Starting Firebase seed...');

    try {
        const batch = db.batch();

        sampleJobs.forEach(job => {
            const docRef = db.collection('jobs').doc();
            batch.set(docRef, {
                ...job,
                postedDate: firebase.firestore.Timestamp.now(),
                createdAt: firebase.firestore.Timestamp.now()
            });
        });

        await batch.commit();

        console.log(`✅ Successfully seeded ${sampleJobs.length} jobs to Firebase!`);
        console.log('📊 Jobs collection populated');

        return {
            success: true,
            count: sampleJobs.length
        };
    } catch (error) {
        console.error('❌ Error seeding Firebase:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Auto-run if Firebase is ready
if (typeof db !== 'undefined') {
    console.log('Firebase detected. Call seedFirebase() to populate data.');
} else {
    console.log('Waiting for Firebase initialization...');
}

// Export for manual execution
window.seedFirebase = seedFirebase;
