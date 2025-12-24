
import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  FileText, Activity, MessageSquare, Layers, Share2, 
  ShoppingBag, Hash, Package, Tag, Settings, Eye, 
  Edit, Trash2, Download, Plus, Layout, Zap, List,
  Moon, Coffee, Terminal, Sparkles
} from 'lucide-react';

// --- Types ---
type StatusType = 'Pending' | 'Approved' | 'Rejected' | 'In Progress';
type ThemeType = 'saas' | 'cyber' | 'paper' | 'terminal';

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

// --- Theme Configs ---
const THEMES: Record<ThemeType, any> = {
  saas: {
    name: 'SaaS Modern',
    desc: '清新简洁，标准的现代管理后台风格',
    bg: 'bg-slate-50',
    sidebar: 'bg-white border-r border-slate-200',
    container: 'bg-white rounded-xl shadow-lg border border-slate-200',
    header: 'bg-slate-50/80 text-slate-500 border-b border-slate-200 backdrop-blur',
    row: 'hover:bg-indigo-50/40 divide-slate-100',
    cell: 'py-4 px-4 text-slate-600',
    badge: {
      'Approved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Pending': 'bg-amber-50 text-amber-700 border-amber-200',
      'Rejected': 'bg-rose-50 text-rose-700 border-rose-200',
      'In Progress': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    actionBtn: 'hover:bg-slate-100 text-slate-400 hover:text-indigo-600',
    stickyShadow: 'after:bg-gradient-to-r after:from-slate-200/50 after:to-transparent'
  },
  cyber: {
    name: 'Cyber Dark',
    desc: '极客氛围，高对比度暗色科技感',
    bg: 'bg-[#0b0e14]',
    sidebar: 'bg-[#151921] border-r border-cyan-900/30 text-slate-300',
    container: 'bg-[#151921] rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-cyan-900/30 overflow-hidden',
    header: 'bg-[#1c232d] text-cyan-400 border-b border-cyan-500/20 font-mono text-[10px]',
    row: 'hover:bg-cyan-500/5 divide-slate-800',
    cell: 'py-4 px-4 text-slate-400 border-slate-800',
    badge: {
      'Approved': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      'Pending': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      'Rejected': 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      'In Progress': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    },
    actionBtn: 'hover:bg-cyan-500/20 text-slate-500 hover:text-cyan-400',
    stickyShadow: 'after:bg-gradient-to-r after:from-cyan-500/10 after:to-transparent'
  },
  paper: {
    name: 'Elegant Paper',
    desc: '如纸质报表般优雅，适合高端财务审计',
    bg: 'bg-[#fcfaf7]',
    sidebar: 'bg-[#f5f1ea] border-r border-[#e0d8cc] text-[#5c4b37]',
    container: 'bg-white rounded-sm shadow-xl border border-[#e0d8cc] relative',
    header: 'bg-[#f5f1ea] text-[#8c7a66] border-b-2 border-[#d6ccbe] italic font-serif',
    row: 'hover:bg-[#fcfaf7] divide-[#f0ede6]',
    cell: 'py-5 px-4 text-[#5c4b37]',
    badge: {
      'Approved': 'border-[#8c9c7e] text-[#4a5d3a] bg-transparent font-serif',
      'Pending': 'border-[#c9ae7c] text-[#7a5d1f] bg-transparent font-serif',
      'Rejected': 'border-[#c98d7c] text-[#8c3a2a] bg-transparent font-serif',
      'In Progress': 'border-[#7c99c9] text-[#2a4e8c] bg-transparent font-serif',
    },
    actionBtn: 'hover:bg-[#f5f1ea] text-[#a69888] hover:text-[#5c4b37]',
    stickyShadow: 'after:bg-gradient-to-r after:from-[#e0d8cc]/30 after:to-transparent'
  },
  terminal: {
    name: 'Terminal Retro',
    desc: '命令行复古风格，纯粹的数据美学',
    bg: 'bg-black',
    sidebar: 'bg-black border-r border-green-900 text-green-500 font-mono',
    container: 'bg-black border border-green-500/50 rounded-none shadow-[0_0_15px_rgba(34,197,94,0.2)]',
    header: 'bg-green-900/20 text-green-500 border-b border-green-500 uppercase tracking-widest font-mono',
    row: 'hover:bg-green-500/10 divide-green-900/30',
    cell: 'py-2 px-3 text-green-600 font-mono text-xs',
    badge: {
      'Approved': 'text-green-500 border-green-500 bg-transparent',
      'Pending': 'text-yellow-500 border-yellow-500 bg-transparent',
      'Rejected': 'text-red-500 border-red-500 bg-transparent',
      'In Progress': 'text-blue-500 border-blue-500 bg-transparent',
    },
    actionBtn: 'text-green-800 hover:text-green-400 hover:bg-green-900/30',
    stickyShadow: 'after:bg-green-500/20'
  }
};

// --- App ---
const App: React.FC = () => {
  const [themeId, setThemeId] = useState<ThemeType>('saas');
  const [data] = useState<TableData[]>(generateData());

  const theme = THEMES[themeId];

  const leftFixedOffsets = useMemo(() => {
    let current = 0;
    return COLUMNS.map(c => {
      const prev = current;
      if (c.fixed === 'left') current += c.width;
      return prev;
    });
  }, []);

  return (
    <div className={`flex min-h-screen ${theme.bg} transition-colors duration-500`}>
      {/* Sidebar Switcher */}
      <aside className={`w-72 ${theme.sidebar} p-8 flex flex-col gap-10 sticky top-0 h-screen transition-all duration-500`}>
        <div>
          <h1 className="flex items-center gap-3 text-xl font-black tracking-tighter mb-8">
            <Sparkles className={themeId === 'cyber' ? 'text-cyan-400' : 'text-indigo-600'} />
            GRID LAB
          </h1>
          
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 font-bold mb-4">切换视觉范式</p>
            {[
              { id: 'saas', icon: <Layout />, label: 'Standard SaaS' },
              { id: 'cyber', icon: <Moon />, label: 'Cyber Dark' },
              { id: 'paper', icon: <Coffee />, label: 'Elegant Paper' },
              { id: 'terminal', icon: <Terminal />, label: 'Terminal Retro' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setThemeId(item.id as ThemeType)}
                className={`w-full group relative flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-semibold transition-all overflow-hidden ${
                  themeId === item.id 
                    ? 'bg-current-theme shadow-lg' 
                    : 'opacity-60 hover:opacity-100 hover:translate-x-1'
                }`}
                style={{
                  backgroundColor: themeId === item.id ? (themeId === 'cyber' ? '#22d3ee20' : (themeId === 'terminal' ? '#22c55e20' : (themeId === 'paper' ? '#d6ccbe' : '#4f46e5'))) : 'transparent',
                  color: themeId === item.id ? (themeId === 'paper' ? '#5c4b37' : (themeId === 'saas' ? '#fff' : (themeId === 'cyber' ? '#22d3ee' : '#22c55e'))) : 'inherit'
                }}
              >
                {item.icon}
                <div className="flex flex-col items-start">
                  <span>{item.label}</span>
                  <span className="text-[10px] opacity-60 font-normal">{THEMES[item.id as ThemeType].name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className={`mt-auto p-5 rounded-2xl border ${themeId === 'cyber' ? 'border-cyan-900/30 bg-cyan-950/20' : 'border-slate-200 bg-slate-100/50'}`}>
          <p className="text-xs font-bold mb-2 opacity-80 uppercase tracking-wider">当前风格特征</p>
          <p className="text-xs leading-relaxed opacity-60 italic">"{theme.desc}"</p>
        </div>
      </aside>

      {/* Main Grid View */}
      <main className="flex-1 p-10 overflow-hidden">
        <header className="mb-10 flex items-end justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
               <span className="w-8 h-[2px] bg-current" style={{ backgroundColor: themeId === 'cyber' ? '#22d3ee' : (themeId === 'terminal' ? '#22c55e' : '#4f46e5') }}></span>
               <span className="text-[10px] uppercase tracking-[0.3em] opacity-50">Operational View</span>
            </div>
            <h2 className={`text-4xl font-bold ${themeId === 'cyber' ? 'text-white' : (themeId === 'terminal' ? 'text-green-500' : 'text-slate-900')}`}>
              应收账单明细
            </h2>
          </div>
          
          <div className="flex gap-3">
             <button className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all border ${
               themeId === 'cyber' ? 'bg-[#1c232d] border-cyan-900/30 text-cyan-400 hover:bg-cyan-900/20' : 
               themeId === 'terminal' ? 'bg-black border-green-500 text-green-500 hover:bg-green-950' :
               themeId === 'paper' ? 'bg-[#f5f1ea] border-[#d6ccbe] text-[#5c4b37]' :
               'bg-white border-slate-200 text-slate-600 hover:shadow-md'
             }`}>
               <Download size={16} /> 导出报表
             </button>
             <button className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-xl ${
               themeId === 'cyber' ? 'bg-cyan-500 text-[#0b0e14] hover:bg-cyan-400 shadow-cyan-500/20' : 
               themeId === 'terminal' ? 'bg-green-500 text-black hover:bg-green-400' :
               themeId === 'paper' ? 'bg-[#5c4b37] text-white' :
               'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
             }`}>
               <Plus size={16} /> 新增入账
             </button>
          </div>
        </header>

        {/* The Grid */}
        <div className={`${theme.container} transition-all duration-700`}>
          <div className="overflow-x-auto relative">
            <table className={`w-full text-sm text-left border-separate border-spacing-0`}>
              <thead>
                <tr className={theme.header}>
                  {COLUMNS.map((col, idx) => {
                    const isFixedLeft = col.fixed === 'left';
                    const isFixedRight = col.fixed === 'right';
                    const isLastFixedLeft = isFixedLeft && COLUMNS[idx + 1]?.fixed !== 'left';

                    return (
                      <th
                        key={col.key}
                        style={{ 
                          width: col.width, minWidth: col.width,
                          left: isFixedLeft ? leftFixedOffsets[idx] : undefined,
                          right: isFixedRight ? 0 : undefined,
                        }}
                        className={`
                          z-20 sticky top-0 py-5 px-4 font-bold uppercase border-b transition-all duration-500
                          ${isFixedLeft ? 'sticky left-0 bg-inherit' : ''}
                          ${isFixedRight ? 'sticky right-0 bg-inherit border-l border-slate-700/20' : ''}
                          ${isLastFixedLeft ? `relative ${theme.stickyShadow} after:absolute after:right-0 after:top-0 after:bottom-0 after:w-4` : ''}
                          ${themeId === 'terminal' ? 'tracking-[0.2em]' : 'tracking-widest'}
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
              <tbody className={`divide-y transition-all ${theme.row}`}>
                {data.map((row, rowIndex) => (
                  <tr key={row.id} className="group transition-all">
                    {COLUMNS.map((col, colIdx) => {
                      const isFixedLeft = col.fixed === 'left';
                      const isFixedRight = col.fixed === 'right';
                      const isLastFixedLeft = isFixedLeft && COLUMNS[colIdx + 1]?.fixed !== 'left';
                      
                      const isMergedCol = ['orderNo', 'status', 'remark', 'subType', 'source', 'store'].includes(col.key);
                      const shouldRender = !isMergedCol || !row.isMerged;
                      const rowSpan = isMergedCol ? row.rowSpan : 1;

                      if (!shouldRender) return null;

                      return (
                        <td
                          key={col.key}
                          rowSpan={rowSpan}
                          style={{ 
                            left: isFixedLeft ? leftFixedOffsets[colIdx] : undefined,
                            right: isFixedRight ? 0 : undefined,
                          }}
                          className={`
                            ${theme.cell} align-middle transition-colors duration-300
                            ${isFixedLeft ? `sticky z-10 ${themeId === 'saas' ? 'bg-white' : (themeId === 'cyber' ? 'bg-[#151921]' : (themeId === 'terminal' ? 'bg-black' : 'bg-white'))}` : ''}
                            ${isFixedRight ? `sticky right-0 z-10 border-l ${themeId === 'saas' ? 'bg-white border-slate-100' : (themeId === 'cyber' ? 'bg-[#1c232d] border-slate-800' : (themeId === 'terminal' ? 'bg-black border-green-900' : 'bg-white border-[#f0ede6]'))}` : ''}
                            ${isLastFixedLeft ? `relative ${theme.stickyShadow} after:absolute after:right-0 after:top-0 after:bottom-0 after:w-4` : ''}
                            ${row.isMerged && !isMergedCol ? 'opacity-70 bg-black/5' : ''}
                            ${rowSpan > 1 ? 'font-bold' : ''}
                          `}
                        >
                          {col.key === 'status' ? (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${theme.badge[row.status]}`}>
                              {row.status}
                            </span>
                          ) : col.key === 'actions' ? (
                            <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                              <button className={`p-1.5 rounded transition-all ${theme.actionBtn}`}><Eye size={14} /></button>
                              <button className={`p-1.5 rounded transition-all ${theme.actionBtn}`}><Edit size={14} /></button>
                              <button className={`p-1.5 rounded transition-all ${theme.actionBtn}`}><Trash2 size={14} /></button>
                            </div>
                          ) : col.key === 'price' ? (
                            <span className={`${themeId === 'terminal' ? 'text-green-400' : 'text-current'}`}>
                               ¥{row.price.toLocaleString()}
                            </span>
                          ) : (
                            <span className={isMergedCol ? 'opacity-100' : 'opacity-80'}>
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
        </div>
      </main>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
