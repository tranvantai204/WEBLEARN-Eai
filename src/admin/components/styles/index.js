// First, import common CSS which has the CSS variables
import './common.css';

// Then import other CSS files that depend on the variables
import './MainLayout.css';
import './Dashboard.css';
import './Login.css';
import './Users.css';
import './ContentReports.css';

// Export all in one file
export default {
  common: './common.css',
  mainLayout: './MainLayout.css',
  dashboard: './Dashboard.css',
  login: './Login.css',
  users: './Users.css',
  contentReports: './ContentReports.css',
}; 