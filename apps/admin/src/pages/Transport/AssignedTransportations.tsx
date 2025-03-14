const handleVerifyDelivery = async (
  deliveryId: string,
  recipientCode: string,
  quantity: string,
  notes: string
) => {
  try {
    // Update the transportation status to Completed
    const response = await axiosInstance.patch(`/transportations/${deliveryId}/status`, {
      newStatus: 'Completed'
    });

    if (response.status === 200) {
      toast.success('Delivery completed successfully!');
      // Refresh the deliveries list
      const updatedDeliveries = await axiosInstance.get(`/transportations/transport/${userId}`);
      setAssignedDeliveries(updatedDeliveries.data);
      setShowVerificationModal(false);
      setSelectedDelivery(null);
    }
  } catch (error) {
    console.error('Error completing delivery:', error);
    toast.error('Failed to complete delivery');
  }
}; 