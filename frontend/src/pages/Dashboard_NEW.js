import { useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  Avatar,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Assessment as AssessmentIcon,
  Send as SendIcon,
  Computer as ComputerIcon,
  CheckCircle as CheckCircleIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Update as UpdateIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import AddApplication from '../components/AddApplication';
import JobSuggestions from '../components/JobSuggestions';
import './Dashboard.css';

function Dashboard() {
  const { token } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data.applications);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  }, [token, API_URL]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleApplicationAdded = (newApp) => {
    setApplications([newApp, ...applications]);
    setShowAddModal(false);
  };

  // Get recent applications (last 5)
  const recentApplications = applications.slice(0, 5);

  // Status badge colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'offer': return 'success';
      case 'rejected': return 'error';
      case 'applied': return 'info';
      case 'phone_screen':
      case 'technical':
      case 'onsite': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* TOP ROW - 4 STAT CARDS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Applications */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#fff3e0', width: 56, height: 56, mr: 2 }}>
                  <AssessmentIcon sx={{ color: '#ff9800', fontSize: 32 }} />
                </Avatar>
                <Box sx={{ flex: 1, textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary">Number</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>{applications.length}</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                <UpdateIcon sx={{ fontSize: 14, mr: 0.5 }} /> Total Apps
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Applied */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#e8f5e9', width: 56, height: 56, mr: 2 }}>
                  <SendIcon sx={{ color: '#66bb6a', fontSize: 32 }} />
                </Avatar>
                <Box sx={{ flex: 1, textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary">Applied</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {applications.filter(app => app.status === 'applied').length}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                <CalendarIcon sx={{ fontSize: 14, mr: 0.5 }} /> Last day
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* In Interview */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#ffebee', width: 56, height: 56, mr: 2 }}>
                  <ComputerIcon sx={{ color: '#ef5350', fontSize: 32 }} />
                </Avatar>
                <Box sx={{ flex: 1, textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary">Interviews</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {applications.filter(app => ['phone_screen', 'technical', 'onsite'].includes(app.status)).length}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                <UpdateIcon sx={{ fontSize: 14, mr: 0.5 }} /> In Progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Offers */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#e3f2fd', width: 56, height: 56, mr: 2 }}>
                  <CheckCircleIcon sx={{ color: '#42a5f5', fontSize: 32 }} />
                </Avatar>
                <Box sx={{ flex: 1, textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary">Offers</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {applications.filter(app => app.status === 'offer').length}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                <UpdateIcon sx={{ fontSize: 14, mr: 0.5 }} /> Received
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* BOTTOM ROW - JOB SUGGESTIONS (LEFT) AND RECENT APPLICATIONS (RIGHT) */}
      <Grid container spacing={3}>
        {/* Left - Job Suggestions */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0', background: '#fff', minHeight: 500 }}>
            <JobSuggestions />
          </Paper>
        </Grid>

        {/* Right - Recent Applications */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0', background: '#fff', minHeight: 500 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Recent Applications</Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => setShowAddModal(true)}
                size="small"
                sx={{ borderRadius: 2, textTransform: 'none', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                Add
              </Button>
            </Box>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
            ) : recentApplications.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <BusinessIcon sx={{ fontSize: 64, color: '#e0e0e0', mb: 2 }} />
                <Typography>No applications yet</Typography>
                <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setShowAddModal(true)} sx={{ mt: 2 }}>
                  Add your first application
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentApplications.map((app) => (
                  <Card key={app.id} elevation={0} sx={{ border: '1px solid #f0f0f0', borderRadius: 2 }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 40, height: 40, bgcolor: '#f5f5f5' }}>
                          <BusinessIcon fontSize="small" />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{app.company}</Typography>
                          <Typography variant="caption" color="text.secondary">{app.position}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5 }}>
                        <Chip label={app.status} color={getStatusColor(app.status)} size="small" />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {showAddModal && <AddApplication onApplicationAdded={handleApplicationAdded} onClose={() => setShowAddModal(false)} />}
    </Container>
  );
}

export default Dashboard;
