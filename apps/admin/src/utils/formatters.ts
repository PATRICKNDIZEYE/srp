export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('rw-RW').format(num);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('rw-RW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}; 