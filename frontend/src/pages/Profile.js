import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Toast from '../components/Toast';
import './Profile.css';

function Profile() {
const { token, user: authUser, refreshUser } = useContext(AuthContext);  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    currentRole: '',
    experience: '',
    targetRole: '',
    targetSalary: '',
    skills: '',
    education: '',
    university: '',
    graduationYear: '',
    jobType: '',
    workMode: '',
    availability: '',
    profilePicture:''
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
  try {
    setLoading(true);
    const response = await axios.get(`${API_URL}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setFormData({
      name: response.data.user.name || '',
      email: response.data.user.email || '',
      phone: response.data.user.phone || '',
      location: response.data.user.location || '',
      bio: response.data.user.bio || '',
      currentRole: response.data.user.currentRole || '',
      experience: response.data.user.experience || '',
      targetRole: response.data.user.targetRole || '',
      targetSalary: response.data.user.targetSalary || '',
      skills: response.data.user.skills || '',
      education: response.data.user.education || '',
      university: response.data.user.university || '',
      graduationYear: response.data.user.graduationYear || '',
      jobType: response.data.user.jobType || '',
      workMode: response.data.user.workMode || '',
      availability: response.data.user.availability || '',
      profilePicture: response.data.user.profilePicture || '' // Ensure this is included
    });
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    setToast({ message: 'Failed to load profile', type: 'error' });
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      setToast({ message: 'Image size must be less than 2MB', type: 'error' });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setToast({ message: 'Please upload an image file', type: 'error' });
      return;
    }

    // Create image element for compression
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      // Create canvas for compression
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Set max dimensions
      const MAX_WIDTH = 400;
      const MAX_HEIGHT = 400;

      let width = img.width;
      let height = img.height;

      // Calculate new dimensions
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw compressed image
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to base64 with compression
      const compressedImage = canvas.toDataURL('image/jpeg', 0.7);

      setFormData({
        ...formData,
        profilePicture: compressedImage
      });
    };

    reader.readAsDataURL(file);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);

  try {
    await axios.put(`${API_URL}/api/profile`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    setToast({ message: 'Profile updated successfully!', type: 'success' });
    setIsEditing(false);

    // Refresh the global user state to update the navbar and other components
    if (refreshUser) refreshUser();
  } catch (error) {
    console.error('Failed to update profile:', error);
    setToast({ message: 'Failed to update profile', type: 'error' });
  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>👤 Profile</h1>
        </div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>👤 Profile</h1>
        {!isEditing ? (
          <button className="primary-btn" onClick={() => setIsEditing(true)}>
            ✏️ Edit Profile
          </button>
        ) : (
          <div className="header-actions">
            <button className="secondary-btn" onClick={() => {
              setIsEditing(false);
              fetchProfile();
            }}>
              Cancel
            </button>
            <button className="primary-btn" onClick={handleSubmit} disabled={saving}>
              {saving ? 'Saving...' : '💾 Save Changes'}
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <div className="profile-section">
          <h2>📋 Personal Information</h2>
          {/* Profile Picture */}
          <div className="profile-picture-section">
            <div className="profile-avatar-large">
              {formData.profilePicture ? (
                <img src={formData.profilePicture} alt="Profile" />
              ) : (
                <span className="avatar-placeholder">
                  {(formData.name || formData.email).charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {isEditing && (
              <div className="upload-section">
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <label htmlFor="profilePicture" className="upload-btn">
                  📷 Upload Photo
                </label>
                {formData.profilePicture && (
                  <button
                    type="button"
                    className="remove-photo-btn"
                    onClick={() => setFormData({ ...formData, profilePicture: '' })}
                  >
                    ✕ Remove
                  </button>
                )}
                <p className="upload-hint">JPG, PNG or GIF. Max 2MB.</p>
              </div>
            )}
          </div>
          <div className="profile-grid">
            <div className="form-group">
              <label>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              ) : (
                <div className="profile-value">{formData.name || 'Not set'}</div>
              )}
            </div>

            <div className="form-group">
              <label>Email</label>
              <div className="profile-value disabled">{formData.email}</div>
            </div>

            <div className="form-group">
              <label>Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                />
              ) : (
                <div className="profile-value">{formData.phone || 'Not set'}</div>
              )}
            </div>

            <div className="form-group">
              <label>Location</label>
              {isEditing ? (
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                />
              ) : (
                <div className="profile-value">{formData.location || 'Not set'}</div>
              )}
            </div>
          </div>

          <div className="form-group full-width">
            <label>Bio</label>
            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                rows="3"
              />
            ) : (
              <div className="profile-value">{formData.bio || 'Not set'}</div>
            )}
          </div>
        </div>

        {/* Professional Information */}
        <div className="profile-section">
          <h2>💼 Professional Information</h2>
          <div className="profile-grid">
            <div className="form-group">
              <label>Current Role</label>
              {isEditing ? (
                <input
                  type="text"
                  name="currentRole"
                  value={formData.currentRole}
                  onChange={handleChange}
                  placeholder="e.g., Software Engineer"
                />
              ) : (
                <div className="profile-value">{formData.currentRole || 'Not set'}</div>
              )}
            </div>

            <div className="form-group">
              <label>Experience Level</label>
              {isEditing ? (
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                >
                  <option value="">Select...</option>
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="junior">Junior (2-4 years)</option>
                  <option value="mid">Mid Level (4-7 years)</option>
                  <option value="senior">Senior (7-10 years)</option>
                  <option value="lead">Lead (10+ years)</option>
                </select>
              ) : (
                <div className="profile-value">{formData.experience || 'Not set'}</div>
              )}
            </div>

            <div className="form-group">
              <label>Target Role</label>
              {isEditing ? (
                <input
                  type="text"
                  name="targetRole"
                  value={formData.targetRole}
                  onChange={handleChange}
                  placeholder="e.g., Senior Developer"
                />
              ) : (
                <div className="profile-value">{formData.targetRole || 'Not set'}</div>
              )}
            </div>

            <div className="form-group">
              <label>Target Salary</label>
              {isEditing ? (
                <input
                  type="text"
                  name="targetSalary"
                  value={formData.targetSalary}
                  onChange={handleChange}
                  placeholder="e.g., $80k - $120k"
                />
              ) : (
                <div className="profile-value">{formData.targetSalary || 'Not set'}</div>
              )}
            </div>
          </div>

          <div className="form-group full-width">
            <label>Skills (comma-separated)</label>
            {isEditing ? (
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, Python, SQL, etc."
              />
            ) : (
              <div className="profile-value skills-tags">
                {formData.skills ? (
                  formData.skills.split(',').map((skill, index) => (
                    <span key={index} className="skill-tag">{skill.trim()}</span>
                  ))
                ) : (
                  'Not set'
                )}
              </div>
            )}
          </div>
        </div>

        {/* Education */}
        <div className="profile-section">
          <h2>🎓 Education</h2>
          <div className="profile-grid">
            <div className="form-group">
              <label>Degree</label>
              {isEditing ? (
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  placeholder="e.g., Bachelor's in CS"
                />
              ) : (
                <div className="profile-value">{formData.education || 'Not set'}</div>
              )}
            </div>

            <div className="form-group">
              <label>University</label>
              {isEditing ? (
                <input
                  type="text"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  placeholder="University name"
                />
              ) : (
                <div className="profile-value">{formData.university || 'Not set'}</div>
              )}
            </div>

            <div className="form-group">
              <label>Graduation Year</label>
              {isEditing ? (
                <input
                  type="text"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  placeholder="2020"
                />
              ) : (
                <div className="profile-value">{formData.graduationYear || 'Not set'}</div>
              )}
            </div>
          </div>
        </div>

        {/* Job Preferences */}
        <div className="profile-section">
          <h2>🎯 Job Search Preferences</h2>
          <div className="profile-grid">
            <div className="form-group">
              <label>Job Type</label>
              {isEditing ? (
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                >
                  <option value="">Select...</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                </select>
              ) : (
                <div className="profile-value">{formData.jobType || 'Not set'}</div>
              )}
            </div>

            <div className="form-group">
              <label>Work Mode</label>
              {isEditing ? (
                <select
                  name="workMode"
                  value={formData.workMode}
                  onChange={handleChange}
                >
                  <option value="">Select...</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
              ) : (
                <div className="profile-value">{formData.workMode || 'Not set'}</div>
              )}
            </div>

            <div className="form-group">
              <label>Availability</label>
              {isEditing ? (
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                >
                  <option value="">Select...</option>
                  <option value="immediate">Immediate</option>
                  <option value="2weeks">2 Weeks Notice</option>
                  <option value="1month">1 Month</option>
                  <option value="flexible">Flexible</option>
                </select>
              ) : (
                <div className="profile-value">{formData.availability || 'Not set'}</div>
              )}
            </div>
          </div>
        </div>
      </form>

      {toast && (
        <Toast 
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default Profile;