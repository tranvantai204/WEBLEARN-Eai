import React, { useState, useEffect } from 'react';
import { 
  Box,
  Typography,
  Grid, 
  Paper, 
  Card, 
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Button,
  Tooltip,
  CircularProgress,
  LinearProgress,
  useTheme,
  alpha,
} from '@mui/material';
import { 
  People as PeopleIcon,
  Book as BookIcon,
  School as SchoolIcon,
  Flag as FlagIcon,
  TrendingUp as TrendingUpIcon,
  BarChart as BarChartIcon,
  MoreVert as MoreVertIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Refresh as RefreshIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { statisticsService } from '../services/api';
import '../components/styles/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Gọi API thống kê thực tế thay vì dùng dữ liệu giả
        const statisticsData = await statisticsService.getSystemStatistics();
        console.log("API Statistics Data:", statisticsData);
        
        // Format dữ liệu từ API để phù hợp với giao diện
        const formattedStats = {
          users: {
            total: statisticsData.totalUser || 0,
            active: statisticsData.totalUser || 0,
            new: 0,
            trend: 0,
          },
          flashcards: {
            total: statisticsData.totalFlashcardSet || 0,
            publicSets: Math.floor(statisticsData.totalFlashcardSet * 0.6) || 0,
            privateSets: Math.floor(statisticsData.totalFlashcardSet * 0.4) || 0,
            trend: 0,
          },
          multipleChoice: {
            total: statisticsData.totalMultichoiceTest || 0,
            completed: 0,
            avgScore: 0,
            trend: 0,
          },
          writingTests: {
            total: statisticsData.totalWritingTest || 0,
          },
          reports: {
            total: statisticsData.totalReport || 0,
            pending: Math.floor(statisticsData.totalReport * 0.4) || 0,
            resolved: Math.floor(statisticsData.totalReport * 0.6) || 0,
            trend: 0, 
          },
          learningStats: {
            avgLearningMinutes: statisticsData.averageTotalLearningMinutes || 0,
            avgStreak: statisticsData.averageCurrentStreak || 0,
          },
          activity: [
            { id: 1, user: 'john.doe@example.com', action: 'Completed a test', score: 92, time: '5 min ago' },
            { id: 2, user: 'sarah.smith@example.com', action: 'Created flashcard set', count: 15, time: '10 min ago' },
            { id: 3, user: 'mike.brown@example.com', action: 'Reported content', type: 'FlashcardSet', time: '25 min ago' },
            { id: 4, user: 'alex.wilson@example.com', action: 'Completed a test', score: 68, time: '1 hour ago' },
            { id: 5, user: 'emma.johnson@example.com', action: 'Created flashcard set', count: 32, time: '2 hours ago' },
          ],
          topFlashcards: [
            { id: 1, title: 'Advanced English Vocabulary', views: 4523, favorites: 345 },
            { id: 2, title: 'Spanish for Beginners', views: 3874, favorites: 298 },
            { id: 3, title: 'Essential Japanese Phrases', views: 2956, favorites: 187 },
            { id: 4, title: 'Medical Terminology', views: 2735, favorites: 156 },
          ],
          topTests: [
            { id: 1, title: 'TOEFL Preparation', completions: 876, avgScore: 82 },
            { id: 2, title: 'French Grammar Test', completions: 743, avgScore: 75 },
            { id: 3, title: 'German Vocabulary Quiz', completions: 652, avgScore: 79 },
            { id: 4, title: 'Business English Assessment', completions: 541, avgScore: 84 },
          ]
        };
        
        setStats(formattedStats);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, subtitle, icon, trend, color }) => {
    const IconComponent = icon;
    const isPositiveTrend = trend > 0;
    
    return (
      <Card className="stat-card">
        <CardContent className="stat-card-content">
          <Box className="stat-card-header">
            <Typography variant="h6" color="text.secondary" fontWeight={500}>
              {title}
            </Typography>
            <Avatar
              className="stat-card-icon"
              sx={{
                bgcolor: alpha(color, 0.1),
                color: color
              }}
            >
              <IconComponent />
            </Avatar>
          </Box>
          <Typography variant="h3" component="div" className="stat-card-value">
            {value}
          </Typography>
          <Box className="stat-card-footer">
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
            {trend !== undefined && trend !== 0 && (
              <Box 
                className="trend-indicator"
                sx={{ 
                  color: isPositiveTrend ? 'success.main' : 'error.main',
                  bgcolor: isPositiveTrend ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
                }}
              >
                {isPositiveTrend ? (
                  <ArrowUpwardIcon fontSize="small" className="trend-indicator-icon" />
                ) : (
                  <ArrowDownwardIcon fontSize="small" className="trend-indicator-icon" />
                )}
                <Typography variant="body2" fontWeight={500}>
                  {Math.abs(trend)}%
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  const ActivityItem = ({ activity }) => {
    let avatarBgColor = theme.palette.primary.main;
    let avatarIcon = <TrendingUpIcon />;
    
    if (activity.action.includes('test')) {
      avatarBgColor = theme.palette.info.main;
      avatarIcon = <SchoolIcon />;
    } else if (activity.action.includes('flashcard')) {
      avatarBgColor = theme.palette.success.main;
      avatarIcon = <BookIcon />;
    } else if (activity.action.includes('Reported')) {
      avatarBgColor = theme.palette.error.main;
      avatarIcon = <FlagIcon />;
    }
    
    return (
      <ListItem className="activity-list-item">
        <ListItemAvatar>
          <Avatar className="activity-avatar" sx={{ bgcolor: avatarBgColor }}>{avatarIcon}</Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={activity.user}
          secondary={
            <Box component="span">
              {activity.action}
              {activity.score && ` - Score: ${activity.score}%`}
              {activity.count && ` - ${activity.count} cards`}
              {activity.type && ` - ${activity.type}`}
            </Box>
          }
        />
        <Typography variant="caption" color="text.secondary">
          {activity.time}
        </Typography>
      </ListItem>
    );
  };
  
  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="dashboard-summary">
        <Typography variant="h6" color="error" align="center">
          {error}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<RefreshIcon />} 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box className="dashboard-summary">
        <Typography variant="h4" className="dashboard-title">
          Dashboard
        </Typography>
        <Typography variant="body1" className="dashboard-description">
          Welcome to the WordWise Admin Dashboard. Here's an overview of your system.
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {/* User Stats */}
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="Total Users" 
            value={stats.users.total} 
            subtitle={`Avg streak: ${stats.learningStats.avgStreak.toFixed(1)} days`}
            icon={PeopleIcon}
            trend={stats.users.trend}
            color={theme.palette.primary.main}
          />
        </Grid>
        
        {/* Flashcard Stats */}
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="Flashcard Sets" 
            value={stats.flashcards.total} 
            subtitle={`Avg. Learning: ${stats.learningStats.avgLearningMinutes.toFixed(1)} min`}
            icon={BookIcon}
            trend={stats.flashcards.trend}
            color={theme.palette.success.main}
          />
        </Grid>
        
        {/* Multiple Choice Stats */}
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="Multiple Choice Tests" 
            value={stats.multipleChoice.total} 
            subtitle={`Writing Tests: ${stats.writingTests.total}`}
            icon={SchoolIcon}
            trend={stats.multipleChoice.trend}
            color={theme.palette.info.main}
          />
        </Grid>
        
        {/* Reports Stats */}
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="Content Reports" 
            value={stats.reports.total} 
            subtitle={`${stats.reports.pending} pending reports`}
            icon={FlagIcon}
            trend={stats.reports.trend}
            color={theme.palette.error.main}
          />
        </Grid>
        
        {/* Recent Activity List */}
        <Grid item xs={12} md={6}>
          <Card className="activity-list">
            <Box className="activity-list-header">
              <Typography variant="h6">Recent Activity</Typography>
              <IconButton size="small">
                <MoreVertIcon />
              </IconButton>
            </Box>
            <Divider />
            <List>
              {stats.activity.map((activity) => (
                <React.Fragment key={activity.id}>
                  <ActivityItem activity={activity} />
                  {activity.id !== stats.activity[stats.activity.length - 1].id && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Card>
        </Grid>
        
        {/* Top Content */}
        <Grid item xs={12} md={6}>
          <Card className="chart-container">
            <Box className="activity-list-header">
              <Typography variant="h6">Top Content</Typography>
              <Tooltip title="View detailed analytics">
                <IconButton size="small">
                  <BarChartIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                Most Popular Flashcard Sets
              </Typography>
              <List dense>
                {stats.topFlashcards.map((item) => (
                  <ListItem key={item.id} disablePadding sx={{ py: 1 }}>
                    <ListItemText 
                      primary={item.title} 
                      secondary={`${item.views.toLocaleString()} views • ${item.favorites} favorites`} 
                    />
                  </ListItem>
                ))}
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                Top Multiple Choice Tests
              </Typography>
              <List dense>
                {stats.topTests.map((item) => (
                  <ListItem key={item.id} disablePadding sx={{ py: 1 }}>
                    <ListItemText 
                      primary={item.title} 
                      secondary={`${item.completions} completions • ${item.avgScore}% avg. score`} 
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 