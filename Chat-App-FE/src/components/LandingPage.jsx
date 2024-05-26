import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleStartChat = () => {
    navigate('/register');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Welcome to the Chat App</h1>
      <button
        onClick={handleStartChat}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg"
      >
        Start Chat
      </button>
    </div>
  );
};

export default LandingPage;