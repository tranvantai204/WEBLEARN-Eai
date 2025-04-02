import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ApiKeyModal() {
    return (
        <div className="modal" id="apiKeyModal">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>API Key Management</h3>
                    <button className="close-button">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="modal-body">
                    <div className="api-key-section">
                        <h4>Your API Key</h4>
                        <div className="api-key-display">
                            <code>abc123def456ghi789</code>
                            <button className="btn btn-sm btn-outline">
                                <i className="fas fa-copy"></i>
                            </button>
                        </div>
                    </div>
                    <div className="api-usage-section">
                        <h4>API Usage</h4>
                        <div className="progress">
                            <div className="progress-bar" style={{ width: '75%' }}>
                                75% used
                            </div>
                        </div>
                        <p className="text-muted">750/1000 requests this month</p>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-outline">Close</button>
                    <button className="btn btn-primary">Generate New Key</button>
                </div>
            </div>
        </div>
    );
}

export default ApiKeyModal; 