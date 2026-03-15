import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  LogIn, 
  Home, 
  Shield,
  Mail,
  Clock,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

const ResetSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, timestamp } = location.state || {};
  
  const [countdown, setCountdown] = useState(5);
  const [securityTips, setSecurityTips] = useState([
    'Regularly update your passwords',
    'Use a password manager',
    'Enable two-factor authentication',
    'Check for suspicious activity',
    'Never share your password'
  ]);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Auto redirect countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      navigate('/login');
    }
  }, [countdown, navigate]);

  // Rotate security tips
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % securityTips.length);
    }, 3000);

    return () => clearInterval(tipInterval);
  }, [securityTips.length]);

  // Format timestamp
  const formatTime = (isoString) => {
    if (!isoString) return 'Just now';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Today';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleTestLogin = () => {
    toast.success('You can now login with your new password!');
  };

  const handleSecurityChecklist = () => {
    navigate('/security-settings');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Toaster position="top-right" />
      
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white text-center">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={48} />
            </div>
            <h1 className="text-3xl font-bold">Password Reset Successful!</h1>
            <p className="text-green-100 mt-2">
              Your password has been successfully updated
            </p>
          </div>

          {/* Main Content */}
          <div className="p-8">
            {/* Success Animation/Icon */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
                <div className="absolute inset-0 animate-ping opacity-20">
                  <div className="w-32 h-32 bg-green-400 rounded-full"></div>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                All Set! 🎉
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Your password has been securely updated. You can now log in to your account with your new password.
              </p>
            </div>

            {/* Account Info Card */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Account</p>
                      <p className="font-medium text-gray-900">{email || 'Your account'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Reset Completed</p>
                      <p className="font-medium text-gray-900">
                        {formatTime(timestamp)} • {formatDate(timestamp)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Shield className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Security Status</p>
                      <p className="font-medium text-green-600">Password Securely Updated</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <RefreshCw className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Auto Redirect</p>
                      <p className="font-medium text-gray-900">
                        In {countdown} second{countdown !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Tips Carousel */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                🔒 Security Tips
              </h3>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <span className="text-sm text-blue-600 font-medium">
                    Tip {currentTipIndex + 1} of {securityTips.length}
                  </span>
                </div>
                <p className="text-center text-gray-800 font-medium text-lg">
                  {securityTips[currentTipIndex]}
                </p>
                <div className="flex justify-center mt-4 space-x-2">
                  {securityTips.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        index === currentTipIndex
                          ? 'w-6 bg-blue-600'
                          : 'w-2 bg-blue-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition flex items-center justify-center gap-3 font-semibold text-lg"
              >
                <LogIn size={24} />
                Go to Login
                <ArrowRight size={20} />
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="w-full py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-3 font-medium"
              >
                <Home size={24} />
                Back to Home
              </button>
            </div>

            {/* Additional Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
              <button
                onClick={handleTestLogin}
                className="py-3 px-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
              >
                Test Login
              </button>
              
              <button
                onClick={handleSecurityChecklist}
                className="py-3 px-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition text-sm font-medium"
              >
                Security Checklist
              </button>
              
              <button
                onClick={() => navigate('/contact-support')}
                className="py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
              >
                Contact Support
              </button>
            </div>

            {/* Final Instructions */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <CheckCircle size={18} />
                What's Next?
              </h4>
              <ul className="text-sm text-green-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-1">✓</span>
                  <span>Log in with your new password on all your devices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">✓</span>
                  <span>Review your recent account activity for anything suspicious</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">✓</span>
                  <span>Consider enabling two-factor authentication for extra security</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">✓</span>
                  <span>Keep your password safe and don't share it with anyone</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-900 text-white p-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-gray-300">
                  Need immediate assistance?
                </p>
                <a 
                  href="mailto:support@example.com" 
                  className="text-green-400 hover:text-green-300 font-medium"
                >
                  support@example.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-400" />
                <span className="text-sm text-gray-300">
                  Your security is our priority
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Countdown Indicator */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">
              Redirecting to login in{' '}
              <span className="font-bold text-green-600">{countdown}</span>{' '}
              second{countdown !== 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Click "Go to Login" above to proceed immediately
          </p>
        </div>
      </div>

      {/* Background Animation */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-green-400 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
`;
document.head.appendChild(style);

export default ResetSuccess;