import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Pagination,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { flashCardService } from '../services/api';

const UserFlashcards = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [userData, setUserData] = useState(null);

  const fetchFlashcardSets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await flashCardService.getUserFlashcardSets(userId, page, itemsPerPage);
      setFlashcardSets(response.data);
      setTotalPages(Math.ceil(response.totalItems / itemsPerPage));
      
      // If we don't have user data yet, we can extract it from the response
      if (!userData && response.userData) {
        setUserData(response.userData);
      }
    } catch (err) {
      console.error("Error fetching flashcard sets:", err);
      setError(err.response?.data?.message || "Failed to load flashcard sets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFlashcardSets();
    }
  }, [userId, page, itemsPerPage]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setPage(1); // Reset to first page when changing items per page
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleViewFlashcardSet = (setId) => {
    // Navigate to flashcard set detail page
    navigate(`/flashcard-sets/${setId}`);
  };

  if (loading && !flashcardSets.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleGoBack}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4">User Flashcard Sets</Typography>
      </Box>

      {userData && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6">{userData.name}</Typography>
          <Typography variant="body1" color="text.secondary">
            {userData.email}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Role: <Chip label={userData.role} size="small" />
          </Typography>
        </Paper>
      )}

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Items per page</InputLabel>
          <Select
            value={itemsPerPage}
            label="Items per page"
            onChange={handleItemsPerPageChange}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {flashcardSets.length === 0 && !loading ? (
        <Alert severity="info">No flashcard sets found for this user.</Alert>
      ) : (
        <Grid container spacing={3}>
          {flashcardSets.map((set) => (
            <Grid item xs={12} sm={6} md={4} key={set.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" noWrap>{set.title}</Typography>
                    <Chip 
                      label={set.isPublic ? "Public" : "Private"} 
                      color={set.isPublic ? "success" : "default"} 
                      size="small" 
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {set.description}
                  </Typography>
                  <Typography variant="body2">
                    Cards: {set.cardsCount}
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    Created: {new Date(set.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    startIcon={<VisibilityIcon />}
                    size="small"
                    onClick={() => handleViewFlashcardSet(set.id)}
                  >
                    View
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {totalPages > 1 && (
        <Stack spacing={2} sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange} 
            color="primary" 
          />
        </Stack>
      )}
    </Box>
  );
};

export default UserFlashcards; 