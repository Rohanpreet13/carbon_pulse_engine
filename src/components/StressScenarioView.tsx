import React, { useState } from 'react';
import { SimulationInputs, SimulationResult } from '../types/carbon';
import {
  TrendingUp,
  ShieldAlert,
  Globe,
  Calendar,
  Layers,
  ArrowRight,
  Sliders,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

interface StressScenarioViewProps {
  inputs: SimulationInputs;
  result: SimulationResult;
  onCustomRateChange: (rate: number) => void;
  onNavigateToEngine: () => void;
}

export const StressScenarioView: React.FC<StressScenarioViewProps> = ({
  inputs,
  result,
  onCustomRateChange,
  onNavigateToEngine,
}) => {
  const [selectedBenchmark, setSelectedBenchmark] = useState<'eu' | 'us' | 'uk' | 'netzero'>('eu');
  const [abatementRate, setAbatementRate] = useState<number>(20); // % emissions reduced via CapEx

  const { predicted_emissions_tco2e, taxable_emissions_tco2e, scenarios } = result;

  // Regulatory Price Benchmarks
  const benchmarks = {
    eu: { name: 'European Union ETS (Phase IV)', rate: 95, allowancePct: 20, desc: 'Includes CBAM phase-in and declining free allowances' },
    us: { name: 'North American Regional (CARB/RGGI)', rate: 45, allowancePct: 25, desc: 'Cap-and-invest compliance markets with sectoral offsets' },
    uk: { name: 'United Kingdom ETS Benchmark', rate: 70, allowancePct: 15, desc: 'Stringent post-Brexit cap trajectory with zero-coal pricing' },
    netzero: { name: 'IPCC 1.5°C Paris Stressed Corridor', rate: 175, allowancePct: 0, desc: 'Aggressive shadow carbon price recommended for net-zero parity' },
  };

  const currentBm = benchmarks[selectedBenchmark];
  const benchmarkGrossTax = Math.round(predicted_emissions_tco2e * currentBm.rate);
  const benchmarkTaxable = Math.max(0, predicted_emissions_tco2e * (1 - currentBm.allowancePct / 100));
  const benchmarkNetTax = Math.round(benchmarkTaxable * currentBm.rate);

  // Abatement Savings Calculation
  const abatedEmissions = Math.max(0, predicted_emissions_tco2e * (1 - abatementRate / 100));
  const abatedTaxable = Math.max(0, abatedEmissions * (1 - currentBm.allowancePct / 100));
  const abatedNetTax = Math.round(abatedTaxable * currentBm.rate);
  const taxSavings = benchmarkNetTax - abatedNetTax;

  // 10-Year Decarbonization Horizon Trajectory (2025 - 2034)
  const trajectoryYears = [2025, 2026, 2027, 2028, 2029, 2030, 2032, 2034];
  const trajectoryData = trajectoryYears.map((yr, idx) => {
    // Carbon price escalates ~7% annually under climate policy
    const price = Math.round(50 * Math.pow(1.08, idx));
    // Emissions baseline without intervention vs with planned transition
    const unmitigatedEmissions = predicted_emissions_tco2e * (1 + idx * 0.02);
    const mitigatedEmissions = predicted_emissions_tco2e * Math.max(0.2, 1 - idx * 0.08);
    const unmitigatedCost = Math.round(unmitigatedEmissions * price * 0.8);
    const mitigatedCost = Math.round(mitigatedEmissions * price * 0.8);
    return {
      year: yr,
      price,
      unmitigatedEmissions: unmitigatedEmissions.toFixed(1),
      mitigatedEmissions: mitigatedEmissions.toFixed(1),
      unmitigatedCost,
      mitigatedCost,
    };
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Policy Stress Scenarios & Fiscal Exposure
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Simulate corporate carbon tax balance sheet liabilities across global compliance corridors, benchmark international ETS policies, and stress test transition capital allocation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToEngine}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            Adjust 12 Parameters in Engine
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Corporate Summary Context Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 border border-white/10">
          <div className="text-[11px] uppercase font-semibold text-slate-400">Current Forecast</div>
          <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-1">
            {predicted_emissions_tco2e.toFixed(2)} <span className="text-sm font-normal text-slate-400">tCO2e</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">{inputs.industry_sector} · {inputs.region}</div>
        </div>

        <div className="glass-card rounded-xl p-4 border border-white/10">
          <div className="text-[11px] uppercase font-semibold text-slate-400">Net Taxable Emissions</div>
          <div className="text-2xl font-extrabold font-mono text-white mt-1">
            {taxable_emissions_tco2e.toFixed(2)} <span className="text-sm font-normal text-slate-400">tCO2e</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">After regional free allowance</div>
        </div>

        <div className="glass-card rounded-xl p-4 border border-white/10">
          <div className="text-[11px] uppercase font-semibold text-slate-400">Selected Horizon Rate</div>
          <div className="text-2xl font-extrabold font-mono text-blue-400 mt-1">
            ${inputs.custom_tax_rate} <span className="text-sm font-normal text-slate-400">/ ton</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Liability: ${scenarios.custom.tax_liability.toLocaleString()}</div>
        </div>

        <div className="glass-card rounded-xl p-4 border border-white/10">
          <div className="text-[11px] uppercase font-semibold text-slate-400">Metabolic Status</div>
          <div className="text-xl font-bold mt-1" style={{ color: result.pulse_metabolism.color }}>
            {result.pulse_metabolism.status}
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-0.5">
            {result.pulse_metabolism.intensity_ratio} tCO2e / $M Revenue
          </div>
        </div>
      </div>

      {/* Part 1: Global Compliance Market Benchmark Stress Test */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              Global Regulatory Benchmark Comparisons
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select an international policy regime to test unhedged balance sheet exposure
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-lg border border-white/10 text-xs">
            {(['eu', 'us', 'uk', 'netzero'] as const).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedBenchmark(key)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                  selectedBenchmark === key
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {key === 'eu' ? 'EU ETS' : key === 'us' ? 'US CARB' : key === 'uk' ? 'UK ETS' : '1.5°C Net Zero'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Regime Details */}
          <div className="space-y-4 lg:col-span-1 bg-slate-900/60 p-5 rounded-xl border border-white/5">
            <div>
              <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Benchmark Regime</div>
              <h4 className="text-lg font-bold text-white mt-0.5">{currentBm.name}</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{currentBm.desc}</p>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-white/5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Carbon Price per tCO2e:</span>
                <span className="font-mono font-bold text-white">${currentBm.rate}/ton</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Policy Free Allowance:</span>
                <span className="font-mono font-bold text-slate-200">{currentBm.allowancePct}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Gross Unhedged Liability:</span>
                <span className="font-mono font-bold text-slate-300">${benchmarkGrossTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/5">
                <span className="text-slate-200 font-semibold">Net Annual Liability:</span>
                <span className="font-mono font-extrabold text-emerald-400 text-sm">${benchmarkNetTax.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Abatement Simulation */}
          <div className="space-y-4 lg:col-span-2 bg-slate-900/60 p-5 rounded-xl border border-white/5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
                  Decarbonization Abatement Sensitivity
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {abatementRate}% Emission Reduction
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Slide to test financial tax savings if your organization accelerates renewable grid adoption or fuel electrification:
              </p>
              <input
                type="range"
                min={0}
                max={80}
                step={5}
                value={abatementRate}
                onChange={(e) => setAbatementRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg cursor-pointer accent-emerald-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
              <div className="bg-slate-950/50 p-3 rounded-lg border border-white/5">
                <div className="text-[11px] text-slate-400">Abated Emissions</div>
                <div className="text-lg font-bold font-mono text-white mt-0.5">
                  {abatedEmissions.toFixed(2)} <span className="text-xs text-slate-400">t</span>
                </div>
              </div>

              <div className="bg-slate-950/50 p-3 rounded-lg border border-white/5">
                <div className="text-[11px] text-slate-400">Abated Net Tax</div>
                <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                  ${abatedNetTax.toLocaleString()}
                </div>
              </div>

              <div className="bg-slate-950/50 p-3 rounded-lg border border-emerald-500/30">
                <div className="text-[11px] text-emerald-400 font-semibold">Annual Tax Saved</div>
                <div className="text-lg font-bold font-mono text-emerald-300 mt-0.5">
                  +${taxSavings.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Sensitivity Matrix: Carbon Price vs Emission Reductions */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            Fiscal Risk Matrix (Carbon Price vs Enterprise Abatement)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-tabulation of projected fiscal tax burden ($ USD) across hypothetical policy scenarios and internal abatement progress.
          </p>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="py-2.5 px-3 font-semibold">Carbon Price</th>
                <th className="py-2.5 px-3 font-semibold text-right">0% Abatement (Status Quo)</th>
                <th className="py-2.5 px-3 font-semibold text-right text-emerald-400">15% Clean Transition</th>
                <th className="py-2.5 px-3 font-semibold text-right text-emerald-400">30% High Renewables</th>
                <th className="py-2.5 px-3 font-semibold text-right text-emerald-400">50% Net-Zero Push</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {[30, 50, 75, 100, 150, 200].map((rate) => {
                const isSelected = rate === inputs.custom_tax_rate;
                return (
                  <tr
                    key={rate}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isSelected ? 'bg-emerald-500/10 font-bold' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-sans font-medium text-white flex items-center gap-2">
                      <span>${rate} / tCO2e</span>
                      {isSelected && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-300">
                      ${Math.round(taxable_emissions_tco2e * rate).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-300">
                      ${Math.round(taxable_emissions_tco2e * 0.85 * rate).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-300">
                      ${Math.round(taxable_emissions_tco2e * 0.70 * rate).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">
                      ${Math.round(taxable_emissions_tco2e * 0.50 * rate).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Part 3: 10-Year Decarbonization Horizon Trajectory */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            10-Year Decarbonization Horizon (2025 – 2034)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Projecting financial tax savings of aggressive decarbonization vs business-as-usual unmitigated growth.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 pt-2">
          {trajectoryData.map((d) => (
            <div
              key={d.year}
              className="bg-slate-900/60 p-3 rounded-xl border border-white/5 flex flex-col justify-between text-xs"
            >
              <div className="border-b border-white/5 pb-1">
                <span className="font-bold text-white text-sm">{d.year}</span>
                <div className="text-[10px] text-slate-400 font-mono">${d.price}/t est.</div>
              </div>
              <div className="space-y-1.5 my-2">
                <div>
                  <div className="text-[10px] text-slate-400">Unhedged:</div>
                  <div className="font-mono text-rose-400 font-bold">${d.unmitigatedCost.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-emerald-400">Decarbonized:</div>
                  <div className="font-mono text-emerald-400 font-bold">${d.mitigatedCost.toLocaleString()}</div>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-white/5">
                {d.mitigatedEmissions} tCO2e
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
