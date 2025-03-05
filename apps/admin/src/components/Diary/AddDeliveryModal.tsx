import React from 'react';

interface AddDeliveryModalProps {
  onClose: () => void;
  onAdd: () => void;
}

const AddDeliveryModal: React.FC<AddDeliveryModalProps> = ({ onClose, onAdd }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Delivery</h2>
        {/* Add form fields and logic here */}
        <button onClick={onAdd}>Add</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AddDeliveryModal;
