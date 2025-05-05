import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { multipleChoiceTestService, authService } from '../services/api';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Button,
    IconButton,
    TextField,
    Grid,
    Chip,
    Tooltip,
    InputAdornment,
    CircularProgress,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Snackbar, 
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Language as LanguageIcon,
    Public as PublicIcon,
    Lock as LockIcon,
    PeopleAlt as PeopleAltIcon,
    CalendarToday as CalendarTodayIcon,
    Info as InfoIcon,
    Refresh as RefreshIcon,
    FilterList as FilterListIcon, 
    Visibility as VisibilityIcon, 
} from '@mui/icons-material';
import { format } from 'date-fns';

// Giả sử có danh sách ngôn ngữ (nên lấy từ API hoặc config)
const LANGUAGES = [
    { code: 'ENG', name: 'English' },
    { code: 'VIE', name: 'Vietnamese' },
    { code: 'FRA', name: 'French' },
    { code: 'ESP', name: 'Spanish' },
    { code: 'GER', name: 'German' },
];

const MultipleChoiceTestsAdmin = () => {
    const navigate = useNavigate();
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 0,
        rowsPerPage: 10,
        totalItems: 0,
        totalPages: 0,
    });
    // *** State quản lý các giá trị filter hiện tại trên UI ***
    const [filters, setFilters] = useState({
        multipleChoiceTestId: '',
        title: '', 
        learningLanguage: '',
        nativeLanguage: '',
    });
    // *** State quản lý các filter đã được áp dụng để gọi API ***
    const [appliedFilters, setAppliedFilters] = useState({ ...filters });
    const [showFilters, setShowFilters] = useState(false); 
    
    // State cho thông báo
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info', 
    });
    
    // State cho xóa và quyền xóa
    const [deleting, setDeleting] = useState(false);
    const [canDelete, setCanDelete] = useState(false);
    
    // Kiểm tra quyền của người dùng khi component mount
    useEffect(() => {
        const checkDeletePermission = () => {
            const isAdmin = authService.hasRole('Admin');
            const isSuperAdmin = authService.hasRole('SuperAdmin');
            setCanDelete(isAdmin || isSuperAdmin);
        };
        
        checkDeletePermission();
    }, []);

    // Hàm gọi API với các filter đã áp dụng
    const fetchTests = async (page, limit, currentAppliedFilters) => {
        setLoading(true);
        setError(null);
        try {
            const apiPage = page + 1;
            const params = {
                page: apiPage,
                itemPerPage: limit,
                multipleChoiceTestId: currentAppliedFilters.multipleChoiceTestId || null,
                learningLanguage: currentAppliedFilters.learningLanguage || null,
                nativeLanguage: currentAppliedFilters.nativeLanguage || null,
            };

            Object.keys(params).forEach(key => {
                if (params[key] === null || params[key] === '') {
                    delete params[key];
                }
            });

            console.log("Calling API with params:", params); 
            const response = await multipleChoiceTestService.getAllMultipleChoiceTestsAdmin(params);
            console.log("API Response Tests:", response);

            setTests(response.multipleChoiceTestSummaries || []);
            const totalItemsCalc = (response.totalPage || 0) * (response.itemPerPage || limit);
            setPagination({
                currentPage: response.curentPage ? response.curentPage - 1 : 0,
                rowsPerPage: response.itemPerPage || limit,
                totalItems: totalItemsCalc,
                totalPages: response.totalPage || 0,
            });

        } catch (err) {
            console.error("Failed to fetch tests:", err);
            const errorMessage = err.response?.data?.message || err.message || "Failed to load tests.";
            setError(errorMessage);
            setTests([]);
            setPagination(prev => ({ ...prev, totalItems: 0, totalPages: 0, currentPage: 0 }));
        } finally {
            setLoading(false);
        }
    };

    // useEffect gọi API khi phân trang hoặc *filter đã áp dụng* thay đổi
    useEffect(() => {
        fetchTests(pagination.currentPage, pagination.rowsPerPage, appliedFilters);
    }, [pagination.currentPage, pagination.rowsPerPage, appliedFilters]); 

    // --- Handler Functions ---
    // Đóng thông báo
    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleChangePage = (event, newPage) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setPagination(prev => ({
            ...prev,
            rowsPerPage: newRowsPerPage,
            currentPage: 0,
        }));
    };

    // Cập nhật state filter nháp khi người dùng nhập liệu
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Áp dụng bộ lọc hiện tại
    const handleApplyFilters = () => {
        setPagination(prev => ({ ...prev, currentPage: 0 })); 
        setAppliedFilters(filters); 
    };

    // Reset bộ lọc và fetch lại
    const handleResetFilters = () => {
        const initialFilters = {
            multipleChoiceTestId: '',
            title: '',
            learningLanguage: '',
            nativeLanguage: '',
        };
        setFilters(initialFilters);
        setPagination(prev => ({ ...prev, currentPage: 0 }));
        setAppliedFilters(initialFilters); 
        setShowFilters(false); 
    };

    const handleRefresh = () => {
        fetchTests(pagination.currentPage, pagination.rowsPerPage, appliedFilters);
    };

    const handleEditTest = (test) => {
        console.log("Edit test:", test);
    };

    // Xử lý xóa bài kiểm tra trắc nghiệm
    const handleDeleteTest = async (testId) => {
        console.log("Delete test:", testId);
        const confirmMessage = `Bạn có chắc chắn muốn xóa bài kiểm tra ${testId.substring(0, 8)}...? 
        Thao tác này sẽ xóa vĩnh viễn bài kiểm tra và tất cả câu hỏi liên quan.`;
        
        if (window.confirm(confirmMessage)) {
            try {
                setDeleting(true);
                // Gọi API xóa
                const response = await multipleChoiceTestService.deleteMultipleChoiceTest(testId);
                console.log("Delete response:", response);
                
                setSnackbar({
                    open: true,
                    message: `Xóa bài kiểm tra thành công. ID: ${testId.substring(0, 8)}...`,
                    severity: 'success',
                });
                
                fetchTests(pagination.currentPage, pagination.rowsPerPage, appliedFilters);
            } catch (err) {
                console.error("Failed to delete test:", err);
                let errorMessage = "Không thể xóa bài kiểm tra.";
                
                if (err.response) {
                    const { status } = err.response;
                    const responseMessage = err.response.data?.message || "";
                    
                    if (status === 400) {
                        if (responseMessage.includes("can not remove")) {
                            errorMessage = "Không thể xóa bài kiểm tra này. Có thể nó đang được sử dụng.";
                        } else {
                            errorMessage = responseMessage || "Yêu cầu không hợp lệ.";
                        }
                    } else if (status === 401) {
                        errorMessage = "Bạn cần đăng nhập để thực hiện chức năng này.";
                    } else if (status === 403) {
                        errorMessage = "Bạn không có quyền xóa bài kiểm tra này.";
                    } else if (status === 404) {
                        errorMessage = "Không tìm thấy bài kiểm tra.";
                    } else if (status === 500) {
                        errorMessage = "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.";
                    } else {
                        errorMessage = responseMessage || errorMessage;
                    }
                }
                
                // Hiển thị thông báo lỗi
                setSnackbar({
                    open: true,
                    message: errorMessage,
                    severity: 'error',
                });
            } finally {
                setDeleting(false);
            }
        }
    };

    // Thêm hàm để xử lý sự kiện khi nhấp vào icon mắt
    const handleViewTest = (testId) => {
        const url = `${window.location.origin}/public-test/${testId}`;
        console.log(`Opening multiple choice test at URL: ${url}`);
        window.open(url, '_blank');
    };

    // --- Kết thúc Handlers ---

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h1">Multiple Choice Test Management</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Refresh Data">
                        <IconButton onClick={handleRefresh} disabled={loading}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    <Button
                        variant={showFilters ? "contained" : "outlined"}
                        startIcon={<FilterListIcon />}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        Filters
                    </Button>
                    {/* <Button variant="contained" startIcon={<AddIcon />} disabled> Add Test </Button> */}
                </Box>
            </Box>

            {/* Khu vực Filter (có thể ẩn/hiện) */}
            {showFilters && (
                <Paper sx={{ p: 2, mb: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={8} md={6}>
                            <TextField
                                label="Filter by Test ID"
                                name="multipleChoiceTestId" 
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={filters.multipleChoiceTestId}
                                onChange={handleFilterChange}
                            />
                        </Grid>
                        {/* Filter theo Learning Language */}
                        <Grid item xs={12} sm={8} md={6}>
                          <FormControl fullWidth size="medium" variant="outlined">
                              <InputLabel>Learning Language</InputLabel>
                              <Select
                                  name="learningLanguage"
                                  value={filters.learningLanguage}
                                  label="Learning Language"
                                  onChange={handleFilterChange}
                                  style={{ minWidth: '250px' }} 
                              >
                                  <MenuItem value="">
                                      <em>All</em>
                                  </MenuItem>
                                  {LANGUAGES.map(lang => (
                                      <MenuItem key={lang.code} value={lang.code}>
                                          {lang.name} ({lang.code})
                                      </MenuItem>
                                  ))}
                              </Select>
                          </FormControl>
                        </Grid>

                        {/* Filter theo Native Language */}
                        <Grid item xs={12} sm={8} md={6}>
                          <FormControl fullWidth size="medium" variant="outlined">
                              <InputLabel>Native Language</InputLabel>
                              <Select
                                  name="nativeLanguage"
                                  value={filters.nativeLanguage}
                                  label="Native Language"
                                  onChange={handleFilterChange}
                                  style={{ minWidth: '250px' }}
                              >
                                  <MenuItem value="">
                                      <em>All</em>
                                  </MenuItem>
                                  {LANGUAGES.map(lang => (
                                      <MenuItem key={lang.code} value={lang.code}>
                                          {lang.name} ({lang.code})
                                      </MenuItem>
                                  ))}
                              </Select>
                          </FormControl>
                        </Grid>

                        {/* Nút Apply và Reset */}
                        <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="contained"
                                onClick={handleApplyFilters}
                                startIcon={<SearchIcon />}
                                disabled={loading}
                                fullWidth
                            >
                                Apply Filters
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={handleResetFilters}
                                disabled={loading}
                                fullWidth
                            >
                                Reset
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            )}

            {/* Thông báo lỗi */}
            {error && !loading && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {/* Bảng dữ liệu */}
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer>
                    <Table stickyHeader sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell sx={{ minWidth: 150 }}>Title</TableCell>
                                <TableCell>Language</TableCell>
                                <TableCell>Created</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Learners</TableCell>
                                <TableCell>Level</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : tests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                        {/* Hiển thị thông báo phù hợp */}
                                        <Typography>
                                            {Object.values(appliedFilters).some(v => v) 
                                                ? "No tests found matching your filters."
                                                : "No multiple choice tests found."}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tests.map((test) => (
                                    <TableRow hover key={test.multipleChoiceTestId}>
                                        <TableCell>
                                            <Tooltip title={test.multipleChoiceTestId}>
                                                <span>{test.multipleChoiceTestId.substring(0, 8)}...</span>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 'medium' }}>{test.title || 'N/A'}</TableCell>
                                        <TableCell>
                                            <Chip icon={<LanguageIcon fontSize="small"/>} label={`${test.learningLanguage || '?'} → ${test.nativeLanguage || '?'}`} size="small" variant="outlined" />
                                        </TableCell>
                                        <TableCell>
                                            {test.createAt ? format(new Date(test.createAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={test.isPublic ? <PublicIcon fontSize="small"/> : <LockIcon fontSize="small"/>}
                                                label={test.isPublic ? 'Public' : 'Private'}
                                                color={test.isPublic ? 'success' : 'default'}
                                                size="small"
                                                variant={test.isPublic ? "filled" : "outlined"}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip icon={<PeopleAltIcon fontSize="small"/>} label={test.learnerCount ?? 0} size="small" />
                                        </TableCell>
                                        <TableCell>
                                            <Chip icon={<InfoIcon fontSize="small"/>} label={test.level ?? 'N/A'} size="small" />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="View Test Details">
                                                <IconButton 
                                                    size="small" 
                                                    onClick={() => handleViewTest(test.multipleChoiceTestId)} 
                                                    color="primary"
                                                >
                                                    <VisibilityIcon fontSize="inherit" />
                                                </IconButton>
                                            </Tooltip>
                                            {/* <Tooltip title="Edit Test">
                                                <IconButton 
                                                    size="small" 
                                                    onClick={() => handleEditTest(test)} 
                                                    color="primary"
                                                >
                                                    <EditIcon fontSize="inherit" />
                                                </IconButton>
                                            </Tooltip> */}
                                            {canDelete && (
                                                <Tooltip title="Delete Test">
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => handleDeleteTest(test.multipleChoiceTestId)} 
                                                        color="error"
                                                        disabled={deleting}
                                                    >
                                                        <DeleteIcon fontSize="inherit"/>
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {/* Pagination */}
                {pagination.totalItems > 0 && !loading && (
                    <TablePagination
                        rowsPerPageOptions={[10, 20, 50]}
                        component="div"
                        count={pagination.totalItems}
                        rowsPerPage={pagination.rowsPerPage}
                        page={pagination.currentPage}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelDisplayedRows={({ from, to, count }) =>
                            `${from}–${to} of approx. ${count}`
                        }
                    />
                )}
            </Paper>

            {/* Snackbar để hiển thị thông báo sau khi xóa */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Disable delete buttons & show spinner when deleting */}
            {deleting && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        zIndex: 1300,
                    }}
                >
                    <CircularProgress />
                </Box>
            )}
        </Box>
    );
};

export default MultipleChoiceTestsAdmin;