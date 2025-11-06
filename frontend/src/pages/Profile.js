import { useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Toast from '../components/Toast';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Avatar,
  Chip,
  Paper,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
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

  const fetchProfile = useCallback(async () => {
  try {
    setLoading(true);
    const response = await axios.get(`${API_URL}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const userData = response.data.user || {};
    
    setFormData({
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      location: userData.location || '',
      bio: userData.bio || '',
      currentRole: userData.currentRole || '',
      experience: userData.experience || '',
      targetRole: userData.targetRole || '',
      targetSalary: userData.targetSalary || '',
      skills: userData.skills || '',
      education: userData.education || '',
      university: userData.university || '',
      graduationYear: userData.graduationYear || '',
      jobType: userData.jobType || '',
      workMode: userData.workMode || '',
      availability: userData.availability || '',
      profilePicture: userData.profilePicture || ''
    });
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    setToast({ message: 'Failed to load profile: ' + (error.response?.data?.message || error.message), type: 'error' });
    
    // Set default values if fetch fails
    setFormData({
      name: authUser?.name || '',
      email: authUser?.email || '',
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
      profilePicture: authUser?.profilePicture || ''
    });
  } finally {
    setLoading(false);
  }
}, [token, API_URL, authUser]);

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token, fetchProfile]);

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
    const response = await axios.put(`${API_URL}/api/profile`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.user) {
      setToast({ message: 'Profile updated successfully!', type: 'success' });
      setIsEditing(false);
      
      // Refresh the global user state to update the navbar and other components
      if (refreshUser) refreshUser();
    }
  } catch (error) {
    console.error('Failed to update profile:', error);
    const errorMsg = error.response?.data?.message || error.message || 'Failed to update profile';
    setToast({ message: 'Error: ' + errorMsg, type: 'error' });
  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header Card */}
      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e0e0e0', background: '#fff', mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, fontSize: '1.3rem' }}>My Profile</Typography>
          <Typography variant="body2" color="text.secondary">Manage your personal and professional information</Typography>
        </Box>
        {!isEditing ? (
          <Button 
            variant="contained" 
            startIcon={<EditIcon />}
            onClick={() => setIsEditing(true)}
            sx={{ borderRadius: 2, textTransform: 'none', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            Edit Profile
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              startIcon={<CancelIcon />}
              onClick={() => {
                setIsEditing(false);
                fetchProfile();
              }}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
              disabled={saving}
              sx={{ borderRadius: 2, textTransform: 'none', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        )}
      </Paper>

      <form onSubmit={handleSubmit}>
        {/* Personal Information Section */}
        <Paper elevation={0} sx={{ p: 6, borderRadius: 3, border: '1px solid #e0e0e0', background: '#fff', mb: 6 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 5, fontSize: '1.2rem' }}>Personal Information</Typography>
          
          {/* Profile Picture and Basic Info Container */}
          <Box sx={{ display: 'flex', gap: 8, mb: 5, alignItems: 'flex-start', pb: 5, borderBottom: '1px solid #f0f0f0', flexDirection: { xs: 'column', md: 'row' } }}>
            {/* Basic Info Section */}
            <Grid container spacing={6} sx={{ flex: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, color: '#333', fontSize: '1.0rem' }}>Full Name</Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    size="small"
                    variant="outlined"
                  />
                ) : (
                  <Typography variant="body2" sx={{ fontSize: '0.95rem', color: '#555' }}>{formData.name || 'Not set'}</Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, color: '#333', fontSize: '1.0rem' }}>Email</Typography>
                <Typography variant="body2" sx={{ color: '#666', fontSize: '0.95rem' }}>{formData.email}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, color: '#333', fontSize: '1.0rem' }}>Phone</Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    size="small"
                    variant="outlined"
                  />
                ) : (
                  <Typography variant="body2" sx={{ fontSize: '0.95rem', color: '#555' }}>{formData.phone || 'Not set'}</Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, color: '#333', fontSize: '1.0rem' }}>Location</Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                    size="small"
                    variant="outlined"
                  />
                ) : (
                  <Typography variant="body2" sx={{ fontSize: '0.95rem', color: '#555' }}>{formData.location || 'Not set'}</Typography>
                )}
              </Grid>
            </Grid>

            {/* Profile Picture Section */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', flexShrink: 0 }}>
              <Avatar 
                sx={{ width: 110, height: 110, bgcolor: '#667eea' }}
                src={formData.profilePicture}
              >
                {!formData.profilePicture && (formData.name || formData.email).charAt(0).toUpperCase()}
              </Avatar>
              
              {isEditing && (
                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', width: '100%' }}>
                  <input
                    type="file"
                    id="profilePicture"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <Button
                    variant="contained"
                    component="label"
                    htmlFor="profilePicture"
                    size="small"
                    sx={{ borderRadius: 1, textTransform: 'none', background: '#667eea', fontSize: '0.85rem' }}
                  >
                    <PhotoCameraIcon sx={{ mr: 0.5, fontSize: 16 }} /> Upload
                  </Button>
                  {formData.profilePicture && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setFormData({ ...formData, profilePicture: '' })}
                      sx={{ borderRadius: 1, textTransform: 'none', color: '#d32f2f', borderColor: '#d32f2f', fontSize: '0.85rem' }}
                    >
                      <DeleteIcon sx={{ mr: 0.5, fontSize: 16 }} /> Remove
                    </Button>
                  )}
                  <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.75rem' }}>Max 2MB</Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Bio Section - Full Width */}
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, color: '#333', fontSize: '1.0rem' }}>Bio</Typography>
            {isEditing ? (
              <TextField
                fullWidth
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                size="small"
                variant="outlined"
                multiline
                rows={3}
              />
            ) : (
              <Typography variant="body2" sx={{ fontSize: '0.95rem', color: '#555' }}>{formData.bio || 'Not set'}</Typography>
            )}
          </Box>
        </Paper>

        {/* Professional Information Section */}
        <Paper elevation={0} sx={{ p: 6, borderRadius: 3, border: '1px solid #e0e0e0', background: '#fff', mb: 6 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 5, fontSize: '1.2rem' }}>Professional Information</Typography>
          
          <Grid container spacing={8}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, color: '#333', fontSize: '1.0rem' }}>Current Role</Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  name="currentRole"
                  value={formData.currentRole}
                  onChange={handleChange}
                  placeholder="e.g., Software Engineer"
                  size="small"
                  variant="outlined"
                />
              ) : (
                <Typography variant="body2" sx={{ fontSize: '0.95rem', color: '#555' }}>{formData.currentRole || 'Not set'}</Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, color: '#333', fontSize: '1.0rem' }}>Experience Level</Typography>
              {isEditing ? (
                <Select
                  fullWidth
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  size="small"
                >
                  <MenuItem value="">Select...</MenuItem>
                  <MenuItem value="entry">Entry Level (0-2 years)</MenuItem>
                  <MenuItem value="junior">Junior (2-4 years)</MenuItem>
                  <MenuItem value="mid">Mid Level (4-7 years)</MenuItem>
                  <MenuItem value="senior">Senior (7-10 years)</MenuItem>
                  <MenuItem value="lead">Lead (10+ years)</MenuItem>
                </Select>
              ) : (
                <Typography variant="body2" sx={{ fontSize: '0.95rem', color: '#555' }}>{formData.experience || 'Not set'}</Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, color: '#333', fontSize: '1.0rem' }}>Target Role</Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  name="targetRole"
                  value={formData.targetRole}
                  onChange={handleChange}
                  placeholder="e.g., Senior Developer"
                  size="small"
                  variant="outlined"
                />
              ) : (
                <Typography variant="body2" sx={{ fontSize: '0.95rem', color: '#555' }}>{formData.targetRole || 'Not set'}</Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, color: '#333', fontSize: '1.0rem' }}>Target Salary</Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  name="targetSalary"
                  value={formData.targetSalary}
                  onChange={handleChange}
                  placeholder="e.g., $80k - $120k"
                  size="small"
                  variant="outlined"
                />
              ) : (
                <Typography variant="body2" sx={{ fontSize: '0.95rem', color: '#555' }}>{formData.targetSalary || 'Not set'}</Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={12} md={8}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, color: '#333', fontSize: '1.0rem' }}>Skills</Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="React, Node.js, Python, SQL, etc."
                  size="small"
                  variant="outlined"
                />
              ) : (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {formData.skills ? (
                    formData.skills.split(',').map((skill, index) => (
                      <Chip key={index} label={skill.trim()} size="small" sx={{ background: '#667eea', color: '#fff', fontSize: '0.85rem' }} />
                    ))
                  ) : (
                    <Typography variant="body2" sx={{ fontSize: '0.95rem', color: '#555' }}>Not set</Typography>
                  )}
                </Box>
              )}
            </Grid>
          </Grid>
        </Paper>

        {/* Education Section */}
        <Paper elevation={0} sx={{ p: 6, borderRadius: 3, border: '1px solid #e0e0e0', background: '#fff', mb: 6 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 5, fontSize: '1.2rem' }}>Education</Typography>
          
          <Grid container spacing={8}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, color: '#333', fontSize: '1.0rem' }}>Degree</Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  placeholder="e.g., Bachelor's in CS"
                  size="small"
                  variant="outlined"
                />
              ) : (
                <Typography variant="body2" sx={{ fontSize: '0.95rem', color: '#555' }}>{formData.education || 'Not set'}</Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, color: '#333', fontSize: '1.0rem' }}>University</Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  placeholder="University name"
                  size="small"
                  variant="outlined"
                />
              ) : (
                <Typography variant="body2" sx={{ fontSize: '0.95rem', color: '#555' }}>{formData.university || 'Not set'}</Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, color: '#333', fontSize: '1.0rem' }}>Graduation Year</Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  placeholder="2020"
                  size="small"
                  variant="outlined"
                />
              ) : (
                <Typography variant="body2" sx={{ fontSize: '0.95rem', color: '#555' }}>{formData.graduationYear || 'Not set'}</Typography>
              )}
            </Grid>
          </Grid>
        </Paper>

        {/* Job Preferences Section */}
        <Paper elevation={0} sx={{ p: 6, borderRadius: 3, border: '1px solid #e0e0e0', background: '#fff', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 5, fontSize: '1.2rem' }}>Job Search Preferences</Typography>
          
          <Grid container spacing={8}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, color: '#333', fontSize: '1.0rem' }}>Job Type</Typography>
              {isEditing ? (
                <Select
                  fullWidth
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  size="small"
                >
                  <MenuItem value="">Select...</MenuItem>
                  <MenuItem value="full-time">Full-time</MenuItem>
                  <MenuItem value="part-time">Part-time</MenuItem>
                  <MenuItem value="contract">Contract</MenuItem>
                  <MenuItem value="freelance">Freelance</MenuItem>
                </Select>
              ) : (
                <Typography variant="body2" sx={{ fontSize: '0.95rem', color: '#555' }}>{formData.jobType || 'Not set'}</Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, color: '#333', fontSize: '1.0rem' }}>Work Mode</Typography>
              {isEditing ? (
                <Select
                  fullWidth
                  name="workMode"
                  value={formData.workMode}
                  onChange={handleChange}
                  size="small"
                >
                  <MenuItem value="">Select...</MenuItem>
                  <MenuItem value="remote">Remote</MenuItem>
                  <MenuItem value="hybrid">Hybrid</MenuItem>
                  <MenuItem value="onsite">On-site</MenuItem>
                </Select>
              ) : (
                <Typography variant="body2" sx={{ fontSize: '0.95rem', color: '#555' }}>{formData.workMode || 'Not set'}</Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, color: '#333', fontSize: '1.0rem' }}>Availability</Typography>
              {isEditing ? (
                <Select
                  fullWidth
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  size="small"
                >
                  <MenuItem value="">Select...</MenuItem>
                  <MenuItem value="immediate">Immediate</MenuItem>
                  <MenuItem value="2weeks">2 Weeks Notice</MenuItem>
                  <MenuItem value="1month">1 Month</MenuItem>
                  <MenuItem value="flexible">Flexible</MenuItem>
                </Select>
              ) : (
                <Typography variant="body2" sx={{ fontSize: '0.95rem', color: '#555' }}>{formData.availability || 'Not set'}</Typography>
              )}
            </Grid>
          </Grid>
        </Paper>
      </form>

      {toast && (
        <Toast 
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </Container>
  );
}

export default Profile;