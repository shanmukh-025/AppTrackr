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
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Assessment as AssessmentIcon,
  Send as SendIcon,
  Computer as ComputerIcon,
  CheckCircle as CheckCircleIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
            🏠 Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back! Here's your application overview
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setShowAddModal(true)}
          size="large"
          sx={{ borderRadius: 2, px: 3 }}
        >
          Add Application
        </Button>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              height: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <AssessmentIcon fontSize="large" />
                </Avatar>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {applications.length}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Total Applications
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              height: '100%',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <SendIcon fontSize="large" />
                </Avatar>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {applications.filter(app => app.status === 'applied').length}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Applied
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              height: '100%',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <ComputerIcon fontSize="large" />
                </Avatar>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {applications.filter(app => 
                    ['phone_screen', 'technical', 'onsite'].includes(app.status)
                  ).length}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                In Interview
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              height: '100%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <CheckCircleIcon fontSize="large" />
                </Avatar>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {applications.filter(app => app.status === 'offer').length}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Offers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Job Suggestions */}
      <Box sx={{ mb: 4 }}>
        <JobSuggestions />
      </Box>

      {/* Recent Applications */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Recent Applications
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : recentApplications.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            No applications yet. Add your first one!
          </Alert>
        ) : (
          <Grid container spacing={2}>
            {recentApplications.map((app) => (
              <Grid item xs={12} key={app.id}>
                <Card 
                  sx={{ 
                    transition: 'all 0.2s',
                    '&:hover': { 
                      boxShadow: 4,
                      transform: 'translateX(4px)'
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {app.logoUrl ? (
                          <Avatar 
                            src={app.logoUrl} 
                            alt={app.company}
                            sx={{ width: 48, height: 48 }}
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        ) : (
                          <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}>
                            <BusinessIcon />
                          </Avatar>
                        )}
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {app.company}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {app.position}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip 
                          label={app.status}
                          color={getStatusColor(app.status)}
                          size="small"
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                          <CalendarIcon fontSize="small" />
                          <Typography variant="body2">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Follow-ups Section */}
      <Paper sx={{ p: 3, borderRadius: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Follow-Ups
        </Typography>
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          🚧 Coming soon! Track companies you need to follow up with.
        </Alert>
      </Paper>

      {showAddModal && (
        <AddApplication 
          onApplicationAdded={handleApplicationAdded}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </Container>
  );
}

export default Dashboard;