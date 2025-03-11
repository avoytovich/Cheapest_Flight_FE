'use client';

import React from 'react';

interface ErrorProps {
  message: string;
}

const Error: React.FC<ErrorProps> = ({
  message = 'Oops! Something went wrong.',
}) => {
  return (
    <div className="error col-span-2 flex flex-col items-center justify-center p-6 border-4 border-red-400 bg-red-50 rounded-2xl shadow-lg m-6">
      <h1>Error 😢</h1>
      <p className="text-center font-medium">{message}</p>
    </div>
  );
};

export default Error;
