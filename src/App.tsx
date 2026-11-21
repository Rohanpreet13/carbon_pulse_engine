/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useTransition } from 'react';
import {
  HISTORICAL_DEFAULTS,
  PRESETS,
  calculateDeterministicEmissions,
  runPrediction,
} from './services/carbonService';
import { SimulationInputs, SimulationResult } from './types/carbon';
import { MetabolicPulseWave } from './components/MetabolicPulseWave';
import { PulseStrengthGauge } from './components/PulseStrengthGauge';
import { PolicyStressChart } from './components/PolicyStressChart';
import { OffsetEquivalence } from './components/OffsetEquivalence';
import { SidebarInputs } from './components/SidebarInputs';
import { LandingHero } from './components/LandingHero';
import { StressScenarioView } from './components/StressScenarioView';
import { EquivalenceDecoderView } from './components/EquivalenceDecoderView';
import {
  Zap,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Flame,
  TrendingUp,
  Sprout,
  LayoutDashboard,
  FileText,
} from 'lucide-react';

export type AppTab = 'landing' | 'dashboard' | 'stress_scenarios' | 'equivalence_decoders';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [inputs, setInputs] = useState<SimulationInputs>(HISTORICAL_DEFAULTS);
  const [result, setResult] = useState<SimulationResult>(() =>
    calculateDeterministicEmissions(HISTORICAL_DEFAULTS)
  );
  const [isPending, startTransition] = useTransition();

  // Run calculation whenever inputs change
  useEffect(() => {
    startTransition(async () => {
      const res = await runPrediction(inputs);
      setResult(res);
    });
  }, [inputs]);

  const handleApplyPreset = (presetKey: string) => {
    const preset = PRESETS[presetKey];
    if (preset) {
      setInputs((prev) => ({
        ...prev,
        ...preset,
      }));
    }
  };

  const handleCustomRateChange = (newRate: number) => {
    setInputs((prev) => ({
      ...prev,
      custom_tax_rate: newRate,
    }));
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Metric,Value,Unit\n' +
      `Forecasted Annual Emissions,${result.predicted_emissions_tco2e},tCO2e\n` +
      `Regional Tax-Free Allowance,${result.tax_free_allowance_tco2e},tCO2e\n` +
      `Net Taxable Emissions,${result.taxable_emissions_tco2e},tCO2e\n` +
      `Projected Fiscal Tax ($50/t),$${result.scenarios.rate_50.tax_liability},USD\n` +
      `Projected Fiscal Tax ($100/t),$${result.scenarios.rate_100.tax_liability},USD\n` +
      `Projected Fiscal Tax ($150/t),$${result.scenarios.rate_150.tax_liability},USD\n` +
      `Projected Fiscal Tax ($${inputs.custom_tax_rate}/t),$${result.scenarios.custom.tax_liability},USD\n` +
      `10-Year Tree Seedlings Needed,${result.offset_equivalence.tree_seedlings_10yr},seedlings\n` +
      `Vehicle KM Equivalence,${result.offset_equivalence.passenger_vehicle_km},km\n` +
      `Crude Oil Barrels Equivalence,${result.offset_equivalence.barrels_oil_equiv},barrels\n` +
      `Operational Metabolism Status,${result.pulse_metabolism.status},-\n` +
      `Carbon Intensity,${result.pulse_metabolism.intensity_ratio},tCO2e/$M Revenue\n` +
      `Scope 1 Direct Combustion,${result.scope_decomposition.scope1_direct},tCO2e\n` +
      `Scope 2 Grid Electricity,${result.scope_decomposition.scope2_electricity},tCO2e\n` +
      `Scope 3 Value Chain & Waste,${result.scope_decomposition.scope3_value_chain},tCO2e\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CarbonPulse_Corporate_Report_${inputs.year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusIcon = (riskLevel: string) => {
    if (riskLevel === 'Low') {
      return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
    }
    if (riskLevel === 'Moderate') {
      return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
    }
    return <Flame className="w-3.5 h-3.5 text-rose-400" />;
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (4-5 Nav Links) - Zone 3 (Action) */}
      <header className="w-full border-b border-white/10 bg-[#0F172A]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark with icon */}
          <button
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Zap className="w-4 h-4" />
            </span>
            <span>CarbonPulse Engine</span>
          </button>

          {/* Zone 2: 4-5 single-line clean text navigation links with working handlers */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => setActiveTab('landing')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'landing' ? 'text-emerald-400 font-bold border-b-2 border-emerald-400 py-1' : 'text-slate-400'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Executive Overview
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'dashboard' ? 'text-emerald-400 font-bold border-b-2 border-emerald-400 py-1' : 'text-slate-400'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Simulation Engine
            </button>

            <button
              onClick={() => setActiveTab('stress_scenarios')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'stress_scenarios' ? 'text-emerald-400 font-bold border-b-2 border-emerald-400 py-1' : 'text-slate-400'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Stress Scenarios
            </button>

            <button
              onClick={() => setActiveTab('equivalence_decoders')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'equivalence_decoders' ? 'text-emerald-400 font-bold border-b-2 border-emerald-400 py-1' : 'text-slate-400'
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              Equivalence Decoders
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleExportCSV}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              Export CSV
            </button>

            {activeTab === 'landing' ? (
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
              >
                Launch Engine Room
              </button>
            ) : (
              <button
                onClick={() => setInputs(HISTORICAL_DEFAULTS)}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Model
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* VIEW 1: Executive Overview (Landing) */}
        {activeTab === 'landing' && (
          <LandingHero onLaunchEngine={() => setActiveTab('dashboard')} />
        )}

        {/* VIEW 2: Primary Engine Room (Dashboard) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Animated Sine Wave Header: Environmental Metabolic Pulse */}
            <MetabolicPulseWave
              color={result.pulse_metabolism.color}
              intensityRatio={result.pulse_metabolism.intensity_ratio}
              status={result.pulse_metabolism.status}
            />

            {/* Layout: Sidebar Inputs (12 Parameters) + Main Body Engine Room */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Sidebar: 12 Categorized Features */}
              <aside className="lg:col-span-4">
                <SidebarInputs
                  inputs={inputs}
                  onChange={setInputs}
                  onApplyPreset={handleApplyPreset}
                />
              </aside>

              {/* Main Body: 3 KPIs + Policy Stress Test + Offset Equivalence */}
              <section className="lg:col-span-8 space-y-6">
                {/* 3 KPI Block Headers (Matching Mockup exactly) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* KPI 1: Live Carbon Pulse Output in tCO2e */}
                  <div className="glass-card rounded-xl p-5 border border-white/10 relative overflow-hidden transition-all">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                      Forecasted Emissions ({inputs.year})
                    </span>
                    <div className="flex items-baseline gap-2 my-2">
                      <span
                        className="text-4xl font-extrabold font-mono transition-colors"
                        style={{ color: result.pulse_metabolism.color }}
                      >
                        {result.predicted_emissions_tco2e.toFixed(2)}
                      </span>
                      <span className="text-lg font-bold text-slate-400">tCO2e</span>
                    </div>
                    <div
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border"
                      style={{
                        backgroundColor: `${result.pulse_metabolism.color}15`,
                        borderColor: `${result.pulse_metabolism.color}35`,
                        color: result.pulse_metabolism.color,
                      }}
                    >
                      {getStatusIcon(result.pulse_metabolism.risk_level)}
                      <span>{result.pulse_metabolism.status}</span>
                    </div>
                  </div>

                  {/* KPI 2: Projected Financial Tax Liability */}
                  <div className="glass-card rounded-xl p-5 border border-white/10 relative overflow-hidden">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                      Projected Fiscal Liability
                    </span>
                    <div className="flex items-baseline gap-1 my-2">
                      <span className="text-2xl font-bold text-slate-400">$</span>
                      <span className="text-4xl font-extrabold font-mono text-white">
                        {result.projected_fiscal_liability.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      <span className="text-slate-300 font-medium">
                        (${inputs.custom_tax_rate}/ton tax)
                      </span>
                      <span className="block text-[11px] text-slate-500 mt-0.5">
                        Based on Regional Policy Baseline
                      </span>
                    </div>
                  </div>

                  {/* KPI 3: Operational Intensity Status (Pulse Strength Gauge) */}
                  <div className="glass-card rounded-xl p-5 border border-white/10 flex flex-col items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold self-start mb-1">
                      Carbon Pulse Strength
                    </span>
                    <PulseStrengthGauge
                      score={result.pulse_metabolism.strength_score}
                      riskLevel={result.pulse_metabolism.risk_level}
                      color={result.pulse_metabolism.color}
                    />
                  </div>
                </div>

                {/* Multi-Scenario Policy Stress Test Chart */}
                <div id="stress-test-section">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">Quick Preview Mode</span>
                    <button
                      onClick={() => setActiveTab('stress_scenarios')}
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                    >
                      Open Full Stress Scenarios Matrix →
                    </button>
                  </div>
                  <PolicyStressChart
                    result={result}
                    customRate={inputs.custom_tax_rate}
                    onCustomRateChange={handleCustomRateChange}
                  />
                </div>

                {/* Environmental Offset Equivalence Panel */}
                <div id="offset-section">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">Quick Preview Mode</span>
                    <button
                      onClick={() => setActiveTab('equivalence_decoders')}
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                    >
                      Open Full Equivalence & Offset Planner →
                    </button>
                  </div>
                  <OffsetEquivalence result={result} />
                </div>
              </section>
            </div>
          </div>
        )}

        {/* VIEW 3: Dedicated Stress Scenarios Page */}
        {activeTab === 'stress_scenarios' && (
          <StressScenarioView
            inputs={inputs}
            result={result}
            onCustomRateChange={handleCustomRateChange}
            onNavigateToEngine={() => setActiveTab('dashboard')}
          />
        )}

        {/* VIEW 4: Dedicated Equivalence Decoders Page */}
        {activeTab === 'equivalence_decoders' && (
          <EquivalenceDecoderView
            inputs={inputs}
            result={result}
            onNavigateToEngine={() => setActiveTab('dashboard')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0B1120] py-6 text-slate-500 text-xs text-center mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            CarbonPulse Engine · Corporate Environmental ML & Deterministic Financial Risk System
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('landing')}
              className={`hover:text-white transition-colors cursor-pointer ${
                activeTab === 'landing' ? 'text-emerald-400 font-semibold' : ''
              }`}
            >
              Executive Overview
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`hover:text-white transition-colors cursor-pointer ${
                activeTab === 'dashboard' ? 'text-emerald-400 font-semibold' : ''
              }`}
            >
              Simulation Engine
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('stress_scenarios')}
              className={`hover:text-white transition-colors cursor-pointer ${
                activeTab === 'stress_scenarios' ? 'text-emerald-400 font-semibold' : ''
              }`}
            >
              Stress Scenarios
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('equivalence_decoders')}
              className={`hover:text-white transition-colors cursor-pointer ${
                activeTab === 'equivalence_decoders' ? 'text-emerald-400 font-semibold' : ''
              }`}
            >
              Equivalence Decoders
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
