
import React, { useState, useMemo } from 'react';
import { COLUMNS, ICONS } from './constants';
import { TableData, StatusType } from './types';
import Badge from './components/Badge';

// Mock Data Generator
const generateMockData = (): TableData[] => {
  const data: TableData[] = [];
  const orders = [
    { id: '1', no: 'ORD-2024-001', status: 'Approved' as StatusType, store: 'Amazon US-Store', count: 5 },
    { id: '2', no: 'ORD-2024-002', status: 'Pending' as StatusType, store: 'Shopify Global', count: 3 },
    { id: '3', no: 'ORD-2024-003', status: 'In Progress' as StatusType, store: 'eBay Enterprise', count: 8 },
    { id: '4', no: 'ORD-2024-004', status: 'Rejected' as StatusType, store: 'TikTok Shop', count: 2 },
  ];

  orders.forEach(order => {
    for (let i = 0; i < order.count; i++) {
      data.push({
        id: `${order.id}-${i}`,
        orderNo: order.no,
        status: order.status,
        remark: i === 0 ? 'Urgent shipment requested by customer' : '-',
        subType: 'Standard Order',
        source: 'Organic',
        store: order.store,
        rowNum: i + 1,
        quantity: Math.floor(Math.random() * 10) + 1,
        price: parseFloat((Math.random() * 100).toFixed(2)),
        sku: `SKU-PROD-${Math.floor(Math.random() * 1000)}`,
        // Logical merging flags
        rowSpan: i === 0 ? order.count : 0,
        isMerged: i > 0
      });
    }
  });

  return data;
};

const App: React.FC = () => {
  const [data] = useState<TableData[]>(generateMockData());

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">应收单层级视图</h1>
            <p className="text-slate-500 text-sm mt-1">管理并监控所有订单的详情与合并状态</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
              重置筛选
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm">
              新建入账
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto relative">
            <table className="w-full text-sm text-left border-collapse table-fixed">
              <thead className="bg-slate-50/80 backdrop-blur-sm sticky top-0 z-20">
                <tr className="border-b border-slate-200">
                  {COLUMNS.map((col, idx) => {
                    const isFixedLeft = col.fixed === 'left';
                    const isFixedRight = col.fixed === 'right';
                    
                    // Calculate left offset for multiple fixed columns
                    let leftOffset = '0px';
                    if (isFixedLeft && idx > 0) {
                        const previousWidths = COLUMNS.slice(0, idx).reduce((acc, curr) => acc + parseInt(curr.width), 0);
                        leftOffset = `${previousWidths}px`;
                    }

                    return (
                      <th
                        key={col.key}
                        style={{ 
                          width: col.width,
                          left: isFixedLeft ? leftOffset : undefined,
                          right: isFixedRight ? '0px' : undefined,
                        }}
                        className={`
                          py-4 px-4 font-semibold text-slate-700 uppercase tracking-wider
                          ${isFixedLeft ? 'sticky z-30 bg-slate-50 after:absolute after:right-0 after:top-0 after:bottom-0 after:w-[1px] after:bg-slate-200' : ''}
                          ${isFixedRight ? 'sticky z-30 bg-slate-50 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200' : ''}
                          ${idx === 0 ? 'rounded-tl-xl' : ''}
                        `}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">{col.icon}</span>
                          <span>{col.label}</span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((row, rowIndex) => (
                  <tr key={row.id} className="hover:bg-indigo-50/30 transition-colors group">
                    {COLUMNS.map((col, colIdx) => {
                      const isFixedLeft = col.fixed === 'left';
                      const isFixedRight = col.fixed === 'right';
                      
                      // Handle Merged Cells logic
                      const isMergeable = ['orderNo', 'status', 'remark', 'subType', 'source', 'store'].includes(col.key);
                      const shouldRender = !isMergeable || !row.isMerged;
                      const rowSpan = isMergeable ? row.rowSpan : 1;

                      if (!shouldRender) return null;

                      let leftOffset = '0px';
                      if (isFixedLeft && colIdx > 0) {
                          const previousWidths = COLUMNS.slice(0, colIdx).reduce((acc, curr) => acc + parseInt(curr.width), 0);
                          leftOffset = `${previousWidths}px`;
                      }

                      return (
                        <td
                          key={col.key}
                          rowSpan={rowSpan}
                          style={{ 
                            left: isFixedLeft ? leftOffset : undefined,
                            right: isFixedRight ? '0px' : undefined,
                          }}
                          className={`
                            p-4 text-slate-600 bg-white
                            ${isFixedLeft ? 'sticky z-10 bg-white after:absolute after:right-0 after:top-0 after:bottom-0 after:w-[1px] after:bg-slate-100' : ''}
                            ${isFixedRight ? 'sticky z-10 bg-white before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-100' : ''}
                            ${row.isMerged && isMergeable ? 'bg-slate-50/50' : ''}
                          `}
                        >
                          {col.key === 'status' ? (
                            <Badge status={row.status} />
                          ) : col.key === 'actions' ? (
                            <div className="flex items-center gap-2">
                               <button title="查看" className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors">
                                 <ICONS.Eye size={18} />
                               </button>
                               <button title="编辑" className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                                 <ICONS.Edit size={18} />
                               </button>
                               <button title="删除" className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors">
                                 <ICONS.Trash2 size={18} />
                               </button>
                            </div>
                          ) : col.key === 'orderNo' ? (
                            <span className="font-medium text-slate-900">{row.orderNo}</span>
                          ) : col.key === 'price' ? (
                            <span className="tabular-nums">￥{row.price}</span>
                          ) : (
                            row[col.key as keyof TableData]
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-sm text-slate-500">
              共 <span className="font-semibold text-slate-900">{data.length}</span> 行数据，已显示 <span className="font-semibold text-slate-900">10</span> 行
            </span>
            <div className="flex items-center gap-2">
              <nav className="flex items-center -space-x-px" aria-label="Pagination">
                <button className="px-3 py-1.5 border border-slate-200 bg-white rounded-l-lg text-slate-500 hover:bg-slate-50 transition-colors">上一页</button>
                <button className="px-3 py-1.5 border border-indigo-600 bg-indigo-50 text-indigo-600 font-medium">1</button>
                <button className="px-3 py-1.5 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors">2</button>
                <button className="px-3 py-1.5 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors">3</button>
                <button className="px-3 py-1.5 border border-slate-200 bg-white rounded-r-lg text-slate-500 hover:bg-slate-50 transition-colors">下一页</button>
              </nav>
              <select className="ml-4 border border-slate-200 rounded-lg text-sm bg-white p-1.5 text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500">
                <option>10 条/页</option>
                <option>20 条/页</option>
                <option>50 条/页</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
