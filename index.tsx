
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  FileText, Activity, MessageSquare, Layers, Share2, 
  ShoppingBag, Hash, Package, Tag, Settings, Eye, 
  Edit, Trash2, Download, Plus, Layout, Zap, Grid,
  MousePointer2, Sparkles, Move
} from 'lucide-react';

// --- Types ---
type StatusType = 'Pending' | 'Approved' | 'Rejected' | 'In Progress';
type ThemeType = 'saas' | 'cyber' | 'sheet';

interface SelectionRange {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}

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
  width: number;
  fixed?: 'left' | 'right';
  icon: React.ReactNode;
}

// --- Constants ---
const COLUMNS: ColumnDefinition[] = [
  { key: 'orderNo', label: '单据编号', width: 160, fixed: 'left', icon: <FileText size={14} /> },
  { key: 'status', label: '状态', width: 110, fixed: 'left', icon: <Activity size={14} /> },
  { key: 'remark', label: '备注', width: 220, icon: <MessageSquare size={14} /> },
  { key: 'subType', label: '类型', width: 120, icon: <Layers size={14} /> },
  { key: 'source', label: '来源', width: 100, icon: <Share2 size={14} /> },
  { key: 'store', label: '店铺', width: 180, icon: <ShoppingBag size={14} /> },
  { key: 'rowNum', label: '行号', width: 70, icon: <Hash size={14} /> },
  { key: 'quantity', label: '数量', width: 80, icon: <Package size={14} /> },
  { key: 'price', label: '单价', width: 90, icon: <Tag size={14} /> },
  { key: 'sku', label: 'MSKU', width: 150, icon: <Package size={14} /> },
  { key: 'actions', label: '操作', width: 120, fixed: 'right', icon: <Settings size={14} /> },
];

const generateData = (): TableData[] => {
  const data: TableData[] = [];
  const groups = [
    { no: 'SO-2024-001', status: 'Approved', store: 'Amazon US Official', items: 3, remark: '客户要求加急' },
    { no: 'SO-2024-002', status: 'Pending', store: 'TikTok Shop HK', items: 1, remark: '-' },
    { no: 'SO-2024-003', status: 'In Progress', store: 'eBay Enterprise', items: 4, remark: '分批到货' },
    { no: 'SO-2024-004', status: 'Rejected', store: 'Walmart Global', items: 2, remark: '库存不足' },
  ];
  groups.forEach((g, gIdx) => {
    for (let i = 0; i < g.items; i++) {
      data.push({
        id: `${gIdx}-${i}`,
        orderNo: g.no,
        status: g.status as StatusType,
        remark: g.remark,
        subType: '常规订单',
        source: '自动同步',
        store: g.store,
        rowNum: i + 1,
        quantity: Math.floor(Math.random() * 20) + 1,
        price: parseFloat((Math.random() * 500 + 10).toFixed(2)),
        sku: `SKU-${Math.floor(Math.random() * 900) + 100}`,
        rowSpan: i === 0 ? g.items : 0,
        isMerged: i > 0
      });
    }
  });
  return data;
};

const THEMES: Record<ThemeType, any> = {
  saas: {
    name: 'SaaS Modern',
    desc: '宽敞现代，柔和的蓝色批量选中区',
    bg: 'bg-slate-50',
    sidebar: 'bg-white border-r border-slate-200',
    container: 'bg-white rounded-2xl shadow-xl border border-slate-200',
    header: 'bg-slate-50 text-slate-500 border-b border-slate-200',
    cell: 'py-4 px-4 text-slate-600',
    rangeBg: 'bg-indigo-500/10',
    borderTop: 'border-t-2 border-indigo-500',
    borderBottom: 'border-b-2 border-indigo-500',
    borderLeft: 'border-l-2 border-indigo-500',
    borderRight: 'border-r-2 border-indigo-500',
    handle: 'hidden'
  },
  cyber: {
    name: 'Cyber Dark',
    desc: '暗色背景，霓虹青色批量选中光效',
    bg: 'bg-[#0b0e14]',
    sidebar: 'bg-[#151921] border-r border-white/5 text-slate-300',
    container: 'bg-[#151921] rounded-lg border border-cyan-500/20 shadow-2xl overflow-hidden',
    header: 'bg-[#0d1117] text-cyan-400 border-b border-cyan-500/20 font-mono text-[11px]',
    cell: 'py-4 px-4 text-slate-400',
    rangeBg: 'bg-cyan-400/5',
    borderTop: 'border-t-2 border-cyan-400 shadow-[0_-2px_10px_rgba(34,211,238,0.3)]',
    borderBottom: 'border-b-2 border-cyan-400 shadow-[0_2px_10px_rgba(34,211,238,0.3)]',
    borderLeft: 'border-l-2 border-cyan-400 shadow-[-2px_0_10px_rgba(34,211,238,0.3)]',
    borderRight: 'border-r-2 border-cyan-400 shadow-[2px_0_10px_rgba(34,211,238,0.3)]',
    handle: 'hidden'
  },
  sheet: {
    name: 'Sheet Pro',
    desc: '经典 Excel 风格，支持拖拽批量选中效果',
    bg: 'bg-[#f0f2f5]',
    sidebar: 'bg-slate-100 border-r border-slate-300 text-slate-700',
    container: 'bg-white border border-slate-300 shadow-sm rounded-none',
    header: 'bg-[#e9ecef] text-slate-600 border-b border-slate-300 font-semibold',
    cell: 'py-1.5 px-3 text-slate-700 border-r border-slate-200 border-b border-slate-200 text-xs font-sans',
    rangeBg: 'bg-[#217346]/10',
    borderTop: 'border-t-2 border-[#217346]',
    borderBottom: 'border-b-2 border-[#217346]',
    borderLeft: 'border-l-2 border-[#217346]',
    borderRight: 'border-r-2 border-[#217346]',
    handle: 'block absolute bottom-[-4.5px] right-[-4.5px] w-2.5 h-2.5 bg-[#217346] border border-white cursor-crosshair z-50'
  }
};

const App: React.FC = () => {
  const [themeId, setThemeId] = useState<ThemeType>('saas');
  const [data] = useState<TableData[]>(generateData());
  const [selection, setSelection] = useState<SelectionRange | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const theme = THEMES[themeId];

  const leftOffsets = useMemo(() => {
    let current = 0;
    return COLUMNS.map(c => {
      const prev = current;
      if (c.fixed === 'left') current += c.width;
      return prev;
    });
  }, []);

  // Selection Logic Helpers
  const isSelected = useCallback((row: number, colIdx: number) => {
    if (!selection) return false;
    const minRow = Math.min(selection.startRow, selection.endRow);
    const maxRow = Math.max(selection.startRow, selection.endRow);
    const minCol = Math.min(selection.startCol, selection.endCol);
    const maxCol = Math.max(selection.startCol, selection.endCol);
    return row >= minRow && row <= maxRow && colIdx >= minCol && colIdx <= maxCol;
  }, [selection]);

  const isEdge = useCallback((row: number, colIdx: number, edge: 'top' | 'bottom' | 'left' | 'right') => {
    if (!selection) return false;
    const minRow = Math.min(selection.startRow, selection.endRow);
    const maxRow = Math.max(selection.startRow, selection.endRow);
    const minCol = Math.min(selection.startCol, selection.endCol);
    const maxCol = Math.max(selection.startCol, selection.endCol);
    
    if (edge === 'top') return row === minRow && colIdx >= minCol && colIdx <= maxCol;
    if (edge === 'bottom') return row === maxRow && colIdx >= minCol && colIdx <= maxCol;
    if (edge === 'left') return colIdx === minCol && row >= minRow && row <= maxRow;
    if (edge === 'right') return colIdx === maxCol && row >= minRow && row <= maxRow;
    return false;
  }, [selection]);

  const isFillHandleCorner = useCallback((row: number, colIdx: number) => {
    if (!selection) return false;
    const maxRow = Math.max(selection.startRow, selection.endRow);
    const maxCol = Math.max(selection.startCol, selection.endCol);
    return row === maxRow && colIdx === maxCol;
  }, [selection]);

  // Event Handlers
  const handleMouseDown = (row: number, colIdx: number) => {
    setIsDragging(true);
    setSelection({ startRow: row, startCol: colIdx, endRow: row, endCol: colIdx });
  };

  const handleMouseEnter = (row: number, colIdx: number) => {
    if (isDragging && selection) {
      setSelection({ ...selection, endRow: row, endCol: colIdx });
    }
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  return (
    <div className={`flex min-h-screen ${theme.bg} transition-colors duration-300 select-none`}>
      {/* Sidebar Switcher */}
      <aside className={`w-72 ${theme.sidebar} p-8 flex flex-col gap-10 sticky top-0 h-screen transition-all z-50`}>
        <div>
          <h1 className="flex items-center gap-3 text-xl font-black tracking-tighter mb-10">
            <Sparkles className={themeId === 'cyber' ? 'text-cyan-400' : 'text-indigo-600'} />
            UI LAB v4
          </h1>
          
          <div className="space-y-4">
            {[
              { id: 'saas', icon: <Layout />, label: 'SaaS Modern' },
              { id: 'cyber', icon: <Zap />, label: 'Cyber Dark' },
              { id: 'sheet', icon: <Grid />, label: 'Sheet Pro' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setThemeId(item.id as ThemeType);
                  setSelection(null);
                }}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-semibold transition-all ${
                  themeId === item.id 
                    ? 'bg-current shadow-lg text-white' 
                    : 'opacity-60 hover:opacity-100 hover:bg-slate-200/50'
                }`}
                style={{
                  backgroundColor: themeId === item.id ? (themeId === 'cyber' ? '#06b6d4' : (themeId === 'sheet' ? '#217346' : '#4f46e5')) : 'transparent',
                }}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className={`mt-auto p-5 rounded-2xl border ${themeId === 'cyber' ? 'border-cyan-900/30 bg-cyan-950/20 text-cyan-400' : 'border-slate-200 bg-white/50 text-slate-600 shadow-sm'}`}>
          <div className="flex items-center gap-2 mb-2 font-bold uppercase text-[10px] tracking-widest">
            <Move size={14} /> 批量操作演示
          </div>
          <p className="text-xs leading-relaxed opacity-80 italic">
            按住鼠标左键并拖拽以<b>批量选中</b>单元格。查看不同风格下的“区域聚焦”表现。
          </p>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 p-10 overflow-hidden">
        <header className="mb-8 flex justify-between items-end">
          <div className="space-y-1">
            <span className={`text-[10px] font-bold uppercase tracking-[0.3em] ${themeId === 'cyber' ? 'text-cyan-500' : 'text-indigo-500'}`}>
              Grid Batch Selection Engine
            </span>
            <h2 className={`text-4xl font-black ${themeId === 'cyber' ? 'text-white' : 'text-slate-900'}`}>
              应收单批量视图
            </h2>
          </div>
          <div className="flex gap-2">
            <button className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
               themeId === 'cyber' ? 'bg-[#1c232d] border-cyan-900 text-cyan-400' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <Download size={16} />
            </button>
            <button className={`px-6 py-2 rounded-lg text-sm font-bold shadow-xl transition-all ${
              themeId === 'sheet' ? 'bg-[#217346] text-white' : (themeId === 'cyber' ? 'bg-cyan-500 text-black' : 'bg-indigo-600 text-white')
            }`}>
              批量审核
            </button>
          </div>
        </header>

        <div className={`${theme.container} transition-all duration-500`}>
          <div className="overflow-x-auto relative">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className={theme.header}>
                  {COLUMNS.map((col, idx) => {
                    const isFixedLeft = col.fixed === 'left';
                    const isFixedRight = col.fixed === 'right';

                    return (
                      <th
                        key={col.key}
                        style={{ 
                          width: col.width, minWidth: col.width,
                          left: isFixedLeft ? leftOffsets[idx] : undefined,
                          right: isFixedRight ? 0 : undefined,
                        }}
                        className={`
                          z-40 sticky top-0 py-4 px-4 font-bold uppercase border-b border-slate-300/30
                          ${isFixedLeft ? 'sticky left-0 bg-inherit' : ''}
                          ${isFixedRight ? 'sticky right-0 bg-inherit' : ''}
                        `}
                      >
                        <div className="flex items-center gap-2">
                          <span className="opacity-40">{col.icon}</span>
                          {col.label}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className={themeId === 'cyber' ? 'bg-transparent' : 'bg-white'}>
                {data.map((row, rowIndex) => (
                  <tr key={row.id} className="group">
                    {COLUMNS.map((col, colIdx) => {
                      const isFixedLeft = col.fixed === 'left';
                      const isFixedRight = col.fixed === 'right';
                      
                      const selected = isSelected(rowIndex, colIdx);
                      const top = isEdge(rowIndex, colIdx, 'top');
                      const bottom = isEdge(rowIndex, colIdx, 'bottom');
                      const left = isEdge(rowIndex, colIdx, 'left');
                      const right = isEdge(rowIndex, colIdx, 'right');
                      const showHandle = isFillHandleCorner(rowIndex, colIdx);

                      const isMergedCol = ['orderNo', 'status', 'remark', 'subType', 'source', 'store'].includes(col.key);
                      const shouldRender = !isMergedCol || !row.isMerged;
                      const rowSpan = isMergedCol ? row.rowSpan : 1;

                      if (!shouldRender) return null;

                      return (
                        <td
                          key={col.key}
                          rowSpan={rowSpan}
                          onMouseDown={() => handleMouseDown(rowIndex, colIdx)}
                          onMouseEnter={() => handleMouseEnter(rowIndex, colIdx)}
                          style={{ 
                            left: isFixedLeft ? leftOffsets[colIdx] : undefined,
                            right: isFixedRight ? 0 : undefined,
                          }}
                          className={`
                            ${theme.cell} relative transition-colors cursor-cell select-none
                            ${isFixedLeft ? 'sticky left-0 z-10 bg-inherit' : ''}
                            ${isFixedRight ? 'sticky right-0 z-10 bg-inherit border-l border-slate-200' : ''}
                            ${selected ? theme.rangeBg : ''}
                            ${top ? theme.borderTop + ' z-30' : ''}
                            ${bottom ? theme.borderBottom + ' z-30' : ''}
                            ${left ? theme.borderLeft + ' z-30' : ''}
                            ${right ? theme.borderRight + ' z-30' : ''}
                            ${row.isMerged && !isMergedCol && themeId !== 'sheet' ? 'bg-slate-50/50' : ''}
                            ${themeId === 'cyber' ? 'bg-[#161b22]' : 'bg-white'}
                          `}
                        >
                          {/* Selection UI Handle */}
                          {showHandle && <div className={theme.handle} />}
                          
                          <div className={`w-full overflow-hidden text-ellipsis whitespace-nowrap`}>
                            {col.key === 'status' ? (
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                row.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                                row.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {row.status}
                              </span>
                            ) : col.key === 'actions' ? (
                              <div className="flex items-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                                <button className="p-1 hover:bg-slate-100 rounded transition-colors"><Eye size={14} /></button>
                                <button className="p-1 hover:bg-slate-100 rounded transition-colors"><Edit size={14} /></button>
                                <button className="p-1 hover:bg-rose-50 rounded text-rose-500 transition-colors"><Trash2 size={14} /></button>
                              </div>
                            ) : col.key === 'price' ? (
                              <span className="tabular-nums font-mono opacity-90">¥{row.price.toLocaleString()}</span>
                            ) : (
                              <span className={isMergedCol && rowSpan > 1 ? 'font-bold' : ''}>{row[col.key as keyof TableData]}</span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
