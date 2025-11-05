
export const translateStatus = (status) => {
  const translations = {
    'Open': 'Terbuka',
    'In Progress': 'Dikerjakan',
    'Closed': 'Selesai',
  };
  return translations[status] || status;
};

export const translatePriority = (priority) => {
    const translations = {
      'High': 'Tinggi',
      'Medium': 'Sedang',
      'Low': 'Rendah',
    };
    return translations[priority] || priority;
};

export const translateCategory = (category) => {
    const translations = {
        'Technical': 'Teknis',
        'Billing': 'Tagihan',
        'Umum': 'Umum',
    };
    return translations[category] || category;
};
