import React from 'react';
import { Play } from 'lucide-react';

const MovieLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {/* Simple spinning play icon */}
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
          <Play className="w-8 h-8 text-white ml-1" />
        </div>
        
        {/* Loading text */}
        <p className="text-white text-lg">Loading...</p>
        
        {/* Simple dots */}
        <div className="flex justify-center space-x-1 mt-4">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
};

export default MovieLoader;