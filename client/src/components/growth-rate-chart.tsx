import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';

interface GrowthRateChartProps {
  currentGrowthRate: number;
  historicalData?: Array<{ month: string; rate: number }>;
}

export function GrowthRateChart({ currentGrowthRate, historicalData = [] }: GrowthRateChartProps) {
  // Generate mock historical data if none provided
  const data = historicalData.length > 0 ? historicalData : Array.from({ length: 12 }, (_, i) => ({
    month: `M${i + 1}`,
    rate: Math.max(0, currentGrowthRate - (12 - i) * 0.5 + Math.random() * 2),
  }));

  const avgRate = data.reduce((sum, d) => sum + d.rate, 0) / data.length;

  return (
    <Card className="border-indigo-400/60 bg-gradient-to-br from-indigo-50 to-blue-100 backdrop-blur-sm p-6 shadow-card">
      <div className="space-y-4">
        <div>
          <p className="text-xs text-blue-900/90 mb-1 font-semibold uppercase tracking-wider">Growth Rate Trend</p>
          <p className="text-3xl font-bold text-blue-950 animate-countUp">{currentGrowthRate.toFixed(1)}%</p>
          <p className="text-xs text-blue-700/70 mt-1">Current month • Avg: {avgRate.toFixed(1)}%</p>
        </div>

        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data} animationDuration={800}>
            <defs>
              <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 150, 200, 0.25)" vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke="rgba(37, 99, 235, 0.8)" 
              style={{ fontSize: '11px' }} 
              tick={{ fill: 'rgba(37, 99, 235, 0.9)' }}
            />
            <YAxis 
              stroke="rgba(37, 99, 235, 0.8)" 
              style={{ fontSize: '11px' }}
              tick={{ fill: 'rgba(37, 99, 235, 0.9)' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#F0F9FF', 
                border: '2px solid rgba(37, 99, 235, 0.6)',
                borderRadius: '8px',
                boxShadow: '0 0 12px rgba(37, 99, 235, 0.3)',
                color: '#1E3A8A'
              }}
              cursor={{ strokeDasharray: '5 5', stroke: 'rgba(37, 99, 235, 0.6)' }}
              formatter={(value: number) => `${value.toFixed(1)}%`}
            />
            <Line
              type="monotoneX"
              dataKey="rate"
              stroke="#2563EB"
              strokeWidth={2}
              dot={{ fill: '#2563EB', r: 3 }}
              activeDot={{ r: 5 }}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="flex items-center justify-between p-3 rounded-lg bg-blue-100/60 border border-blue-400/50">
          <span className="text-xs text-blue-900/90 font-semibold">Status</span>
          <span className={`text-sm font-bold ${currentGrowthRate > 10 ? 'text-green-700' : currentGrowthRate > 5 ? 'text-amber-700' : 'text-orange-700'}`}>
            {currentGrowthRate > 10 ? 'Excellent' : currentGrowthRate > 5 ? 'Good' : currentGrowthRate > 0 ? 'Fair' : 'Needs Work'}
          </span>
        </div>
      </div>
    </Card>
  );
}
