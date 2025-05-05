import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  People as PeopleIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { userService } from '../services/api'; // Đảm bảo đường dẫn đúng

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [page, setPage] = useState(0); // Xóa state không dùng
  const [currentPage, setCurrentPage] = useState(0); // State cho trang hiện tại (0-based index)
  const [rowsPerPage, setRowsPerPage] = useState(10); // Bắt đầu với 10 hoặc 20 thay vì 1
  const [totalItems, setTotalItems] = useState(0); // State cho tổng số users
  // const [totalPages, setTotalPages] = useState(0); // Không cần thiết nếu có totalItems
  const [filters, setFilters] = useState({ email: '', role: '' }); // Gom filter vào một state object
  const [appliedFilters, setAppliedFilters] = useState({ email: '', role: '' }); // State lưu filter đã áp dụng
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Khởi tạo là null
  const [isEdit, setIsEdit] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  // const [searchQuery, setSearchQuery] = useState(''); // Xóa state thừa

  // Function to fetch users from API
  const fetchUsers = async (pageIndex, pageSize, currentFilters) => {
    setLoading(true);
    setError(null); // Reset lỗi trước mỗi lần fetch
    try {
      // API yêu cầu page 1-based
      const apiPage = pageIndex + 1;
      const response = await userService.getAllUsers(
          apiPage,
          pageSize,
          currentFilters.email || null, // Gửi null nếu rỗng
          currentFilters.role || null   // Gửi null nếu rỗng
      );

      console.log("API Response:", response); // Kiểm tra response

      setUsers(response.inforUsers || []);

      // *** TÍNH TOÁN totalItems ***
      if (response.totalPage && response.itemPerPage) {
        // Tính toán nếu API không trả về totalItems trực tiếp
        const calculatedTotalItems = response.totalPage * response.itemPerPage;
        // Có thể cần điều chỉnh nếu trang cuối không đủ item, nhưng đây là ước tính tốt nhất
        setTotalItems(calculatedTotalItems);
         // Nếu API có trả về totalItems thì dùng nó: setTotalItems(response.totalItems || 0);
      } else {
         // Fallback nếu không có totalPage hoặc itemPerPage
         setTotalItems(response.inforUsers?.length || 0);
         // Hoặc nếu biết chắc là có totalItems thì dùng:
         // setTotalItems(response.totalItems || response.inforUsers?.length || 0);
      }


      // *** KHÔNG CẬP NHẬT currentPage Ở ĐÂY ***
      // setCurrentPage(response.curentPage ? response.curentPage - 1 : 0); // <--- XÓA DÒNG NÀY

    } catch (error) {
      console.error("Failed to fetch users:", error);
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || "Failed to fetch users";
      setError(errorMessage); // Hiển thị lỗi cụ thể hơn
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
      setUsers([]); // Xóa dữ liệu cũ khi có lỗi
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  // useEffect chỉ fetch khi trang, số dòng/trang, hoặc filter *đã áp dụng* thay đổi
  useEffect(() => {
    fetchUsers(currentPage, rowsPerPage, appliedFilters);
  }, [currentPage, rowsPerPage, appliedFilters]); // Chỉ fetch khi các state này thay đổi

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage); // Chỉ cần cập nhật state, useEffect sẽ xử lý việc fetch
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(0); // Reset về trang đầu khi thay đổi số dòng/trang
  };

  // Cập nhật state filter nháp khi người dùng nhập liệu
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Hàm xử lý khi nhấn nút Apply Filters hoặc Enter
  const handleApplyFilters = () => {
    setCurrentPage(0); // Reset về trang đầu khi áp dụng filter mới
    setAppliedFilters(filters); // Cập nhật filter đã áp dụng, trigger useEffect
  };

  // Xử lý nhấn Enter trong ô tìm kiếm email
  const handleEmailKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApplyFilters();
    }
  };

  // Reset filter và fetch lại
  const handleResetFilters = () => {
    setFilters({ email: '', role: '' });
    setCurrentPage(0);
    setAppliedFilters({ email: '', role: '' }); // Reset applied filters để trigger fetch
  };

  // Mở dialog thêm/sửa
  const handleOpenDialog = (user = null) => {
    if (user) {
      // Đảm bảo dùng đúng tên trường 'id' từ API
      setCurrentUser({
        id: user.id, // Dùng 'id'
        userName: user.userName || '',
        email: user.email || '',
        password: '', // Không hiển thị password cũ
        roles: user.roles || ['User'], // Mặc định là User nếu không có
        gender: user.gender === undefined ? true : user.gender, // Xử lý trường hợp undefined
        level: user.level || 0,
        // status: user.status || 'Active', // API response ví dụ không có status
      });
      setIsEdit(true);
    } else {
      // Reset form cho user mới
      setCurrentUser({
        id: '',
        userName: '',
        email: '',
        password: '',
        roles: ['User'], // Mặc định là User khi tạo mới
        gender: true, // Mặc định là Male
        level: 0,
        // status: 'Active',
      });
      setIsEdit(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentUser(null); // Reset currentUser khi đóng dialog
  };

  // Cập nhật state currentUser trong dialog
  const handleDialogInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser(prev => ({
      ...prev,
      [name]: name === 'level' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleDialogRoleChange = (e) => {
    const { value } = e.target;
    setCurrentUser(prev => ({
      ...prev,
      roles: typeof value === 'string' ? value.split(',') : value, // Xử lý giá trị select multiple
    }));
  };

  const handleSaveUser = async () => {
    if (!currentUser) return;

    // Simple validation example
    if (!currentUser.email || !currentUser.userName || (!isEdit && !currentUser.password)) {
        setSnackbar({ open: true, message: "Please fill in all required fields.", severity: "warning" });
        return;
    }
     if (!isEdit && currentUser.password && !/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/.test(currentUser.password)) {
       setSnackbar({ open: true, message: "Password must be at least 6 chars, with 1 uppercase, 1 number, 1 special char.", severity: "warning" });
       return;
     }


    setLoading(true); // Có thể thêm loading state riêng cho dialog
    try {
      let message = '';
      // Chuẩn bị data gửi đi (chỉ gửi những trường cần thiết)
       const userData = {
           userName: currentUser.userName,
           email: currentUser.email,
           gender: currentUser.gender,
           level: parseInt(currentUser.level, 10) || 0,
           roles: currentUser.roles,
           // Chỉ gửi password khi tạo mới hoặc nếu muốn cho phép cập nhật password
           ...(isEdit ? {} : { password: currentUser.password }), // Chỉ gửi password khi tạo mới
       };

    if (isEdit) {
        // Khi update, thường chỉ cần gửi những trường thay đổi, hoặc toàn bộ trừ password
        // API của bạn cần endpoint update (ví dụ: updateUser(userId, data))
        await userService.updateUser(currentUser.id, userData); // Giả sử có hàm này
        message = 'User updated successfully';
      } else {
        // Khi tạo mới
        // Kiểm tra nếu tạo admin (ví dụ)
        if (currentUser.roles.includes('Admin') || currentUser.roles.includes('SuperAdmin')) {
           // API có thể cần endpoint riêng như registerAdmin
           // Hoặc endpoint createUser xử lý được việc gán role
           const adminData = { ...userData, password: currentUser.password };
           // await userService.registerAdmin(adminData); // Nếu có endpoint riêng
           await userService.createUser(adminData); // Nếu dùng endpoint chung
           message = 'Admin user created successfully';
    } else {
            const createData = { ...userData, password: currentUser.password };
            await userService.createUser(createData); // Dùng endpoint chung
            message = 'User created successfully';
        }
      }

      setSnackbar({ open: true, message: message, severity: 'success' });
      fetchUsers(currentPage, rowsPerPage, appliedFilters); // Fetch lại dữ liệu
      handleCloseDialog();
    } catch (err) {
      console.error("Error saving user:", err);
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Error saving user';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setLoading(false); // Tắt loading dialog
    }
  };

  const handleDeleteUser = async (id) => {
    // Xác nhận trước khi xóa
    if (window.confirm(`Are you sure you want to delete user ${id.substring(0,8)}...? This action cannot be undone.`)) {
      setLoading(true); // Có thể dùng loading state riêng
      try {
        console.log(`Attempting to delete user with ID: ${id}`);
        await userService.deleteUser(id);
        console.log(`User ${id} deleted successfully`);
        setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' });
        // Fetch lại trang hiện tại, hoặc về trang đầu nếu trang hiện tại trống sau khi xóa
        fetchUsers(currentPage, rowsPerPage, appliedFilters);
      } catch (err) {
        console.error("Error deleting user:", err);
        let errorMessage = 'Error deleting user';
        
        // Handle specific error status codes
        if (err.response) {
          const { status } = err.response;
          const responseMessage = err.response.data?.message || "";
          
          if (status === 400) {
            errorMessage = responseMessage || "Bad request - User deletion failed";
          } else if (status === 401) {
            errorMessage = "You need to be logged in to delete users";
          } else if (status === 403) {
            errorMessage = "You don't have permission to delete this user";
          } else if (status === 404) {
            errorMessage = "User not found or has already been deleted";
          } else if (status === 500) {
            errorMessage = "Server error occurred while deleting user";
          } else {
            errorMessage = responseMessage || errorMessage;
          }
        }
        
        console.error(`Delete user error: ${errorMessage}`);
        setSnackbar({ open: true, message: errorMessage, severity: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Helper function để hiển thị roles
  const getRoleChips = (roles) => {
    if (!Array.isArray(roles) || roles.length === 0) {
      return <Chip label="User" size="small" variant="outlined" />;
    }
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {roles.map((role) => (
          <Chip
            key={role}
            label={role}
            size="small"
            color={role === 'Admin' || role === 'SuperAdmin' ? 'primary' : 'secondary'}
            variant="filled"
          />
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}> {/* Tăng padding cho toàn bộ trang */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        mb: 4,
        gap: 2
      }}>
    <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 700, 
              color: 'text.primary',
              mb: 1
            }}
          >
            Users Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage user accounts, roles and permissions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          disabled={loading}
          sx={{ 
            px: 2,
            py: 1,
            boxShadow: 2,
            borderRadius: 2,
          }}
        >
          Add New User
        </Button>
      </Box>

      {/* Cards hiển thị thông tin tổng quan */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
        gap: 3,
        mb: 4
      }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: (theme) => theme.palette.primary.light,
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Total Users
            </Typography>
            <Typography variant="h3" fontWeight="700">
              {totalItems}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
              {loading ? 'Loading...' : 'All registered accounts'}
            </Typography>
          </Box>
          <Box sx={{ 
            position: 'absolute',
            right: -15,
            bottom: -15,
            opacity: 0.15,
            fontSize: 100
          }}>
            <PeopleIcon fontSize="inherit" />
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: (theme) => '#4caf50',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Regular Users
            </Typography>
            <Typography variant="h3" fontWeight="700">
              {users.filter(user => !user.roles?.some(r => r === 'Admin' || r === 'SuperAdmin')).length}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
              Standard account users
            </Typography>
          </Box>
          <Box sx={{ 
            position: 'absolute',
            right: -15,
            bottom: -15,
            opacity: 0.15,
            fontSize: 100
          }}>
            <AccountCircleIcon fontSize="inherit" />
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: (theme) => '#ff9800',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Admin Users
            </Typography>
            <Typography variant="h3" fontWeight="700">
              {users.filter(user => user.roles?.includes('Admin')).length}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
              Users with admin privileges
            </Typography>
          </Box>
          <Box sx={{ 
            position: 'absolute',
            right: -15,
            bottom: -15,
            opacity: 0.15,
            fontSize: 100
          }}>
            <SettingsIcon fontSize="inherit" />
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: (theme) => '#f44336',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              SuperAdmins
            </Typography>
            <Typography variant="h3" fontWeight="700">
              {users.filter(user => user.roles?.includes('SuperAdmin')).length}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
              Full access system administrators
            </Typography>
          </Box>
          <Box sx={{ 
            position: 'absolute',
            right: -15,
            bottom: -15,
            opacity: 0.15,
            fontSize: 100
          }}>
            <FilterListIcon fontSize="inherit" />
          </Box>
        </Paper>
      </Box>

      {/* Thông báo lỗi tổng quát */}
      {error && !loading && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            boxShadow: 1
          }} 
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Phần Filter */}
      <Paper 
        sx={{ 
          p: 3, 
          mb: 3,
          borderRadius: 3,
          boxShadow: 2,
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <FilterListIcon /> Filter Users
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          alignItems: 'center', 
          flexWrap: 'wrap',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ 
            display: 'flex',
            gap: 2,
            flexGrow: 1,
            flexWrap: { xs: 'wrap', md: 'nowrap' }
          }}>
          <TextField
              placeholder="Search by email..."
            variant="outlined"
            size="small"
              name="email"
              value={filters.email}
              onChange={handleFilterChange}
              onKeyPress={handleEmailKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                    <SearchIcon fontSize="small"/>
                </InputAdornment>
              ),
            }}
              sx={{ 
                flexGrow: 1, 
                minWidth: { xs: '100%', md: '250px' },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            <FormControl 
              variant="outlined" 
              size="small" 
              sx={{ 
                minWidth: { xs: '100%', md: '200px' },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            >
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
                label="Role"
              >
                <MenuItem value="">
                  <em>All Roles</em>
                </MenuItem>
                <MenuItem value="User">User</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="SuperAdmin">SuperAdmin</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            flexWrap: 'nowrap'
          }}>
            <Button
              variant="contained"
              size="medium"
              onClick={handleApplyFilters}
              startIcon={<SearchIcon />}
              disabled={loading}
              sx={{ 
                minWidth: '100px',
                borderRadius: 2
              }}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              size="medium"
              onClick={handleResetFilters}
              startIcon={<RefreshIcon />}
              disabled={loading}
              sx={{ 
                minWidth: '100px',
                borderRadius: 2
              }}
            >
              Reset
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Bảng dữ liệu */}
      <Paper sx={{ 
        width: '100%', 
        overflow: 'hidden',
        borderRadius: 3,
        boxShadow: 2,
        bgcolor: 'white'
      }}>
        <TableContainer sx={{ backgroundColor: 'white' }}>
          <Table stickyHeader sx={{ minWidth: 750, backgroundColor: 'white' }} aria-labelledby="tableTitle" size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'white' }}>
                {/* Có thể thêm sort nếu API hỗ trợ */}
                <TableCell width="150px" sx={{ backgroundColor: 'white' }}>ID</TableCell>
                <TableCell width="150px" sx={{ backgroundColor: 'white' }}>Username</TableCell>
                <TableCell width="200px" sx={{ backgroundColor: 'white' }}>Email</TableCell>
                <TableCell width="150px" sx={{ backgroundColor: 'white' }}>Roles</TableCell>
                <TableCell width="100px" sx={{ backgroundColor: 'white' }}>Gender</TableCell>
                <TableCell width="80px" sx={{ backgroundColor: 'white' }}>Level</TableCell>
                <TableCell align="right" width="100px" sx={{ backgroundColor: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow sx={{ backgroundColor: 'white' }}>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, backgroundColor: 'white' }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow sx={{ backgroundColor: 'white' }}>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, backgroundColor: 'white' }}>
                    <Typography>No users found matching your criteria.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { backgroundColor: 'white' },
                    backgroundColor: 'white'
                  }}>
                    <TableCell component="th" scope="row" sx={{ backgroundColor: 'white' }}>
                       <Tooltip title={user.id}>
                          <span>
                            {user.id.substring(0, 8)}...
                          </span>
                       </Tooltip>
                    </TableCell>
                    <TableCell sx={{ backgroundColor: 'white' }}>{user.userName}</TableCell>
                    <TableCell sx={{ backgroundColor: 'white' }}>{user.email}</TableCell>
                    <TableCell sx={{ backgroundColor: 'white' }}>{getRoleChips(user.roles)}</TableCell>
                    <TableCell sx={{ backgroundColor: 'white' }}>{user.gender ? 'Male' : 'Female'}</TableCell>
                    <TableCell sx={{ backgroundColor: 'white' }}>{user.level}</TableCell>
                    <TableCell align="right" sx={{ backgroundColor: 'white' }}>
                      <Tooltip title="Edit User">
                        <IconButton size="small" onClick={() => handleOpenDialog(user)} color="primary">
                          <EditIcon fontSize="inherit" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Chỉ hiển thị Pagination nếu có dữ liệu và không loading */}
        {totalItems > 0 && !loading && (
        <TablePagination
            rowsPerPageOptions={[5, 10, 20, 50]} // Điều chỉnh options nếu cần
          component="div"
            count={totalItems} // Sử dụng totalItems đã tính toán/lấy về
          rowsPerPage={rowsPerPage}
            page={currentPage} // Sử dụng currentPage (0-based index)
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
            // Thêm label để rõ ràng hơn, đặc biệt khi count là ước tính
             labelDisplayedRows={({ from, to, count }) =>
                 // Nếu count là tính toán từ totalPages, có thể ghi chú
                 `${from}–${to} of ${count}` // Giữ nguyên nếu API trả về totalItems chính xác
                 // `${from}–${to} of approx. ${count}` // Nếu count là ước tính
             }
          />
        )}
      </Paper>

      {/* Add/Edit User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent>
          {/* Chỉ render form khi currentUser có giá trị */}
          {currentUser && (
            <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
            <TextField
              fullWidth
              margin="dense"
                label="Username"
                name="userName"
                value={currentUser.userName}
                onChange={handleDialogInputChange}
              required
                variant="outlined"
            />
            <TextField
              fullWidth
              margin="dense"
              label="Email"
              name="email"
              type="email"
              value={currentUser.email}
                onChange={handleDialogInputChange}
              required
                variant="outlined"
                // disabled={isEdit} // Có thể không cho sửa email
              />
              {/* Chỉ hiển thị password khi tạo mới */}
              {!isEdit && (
                <TextField
                  fullWidth
                  margin="dense"
                  label="Password"
                  name="password"
                  type="password"
                  value={currentUser.password}
                  onChange={handleDialogInputChange}
                  required={!isEdit} // Bắt buộc khi tạo mới
                  variant="outlined"
                  helperText="Min 6 chars, 1 uppercase, 1 number, 1 special char (!@#$%^&*)"
                />
              )}
               <FormControl fullWidth margin="dense" variant="outlined">
                 <InputLabel>Roles</InputLabel>
              <Select
                   multiple
                   name="roles"
                   value={currentUser.roles}
                   label="Roles"
                   onChange={handleDialogRoleChange}
                   renderValue={(selected) => (
                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                       {(selected || []).map((value) => ( // Xử lý selected có thể là null/undefined
                         <Chip key={value} label={value} size="small" />
                       ))}
                     </Box>
                   )}
                 >
                   {/* Có thể lấy danh sách role từ API */}
                   <MenuItem value="User">User</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                   <MenuItem value="SuperAdmin">SuperAdmin</MenuItem>
              </Select>
            </FormControl>
              <FormControl fullWidth margin="dense" variant="outlined">
                <InputLabel>Gender</InputLabel>
              <Select
                  name="gender"
                  value={currentUser.gender}
                  label="Gender"
                  onChange={handleDialogInputChange}
                >
                  <MenuItem value={true}>Male</MenuItem>
                  <MenuItem value={false}>Female</MenuItem>
              </Select>
            </FormControl>
              <TextField
                fullWidth
                margin="dense"
                label="Level"
                name="level"
                type="number"
                value={currentUser.level}
                onChange={handleDialogInputChange}
                InputProps={{ inputProps: { min: 0 } }}
                variant="outlined"
              />
          </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}> {/* Thêm padding */}
          <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
          <Button
            onClick={handleSaveUser}
            variant="contained"
            disabled={loading} // Disable khi đang lưu
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000} // Giảm thời gian một chút
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled" // Dùng filled cho nổi bật
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Users; 