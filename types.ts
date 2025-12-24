
import React from 'react';

export type StatusType = 'Pending' | 'Approved' | 'Rejected' | 'In Progress';

export interface TableData {
  id: string;
  orderNo: string;
  status: StatusType;
  remark: string;
  subType: string;
  source: string;
  store: string;
  rowNum: number;
  quantity: number;
  price: number;
  sku: string;
  // Merging info
  rowSpan?: number;
  isMerged?: boolean;
}

export interface ColumnDefinition {
  key: keyof TableData | 'actions';
  label: string;
  width: string;
  fixed?: 'left' | 'right';
  // Fixed error: Cannot find namespace 'React'
  icon?: React.ReactNode;
}
