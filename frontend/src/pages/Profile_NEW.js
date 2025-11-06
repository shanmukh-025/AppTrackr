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
  CircularProgress,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Briefcase as BriefcaseIcon,
} from '@mui/icons-material';
import './Profile.css';

function Profile() {
  const { token, user: authUser, refreshUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
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
    profilePicture: ''
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

    if (file.size > 2 * 1024 * 1024) {
      setToast({ message: 'Image size must be less than 2MB', type: 'error' });
      return;
    }

    if (!file.type.startsWith('image/')) {
      setToast({ message: 'Please upload an image file', type: 'error' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData({ ...formData, profilePicture: e.target.result });
      setToast({ message: 'Image uploaded successfully', type: 'success' });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await axios.put(`${API_URL}/api/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setToast({ message: 'Profile updated successfully!', type: 'success' });
      setIsEditing(false);
      refreshUser();
    } catch (error) {
      setToast({ message: 'Failed to update profile: ' + (error.response?.data?.message || error.message), type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* HEADER CARD - Profile Summary */}
      <Card elevation={0} sx={{ mb: 4, background: '#fff', border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            {/* Left: Avatar & Basic Info */}
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', flex: 1, minWidth: 300 }}>
              <Avatar
                sx={{ width: 120, height: 120, bgcolor: '#667eea', fontSize: 48, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                src={formData.profilePicture}
              >
                {!formData.profilePicture && (formData.name || formData.email).charAt(0).toUpperCase()}
              </Avatar>

              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  {formData.name || 'Complete your profile'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {formData.currentRole || 'No role set'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {formData.location && <Chip label={formData.location} size="small" variant="outlined" sx={{ borderRadius: 1 }} />}
                  {formData.experience && <Chip label={formData.experience} size="small" variant="outlined" sx={{ borderRadius: 1 }} />}
                  {formData.availability && <Chip label={formData.availability} size="small" variant="outlined" sx={{ borderRadius: 1 }} />}
                </Box>
              </Box>
            </Box>

            {/* Right: Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {isEditing ? (
                <>
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
                    sx={{ borderRadius: 2, textTransform: 'none', background: '#667eea' }}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                  sx={{ borderRadius: 2, textTransform: 'none', background: '#667eea' }}
                >
                  Edit Profile
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* MAIN CONTENT - Form Sections */}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* SECTION 1: Personal Information */}
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 2, height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, pb: 2, borderBottom: '1px solid #f0f0f0' }}>
                  <PersonIcon sx={{ color: '#667eea', fontSize: 24 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Personal Info</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Profile Picture Upload */}
                  {isEditing && (
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#555' }}>Profile Picture</Typography>
                      <input
                        type="file"
                        id="profilePicture"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          component="label"
                          htmlFor="profilePicture"
                          size="small"
                          sx={{ borderRadius: 1, textTransform: 'none', background: '#667eea' }}
                        >
                          <PhotoCameraIcon sx={{ mr: 1, fontSize: 16 }} /> Upload
                        </Button>
                        {formData.profilePicture && (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setFormData({ ...formData, profilePicture: '' })}
                            sx={{ borderRadius: 1, textTransform: 'none', color: '#d32f2f', borderColor: '#d32f2f' }}
                          >
                            <DeleteIcon sx={{ fontSize: 16 }} />
                          </Button>
                        )}
                      </Box>
                      <Typography variant="caption" color="text.secondary">Max 2MB • JPG, PNG</Typography>
                    </Box>
                  )}

                  {/* Name */}
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#555' }}>Full Name</Typography>
                    {isEditing ? (
                      <TextField fullWidth name="name" value={formData.name} onChange={handleChange} size="small" variant="outlined" placeholder="John Doe" />
                    ) : (
                      <Typography variant="body2" sx={{ color: formData.name ? '#333' : '#999' }}>
                        {formData.name || 'Not set'}
                      </Typography>
                    )}
                  </Box>

                  {/* Email */}
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#555' }}>Email</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>{formData.email}</Typography>
                  </Box>

                  {/* Phone */}
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#555' }}>Phone</Typography>
                    {isEditing ? (
                      <TextField fullWidth type="tel" name="phone" value={formData.phone} onChange={handleChange} size="small" variant="outlined" placeholder="+1 (555) 123-4567" />
                    ) : (
                      <Typography variant="body2" sx={{ color: formData.phone ? '#333' : '#999' }}>
                        {formData.phone || 'Not set'}
                      </Typography>
                    )}
                  </Box>

                  {/* Location */}
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#555' }}>Location</Typography>
                    {isEditing ? (
                      <TextField fullWidth name="location" value={formData.location} onChange={handleChange} size="small" variant="outlined" placeholder="San Francisco, CA" />
                    ) : (
                      <Typography variant="body2" sx={{ color: formData.location ? '#333' : '#999' }}>
                        {formData.location || 'Not set'}
                      </Typography>
                    )}
                  </Box>

                  {/* Bio */}
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#555' }}>Bio</Typography>
                    {isEditing ? (
                      <TextField fullWidth name="bio" value={formData.bio} onChange={handleChange} size="small" variant="outlined" multiline rows={3} placeholder="Tell us about yourself..." />
                    ) : (
                      <Typography variant="body2" sx={{ color: formData.bio ? '#333' : '#999' }}>
                        {formData.bio || 'Not set'}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* SECTION 2: Professional Info */}
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 2, height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, pb: 2, borderBottom: '1px solid #f0f0f0' }}>
                  <WorkIcon sx={{ color: '#667eea', fontSize: 24 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Professional</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Current Role */}
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#555' }}>Current Role</Typography>
                    {isEditing ? (
                      <TextField fullWidth name="currentRole" value={formData.currentRole} onChange={handleChange} size="small" variant="outlined" placeholder="e.g., Software Engineer" />
                    ) : (
                      <Typography variant="body2" sx={{ color: formData.currentRole ? '#333' : '#999' }}>
                        {formData.currentRole || 'Not set'}
                      </Typography>
                    )}
                  </Box>

                  {/* Experience */}
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#555' }}>Experience Level</Typography>
                    {isEditing ? (
                      <Select fullWidth name="experience" value={formData.experience} onChange={handleChange} size="small">
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="entry">Entry Level (0-2 years)</MenuItem>
                        <MenuItem value="junior">Junior (2-4 years)</MenuItem>
                        <MenuItem value="mid">Mid Level (4-7 years)</MenuItem>
                        <MenuItem value="senior">Senior (7-10 years)</MenuItem>
                        <MenuItem value="lead">Lead (10+ years)</MenuItem>
                      </Select>
                    ) : (
                      <Typography variant="body2" sx={{ color: formData.experience ? '#333' : '#999' }}>
                        {formData.experience || 'Not set'}
                      </Typography>
                    )}
                  </Box>

                  {/* Target Role */}
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#555' }}>Target Role</Typography>
                    {isEditing ? (
                      <TextField fullWidth name="targetRole" value={formData.targetRole} onChange={handleChange} size="small" variant="outlined" placeholder="e.g., Senior Developer" />
                    ) : (
                      <Typography variant="body2" sx={{ color: formData.targetRole ? '#333' : '#999' }}>
                        {formData.targetRole || 'Not set'}
                      </Typography>
                    )}
                  </Box>

                  {/* Target Salary */}
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#555' }}>Target Salary</Typography>
                    {isEditing ? (
                      <TextField fullWidth name="targetSalary" value={formData.targetSalary} onChange={handleChange} size="small" variant="outlined" placeholder="e.g., $80k - $120k" />
                    ) : (
                      <Typography variant="body2" sx={{ color: formData.targetSalary ? '#333' : '#999' }}>
                        {formData.targetSalary || 'Not set'}
                      </Typography>
                    )}
                  </Box>

                  {/* Skills */}
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#555' }}>Skills</Typography>
                    {isEditing ? (
                      <TextField fullWidth name="skills" value={formData.skills} onChange={handleChange} size="small" variant="outlined" placeholder="React, Node.js, Python, SQL..." />
                    ) : (
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {formData.skills ? (
                          formData.skills.split(',').map((skill, idx) => (
                            <Chip key={idx} label={skill.trim()} size="small" sx={{ background: '#e0e7ff', color: '#667eea' }} />
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">Not set</Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* SECTION 3: Education */}
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 2, height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, pb: 2, borderBottom: '1px solid #f0f0f0' }}>
                  <SchoolIcon sx={{ color: '#667eea', fontSize: 24 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Education</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Degree */}
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#555' }}>Degree</Typography>
                    {isEditing ? (
                      <TextField fullWidth name="education" value={formData.education} onChange={handleChange} size="small" variant="outlined" placeholder="e.g., Bachelor's in CS" />
                    ) : (
                      <Typography variant="body2" sx={{ color: formData.education ? '#333' : '#999' }}>
                        {formData.education || 'Not set'}
                      </Typography>
                    )}
                  </Box>

                  {/* University */}
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#555' }}>University</Typography>
                    {isEditing ? (
                      <TextField fullWidth name="university" value={formData.university} onChange={handleChange} size="small" variant="outlined" placeholder="University name" />
                    ) : (
                      <Typography variant="body2" sx={{ color: formData.university ? '#333' : '#999' }}>
                        {formData.university || 'Not set'}
                      </Typography>
                    )}
                  </Box>

                  {/* Graduation Year */}
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#555' }}>Graduation Year</Typography>
                    {isEditing ? (
                      <TextField fullWidth name="graduationYear" value={formData.graduationYear} onChange={handleChange} size="small" variant="outlined" placeholder="2024" />
                    ) : (
                      <Typography variant="body2" sx={{ color: formData.graduationYear ? '#333' : '#999' }}>
                        {formData.graduationYear || 'Not set'}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* SECTION 4: Preferences */}
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 2, height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, pb: 2, borderBottom: '1px solid #f0f0f0' }}>
                  <BriefcaseIcon sx={{ color: '#667eea', fontSize: 24 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Preferences</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Job Type */}
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#555' }}>Job Type</Typography>
                    {isEditing ? (
                      <Select fullWidth name="jobType" value={formData.jobType} onChange={handleChange} size="small">
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="full-time">Full Time</MenuItem>
                        <MenuItem value="part-time">Part Time</MenuItem>
                        <MenuItem value="contract">Contract</MenuItem>
                        <MenuItem value="freelance">Freelance</MenuItem>
                      </Select>
                    ) : (
                      <Typography variant="body2" sx={{ color: formData.jobType ? '#333' : '#999' }}>
                        {formData.jobType || 'Not set'}
                      </Typography>
                    )}
                  </Box>

                  {/* Work Mode */}
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#555' }}>Work Mode</Typography>
                    {isEditing ? (
                      <Select fullWidth name="workMode" value={formData.workMode} onChange={handleChange} size="small">
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="remote">Remote</MenuItem>
                        <MenuItem value="on-site">On-Site</MenuItem>
                        <MenuItem value="hybrid">Hybrid</MenuItem>
                      </Select>
                    ) : (
                      <Typography variant="body2" sx={{ color: formData.workMode ? '#333' : '#999' }}>
                        {formData.workMode || 'Not set'}
                      </Typography>
                    )}
                  </Box>

                  {/* Availability */}
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#555' }}>Availability</Typography>
                    {isEditing ? (
                      <Select fullWidth name="availability" value={formData.availability} onChange={handleChange} size="small">
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="immediately">Immediately</MenuItem>
                        <MenuItem value="2-weeks">2 Weeks</MenuItem>
                        <MenuItem value="1-month">1 Month</MenuItem>
                        <MenuItem value="3-months">3 Months</MenuItem>
                      </Select>
                    ) : (
                      <Typography variant="body2" sx={{ color: formData.availability ? '#333' : '#999' }}>
                        {formData.availability || 'Not set'}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </Container>
  );
}

export default Profile;
