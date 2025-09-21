
import React from 'react';

const Spinner: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-primary"></div>
      {message && <p className="mt-4 text-lg font-semibold text-brand-dark">{message}</p>}
    </div>
  );
};

export default Spinner;
