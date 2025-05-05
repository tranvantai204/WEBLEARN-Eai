import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  InputAdornment,
  Tooltip,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
  TableSortLabel,
  Snackbar,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { reportService, userService, flashCardService, multipleChoiceTestService } from '../services/api';
import { useNavigate } from 'react-router-dom';

// --- BỎ ENUM SỐ NÀY ĐI HOẶC CẬP NHẬT NẾU MUỐN DÙNG STRING ---
// const ContentTypeReport = {
//   FLASHCARD_SET: 1,
//   FLASHCARD: 2,
//   LESSON: 3,
//   COMMENT: 4,
// };

// Cập nhật ContentTypeReport enum theo API docs
const ContentTypeReport = {
  WRITING_EXERCISE: 0,
  MULTIPLE_CHOICE: 1,
  FLASHCARD_SET: 2,
};

// Enum for report status (CÁI NÀY VẪN ĐÚNG VÌ API DÙNG SỐ)
const ReportStatus = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
};

const getContentTypeLabel = (typeValue) => {
  // Hàm này nhận vào value (có thể là số hoặc string) và trả về label
  if (typeof typeValue === 'string') {
    // Xử lý trường hợp backend trả về string
    switch (typeValue) {
      case 'FlashcardSet':
        return 'Flashcard Set';
      case 'Flashcard':
        return 'Flashcard';
      case 'Lesson':
        return 'Lesson';
      case 'Comment':
        return 'Comment';
      case 'MultipleChoice':
        return 'Multiple Choice';
      case 'WritingExercise':
        return 'Writing Exercise';
      default:
        return typeValue || 'Unknown';
    }
  } else {
    // Xử lý trường hợp là số (enum value)
    switch (typeValue) {
      case ContentTypeReport.WRITING_EXERCISE:
        return 'Writing Exercise';
      case ContentTypeReport.MULTIPLE_CHOICE:
        return 'Multiple Choice';
      case ContentTypeReport.FLASHCARD_SET:
        return 'Flashcard Set';
      default:
        return `Unknown Type (${typeValue})`;
    }
  }
};

const getStatusInfo = (status) => {
  switch (status) {
    case ReportStatus.PENDING:
      return { label: 'Pending', color: 'warning' };
    case ReportStatus.APPROVED:
      return { label: 'Approved', color: 'success' };
    case ReportStatus.REJECTED:
      return { label: 'Rejected', color: 'error' };
    default:
      return { label: 'Unknown', color: 'default' };
  }
};

const ContentReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selectedReport, setSelectedReport] = useState(null);
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Filters
  const [filters, setFilters] = useState({
    userId: '',
    contentType: '',
    status: '',
    sortBy: 'CreateAt',
    isDesc: true,
  });

  // Open filters
  const [openFilters, setOpenFilters] = useState(false);

  // Confirmation dialog states
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    content: '',
    action: null,
    reportId: null,
    status: null,
    contentId: null,
    contentType: null
  });

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiParams = {
        userId: filters.userId || null,
        // Sửa contentType để đảm bảo gửi số thay vì string
        contentType: filters.contentType !== '' ? Number(filters.contentType) : null,
        status: filters.status !== '' ? Number(filters.status) : null,
        sortBy: filters.sortBy,
        isDesc: filters.isDesc,
        currentPage: page + 1,
        itemPerPage: rowsPerPage,
      };

      console.log("Sending API params:", apiParams);

      const response = await reportService.getAllReports(apiParams);

      console.log("API Response:", response); // Log để xem response thực tế

      // *** SỬA CÁCH LẤY DỮ LIỆU TỪ RESPONSE ***
      if (response && response.contentReports) {
        setReports(response.contentReports);
        // Sử dụng trường chính xác từ API
        if (response.totalCount !== undefined) {
          setTotalItems(response.totalCount);
        } else {
          // Fallback - tính toán từ totalPage
          const calculatedTotalItems = (response.totalPage || 0) * (response.itemPerPage || rowsPerPage);
          setTotalItems(calculatedTotalItems);
        }
      } else {
        // Xử lý trường hợp response không hợp lệ
        setReports([]);
        setTotalItems(0);
        console.warn("API response structure might be different:", response);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Failed to load reports';
      setError(errorMessage);
      // Reset state khi có lỗi
      setReports([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // Bỏ filters ra khỏi dependency array nếu không muốn fetch lại khi gõ từng chữ vào TextField
    // Thay vào đó gọi fetchReports trong nút Apply của bộ lọc
  }, [page, rowsPerPage, filters.sortBy, filters.isDesc]); // Chỉ fetch lại khi page, rowsPerPage, sort thay đổi


  // Hàm này chỉ gọi fetch khi nhấn Apply Filters
  const applyFilters = () => {
    setPage(0); // Reset về trang đầu khi áp dụng bộ lọc mới
    fetchReports();
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Không fetch lại ngay lập tức, đợi nhấn Apply
    // setPage(0);
  };

  const handleSortChange = (field) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      isDesc: prev.sortBy === field ? !prev.isDesc : true,
    }));
    setPage(0); // Fetch lại khi sort thay đổi (do useEffect)
  };

  const handleViewReport = (contentId, contentType) => {
    if (!contentId || !contentType) {
      setSnackbar({ open: true, message: 'Missing content info', severity: 'error' });
      return;
    }
  
    let url = '';
    // Get the base URL from window.location to handle various environments
    const baseUrl = window.location.origin; // This gets the full domain including http(s)://
    
    // Convert contentType to proper format if it's a number
    let formattedContentType = contentType;
    if (typeof contentType === 'number') {
      switch (contentType) {
        case ContentTypeReport.MULTIPLE_CHOICE:
          formattedContentType = 'MultipleChoice';
          break;
        case ContentTypeReport.FLASHCARD_SET:
          formattedContentType = 'FlashcardSet';
          break;
        // Add other mappings as needed
        default:
          formattedContentType = contentType.toString();
      }
    }
    
    if (formattedContentType === 'FlashCard' || formattedContentType === 'FlashcardSet') {
      // For flashcards - use full absolute URL with proper domain
      url = `${baseUrl}/flashcard-set/${contentId}`;
    } else if (formattedContentType === 'MultipleChoice') {
      // For multiple choice tests - use full absolute URL with proper domain
      // Use the public endpoint since it doesn't require authentication
      url = `${baseUrl}/public-test/${contentId}`;
      console.log(`Opening multiple choice test at URL: ${url}`);
    } else {
      setSnackbar({ open: true, message: `Unsupported content type: ${formattedContentType}`, severity: 'warning' });
      return;
    }
  
    window.open(url, '_blank');
  };
  

  const handleCloseReportDialog = () => {
    setOpenReportDialog(false);
    setSelectedReport(null);
  };

  const openConfirmationDialog = (reportId, status, contentId, contentType) => {
    let title = '';
    let content = '';
    const contentTypeLabel = getContentTypeLabel(contentType);
    
    if (status === ReportStatus.APPROVED) {
      title = 'Xác nhận phê duyệt báo cáo';
      content = `Vui lòng check kỹ bài ${contentTypeLabel}. Bạn có chắc muốn xoá ${contentTypeLabel} này không?`;
    } else if (status === ReportStatus.REJECTED) {
      title = 'Xác nhận từ chối báo cáo';
      content = 'Bạn có chắc chắn muốn từ chối báo cáo này không?';
    }

    setConfirmDialog({
      open: true,
      title,
      content,
      reportId,
      status,
      contentId,
      contentType
    });
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialog({
      ...confirmDialog,
      open: false
    });
  };

  const handleConfirmAction = async () => {
    const { reportId, status, contentId, contentType } = confirmDialog;
    
    try {
      setProcessing(true);
      // First, update the report status
      const responseMessage = await reportService.updateReportStatus(reportId, status);

      // Cập nhật trạng thái trong bảng (optimistic update)
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.contentReportId === reportId ? { ...report, status } : report
        )
      );

      // Cập nhật trạng thái trong dialog nếu đang mở
      if (selectedReport && selectedReport.contentReportId === reportId) {
        setSelectedReport((prev) => ({ ...prev, status }));
      }

      // If approved, handle content deletion based on type
      if (status === ReportStatus.APPROVED) {
        try {
          if (contentType === 'FlashcardSet') {
            await flashCardService.deleteFlashcardSet(contentId);
            setSnackbar({
              open: true,
              message: 'Báo cáo đã được phê duyệt và Flashcard Set đã bị xóa.',
              severity: 'success',
            });
          } else if (contentType === 'MultipleChoice') {
            await multipleChoiceTestService.deleteMultipleChoiceTest(contentId);
            setSnackbar({
              open: true,
              message: 'Báo cáo đã được phê duyệt và bài trắc nghiệm đã bị xóa.',
              severity: 'success',
            });
          } else {
            setSnackbar({
              open: true,
              message: `Báo cáo đã được phê duyệt. Loại nội dung ${contentType} không có xử lý xóa tự động.`,
              severity: 'info',
            });
          }
        } catch (deleteErr) {
          console.error('Error deleting content:', deleteErr);
          setSnackbar({
            open: true,
            message: `Báo cáo đã được phê duyệt nhưng không thể xóa nội dung: ${deleteErr.message}`,
            severity: 'warning',
          });
        }
      } else {
        // Just show success message for rejection
        setSnackbar({
          open: true,
          message: 'Báo cáo đã được từ chối thành công.',
          severity: 'success',
        });
      }

      // Close the confirmation dialog
      handleCloseConfirmDialog();
    } catch (err) {
      console.error('Error updating report status:', err);
      let errorMessage;
      if (err.response) {
        errorMessage = err.response.data?.message || err.response.data || `Error ${err.response.status}: Failed to update status.`;
      } else {
        errorMessage = err.message || 'Network error. Please try again.';
      }
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
      handleCloseConfirmDialog();
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateReportStatus = (reportId, newStatus) => {
    // Find the report to get its content ID and type
    const reportToUpdate = reports.find(report => report.contentReportId === reportId);
    if (reportToUpdate) {
      openConfirmationDialog(
        reportId, 
        newStatus, 
        reportToUpdate.contentId, 
        reportToUpdate.contentType
      );
    } else {
      setSnackbar({
        open: true,
        message: 'Không thể tìm thấy thông tin báo cáo',
        severity: 'error',
      });
    }
  };

  const resetFilters = () => {
    setFilters({
      userId: '',
      contentType: '',
      status: '',
      sortBy: 'CreateAt',
      isDesc: true,
    });
    setPage(0);
    // Fetch lại dữ liệu với bộ lọc đã reset
    // Cần gọi fetchReports thủ công ở đây vì filters object reference không đổi nếu chỉ reset field
     fetchReports(); // Fetch lại sau khi reset
  };


  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Content Reports Management</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
           <IconButton onClick={fetchReports} disabled={loading} title="Refresh Data">
                <RefreshIcon />
            </IconButton>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setOpenFilters(!openFilters)}
            >
              Filters
            </Button>
        </Box>
      </Box>

      {error && !loading && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}

      {/* Filters */}
      {openFilters && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="User ID"
                name="userId"
                value={filters.userId}
                onChange={handleFilterChange}
                size="small"
                InputProps={{ // Thêm nút search nhỏ
                     endAdornment: (
                       <InputAdornment position="end">
                         <SearchIcon />
                       </InputAdornment>
                     ),
                   }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Content Type</InputLabel>
                <Select
                  name="contentType"
                  value={filters.contentType}
                  label="Content Type"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value={ContentTypeReport.WRITING_EXERCISE}>Writing Exercise</MenuItem>
                  <MenuItem value={ContentTypeReport.MULTIPLE_CHOICE}>Multiple Choice</MenuItem>
                  <MenuItem value={ContentTypeReport.FLASHCARD_SET}>Flashcard Set</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={filters.status} // status là number hoặc ''
                  label="Status"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value={ReportStatus.PENDING}>Pending</MenuItem>
                  <MenuItem value={ReportStatus.APPROVED}>Approved</MenuItem>
                  <MenuItem value={ReportStatus.REJECTED}>Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  fullWidth
                  // onClick={fetchReports} // Gọi fetch khi nhấn Apply
                  onClick={applyFilters} // Sửa thành hàm apply
                  disabled={loading}
                  startIcon={<SearchIcon />}
                >
                  Apply
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={resetFilters}
                  disabled={loading}
                  startIcon={<RefreshIcon />}
                >
                  Reset
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      <Paper sx={{ width: '100%', mb: 2, overflow: 'hidden' }}> {/* Thêm overflow: 'hidden' */}
        {loading && ( // Hiển thị loading overlay hoặc progress bar thay vì thay thế toàn bộ bảng
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Luôn hiển thị TableContainer, chỉ ẩn TableBody khi loading hoặc không có data */}
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
            <TableHead>
              <TableRow>
                {/* *** Đảm bảo SortBy khớp với tên trường API hoặc mapping nếu cần *** */}
                <TableCell sortDirection={filters.sortBy === 'ContentReportId' ? (filters.isDesc ? 'desc' : 'asc') : false}>
                    <TableSortLabel
                        active={filters.sortBy === 'ContentReportId'} // Giả sử API sort bằng 'ContentReportId'
                        direction={filters.isDesc ? 'desc' : 'asc'}
                        onClick={() => handleSortChange('ContentReportId')}
                    >
                        Report ID
                    </TableSortLabel>
                </TableCell>
                 <TableCell sortDirection={filters.sortBy === 'UserId' ? (filters.isDesc ? 'desc' : 'asc') : false}>
                     <TableSortLabel
                         active={filters.sortBy === 'UserId'}
                         direction={filters.isDesc ? 'desc' : 'asc'}
                         onClick={() => handleSortChange('UserId')}
                     >
                         Reported By (User ID)
                     </TableSortLabel>
                 </TableCell>
                <TableCell>Content ID</TableCell>
                <TableCell sortDirection={filters.sortBy === 'ContentType' ? (filters.isDesc ? 'desc' : 'asc') : false}>
                    <TableSortLabel
                        active={filters.sortBy === 'ContentType'}
                        direction={filters.isDesc ? 'desc' : 'asc'}
                        onClick={() => handleSortChange('ContentType')}
                    >
                        Content Type
                    </TableSortLabel>
                 </TableCell>
                <TableCell>Reason</TableCell>
                <TableCell sortDirection={filters.sortBy === 'Status' ? (filters.isDesc ? 'desc' : 'asc') : false}>
                    <TableSortLabel
                        active={filters.sortBy === 'Status'}
                        direction={filters.isDesc ? 'desc' : 'asc'}
                        onClick={() => handleSortChange('Status')}
                    >
                        Status
                    </TableSortLabel>
                </TableCell>
                 <TableCell sortDirection={filters.sortBy === 'CreateAt' ? (filters.isDesc ? 'desc' : 'asc') : false}>
                     <TableSortLabel
                         active={filters.sortBy === 'CreateAt'}
                         direction={filters.isDesc ? 'desc' : 'asc'}
                         onClick={() => handleSortChange('CreateAt')}
                     >
                         Created At
                     </TableSortLabel>
                 </TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Chỉ hiển thị nội dung khi không loading VÀ có dữ liệu */}
              {!loading && reports.length > 0 && reports.map((report) => {
                // Đổi tên reportId thành contentReportId cho khớp API
                const statusInfo = getStatusInfo(report.status);
                return (
                  <TableRow hover key={report.contentReportId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    {/* Nên hiển thị toàn bộ ID hoặc dùng Tooltip */}
                    <TableCell component="th" scope="row">
                       <Tooltip title={report.contentReportId}>
                           <span>{report.contentReportId.substring(0, 8)}...</span>
                       </Tooltip>
                    </TableCell>
                    <TableCell>
                       <Tooltip title={report.userId}>
                           <span>{report.userId.substring(0, 8)}...</span>
                       </Tooltip>
                    </TableCell>
                     <TableCell>
                        <Tooltip title={report.contentId}>
                             <span>{report.contentId.substring(0, 8)}...</span>
                         </Tooltip>
                     </TableCell>
                    {/* *** SỬ DỤNG HÀM ĐÃ SỬA *** */}
                    <TableCell>{getContentTypeLabel(report.contentType)}</TableCell>
                    <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <Tooltip title={report.reason}>
                        <span>{report.reason}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusInfo.label}
                        color={statusInfo.color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{new Date(report.createAt).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Details">
                        {/* Đổi tên reportId thành contentReportId */}
                        <IconButton size="small" onClick={() => handleViewReport(report.contentId, report.contentType)}>
                          <VisibilityIcon fontSize="small"/>
                        </IconButton>
                      </Tooltip>
                      {report.status === ReportStatus.PENDING && (
                        <>
                          <Tooltip title="Phê duyệt (Xóa nội dung)">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleUpdateReportStatus(report.contentReportId, ReportStatus.APPROVED)}
                              disabled={processing}
                            >
                              <ApproveIcon fontSize="small"/>
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Từ chối báo cáo">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleUpdateReportStatus(report.contentReportId, ReportStatus.REJECTED)}
                              disabled={processing}
                            >
                              <RejectIcon fontSize="small"/>
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {/* Hiển thị thông báo "No reports found" nếu không loading và không có data */}
              {!loading && reports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                     <Typography variant="body1" sx={{ p: 3 }}>No reports found matching your criteria.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Chỉ hiển thị Pagination nếu có dữ liệu */}
        {totalItems > 0 && !loading && (
            <TablePagination
              rowsPerPageOptions={[10, 20, 50]}
              component="div"
              // *** SỬ DỤNG totalItems ĐÃ TÍNH TOÁN ***
              count={totalItems}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              // Thêm label để rõ ràng hơn
               labelDisplayedRows={({ from, to, count }) =>
                   `${from}–${to} of approx. ${count}` // Ghi chú là 'approx.' vì count được tính toán
               }
            />
         )}
      </Paper>

      {/* Report Details Dialog */}
      <Dialog
        open={openReportDialog}
        onClose={handleCloseReportDialog}
        maxWidth="sm" // Giảm kích thước dialog nếu nội dung không quá nhiều
        fullWidth
      >
        {/* Thêm tiêu đề động */}
        <DialogTitle>Report Details {selectedReport ? `(${selectedReport.contentReportId.substring(0,8)}...)` : ''}</DialogTitle>
        <DialogContent dividers>
          {/* Thêm loading khi chờ load detail */}
           {loading && !selectedReport && <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>}
          {selectedReport && (
            <Grid container spacing={2}>
              {/* Sử dụng Grid để layout đẹp hơn */}
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">Report ID</Typography>
                <Typography variant="body1" gutterBottom>{selectedReport.contentReportId}</Typography>

                <Typography variant="body2" color="textSecondary">Reported By (User ID)</Typography>
                <Typography variant="body1" gutterBottom>{selectedReport.userId}</Typography>

                <Typography variant="body2" color="textSecondary">Content Type</Typography>
                {/* *** SỬ DỤNG HÀM ĐÃ SỬA *** */}
                <Typography variant="body1" gutterBottom>{getContentTypeLabel(selectedReport.contentType)}</Typography>

                <Typography variant="body2" color="textSecondary">Content ID</Typography>
                <Typography variant="body1" gutterBottom>{selectedReport.contentId}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                 <Typography variant="body2" color="textSecondary">Status</Typography>
                 <Chip
                   label={getStatusInfo(selectedReport.status).label}
                   color={getStatusInfo(selectedReport.status).color}
                   size="small" // Dùng size small cho nhất quán
                   sx={{ mb: 1 }}
                 />

                 <Typography variant="body2" color="textSecondary">Created At</Typography>
                 <Typography variant="body1" gutterBottom>
                   {new Date(selectedReport.createAt).toLocaleString()}
                 </Typography>

                 <Typography variant="body2" color="textSecondary">Reason</Typography>
                 <Typography variant="body1" gutterBottom sx={{ wordBreak: 'break-word' }}>{selectedReport.reason}</Typography>

              </Grid>
              {/* Giả sử API getById trả về description */}
              {selectedReport.description && (
                  <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">Description</Typography>
                      <Paper variant="outlined" sx={{ p: 1, mt: 0.5, bgcolor: 'grey.100' }}>
                          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                              {selectedReport.description}
                          </Typography>
                      </Paper>
                  </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{p: 2}}> {/* Thêm padding cho actions */}
          {selectedReport && selectedReport.status === ReportStatus.PENDING && (
            <>
              <Button
                variant="contained"
                color="success"
                startIcon={<ApproveIcon />}
                onClick={() => handleUpdateReportStatus(selectedReport.contentReportId, ReportStatus.APPROVED)}
                disabled={processing}
              >
                {processing ? <CircularProgress size={24} color="inherit" /> : 'Phê duyệt (Xóa)'}
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<RejectIcon />}
                onClick={() => handleUpdateReportStatus(selectedReport.contentReportId, ReportStatus.REJECTED)}
                disabled={processing}
              >
                 {processing ? <CircularProgress size={24} color="inherit" /> : 'Từ chối'}
              </Button>
              <Box sx={{ flexGrow: 1 }} /> {/* Đẩy nút Close sang phải */}
            </>
          )}
          <Button onClick={handleCloseReportDialog} variant="outlined">Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleCloseConfirmDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmDialog.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary" variant="outlined">
            Hủy
          </Button>
          {confirmDialog.status === ReportStatus.APPROVED && (
            <Button 
              onClick={() => {
                // Get the base URL from window.location
                const baseUrl = window.location.origin;
                
                // Convert contentType to proper format if it's a number
                let formattedContentType = confirmDialog.contentType;
                if (typeof confirmDialog.contentType === 'number') {
                  switch (confirmDialog.contentType) {
                    case ContentTypeReport.MULTIPLE_CHOICE:
                      formattedContentType = 'MultipleChoice';
                      break;
                    case ContentTypeReport.FLASHCARD_SET:
                      formattedContentType = 'FlashcardSet';
                      break;
                    // Add other mappings as needed
                    default:
                      formattedContentType = confirmDialog.contentType.toString();
                  }
                }
                
                // Logic to view content based on type
                if (formattedContentType === 'FlashCard' || formattedContentType === 'FlashcardSet') {
                  // Navigate to flashcard set detail with ID - use absolute URL with proper domain
                  window.open(`${baseUrl}/flashcard-set/${confirmDialog.contentId}`, '_blank');
                } else if (formattedContentType === 'MultipleChoice') {
                  // Navigate to multiple choice test detail with ID - use absolute URL with proper domain
                  const url = `${baseUrl}/public-test/${confirmDialog.contentId}`;
                  console.log(`Opening multiple choice test at URL: ${url}`);
                  window.open(url, '_blank');
                } else {
                  setSnackbar({
                    open: true,
                    message: `Không thể xem trước nội dung loại ${getContentTypeLabel(confirmDialog.contentType)}`,
                    severity: 'info',
                  });
                }
              }}
              color="info"
              variant="outlined"
            >
              Xem nội dung
            </Button>
          )}
          <Button 
            onClick={handleConfirmAction} 
            color={confirmDialog.status === ReportStatus.APPROVED ? "success" : "error"}
            variant="contained"
            disabled={processing}
            startIcon={processing ? <CircularProgress size={20} /> : null}
          >
            {confirmDialog.status === ReportStatus.APPROVED ? "Xác nhận xóa" : "Xác nhận từ chối"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000} // Tăng thời gian hiển thị một chút
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {/* Snackbar có thể không tự đóng khi Alert có onClose */}
        <Alert
          onClose={handleCloseSnackbar} // Cho phép đóng thủ công
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContentReports;