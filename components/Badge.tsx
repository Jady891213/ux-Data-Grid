
import React from 'react';
import { StatusType } from '../types';

interface BadgeProps {
  status: StatusType;
}

const Badge: React.FC<BadgeProps> = ({ status }) => {
  const styles = {
    'Approved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Pending': 'bg-amber-50 text-amber-700 border-amber-200',
    'Rejected': 'bg-rose-50 text-rose-700 border-rose-200',
    'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {status}
    </span>
  );
};

export default Badge;
