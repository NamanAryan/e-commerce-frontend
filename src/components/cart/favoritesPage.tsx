import React, { useState, useEffect } from 'react';
import { Rocket, CheckCircle } from 'lucide-react';

interface ComingSoonProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  countdown?: {
    targetDate: Date;
    onCountdownComplete?: () => void;
  };
  notifyEmail?: boolean;
}

const ComingSoon: React.FC<ComingSoonProps> = ({
  title = "Coming Soon",
  subtitle = "We're working on something awesome!",
  backgroundImage,
  countdown,
  notifyEmail = true
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (!countdown) return;

    const timer = setInterval(() => {
      const difference = countdown.targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        clearInterval(timer);
        countdown.onCountdownComplete && countdown.onCountdownComplete();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleEmailSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically integrate with your backend email subscription service
    // For now, we'll just simulate a subscription
    if (email) {
      setSubscribed(true);
      // Reset email input after a short delay
      setTimeout(() => {
        setEmail('');
      }, 2000);
    }
  };

  return (
    <div 
      className={`min-h-screen flex items-center justify-center relative overflow-hidden p-6 ${backgroundImage ? 'bg-cover bg-center' : 'bg-gradient-to-br from-blue-50 to-blue-100'}`}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
    >
      <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm"></div>
      
      <div className="relative z-10 max-w-2xl w-full text-center bg-white/90 rounded-2xl shadow-2xl p-10 border border-blue-100">
        <div className="mb-8">
          <Rocket className="mx-auto mb-4 text-blue-600 animate-bounce" size={64} />
          <h1 className="text-4xl font-bold mb-4 text-gray-800 tracking-tight">{title}</h1>
          <p className="text-xl text-gray-600 mb-6">{subtitle}</p>
        </div>

        {countdown && (
          <div className="flex justify-center space-x-4 mb-8">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="bg-blue-50 p-4 rounded-xl shadow-md w-24">
                <div className="text-4xl font-bold text-blue-600">{value.toString().padStart(2, '0')}</div>
                <div className="text-sm text-gray-500 uppercase">{unit}</div>
              </div>
            ))}
          </div>
        )}

        {notifyEmail && !subscribed && (
          <form onSubmit={handleEmailSubscription} className="max-w-md mx-auto">
            <div className="flex rounded-full bg-white shadow-lg overflow-hidden">
              <input 
                type="email" 
                placeholder="Enter your email for updates" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-grow px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-6 py-3 hover:bg-blue-700 transition-colors"
              >
                Notify Me
              </button>
            </div>
          </form>
        )}

        {subscribed && (
          <div className="flex items-center justify-center text-green-600 space-x-2">
            <CheckCircle size={24} />
            <span className="text-lg font-semibold">Thanks for subscribing!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComingSoon;