import React from 'react';
import { ShieldCheck, ArrowRight, DollarSign, Leaf, Zap, BarChart3, Database } from 'lucide-react';

interface LandingHeroProps {
  onLaunchEngine: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onLaunchEngine }) => {
  return (
    <div className="space-y-16 pb-12">
      {/* Hero Banner */}
      <section className="relative pt-8 sm:pt-14 pb-12 overflow-hidden text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs font-semibold text-emerald-400">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Production Machine Learning Pipeline & Deterministic Tax Engine</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] text-balance">
          Quantify Corporate Carbon. Simulate Financial Tax Risk.
        </h1>

        <p className="text-base sm:text-lg text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed text-balance">
          CarbonPulse empowers corporate decision-makers to stress test multi-scenario carbon pricing ($50, $100, $150/ton), forecast GHG emissions, and translate metabolic data into balance sheet clarity.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onLaunchEngine}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all duration-200 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            Launch Simulation Engine Room
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="#value-matrix"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-medium text-sm border border-white/10 transition-colors flex items-center justify-center"
          >
            Executive Architecture
          </a>
        </div>
      </section>

      {/* Dual Value Matrix: CFO vs Sustainability Executive */}
      <section id="value-matrix" className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* CFO Card */}
        <div className="glass-card rounded-2xl p-7 border border-white/10 space-y-5 hover:border-blue-500/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">For Chief Financial Officers</h3>
            <p className="text-xs text-slate-400 mt-1">Hedge balance sheets against accelerating global carbon border mechanisms and tariffs.</p>
          </div>
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <span className="text-blue-400 font-bold">✔</span>
              <span><strong>Policy Stress Testing:</strong> Model financial tax liabilities instantly across $50, $100, and $150/t price corridors.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-blue-400 font-bold">✔</span>
              <span><strong>Tax-Free Allowance Deductions:</strong> Automatically calibrate regional grandfathering and allowance phaseouts.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-blue-400 font-bold">✔</span>
              <span><strong>CapEx Transition ROI:</strong> Evaluate financial paybacks of shifting fleet fuels and expanding renewable grid shares.</span>
            </li>
          </ul>
        </div>

        {/* CSO Card */}
        <div className="glass-card rounded-2xl p-7 border border-white/10 space-y-5 hover:border-emerald-500/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">For Sustainability Officers</h3>
            <p className="text-xs text-slate-400 mt-1">Operationalize GHG Protocol compliance across Scope 1 direct, Scope 2 electricity, and Scope 3 waste.</p>
          </div>
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-400 font-bold">✔</span>
              <span><strong>Dynamic Metabolic Pulse:</strong> Real-time animated sine wave reflecting operational emissions intensity.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-400 font-bold">✔</span>
              <span><strong>12-Feature Pipeline:</strong> Inputs electricity, natural gas, fleet diesel, waste tons, output volume, and employees.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-400 font-bold">✔</span>
              <span><strong>Decoded Equivalencies:</strong> Convert abstract tCO2e figures into 10-year tree seedlings and passenger vehicle kilometers.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Feature Triad Highlights */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-6xl mx-auto">
        <div className="bg-slate-900/60 rounded-xl p-5 border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold">
            <Database className="w-4 h-4" />
            01. PIPELINE DE-LEAKAGE
          </div>
          <h4 className="text-sm font-bold text-white">Safe Feature Ingestion</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Strips target indicators and organizational IDs. Auto-imputes missing variables using historical column medians.
          </p>
        </div>

        <div className="bg-slate-900/60 rounded-xl p-5 border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-blue-400 text-xs font-mono font-bold">
            <BarChart3 className="w-4 h-4" />
            02. MULTI-SCENARIO ENGINE
          </div>
          <h4 className="text-sm font-bold text-white">Tax Exposure Modeling</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Deterministic formula: <code className="text-slate-200">Tax = Net Emissions × Rate</code> across $50, $100, $150/t and custom tax rates.
          </p>
        </div>

        <div className="bg-slate-900/60 rounded-xl p-5 border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold">
            <ShieldCheck className="w-4 h-4" />
            03. OFFSET RIGOR
          </div>
          <h4 className="text-sm font-bold text-white">Standard Equivalences</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            EPA compliant conversion factors: 16.5× tree seedlings grown for 10 years and 4,080 km driven per metric ton CO2e.
          </p>
        </div>
      </section>
    </div>
  );
};
