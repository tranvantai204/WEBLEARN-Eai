import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { flashCardService } from '../services/api';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Tooltip,
  IconButton,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Rating,
} from '@mui/material';
import {
  Language as LanguageIcon,
  CalendarToday as CalendarTodayIcon,
  Person as PersonIcon,
  Info as InfoIcon,
  LibraryBooks as LibraryBooksIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  VolumeUp as VolumeUpIcon,
  Star as StarIcon,
  Public as PublicIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const FlashcardSetDetails = () => {
  const { flashcardSetId } = useParams();
  const navigate = useNavigate();
  const [flashcardSet, setFlashcardSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchFlashcardSetDetails = async () => {
      if (!flashcardSetId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await flashCardService.getFlashcardSetDetails(flashcardSetId);
        console.log('Flashcard set details:', data);
        setFlashcardSet(data);
      } catch (err) {
        console.error('Error fetching flashcard set details:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load flashcard set details';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcardSetDetails();
  }, [flashcardSetId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Button variant="outlined" onClick={handleBack} sx={{ mb: 2 }}>
          Quay lại
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!flashcardSet) {
    return (
      <Box p={3}>
        <Button variant="outlined" onClick={handleBack} sx={{ mb: 2 }}>
          Quay lại
        </Button>
        <Alert severity="info">Không tìm thấy bộ thẻ flashcard.</Alert>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Button variant="outlined" onClick={handleBack} sx={{ mb: 2 }}>
        Quay lại
      </Button>

      {/* Header section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Box display="flex" alignItems="center">
              <Typography variant="h5" component="h1" gutterBottom>
                {flashcardSet.title || 'Untitled Set'}
              </Typography>
              <Box ml={1}>
                {flashcardSet.isPublic ? (
                  <Tooltip title="Công khai">
                    <PublicIcon color="success" fontSize="small" />
                  </Tooltip>
                ) : (
                  <Tooltip title="Riêng tư">
                    <LockIcon color="action" fontSize="small" />
                  </Tooltip>
                )}
              </Box>
            </Box>
            
            <Typography variant="body1" paragraph>
              {flashcardSet.description || 'Không có mô tả.'}
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
              <Chip
                icon={<LanguageIcon />}
                label={`${flashcardSet.learningLanguage || '?'} → ${flashcardSet.nativeLanguage || '?'}`}
                variant="outlined"
              />
              <Chip
                icon={<InfoIcon />}
                label={`Cấp độ: ${flashcardSet.level || 'N/A'}`}
                variant="outlined"
              />
              <Chip
                icon={<LibraryBooksIcon />}
                label={`${flashcardSet.totalVocabulary || 0} thẻ`}
                variant="outlined"
              />
              <Chip
                icon={<CalendarTodayIcon />}
                label={`Tạo: ${flashcardSet.createdAt ? format(new Date(flashcardSet.createdAt), 'dd/MM/yyyy') : 'N/A'}`}
                variant="outlined"
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={1} sx={{ p: 2, bgcolor: 'background.default' }}>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ mr: 2 }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1">
                    {flashcardSet.creatorName || 'Unknown User'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Người tạo
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 1 }} />
              
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                <Typography variant="body2">
                  ID Bộ thẻ:
                </Typography>
                <Tooltip title={flashcardSet.flashcardSetId}>
                  <Typography variant="body2" noWrap sx={{ maxWidth: '200px' }}>
                    {flashcardSet.flashcardSetId?.substring(0, 8)}...
                  </Typography>
                </Tooltip>
              </Box>
              
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="body2">
                  Lượt học:
                </Typography>
                <Typography variant="body2">
                  {flashcardSet.learnerCount || 0}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="body2">
                  Đánh giá:
                </Typography>
                <Box display="flex" alignItems="center">
                  <Rating 
                    value={flashcardSet.averageRating || 0} 
                    precision={0.1} 
                    readOnly 
                    size="small" 
                  />
                  <Typography variant="body2" ml={0.5}>
                    ({flashcardSet.reviewCount || 0})
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs section */}
      <Paper elevation={2} sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Thẻ ghi nhớ" id="tab-0" />
          <Tab label="Đánh giá" id="tab-1" />
        </Tabs>

        {/* Flashcards Tab */}
        <TabPanel value={tabValue} index={0}>
          {!flashcardSet.vocabularies?.length ? (
            <Alert severity="info">Không có thẻ ghi nhớ nào trong bộ này.</Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Từ vựng</TableCell>
                    <TableCell>Nghĩa</TableCell>
                    <TableCell>Phát âm</TableCell>
                    <TableCell>Ví dụ</TableCell>
                    <TableCell>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {flashcardSet.vocabularies.map((vocab, index) => (
                    <TableRow key={vocab.vocabularyId}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{vocab.term}</TableCell>
                      <TableCell>{vocab.definition}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {vocab.pronunciation && (
                            <>
                              <Typography variant="body2" mr={1}>
                                {vocab.pronunciation}
                              </Typography>
                              <IconButton size="small">
                                <VolumeUpIcon fontSize="small" />
                              </IconButton>
                            </>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>{vocab.example || '-'}</TableCell>
                      <TableCell>
                        <IconButton size="small" color="primary">
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="primary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        {/* Reviews Tab */}
        <TabPanel value={tabValue} index={1}>
          {!flashcardSet.reviews?.length ? (
            <Alert severity="info">Chưa có đánh giá nào cho bộ thẻ này.</Alert>
          ) : (
            <List>
              {flashcardSet.reviews.map((review) => (
                <Paper key={review.reviewId} elevation={1} sx={{ mb: 2, p: 2 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Avatar sx={{ mr: 1 }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">
                        {review.userName || 'Anonymous'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {review.createdAt ? format(new Date(review.createdAt), 'dd/MM/yyyy') : 'N/A'}
                      </Typography>
                    </Box>
                    <Box ml="auto">
                      <Rating value={review.rating || 0} readOnly size="small" />
                    </Box>
                  </Box>
                  <Typography variant="body2" paragraph>
                    {review.comment || 'Không có nhận xét.'}
                  </Typography>
                </Paper>
              ))}
            </List>
          )}
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default FlashcardSetDetails; 