import React from 'react';

interface AddDailyModalProps {
  onClose: () => void;
  onAdd: () => void;
  initialTransportId: string | null;
  deliveryId: string;
}

const AddDailyModal: React.FC<AddDailyModalProps> = ({ onClose, onAdd, initialTransportId, deliveryId }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Daily Entry</h2>
        {/* Add form fields and logic here */}
        <button onClick={onAdd}>Add</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AddDailyModal; 