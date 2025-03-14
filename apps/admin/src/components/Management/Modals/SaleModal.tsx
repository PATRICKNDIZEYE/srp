import React from 'react';

interface SaleModalProps {
  sale: any; // Replace 'any' with the appropriate type
  onClose: () => void;
  onSave: (saleData: any) => void; // Replace 'any' with the appropriate type
}

const SaleModal: React.FC<SaleModalProps> = ({ sale, onClose, onSave }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Sale</h2>
        {/* Add form fields for editing a sale */}
        <button onClick={onClose}>Close</button>
        <button onClick={() => onSave(sale)}>Save</button>
      </div>
    </div>
  );
};

export default SaleModal; 