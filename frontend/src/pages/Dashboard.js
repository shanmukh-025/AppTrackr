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
  TrendingUp as TrendingUpIcon,
  Update as UpdateIcon,
  Favorite as FavoriteIcon,
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

      {/* Quick Stats - Top Row (4 Cards) */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Applications Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={0}
            sx={{ 
              height: '100%',
              minHeight: 160,
              display: 'flex',
              flexDirection: 'column',
              background: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { 
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
              }
            }}
          >
            <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: '#fff3e0', 
                    width: 56, 
                    height: 56,
                    mr: 2
                  }}
                >
                  <AssessmentIcon sx={{ color: '#ff9800', fontSize: 32 }} />
                </Avatar>
                <Box sx={{ flex: 1, textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, whiteSpace: 'nowrap' }}>
                    Total Applications Now
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#424242' }}>
                    {applications.length}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', color: '#9e9e9e', fontSize: '0.875rem' }}>
                <UpdateIcon sx={{ fontSize: 16, mr: 0.5 }} />
                Update Now
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Applied Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={0}
            sx={{ 
              height: '100%',
              minHeight: 160,
              display: 'flex',
              flexDirection: 'column',
              background: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { 
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
              }
            }}
          >
            <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: '#e8f5e9', 
                    width: 56, 
                    height: 56,
                    mr: 2
                  }}
                >
                  <SendIcon sx={{ color: '#66bb6a', fontSize: 32 }} />
                </Avatar>
                <Box sx={{ flex: 1, textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, whiteSpace: 'nowrap' }}>
                    Total Applied Till Now
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#424242' }}>
                    {applications.filter(app => app.status === 'applied').length}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', color: '#9e9e9e', fontSize: '0.875rem' }}>
                <CalendarIcon sx={{ fontSize: 16, mr: 0.5 }} />
                Last day
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* In Interview Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={0}
            sx={{ 
              height: '100%',
              minHeight: 160,
              display: 'flex',
              flexDirection: 'column',
              background: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { 
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
              }
            }}
          >
            <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: '#fff3e0', 
                    width: 56, 
                    height: 56,
                    mr: 2
                  }}
                >
                  <ComputerIcon sx={{ color: '#ff9800', fontSize: 32 }} />
                </Avatar>
                <Box sx={{ flex: 1, textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, whiteSpace: 'nowrap' }}>
                    Total Interviews  Held
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#424242' }}>
                    {applications.filter(app => 
                      ['phone_screen', 'technical', 'onsite'].includes(app.status)
                    ).length}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', color: '#9e9e9e', fontSize: '0.875rem' }}>
                <UpdateIcon sx={{ fontSize: 16, mr: 0.5 }} />
                In Progress
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Offers Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={0}
            sx={{ 
              height: '100%',
              minHeight: 160,
              display: 'flex',
              flexDirection: 'column',
              background: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { 
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
              }
            }}
          >
            <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: '#e3f2fd', 
                    width: 56, 
                    height: 56,
                    mr: 2
                  }}
                >
                  <CheckCircleIcon sx={{ color: '#42a5f5', fontSize: 32 }} />
                </Avatar>
                <Box sx={{ flex: 1, textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, whiteSpace: 'nowrap' }}>
                    Total Offers  Received 
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#424242' }}>
                    {applications.filter(app => app.status === 'offer').length}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', color: '#9e9e9e', fontSize: '0.875rem' }}>
                <UpdateIcon sx={{ fontSize: 16, mr: 0.5 }} />
                Received
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content - Two Columns */}
      <Grid container spacing={3}>
        {/* Left Column - Job Suggestions (8 columns) */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              borderRadius: 2,
              border: '1px solid #e0e0e0',
              background: '#fff',
              minHeight: 500
            }}
          >
            <JobSuggestions />
          </Paper>
        </Grid>

        {/* Right Column - Recent Applications (4 columns) */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              borderRadius: 2,
              border: '1px solid #e0e0e0',
              background: '#fff',
              minHeight: 500
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#424242' }}>
                Recent Applications
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => setShowAddModal(true)}
                size="small"
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  }
                }}
              >
                Add
              </Button>
            </Box>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : recentApplications.length === 0 ? (
              <Box sx={{ 
                textAlign: 'center', 
                py: 8,
                color: 'text.secondary' 
              }}>
                <BusinessIcon sx={{ fontSize: 64, color: '#e0e0e0', mb: 2 }} />
                <Typography variant="body1">
                  No applications yet
                </Typography>
                <Button 
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setShowAddModal(true)}
                  sx={{ mt: 2, borderRadius: 2, textTransform: 'none' }}
                >
                  Add your first application
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentApplications.map((app) => (
                  <Card 
                    key={app.id}
                    elevation={0}
                    sx={{ 
                      border: '1px solid #f0f0f0',
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': { 
                        borderColor: '#667eea',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {app.logoUrl ? (
                          <Avatar 
                            src={app.logoUrl} 
                            alt={app.company}
                            sx={{ width: 40, height: 40 }}
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        ) : (
                          <Avatar 
                            sx={{ 
                              width: 40, 
                              height: 40, 
                              bgcolor: '#f5f5f5',
                              color: '#667eea'
                            }}
                          >
                            <BusinessIcon fontSize="small" />
                          </Avatar>
                        )}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontWeight: 600,
                              color: '#424242',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {app.company}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ 
                              display: 'block',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {app.position}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5 }}>
                        <Chip 
                          label={app.status}
                          color={getStatusColor(app.status)}
                          size="small"
                          sx={{ 
                            borderRadius: 1.5,
                            height: 24,
                            fontSize: '0.75rem',
                            fontWeight: 500
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(app.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
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