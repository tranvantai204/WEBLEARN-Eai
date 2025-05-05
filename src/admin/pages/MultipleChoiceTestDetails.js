import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { multipleChoiceTestService } from '../services/api';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Divider,
  Avatar,
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
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';
import {
  Language as LanguageIcon,
  CalendarToday as CalendarTodayIcon,
  Person as PersonIcon,
  Info as InfoIcon,
  VerifiedUser as VerifiedUserIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Public as PublicIcon,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
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

const MultipleChoiceTestDetails = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchTestDetails = async () => {
      if (!testId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Note: This is a placeholder - implement the API service method
        // const data = await multipleChoiceTestService.getTestDetails(testId);
        
        // Temporary mock data until API is implemented
        const mockData = {
          multipleChoiceTestId: testId,
          title: "Bài đọc về văn hóa Việt Nam",
          description: "Đây là bài đọc giúp người học hiểu thêm về văn hóa, lịch sử và con người Việt Nam.",
          learningLanguage: "VIE",
          nativeLanguage: "ENG",
          level: "Intermediate",
          isPublic: true,
          learnerCount: 125,
          createAt: new Date().toISOString(),
          creatorName: "Admin User",
          passScore: 70,
          totalQuestions: 10,
          timeLimit: 20, // minutes
          readingContent: `<p>Việt Nam là một quốc gia đa dạng về văn hóa với 54 dân tộc anh em. Mỗi dân tộc đều có những nét văn hóa đặc sắc riêng, tạo nên bức tranh văn hóa đa dạng, phong phú của đất nước.</p>
          <p>Người Việt Nam tự hào về lịch sử hàng nghìn năm dựng nước và giữ nước. Trải qua nhiều thời kỳ lịch sử, từ thời kỳ Hùng Vương dựng nước, đến các triều đại phong kiến và cuộc kháng chiến chống ngoại xâm, người Việt Nam luôn thể hiện tinh thần đoàn kết, yêu nước.</p>
          <p>Ẩm thực Việt Nam được đánh giá là một trong những nền ẩm thực hấp dẫn nhất thế giới với các món ăn như phở, bánh mì, bún chả, và nhiều món ăn đặc sản khác. Mỗi vùng miền đều có những món ăn đặc trưng riêng, phản ánh đặc điểm địa lý, khí hậu và văn hóa của vùng đất đó.</p>`,
          questions: [
            {
              questionId: "q1",
              questionText: "Việt Nam có bao nhiêu dân tộc anh em?",
              options: [
                { optionId: "q1_a", text: "53" },
                { optionId: "q1_b", text: "54" },
                { optionId: "q1_c", text: "55" },
                { optionId: "q1_d", text: "56" }
              ],
              correctOptionId: "q1_b"
            },
            {
              questionId: "q2",
              questionText: "Người Việt Nam tự hào về điều gì?",
              options: [
                { optionId: "q2_a", text: "Tài nguyên thiên nhiên" },
                { optionId: "q2_b", text: "Lịch sử hàng nghìn năm dựng nước và giữ nước" },
                { optionId: "q2_c", text: "Kinh tế phát triển" },
                { optionId: "q2_d", text: "Địa hình đa dạng" }
              ],
              correctOptionId: "q2_b"
            },
            {
              questionId: "q3",
              questionText: "Ẩm thực Việt Nam được đánh giá như thế nào?",
              options: [
                { optionId: "q3_a", text: "Là một trong những nền ẩm thực đơn điệu nhất" },
                { optionId: "q3_b", text: "Không được quốc tế công nhận" },
                { optionId: "q3_c", text: "Là một trong những nền ẩm thực hấp dẫn nhất thế giới" },
                { optionId: "q3_d", text: "Chỉ nổi tiếng trong khu vực Đông Nam Á" }
              ],
              correctOptionId: "q3_c"
            }
          ]
        };
        
        console.log('Test details:', mockData);
        setTest(mockData);
      } catch (err) {
        console.error('Error fetching test details:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load test details';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [testId]);

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

  if (!test) {
    return (
      <Box p={3}>
        <Button variant="outlined" onClick={handleBack} sx={{ mb: 2 }}>
          Quay lại
        </Button>
        <Alert severity="info">Không tìm thấy bài đọc.</Alert>
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
                {test.title || 'Untitled Test'}
              </Typography>
              <Box ml={1}>
                {test.isPublic ? (
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
              {test.description || 'Không có mô tả.'}
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
              <Chip
                icon={<LanguageIcon />}
                label={`${test.learningLanguage || '?'} → ${test.nativeLanguage || '?'}`}
                variant="outlined"
              />
              <Chip
                icon={<InfoIcon />}
                label={`Cấp độ: ${test.level || 'N/A'}`}
                variant="outlined"
              />
              <Chip
                icon={<QuestionAnswerIcon />}
                label={`${test.totalQuestions || 0} câu hỏi`}
                variant="outlined"
              />
              <Chip
                icon={<CalendarTodayIcon />}
                label={`Tạo: ${test.createAt ? format(new Date(test.createAt), 'dd/MM/yyyy') : 'N/A'}`}
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
                    {test.creatorName || 'Unknown User'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Người tạo
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 1 }} />
              
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                <Typography variant="body2">
                  ID bài đọc:
                </Typography>
                <Tooltip title={test.multipleChoiceTestId}>
                  <Typography variant="body2" noWrap sx={{ maxWidth: '200px' }}>
                    {test.multipleChoiceTestId?.substring(0, 8)}...
                  </Typography>
                </Tooltip>
              </Box>
              
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="body2">
                  Số người học:
                </Typography>
                <Typography variant="body2">
                  {test.learnerCount || 0}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="body2">
                  Thời gian làm bài:
                </Typography>
                <Typography variant="body2">
                  {test.timeLimit || 'N/A'} phút
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="body2">
                  Điểm đạt:
                </Typography>
                <Typography variant="body2">
                  {test.passScore || 0}%
                </Typography>
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
          <Tab label="Nội dung đọc" id="tab-0" />
          <Tab label="Câu hỏi" id="tab-1" />
        </Tabs>

        {/* Reading Content Tab */}
        <TabPanel value={tabValue} index={0}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Nội dung bài đọc
            </Typography>
            <Box 
              dangerouslySetInnerHTML={{ __html: test.readingContent || 'Không có nội dung.' }}
              sx={{ 
                mt: 2, 
                lineHeight: 1.7,
                '& p': { mb: 2 }
              }}
            />
          </Paper>
        </TabPanel>

        {/* Questions Tab */}
        <TabPanel value={tabValue} index={1}>
          {!test.questions?.length ? (
            <Alert severity="info">Không có câu hỏi nào trong bài đọc này.</Alert>
          ) : (
            <List>
              {test.questions.map((question, index) => (
                <Card key={question.questionId} sx={{ mb: 3 }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Typography variant="h6" component="div">
                        Câu {index + 1}:
                      </Typography>
                      <Typography variant="h6" component="div" ml={1}>
                        {question.questionText}
                      </Typography>
                    </Box>
                    
                    <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
                      <RadioGroup>
                        {question.options.map((option) => (
                          <FormControlLabel
                            key={option.optionId}
                            value={option.optionId}
                            control={
                              <Radio 
                                disabled 
                                checked={option.optionId === question.correctOptionId}
                                color="primary"
                              />
                            }
                            label={
                              <Box display="flex" alignItems="center">
                                <Typography>{option.text}</Typography>
                                {option.optionId === question.correctOptionId && (
                                  <CheckCircleIcon color="success" fontSize="small" sx={{ ml: 1 }} />
                                )}
                              </Box>
                            }
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </CardContent>
                </Card>
              ))}
            </List>
          )}
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default MultipleChoiceTestDetails; 