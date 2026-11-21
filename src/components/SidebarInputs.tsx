import React from 'react';
import { SimulationInputs } from '../types/carbon';
import { PRESETS } from '../services/carbonService';
import { Building2, Users, Zap, CheckCircle2 } from 'lucide-react';

interface SidebarInputsProps {
  inputs: SimulationInputs;
  onChange: (inputs: SimulationInputs) => void;
  onApplyPreset: (presetKey: string) => void;
}

export const SidebarInputs: React.FC<SidebarInputsProps> = ({
  inputs,
  onChange,
  onApplyPreset,
}) => {
  const updateField = <K extends keyof SimulationInputs>(
    field: K,
    val: SimulationInputs[K]
  ) => {
    onChange({
      ...inputs,
      [field]: val,
    });
  };

  return (
    <div className="glass-card rounded-xl p-5 border border-white/10 space-y-4">
      {/* Sidebar Header & Presets */}
      <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center lg:items-start xl:items-center justify-between gap-2 pb-3 border-b border-white/10">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Enterprise Model Inputs
          </h2>
          <p className="text-xs text-slate-400">12 Features mapped to ML Pipeline</p>
        </div>

        <select
          onChange={(e) => onApplyPreset(e.target.value)}
          defaultValue="manufacturing"
          className="text-xs bg-slate-800 text-slate-200 border border-white/10 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
        >
          <option value="manufacturing">Preset: Manufacturing Factory</option>
          <option value="tech_datacenter">Preset: Cloud & Data Center</option>
          <option value="fleet_logistics">Preset: Logistics Fleet</option>
          <option value="heavy_industry">Preset: Heavy Industry Operator</option>
        </select>
      </div>

      {/* Accordion / Category 1: Jurisdiction & Governance */}
      <details open className="group border border-white/5 bg-slate-900/50 rounded-lg p-3 transition-colors">
        <summary className="flex items-center justify-between text-xs font-semibold text-slate-200 cursor-pointer list-none select-none">
          <span className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            1. Jurisdiction & Governance
          </span>
          <span className="text-slate-400 group-open:rotate-180 transition-transform text-xs">▼</span>
        </summary>
        <div className="grid grid-cols-2 gap-3 mt-3 pt-2 border-t border-white/5">
          {/* 1. year */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Target Fiscal Year</label>
            <select
              value={inputs.year}
              onChange={(e) => updateField('year', Number(e.target.value))}
              className="w-full bg-slate-800 border border-white/10 text-xs rounded-lg px-2.5 py-2 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
              <option value={2028}>2028</option>
              <option value={2030}>2030</option>
            </select>
          </div>

          {/* 2. industry_sector */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Industry Sector</label>
            <select
              value={inputs.industry_sector}
              onChange={(e) => updateField('industry_sector', e.target.value)}
              className="w-full bg-slate-800 border border-white/10 text-xs rounded-lg px-2.5 py-2 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="Manufacturing">Manufacturing</option>
              <option value="Energy">Energy & Utilities</option>
              <option value="Technology">Technology & Cloud</option>
              <option value="Transport & Logistics">Transport & Logistics</option>
              <option value="Heavy Industry">Heavy Industry</option>
              <option value="Construction">Construction</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Retail">Retail & Consumer</option>
            </select>
          </div>

          {/* 3. region */}
          <div className="col-span-2">
            <label className="block text-[11px] text-slate-400 mb-1">Regulatory Region</label>
            <select
              value={inputs.region}
              onChange={(e) => updateField('region', e.target.value)}
              className="w-full bg-slate-800 border border-white/10 text-xs rounded-lg px-2.5 py-2 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="Europe">Europe (EU ETS Policy)</option>
              <option value="North America">North America (US Clean Air Act)</option>
              <option value="Asia-Pacific">Asia-Pacific (Carbon Market)</option>
              <option value="Latin America">Latin America</option>
              <option value="Middle East & Africa">Middle East & Africa</option>
            </select>
          </div>
        </div>
      </details>

      {/* Accordion / Category 2: Operational Scale & Output */}
      <details open className="group border border-white/5 bg-slate-900/50 rounded-lg p-3 transition-colors">
        <summary className="flex items-center justify-between text-xs font-semibold text-slate-200 cursor-pointer list-none select-none">
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            2. Operational Scale & Output
          </span>
          <span className="text-slate-400 group-open:rotate-180 transition-transform text-xs">▼</span>
        </summary>
        <div className="space-y-3 mt-3 pt-2 border-t border-white/5">
          {/* 4. employee_count */}
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs text-slate-400">Employee Count</label>
            <input
              type="number"
              min={1}
              max={100000}
              value={inputs.employee_count}
              onChange={(e) => updateField('employee_count', Math.max(1, Number(e.target.value)))}
              className="w-24 bg-slate-800 border border-white/10 text-xs rounded-lg px-2 py-1 text-right font-mono text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* 5. annual_revenue */}
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs text-slate-400">Annual Revenue ($M)</label>
            <input
              type="number"
              step="1"
              min={0.1}
              value={inputs.annual_revenue}
              onChange={(e) => updateField('annual_revenue', Math.max(0.1, Number(e.target.value)))}
              className="w-24 bg-slate-800 border border-white/10 text-xs rounded-lg px-2 py-1 text-right font-mono text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* 6. annual_output_volume */}
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs text-slate-400">Output Volume (k Units)</label>
            <input
              type="number"
              step="0.1"
              min={0.1}
              value={inputs.annual_output_volume}
              onChange={(e) => updateField('annual_output_volume', Math.max(0.1, Number(e.target.value)))}
              className="w-24 bg-slate-800 border border-white/10 text-xs rounded-lg px-2 py-1 text-right font-mono text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* 11. fleet_size */}
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs text-slate-400">Fleet Size (Vehicles)</label>
            <input
              type="number"
              min={0}
              value={inputs.fleet_size}
              onChange={(e) => updateField('fleet_size', Math.max(0, Number(e.target.value)))}
              className="w-24 bg-slate-800 border border-white/10 text-xs rounded-lg px-2 py-1 text-right font-mono text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
      </details>

      {/* Accordion / Category 3: Resource Projections & Energy */}
      <details open className="group border border-white/5 bg-slate-900/50 rounded-lg p-3 transition-colors">
        <summary className="flex items-center justify-between text-xs font-semibold text-slate-200 cursor-pointer list-none select-none">
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            3. Resource Projections
          </span>
          <span className="text-slate-400 group-open:rotate-180 transition-transform text-xs">▼</span>
        </summary>
        <div className="space-y-3.5 mt-3 pt-2 border-t border-white/5">
          {/* 7. electricity_consumption_mwh */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Electricity Demand</span>
              <span className="font-mono text-emerald-400">{inputs.electricity_consumption_mwh} MWh</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={60}
              step={0.1}
              value={inputs.electricity_consumption_mwh}
              onChange={(e) => updateField('electricity_consumption_mwh', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg cursor-pointer accent-emerald-500"
            />
          </div>

          {/* 8. natural_gas_consumption_mmbtu */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Natural Gas Demand</span>
              <span className="font-mono text-blue-400">{inputs.natural_gas_consumption_mmbtu} MMBtu</span>
            </div>
            <input
              type="range"
              min={1}
              max={150}
              step={0.5}
              value={inputs.natural_gas_consumption_mmbtu}
              onChange={(e) => updateField('natural_gas_consumption_mmbtu', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg cursor-pointer accent-blue-500"
            />
          </div>

          {/* 9. diesel_consumption_liters */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Diesel Fleet Fuel</span>
              <span className="font-mono text-amber-400">{inputs.diesel_consumption_liters} L</span>
            </div>
            <input
              type="range"
              min={5}
              max={500}
              step={1}
              value={inputs.diesel_consumption_liters}
              onChange={(e) => updateField('diesel_consumption_liters', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg cursor-pointer accent-amber-500"
            />
          </div>

          {/* 10. renewable_electricity_share_pct (HIGHLIGHTED CONTAINER AS IN MOCKUP) */}
          <div className="p-3 rounded-lg border border-emerald-500/40 bg-emerald-950/20 shadow-[0_0_18px_-4px_rgba(16,185,129,0.25)]">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Renewable Grid Share (%)
              </span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {inputs.renewable_electricity_share_pct}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={inputs.renewable_electricity_share_pct}
              onChange={(e) => updateField('renewable_electricity_share_pct', Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg cursor-pointer accent-emerald-400"
            />
          </div>

          {/* 12. waste_generated_tons */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Solid Waste Generated</span>
              <span className="font-mono text-purple-400">{inputs.waste_generated_tons} Tons</span>
            </div>
            <input
              type="range"
              min={0.01}
              max={5}
              step={0.05}
              value={inputs.waste_generated_tons}
              onChange={(e) => updateField('waste_generated_tons', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg cursor-pointer accent-purple-500"
            />
          </div>
        </div>
      </details>
    </div>
  );
};
