// Firebase Jobs Service
(function () {
    'use strict';

    // Use the db instance from firebase-config.js
    const db = window.db || window.firebaseDB;
    const storage = window.firebaseStorage;

    const jobsCollection = 'jobs';
    const applicationsCollection = 'applications';

    // Fetch all jobs with filters
    async function fetchJobsFromFirebase(filters = {}) {
        try {
            let query = db.collection(jobsCollection).where('isActive', '==', true);

            // Apply filters
            if (filters.location) {
                query = query.where('location', '==', filters.location);
            }

            if (filters.jobType && filters.jobType.length > 0) {
                query = query.where('jobType', 'in', filters.jobType);
            }

            if (filters.experience && filters.experience.length > 0) {
                query = query.where('experience', 'in', filters.experience);
            }

            // Execute query (removed orderBy to avoid composite index requirement)
            const snapshot = await query.get();

            const jobs = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                jobs.push({
                    id: doc.id,
                    ...data,
                    // Convert Firestore Timestamp to Date for sorting
                    postedDate: data.postedDate?.toDate ? data.postedDate.toDate() : data.postedDate
                });
            });

            // Sort by postedDate on the client side (newest first)
            jobs.sort((a, b) => {
                const dateA = a.postedDate ? new Date(a.postedDate) : new Date(0);
                const dateB = b.postedDate ? new Date(b.postedDate) : new Date(0);
                return dateB - dateA; // Descending order
            });

            // Client-side text search (Firestore doesn't have full-text search)
            let filteredJobs = jobs;
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                filteredJobs = jobs.filter(job =>
                    job.title.toLowerCase().includes(searchLower) ||
                    job.description.toLowerCase().includes(searchLower) ||
                    (job.skills && job.skills.some(skill => skill.toLowerCase().includes(searchLower)))
                );
            }

            return {
                success: true,
                data: filteredJobs,
                total: filteredJobs.length
            };
        } catch (error) {
            console.error('Error fetching jobs:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get single job by ID
    async function getJobById(jobId) {
        try {
            const doc = await db.collection(jobsCollection).doc(jobId).get();

            if (!doc.exists) {
                return {
                    success: false,
                    error: 'Job not found'
                };
            }

            return {
                success: true,
                data: {
                    id: doc.id,
                    ...doc.data()
                }
            };
        } catch (error) {
            console.error('Error fetching job:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Add a new job (admin function)
    async function addJob(jobData) {
        try {
            const docRef = await db.collection(jobsCollection).add({
                ...jobData,
                postedDate: firebase.firestore.FieldValue.serverTimestamp(),
                isActive: true,
                applicationsCount: 0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            return {
                success: true,
                id: docRef.id,
                message: 'Job created successfully'
            };
        } catch (error) {
            console.error('Error adding job:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Update job
    async function updateJob(jobId, updates) {
        try {
            await db.collection(jobsCollection).doc(jobId).update({
                ...updates,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            return {
                success: true,
                message: 'Job updated successfully'
            };
        } catch (error) {
            console.error('Error updating job:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Delete job
    async function deleteJob(jobId) {
        try {
            await db.collection(jobsCollection).doc(jobId).delete();

            return {
                success: true,
                message: 'Job deleted successfully'
            };
        } catch (error) {
            console.error('Error deleting job:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Submit job application
    async function submitApplication(applicationData, resumeFile, photoFile = null) {
        try {
            let resumeURL = null;
            let photoURL = null;

            // Upload resume to Firebase Storage if provided
            if (resumeFile) {
                if (!storage) {
                    throw new Error('Firebase Storage is not initialized. Cannot upload resume.');
                }

                console.log('[UPLOAD] Uploading resume to Firebase Storage...');
                const storageRef = storage.ref();
                const resumePath = `resumes/${Date.now()}_${resumeFile.name}`;
                const resumeRef = storageRef.child(resumePath);

                await resumeRef.put(resumeFile);
                resumeURL = await resumeRef.getDownloadURL();
                console.log('[SUCCESS] Resume uploaded successfully');
            }

            // Upload photo to Firebase Storage if provided
            if (photoFile) {
                if (!storage) {
                    throw new Error('Firebase Storage is not initialized. Cannot upload photo.');
                }

                console.log('[UPLOAD] Uploading photo to Firebase Storage...');
                const storageRef = storage.ref();
                const photoPath = `photos/${Date.now()}_${photoFile.name}`;
                const photoRef = storageRef.child(photoPath);

                await photoRef.put(photoFile);
                photoURL = await photoRef.getDownloadURL();
                console.log('[SUCCESS] Photo uploaded successfully');
            }

            // Check if already applied (using email or phone number)
            const checkPromises = [];

            if (applicationData.email) {
                checkPromises.push(
                    db.collection(applicationsCollection)
                        .where('jobId', '==', applicationData.jobId)
                        .where('email', '==', applicationData.email)
                        .get()
                );
            }

            if (applicationData.mobileNumber) {
                checkPromises.push(
                    db.collection(applicationsCollection)
                        .where('jobId', '==', applicationData.jobId)
                        .where('mobileNumber', '==', applicationData.mobileNumber)
                        .get()
                );
            }

            const snapshots = await Promise.all(checkPromises);
            const isDuplicate = snapshots.some(snap => !snap.empty);

            if (isDuplicate) {
                return {
                    success: false,
                    error: 'You have already applied for this position'
                };
            }

            // Create application document
            const docRef = await db.collection(applicationsCollection).add({
                ...applicationData,
                resumeURL: resumeURL,
                photoURL: photoURL,
                status: applicationData.status || 'Submitted',
                appliedDate: firebase.firestore.FieldValue.serverTimestamp(),
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Increment applications count
            const jobRef = db.collection(jobsCollection).doc(applicationData.jobId);
            await jobRef.update({
                applicationsCount: firebase.firestore.FieldValue.increment(1)
            });

            return {
                success: true,
                id: docRef.id,
                message: 'Application submitted successfully'
            };
        } catch (error) {
            console.error('Error submitting application:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get applications for a job (admin function)
    async function getApplicationsByJob(jobId) {
        try {
            const snapshot = await db.collection(applicationsCollection)
                .where('jobId', '==', jobId)
                .get();

            const applications = [];
            snapshot.forEach(doc => {
                applications.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            // Sort client-side to avoid composite index requirement
            applications.sort((a, b) => {
                const dateA = a.appliedDate && a.appliedDate.toDate ? a.appliedDate.toDate() : new Date(a.appliedDate || 0);
                const dateB = b.appliedDate && b.appliedDate.toDate ? b.appliedDate.toDate() : new Date(b.appliedDate || 0);
                return dateB - dateA;
            });

            return {
                success: true,
                data: applications
            };
        } catch (error) {
            console.error('Error fetching applications:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Fetch all applications (admin function for stats)
    async function fetchAllApplications() {
        try {
            const snapshot = await db.collection(applicationsCollection)
                .orderBy('appliedDate', 'desc')
                .get();

            const applications = [];
            snapshot.forEach(doc => {
                applications.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            return {
                success: true,
                data: applications
            };
        } catch (error) {
            console.error('Error fetching all applications:', error);
            return {
                success: false,
                error: error.message,
                data: []
            };
        }
    }

    // Update application status (admin function)
    async function updateApplicationStatus(applicationId, status, note = '') {
        try {
            const updates = {
                status: status,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            if (note) {
                updates.notes = firebase.firestore.FieldValue.arrayUnion({
                    content: note,
                    addedBy: 'Admin',
                    addedAt: new Date().toISOString()
                });
            }

            await db.collection(applicationsCollection).doc(applicationId).update(updates);

            return {
                success: true,
                message: 'Application status updated'
            };
        } catch (error) {
            console.error('Error updating application:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Export functions
    window.firebaseJobs = {
        fetchJobs: fetchJobsFromFirebase,
        getJobById,
        addJob,
        updateJob,
        deleteJob,
        submitApplication,
        getApplicationsByJob,
        fetchAllApplications,
        updateApplicationStatus
    };

    console.log('[SUCCESS] Firebase Jobs Service loaded');
})();
