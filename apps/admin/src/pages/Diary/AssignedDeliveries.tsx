import React, { useState, useEffect } from 'react';
// other imports...
import { useUserContext } from '../../context/UserContext'; // Correct import

const AssignedDeliveries = () => {
  const { userId } = useUserContext(); // Use the correct hook

  useEffect(() => {
    // Example of using userId
    console.log('User ID:', userId);
    // Fetch assigned deliveries or other logic here
  }, [userId]);

  return (
    <div>
      {/* Your component JSX here */}
    </div>
  );
};

export default AssignedDeliveries; 