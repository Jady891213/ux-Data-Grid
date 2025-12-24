
import React from 'react';
import { 
  FileText, 
  Activity, 
  MessageSquare, 
  Layers, 
  Share2, 
  ShoppingBag, 
  Hash, 
  Package, 
  Tag, 
  Settings,
  MoreVertical,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { ColumnDefinition } from './types';

export const COLUMNS: ColumnDefinition[] = [
  { key: 'orderNo', label: '单据编号', width: '160px', fixed: 'left', icon: <FileText size={16} /> },
  { key: 'status', label: '单据状态', width: '120px', fixed: 'left', icon: <Activity size={16} /> },
  { key: 'remark', label: '备注', width: '200px', icon: <MessageSquare size={16} /> },
  { key: 'subType', label: '子类型', width: '140px', icon: <Layers size={16} /> },
  { key: 'source', label: '来源', width: '120px', icon: <Share2 size={16} /> },
  { key: 'store', label: '店铺', width: '180px', icon: <ShoppingBag size={16} /> },
  { key: 'rowNum', label: '行号', width: '100px', icon: <Hash size={16} /> },
  { key: 'quantity', label: '数量', width: '100px', icon: <Package size={16} /> },
  { key: 'price', label: '单价', width: '100px', icon: <Tag size={16} /> },
  { key: 'sku', label: 'MSKU', width: '160px', icon: <Package size={16} /> },
  { key: 'actions', label: '操作', width: '120px', fixed: 'right', icon: <Settings size={16} /> },
];

export const ICONS = {
  MoreVertical, Eye, Edit, Trash2
};
