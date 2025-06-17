import React, { useRef, useEffect } from 'react';

const LogPanel = ({ title, messages, messageType }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getSignalRMessageClass = (type) => {
    switch (type) {
      case 'Error':
        return 'text-danger';
      case 'Event':
        return 'text-primary';
      case 'Question':
        return 'text-success';
      case 'Result':
        return 'text-info'; // Bootstrap doesn't have a direct purple, using info
      default:
        return '';
    }
  };

  return (
    <div className="card shadow-lg">
      <h3 className="card-header bg-light p-3 h5 fw-semibold">{title}</h3>
      <div 
        className="card-body p-3 overflow-y-auto" 
        style={{ height: '16rem' }} // 16rem is 256px, similar to h-64 (1rem = 16px)
      >
        {messages.map((msg, i) => {
          const content = typeof msg === 'string' ? msg : msg.message;
          const time = typeof msg === 'string' ? '' : msg.time;
          const type = typeof msg === 'string' ? '' : msg.type;
          
          return (
            <div 
              key={i} 
              className={`small py-1 border-bottom border-light ${
                messageType === 'signalr' ? getSignalRMessageClass(type) : ''
              }`}
            >
              {messageType === 'signalr' && time && type && (
                <span className="small text-muted">
                  {time} [{type}]
                </span>
              )}{' '}
              {content}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default LogPanel;