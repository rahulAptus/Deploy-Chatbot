import React from "react";

const Offline: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800">Offline</h1>
      <p className="mt-2 text-gray-600">
        Please check your internet connection.
      </p>
    </div>
  );
};

export default Offline;
