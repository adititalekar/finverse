import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, TrendingUp, Target, Zap } from 'lucide-react';

interface AIFinancialScoreProps {
  gameState: any;
}

export function AIFinancialScore({ gameState }: AIFinancialScoreProps) {
  // Calculate AI metrics
  const cashBalance = gameState.cashBalance || 0;
  const salary = gameState.userProfile?.salary || 0;
  const expenses = gameState.userProfile?.expenses || 0;
  const passiveIncome = gameState.passiveIncome || 0;
  const stockValue = gameState.stockHoldings?.reduce((total: number, h: any) => total + (h.investmentAmount || 0), 0) || 0;
  const portfolioValue = Object.values(gameState.portfolio || {}).reduce((a: number, b: any) => a + (b as number), 0) as number;
  
  // AI Calculated Metrics
  const debtToIncomeRatio = salary > 0 ? (expenses / salary) * 100 : 0;
  const investmentRate = salary > 0 ? ((stockValue + portfolioValue) / salary) * 100 : 0;
  const liquidityScore = Math.min((cashBalance / (expenses * 3)) * 100, 100); // 3 months emergency fund
  const passiveIncomeRatio = salary > 0 ? (passiveIncome / salary) * 100 : 0;
  
  // AI Financial Health Score (0-100)
  const debtScore = Math.max(0, 100 - debtToIncomeRatio);
  const investmentScore = Math.min(investmentRate * 5, 100);
  const liquidityScoreNorm = liquidityScore;
  const passiveIncomeScore = Math.min(passiveIncomeRatio * 2, 100);
  
  const aiHealthScore = (debtScore * 0.3 + investmentScore * 0.3 + liquidityScoreNorm * 0.2 + passiveIncomeScore * 0.2);

  // AI Recommendations
  const recommendations = [];
  
  if (debtToIncomeRatio > 60) recommendations.push({ type: 'warning', text: 'High expense ratio detected - reduce spending', icon: '⚠️' });
  if (liquidityScore < 50) recommendations.push({ type: 'alert', text: 'Build emergency fund (target: 3-6 months expenses)', icon: '🚨' });
  if (passiveIncomeRatio < 20) recommendations.push({ type: 'info', text: 'Increase passive income streams', icon: '📈' });
  if (investmentRate > 30) recommendations.push({ type: 'success', text: 'Strong investment momentum!', icon: '✅' });
  if (recommendations.length === 0) recommendations.push({ type: 'success', text: 'Financial health is excellent', icon: '🌟' });

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { color: 'bg-green-200/70 text-green-900 border-green-400/60', label: 'Excellent' };
    if (score >= 60) return { color: 'bg-cyan-200/70 text-cyan-900 border-cyan-400/60', label: 'Good' };
    if (score >= 40) return { color: 'bg-yellow-200/70 text-yellow-900 border-yellow-400/60', label: 'Fair' };
    return { color: 'bg-red-200/70 text-red-900 border-red-400/60', label: 'Needs Work' };
  };

  const scoreBadge = getScoreBadge(aiHealthScore);

  return (
    <Card className="border-indigo-400/60 bg-gradient-to-br from-indigo-50 to-blue-100 backdrop-blur-sm p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-blue-950 flex items-center gap-2">
          <Zap className="h-5 w-5 text-indigo-600" />
          AI Financial Health Score
        </h3>
        <Badge className={`${scoreBadge.color} border text-xs font-semibold px-3 py-1`}>
          {scoreBadge.label}
        </Badge>
      </div>

      {/* Main Score Gauge */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(37, 99, 235, 0.2)" strokeWidth="8" />
            <circle 
              cx="60" 
              cy="60" 
              r="50" 
              fill="none" 
              stroke="#2563EB" 
              strokeWidth="8" 
              strokeDasharray={`${(aiHealthScore / 100) * 314} 314`}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-blue-950">{Math.round(aiHealthScore)}</span>
            <span className="text-xs text-blue-700/60 font-semibold">/100</span>
          </div>
        </div>
      </div>

      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 pb-6 border-b border-blue-400/30">
        <div className="p-3 bg-blue-100/60 rounded-lg border border-blue-400/50">
          <p className="text-xs text-blue-800/70 mb-1">Debt-to-Income</p>
          <p className="text-lg font-bold text-blue-950">{debtToIncomeRatio.toFixed(0)}%</p>
          <p className="text-xs text-blue-700/60 mt-1">Score: {Math.round(debtScore)}</p>
        </div>
        <div className="p-3 bg-blue-100/60 rounded-lg border border-blue-400/50">
          <p className="text-xs text-blue-800/70 mb-1">Investment Rate</p>
          <p className="text-lg font-bold text-blue-950">{investmentRate.toFixed(0)}%</p>
          <p className="text-xs text-blue-700/60 mt-1">Score: {Math.round(investmentScore)}</p>
        </div>
        <div className="p-3 bg-blue-100/60 rounded-lg border border-blue-400/50">
          <p className="text-xs text-blue-800/70 mb-1">Liquidity Score</p>
          <p className="text-lg font-bold text-blue-950">{Math.round(liquidityScore)}%</p>
          <p className="text-xs text-blue-700/60 mt-1">Emergency Fund</p>
        </div>
        <div className="p-3 bg-blue-100/60 rounded-lg border border-blue-400/50">
          <p className="text-xs text-blue-800/70 mb-1">Passive Income</p>
          <p className="text-lg font-bold text-blue-950">{passiveIncomeRatio.toFixed(0)}%</p>
          <p className="text-xs text-blue-700/60 mt-1">Score: {Math.round(passiveIncomeScore)}</p>
        </div>
      </div>

      {/* AI Recommendations */}
      <div>
        <h4 className="text-sm font-semibold text-blue-950 mb-3 flex items-center gap-2">
          <Target className="h-4 w-4 text-indigo-600" />
          AI Recommendations
        </h4>
        <div className="space-y-2">
          {recommendations.map((rec, idx) => (
            <div 
              key={idx}
              className={`p-3 rounded-lg border flex items-start gap-2 ${
                rec.type === 'success' ? 'bg-green-100/70 border-green-400/50' :
                rec.type === 'warning' ? 'bg-yellow-100/70 border-yellow-400/50' :
                rec.type === 'alert' ? 'bg-red-100/70 border-red-400/50' :
                'bg-blue-100/70 border-blue-400/50'
              }`}
            >
              <span className="text-lg flex-shrink-0 mt-0.5">{rec.icon}</span>
              <p className={`text-xs font-semibold ${
                rec.type === 'success' ? 'text-green-800' :
                rec.type === 'warning' ? 'text-yellow-800' :
                rec.type === 'alert' ? 'text-red-800' :
                'text-blue-800'
              }`}>
                {rec.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
