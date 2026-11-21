import React from 'react';
import { SimulationResult } from '../types/carbon';
import { TrendingUp, Sliders } from 'lucide-react';

interface PolicyStressChartProps {
  result: SimulationResult;
  customRate: number;
  onCustomRateChange: (rate: number) => void;
}

export const PolicyStressChart: React.FC<PolicyStressChartProps> = ({
  result,
  customRate,
  onCustomRateChange,
}) => {
  const { scenarios, scope_decomposition } = result;

  // Maximum value for scaling the bars cleanly
  const maxLiability = Math.max(
    scenarios.rate_150.gross_liability,
    scenarios.custom.gross_liability,
    100
  );

  return (
    <div className="glass-card rounded-xl p-6 border border-white/10 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Policy Stress Test: Tax Liability Scenarios
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Multi-tier fiscal exposure modeling across international regulatory carbon price regimes
          </p>
        </div>

        {/* Custom Rate Interactive Control */}
        <div className="flex items-center gap-2.5 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-white/10 shrink-0">
          <Sliders className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-300 font-medium whitespace-nowrap">
            Target Horizon:
          </span>
          <span className="font-mono font-bold text-emerald-400 text-xs">
            ${customRate}/ton
          </span>
          <input
            type="range"
            min={20}
            max={300}
            step={5}
            value={customRate}
            onChange={(e) => onCustomRateChange(Number(e.target.value))}
            className="w-20 h-1.5 bg-slate-700 rounded-lg cursor-pointer accent-emerald-500"
          />
        </div>
      </div>

      {/* Scenario Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* $50/ton */}
        <div className="bg-slate-900/60 rounded-xl p-4 border border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-slate-200">$50 / ton</span>
              <span className="text-[11px] text-slate-400">Baseline Rate</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white my-1">
              ${scenarios.rate_50.tax_liability.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400">
              Gross Unhedged: <span className="font-mono text-slate-300">${scenarios.rate_50.gross_liability.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-5 flex items-end gap-2.5 h-28 pt-2 border-t border-white/5">
            <div className="w-1/2 flex flex-col items-center gap-1.5">
              <div
                className="w-full bg-blue-500/80 rounded-t transition-all duration-500 hover:bg-blue-400"
                style={{
                  height: `${Math.max(12, (scenarios.rate_50.gross_liability / maxLiability) * 100)}%`,
                }}
              />
              <span className="text-[10px] text-slate-400">Gross</span>
            </div>
            <div className="w-1/2 flex flex-col items-center gap-1.5">
              <div
                className="w-full bg-rose-500/80 rounded-t transition-all duration-500 hover:bg-rose-400"
                style={{
                  height: `${Math.max(10, (scenarios.rate_50.tax_liability / maxLiability) * 100)}%`,
                }}
              />
              <span className="text-[10px] text-slate-400">Net Tax</span>
            </div>
          </div>
        </div>

        {/* $100/ton */}
        <div className="bg-slate-900/60 rounded-xl p-4 border border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-slate-200">$100 / ton</span>
              <span className="text-[11px] text-slate-400">Accelerated Transition</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white my-1">
              ${scenarios.rate_100.tax_liability.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400">
              Gross Unhedged: <span className="font-mono text-slate-300">${scenarios.rate_100.gross_liability.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-5 flex items-end gap-2.5 h-28 pt-2 border-t border-white/5">
            <div className="w-1/2 flex flex-col items-center gap-1.5">
              <div
                className="w-full bg-blue-500/80 rounded-t transition-all duration-500 hover:bg-blue-400"
                style={{
                  height: `${Math.max(18, (scenarios.rate_100.gross_liability / maxLiability) * 100)}%`,
                }}
              />
              <span className="text-[10px] text-slate-400">Gross</span>
            </div>
            <div className="w-1/2 flex flex-col items-center gap-1.5">
              <div
                className="w-full bg-rose-500/80 rounded-t transition-all duration-500 hover:bg-rose-400"
                style={{
                  height: `${Math.max(14, (scenarios.rate_100.tax_liability / maxLiability) * 100)}%`,
                }}
              />
              <span className="text-[10px] text-slate-400">Net Tax</span>
            </div>
          </div>
        </div>

        {/* $150/ton Benchmark */}
        <div className="bg-slate-900/60 rounded-xl p-4 border border-emerald-500/30 flex flex-col justify-between shadow-[0_0_20px_-4px_rgba(16,185,129,0.15)]">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-emerald-400">$150 / ton</span>
              <span className="text-[11px] text-emerald-400/80 font-semibold">Stressed Standard</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white my-1">
              ${scenarios.rate_150.tax_liability.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400">
              Gross Unhedged: <span className="font-mono text-slate-300">${scenarios.rate_150.gross_liability.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-5 flex items-end gap-2.5 h-28 pt-2 border-t border-white/5">
            <div className="w-1/2 flex flex-col items-center gap-1.5">
              <div
                className="w-full bg-blue-500/90 rounded-t transition-all duration-500 hover:bg-blue-400"
                style={{
                  height: `${Math.max(25, (scenarios.rate_150.gross_liability / maxLiability) * 100)}%`,
                }}
              />
              <span className="text-[10px] text-slate-400">Gross</span>
            </div>
            <div className="w-1/2 flex flex-col items-center gap-1.5">
              <div
                className="w-full bg-rose-500/90 rounded-t transition-all duration-500 hover:bg-rose-400"
                style={{
                  height: `${Math.max(20, (scenarios.rate_150.tax_liability / maxLiability) * 100)}%`,
                }}
              />
              <span className="text-[10px] text-slate-400">Net Tax</span>
            </div>
          </div>
        </div>
      </div>

      {/* GHG Protocol Scope Decomposition Strip */}
      <div className="bg-slate-900/40 rounded-xl p-3 border border-white/5 flex flex-wrap items-center justify-between text-xs gap-3">
        <span className="text-slate-400 font-medium">GHG Protocol Scope Decomposition:</span>
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-slate-300">Scope 1 (Direct):</span>
            <strong className="text-white">{scope_decomposition.scope1_direct} tCO2e</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
            <span className="text-slate-300">Scope 2 (Electricity):</span>
            <strong className="text-white">{scope_decomposition.scope2_electricity} tCO2e</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
            <span className="text-slate-300">Scope 3 (Value Chain):</span>
            <strong className="text-white">{scope_decomposition.scope3_value_chain} tCO2e</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
