// Success and Error notification utilities for consistent messaging

export const showSuccessMessage = (message, duration = 2000) => {
  const successMessage = document.createElement('div');
  successMessage.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
      z-index: 10000;
      font-weight: 600;
      animation: slideIn 0.3s ease-out;
    ">
      ✅ ${message}
    </div>
  `;
  
  // Add CSS animation
  if (!document.getElementById('notification-animation-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-animation-styles';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(successMessage);
  
  setTimeout(() => {
    if (document.body.contains(successMessage)) {
      document.body.removeChild(successMessage);
    }
  }, duration);
};

export const showErrorMessage = (message, duration = 3000) => {
  const errorMessage = document.createElement('div');
  errorMessage.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3);
      z-index: 10000;
      font-weight: 600;
      animation: slideIn 0.3s ease-out;
    ">
      ❌ ${message}
    </div>
  `;
  
  document.body.appendChild(errorMessage);
  
  setTimeout(() => {
    if (document.body.contains(errorMessage)) {
      document.body.removeChild(errorMessage);
    }
  }, duration);
};