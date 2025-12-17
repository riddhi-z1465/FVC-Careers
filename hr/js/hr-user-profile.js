
// ==========================================
// User Profile Editing Logic (Internal Team)
// ==========================================

let currentUserKey = null; // Store which user is logged in
let tempUserProfilePhoto = null; // Temp photo for preview

function openUserProfileModal() {
    // 1. Identify User
    const username = sessionStorage.getItem('hrUsername');
    if (!username) {
        console.warn('No username found in session.');
        return;
    }

    // 2. Load Team Data
    // We try to find the user in our persisted team list
    let teamMembers = [];
    try {
        const stored = localStorage.getItem('fvc_team_members');
        teamMembers = stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error('Error reading team members for profile:', e);
    }

    // Find matching user
    const member = teamMembers.find(m => m.username === username);

    // Setup Preview
    const preview = document.getElementById('userProfilePreview');
    tempUserProfilePhoto = null; // Reset temp

    if (member && member.photo) {
        currentEditPhoto = member.photo; // Use existing photo
        preview.innerHTML = `<img src="${member.photo}" style="width:100%; height:100%; object-fit:cover;">`;
    } else {
        // Fallback to existing logic or initials
        const initial = username.charAt(0).toUpperCase();
        preview.innerHTML = initial;
    }

    // Show Modal (using overlay classes similar to other popups)
    document.getElementById('userProfileOverlay').classList.add('show');
    document.getElementById('userProfileModal').classList.add('show');
}

function closeUserProfileModal() {
    document.getElementById('userProfileOverlay').classList.remove('show');
    document.getElementById('userProfileModal').classList.remove('show');
}

function handleUserProfileSelect(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            tempUserProfilePhoto = e.target.result; // Base64 string
            // Update preview
            document.getElementById('userProfilePreview').innerHTML = `<img src="${tempUserProfilePhoto}" style="width:100%; height:100%; object-fit:cover;">`;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function saveUserProfile(event) {
    event.preventDefault();

    if (!tempUserProfilePhoto) {
        // No change made
        closeUserProfileModal();
        return;
    }

    const username = sessionStorage.getItem('hrUsername');
    if (!username) return;

    // Update in Local Storage
    try {
        let teamMembers = JSON.parse(localStorage.getItem('fvc_team_members') || '[]');
        const index = teamMembers.findIndex(m => m.username === username);

        if (index !== -1) {
            // Existing member found in list
            teamMembers[index].photo = tempUserProfilePhoto;
        } else {
            // If user logged in (e.g. from demo creds) but NOT in the fvc_team_members list yet (e.g. first time load issue), 
            // we should add them or just handle the session specific visual.
            // For consistency in this demo, let's assume they might be missing if fvc_team_members wasn't initialized
            // We'll update the session's specific "userAvatar" immediately regardless.
        }

        localStorage.setItem('fvc_team_members', JSON.stringify(teamMembers));

        // Update the actual dashboard avatar immediately
        const avatarImg = document.getElementById('userAvatar');
        if (avatarImg) {
            avatarImg.src = tempUserProfilePhoto;
        }

        closeUserProfileModal();

    } catch (e) {
        console.error('Error saving profile photo:', e);
        alert('Failed to save profile photo.');
    }
}

// Auto-load profile photo on init
function initUserProfile() {
    const username = sessionStorage.getItem('hrUsername');
    if (!username) return;

    try {
        const teamMembers = JSON.parse(localStorage.getItem('fvc_team_members') || '[]');
        const member = teamMembers.find(m => m.username === username);
        if (member && member.photo) {
            const avatarImg = document.getElementById('userAvatar');
            if (avatarImg) {
                avatarImg.src = member.photo;
            }
        }
    } catch (e) {
        console.error('Error loading user profile:', e);
    }
}

// Call init on load
document.addEventListener('DOMContentLoaded', initUserProfile);
