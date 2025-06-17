import React from 'react';

const ConnectionConfig = ({ 
  token, 
  setToken, 
  apiBaseUrl, 
  setApiBaseUrl, 
  connectToHub, 
  connectionStatus 
}) => (
  <div className="card shadow-lg mb-4 d-none"> 
    <div className="card-body p-4"> 
      <h2 className="card-title h3 fw-semibold mb-4">Cấu Hình Kết Nối</h2> 
      
      <div className="row g-3"> 
        <div className="col-md-6">
          <label htmlFor="apiBaseUrlInput" className="form-label fw-medium mb-2">API Base URL</label> 
          <input 
            type="text" 
            className="form-control" 
            id="apiBaseUrlInput"
            value={apiBaseUrl} 
            onChange={(e) => setApiBaseUrl(e.target.value)} 
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="jwtTokenInput" className="form-label fw-medium mb-2">JWT Token</label>
          <textarea 
            className="form-control" 
            id="jwtTokenInput"
            rows="3" 
            value={token} 
            onChange={(e) => setToken(e.target.value)} 
            placeholder="Dán JWT token vào đây"
          />
        </div>
      </div>
      
      <div className="mt-4">
        <button 
          type="button" 
          className="btn btn-primary btn-lg me-3" 
          onClick={connectToHub}
          disabled={connectionStatus === 'Connected'}
        >
          Kết Nối SignalR
        </button>
        <span className={`small ${connectionStatus === 'Connected' ? 'text-success' : 'text-danger'}`}> 
          Trạng thái: {connectionStatus}
        </span>
      </div>
    </div>
  </div>
);

export default ConnectionConfig;