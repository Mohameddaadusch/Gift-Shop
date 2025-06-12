import React from 'react';
import { Calendar, Gift, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const ReminderCTA: React.FC = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (user) {
      navigate('/profile#reminders');
    } else {
      navigate('/login?returnTo=/profile#reminders');
    }
  };
  
  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="lg:flex">
            <div className="lg:w-1/2 p-8 sm:p-12 lg:pr-4">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 text-primary-600 mb-5">
                <Bell size={24} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Never Miss an Important Occasion
              </h2>
              <p className="text-gray-600 mb-6 sm:text-lg">
                Set up reminders for birthdays, anniversaries, and special events. We'll notify you with plenty of time to find the perfect gift.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-success-100 text-success-700 mt-1">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-700">
                    <span className="font-medium">Personalized reminders</span> for upcoming events
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-success-100 text-success-700 mt-1">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-700">
                    <span className="font-medium">Tailored gift suggestions</span> based on recipient preferences
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleClick}
                className="mt-8 btn btn-primary px-6 py-3"
              >
                Set Up Reminders
              </button>
            </div>
            
            <div className="lg:w-1/2 relative">
              <div className="h-64 lg:h-full bg-primary-600">
                <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1793035/pexels-photo-1793035.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-20"></div>
                <div className="relative h-full flex items-center justify-center">
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white bg-opacity-20 text-white mb-4">
                      <Calendar size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Important Events</h3>
                    <p className="text-primary-100 mb-6">
                      Keep track of upcoming birthdays, anniversaries, and more
                    </p>
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white bg-opacity-20 text-white mb-4">
                      <Gift size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Perfect Gifts</h3>
                    <p className="text-primary-100">
                      Get AI-powered gift recommendations for each occasion
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ReminderCTA;