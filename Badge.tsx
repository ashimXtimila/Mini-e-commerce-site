import React from 'react';
const Badge = ({ children }) => {
  return (
    <span className="bg-green-200 text-green-800 py-1 px-2 rounded-full">
      {children}
    </span>
  );
};
export default Badge;