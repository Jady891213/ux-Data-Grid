
import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
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
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Plus
} from 'lucide-react';

// --- Types ---
type StatusType = 'Pending' | 'Approved' | 'Rejected' | 'In Progress';

interface TableData {
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
  rowSpan?: number;
  isMerged?: boolean;
}

interface ColumnDefinition {
  key: keyof TableData | 'actions';
  label: string;
  width: number; // Width in pixels
  fixed?: 'left' | 'right';
  icon: React.ReactNode;
}

// --- Constants ---
const COLUMNS: ColumnDefinition[] = [
  { key: 'orderNo', label: '单据编号', width: 160, fixed: 'left', icon: <FileText size={14} /> },
  { key: 'status', label: '状态', width: 110, fixed: 'left', icon: <Activity size={14} /> },
  { key: 'remark', label: '备注', width: 220, icon: <MessageSquare size={14} /> },
  { key: 'subType', label: '类型', width: 130, icon: <Layers size={14} /> },
  { key: 'source', label: '来源', width: 110, icon: <Share2 size={14} /> },
  { key: 'store', label: '店铺', width: 180, icon: <ShoppingBag size={14} /> },
  { key: 'rowNum', label: '行号', width: 80, icon: <Hash size={14} /> },
  { key: 'quantity', label: '数量', width: 100, icon: <Package size={14} /> },
  { key: 'price', label: '单价', width: 100, icon: <Tag size={14} /> },
  { key: 'sku', label: 'MSKU', width: 160, icon: <Package size={14} /> },
  { key: 'actions', label: '操作', width: 120, fixed: 'right', icon: <Settings size={14} /> },
];

// --- Components ---
const Badge: React.FC<{ status: StatusType }> = ({ status }) => {
  const styles = {
    'Approved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Pending': 'bg-amber-50 text-amber-700 border-amber-200',
    'Rejected': 'bg-rose-50 text-rose-700 border-rose-200',
    'In Progress': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border uppercase tracking-wider ${styles[status]}`}>
      {status}
    </span>
  );
};

// --- Mock Data ---
const generateData = (): TableData[] => {
  const data: TableData[] = [];
  const groups = [
    { no: 'SO20240325001', status: 'Approved', store: 'Amazon US Official', items: 3, remark: '客户要求加急处理' },
    { no: 'SO20240325002', status: 'Pending', store: 'TikTok Shop HK', items: 1, remark: '-' },
    { no: 'SO20240325003', status: 'In Progress', store: 'eBay Enterprise', items: 4, remark: '分批到货确认中' },
    { no: 'SO20240325004', status: 'Rejected', store: 'Walmart Global', items: 2, remark: '库存不足' },
  ];

  groups.forEach((g, gIdx) => {
    for (let i = 0; i < g.items; i++) {
      data.push({
        id: `${gIdx}-${i}`,
        orderNo: g.no,
        status: g.status as StatusType,
        remark: g.remark,
        subType: '常规订单',
        source: '手动同步',
        store: g.store,
        rowNum: i + 1,
        quantity: Math.floor(Math.random() * 20) + 1,
        price: parseFloat((Math.random() * 500 + 10).toFixed(2)),
        sku: `MSKU-B00${Math.floor(Math.random() * 900) + 100}`,
        rowSpan: i === 0 ? g.items : 0,
        isMerged: i > 0
      });
    }
  });
  return data;
};

// --- Main App ---
const App: React.FC = () => {
  const [data] = useState<TableData[]>(generateData());

  const leftFixedColumnsWidths = useMemo(() => {
    let current = 0;
    return COLUMNS.map(c => {
      const prev = current;
      if (c.fixed === 'left') current += c.width;
      return prev;
    });
  }, []);

  return (
    <div className="max-w-[1440px] mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <nav className="text-xs text-slate-400 mb-1 flex items-center gap-2">
            <span>财务管理</span>
            <span>/</span>
            <span className="text-slate-600 font-medium">应收账单明细</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            应收单层级视图
            <span className="text-xs font-normal bg-slate-200 text-slate-600 px-2 py-0.5 rounded">v2.4</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-all shadow-sm">
            <Filter size={16} /> 筛选
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-all shadow-sm">
            <Download size={16} /> 导出
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            <Plus size={16} /> 新增账单
          </button>
        </div>
      </div>

      {/* Main Grid Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto relative">
          <table className="w-full text-sm text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/50">
                {COLUMNS.map((col, idx) => {
                  const isFixedLeft = col.fixed === 'left';
                  const isFixedRight = col.fixed === 'right';
                  const isLastFixedLeft = isFixedLeft && COLUMNS[idx + 1]?.fixed !== 'left';

                  return (
                    <th
                      key={col.key}
                      style={{ 
                        minWidth: col.width,
                        width: col.width,
                        left: isFixedLeft ? leftFixedColumnsWidths[idx] : undefined,
                        right: isFixedRight ? 0 : undefined,
                      }}
                      className={`
                        z-20 sticky top-0 py-4 px-4 font-bold text-slate-500 text-[11px] uppercase tracking-widest border-b border-slate-200 bg-slate-50/80 backdrop-blur-md
                        ${isFixedLeft ? 'sticky left-0 bg-slate-50/90' : ''}
                        ${isFixedRight ? 'sticky right-0 bg-slate-50/90' : ''}
                        ${isLastFixedLeft ? 'sticky-left-last' : ''}
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-indigo-500/70">{col.icon}</span>
                        {col.label}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((row, rowIndex) => (
                <tr key={row.id} className="group transition-colors hover:bg-slate-50/50">
                  {COLUMNS.map((col, colIdx) => {
                    const isFixedLeft = col.fixed === 'left';
                    const isFixedRight = col.fixed === 'right';
                    const isLastFixedLeft = isFixedLeft && COLUMNS[colIdx + 1]?.fixed !== 'left';
                    
                    // Logic for Merged Cells (Order-level data)
                    const isMergedCol = ['orderNo', 'status', 'remark', 'subType', 'source', 'store'].includes(col.key);
                    const shouldRender = !isMergedCol || !row.isMerged;
                    const rowSpan = isMergedCol ? row.rowSpan : 1;

                    if (!shouldRender) return null;

                    return (
                      <td
                        key={col.key}
                        rowSpan={rowSpan}
                        style={{ 
                          left: isFixedLeft ? leftFixedColumnsWidths[colIdx] : undefined,
                          right: isFixedRight ? 0 : undefined,
                        }}
                        className={`
                          py-3.5 px-4 text-slate-600 align-middle
                          ${isFixedLeft ? 'sticky bg-white z-10 group-hover:bg-slate-50 transition-colors' : ''}
                          ${isFixedRight ? 'sticky bg-white z-10 group-hover:bg-slate-50 transition-colors border-l border-slate-100 sticky-right-first' : ''}
                          ${isLastFixedLeft ? 'sticky-left-last border-r border-slate-100' : ''}
                          ${row.isMerged && !isMergedCol ? 'bg-indigo-50/10' : ''}
                          ${rowSpan > 1 ? 'bg-white font-medium shadow-[inset_-1px_0_0_0_#f1f5f9]' : ''}
                        `}
                      >
                        {col.key === 'status' ? (
                          <Badge status={row.status} />
                        ) : col.key === 'orderNo' ? (
                          <span className="text-slate-900 font-semibold font-mono tracking-tight cursor-pointer hover:text-indigo-600 transition-colors">
                            {row.orderNo}
                          </span>
                        ) : col.key === 'price' ? (
                          <span className="tabular-nums text-slate-900 font-medium">¥{row.price.toLocaleString()}</span>
                        ) : col.key === 'quantity' ? (
                          <span className="tabular-nums bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs">{row.quantity}</span>
                        ) : col.key === 'actions' ? (
                          <div className="flex items-center gap-1.5">
                            <button title="查看详情" className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                              <Eye size={16} />
                            </button>
                            <button title="编辑" className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                              <Edit size={16} />
                            </button>
                            <div className="w-[1px] h-4 bg-slate-200 mx-1"></div>
                            <button title="删除" className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ) : (
                          <span className={isMergedCol ? 'text-slate-900' : 'text-slate-500'}>
                            {row[col.key as keyof TableData]}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Improved Pagination Footer */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>
              显示 <span className="font-semibold text-slate-900">1</span> 到 <span className="font-semibold text-slate-900">10</span> 之 <span className="font-semibold text-slate-900">{data.length}</span> 行数据
            </span>
            <select className="bg-transparent border border-slate-300 rounded-md py-1 px-2 text-slate-600 outline-none focus:ring-1 focus:ring-indigo-500 text-[11px]">
              <option>10 条/页</option>
              <option>20 条/页</option>
              <option>50 条/页</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 border border-slate-200 bg-white rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm">
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center px-1">
              <button className="w-8 h-8 rounded-lg bg-indigo-600 text-white text-xs font-bold shadow-sm">1</button>
              <button className="w-8 h-8 rounded-lg text-slate-600 text-xs font-medium hover:bg-slate-200/50">2</button>
              <button className="w-8 h-8 rounded-lg text-slate-600 text-xs font-medium hover:bg-slate-200/50">3</button>
              <span className="px-1 text-slate-300">...</span>
              <button className="w-8 h-8 rounded-lg text-slate-600 text-xs font-medium hover:bg-slate-200/50">12</button>
            </div>
            <button className="p-2 border border-slate-200 bg-white rounded-lg text-slate-400 hover:bg-slate-50 transition-all shadow-sm">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid Stats Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: '总金额', value: '¥1,248,390.00', color: 'indigo' },
          { label: '待处理账单', value: '12', color: 'amber' },
          { label: '已完成单据', value: '482', color: 'emerald' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">{stat.label}</span>
            <span className={`text-lg font-bold text-${stat.color}-600`}>{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Render ---
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
