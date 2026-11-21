import React, { useState } from 'react';
import { SimulationInputs, SimulationResult } from '../types/carbon';
import {
  Sprout,
  Car,
  Flame,
  Home,
  Smartphone,
  Plane,
  Trees,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface EquivalenceDecoderViewProps {
  inputs: SimulationInputs;
  result: SimulationResult;
  onNavigateToEngine: () => void;
}

export const EquivalenceDecoderView: React.FC<EquivalenceDecoderViewProps> = ({
  inputs,
  result,
  onNavigateToEngine,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'nature' | 'mobility' | 'energy' | 'fossil'>('all');
  const [offsetPricePerTon, setOffsetPricePerTon] = useState<number>(25); // $25/credit on voluntary carbon market
  const [neutralizationTargetPct, setNeutralizationTargetPct] = useState<number>(100);

  const { predicted_emissions_tco2e } = result;

  // EPA Standard Environmental Equivalence Factors
  const metrics = {
    treeSeedlings: Math.round(predicted_emissions_tco2e * 16.5),
    acresForest: (predicted_emissions_tco2e * 1.22).toFixed(1),
    urbanTrees: Math.round(predicted_emissions_tco2e * 2.8),
    vehicleKm: Math.round(predicted_emissions_tco2e * 4080),
    gasolineLiters: Math.round(predicted_emissions_tco2e * 427),
    flightsLondonNY: (predicted_emissions_tco2e / 0.85).toFixed(1),
    homesElectricityYear: (predicted_emissions_tco2e * 0.19).toFixed(1),
    smartphonesCharged: Math.round(predicted_emissions_tco2e * 121643),
    ledHours: Math.round(predicted_emissions_tco2e * 72000),
    barrelsOil: (predicted_emissions_tco2e * 2.32).toFixed(1),
    poundsCoal: Math.round(predicted_emissions_tco2e * 1102),
    propaneCylinders: Math.round(predicted_emissions_tco2e * 44),
  };

  // Neutralization budget
  const tonsToOffset = predicted_emissions_tco2e * (neutralizationTargetPct / 100);
  const totalOffsetCost = Math.round(tonsToOffset * offsetPricePerTon);

  const cards = [
    {
      category: 'nature',
      icon: <Sprout className="w-6 h-6 text-emerald-400" />,
      color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
      title: 'Tree Seedlings Grown for 10 Years',
      value: metrics.treeSeedlings.toLocaleString(),
      unit: 'seedlings',
      desc: 'Urban and coniferous saplings sequestering carbon over a ten-year survival period (EPA greenhouse gas factor 16.5×).',
    },
    {
      category: 'nature',
      icon: <Trees className="w-6 h-6 text-emerald-400" />,
      color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
      title: 'Acres of U.S. Forest Preserved',
      value: metrics.acresForest,
      unit: 'acres',
      desc: 'Total annual carbon sequestered by one acre of average temperate deciduous forest ecosystem in one year.',
    },
    {
      category: 'mobility',
      icon: <Car className="w-6 h-6 text-blue-400" />,
      color: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
      title: 'Passenger Vehicle Kilometers',
      value: `${metrics.vehicleKm.toLocaleString()} km`,
      unit: 'km driven',
      desc: 'Distance driven by an average internal combustion engine passenger car (EPA factor: 4,080 km per tCO2e).',
    },
    {
      category: 'mobility',
      icon: <Plane className="w-6 h-6 text-blue-400" />,
      color: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
      title: 'Transatlantic Flights (London – NY)',
      value: metrics.flightsLondonNY,
      unit: 'passenger trips',
      desc: 'Equivalent individual economy passenger round-trip flight emissions including radiative forcing indices.',
    },
    {
      category: 'energy',
      icon: <Home className="w-6 h-6 text-amber-400" />,
      color: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
      title: 'Homes Powered for an Entire Year',
      value: metrics.homesElectricityYear,
      unit: 'homes / year',
      desc: 'Annual electricity demand consumption of typical residential detached homes (EPA average 10,500 kWh/year).',
    },
    {
      category: 'energy',
      icon: <Smartphone className="w-6 h-6 text-amber-400" />,
      color: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
      title: 'Smartphones Charged',
      value: metrics.smartphonesCharged.toLocaleString(),
      unit: 'recharges',
      desc: 'Full battery charge cycles of modern mobile lithium-ion smartphones (121,643 charges per metric ton CO2e).',
    },
    {
      category: 'fossil',
      icon: <Flame className="w-6 h-6 text-rose-400" />,
      color: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
      title: 'Barrels of Crude Oil Consumed',
      value: metrics.barrelsOil,
      unit: 'barrels',
      desc: 'Direct stoichiometric thermal energy release from standard 42-gallon barrels of petroleum crude oil.',
    },
    {
      category: 'fossil',
      icon: <Flame className="w-6 h-6 text-rose-400" />,
      color: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
      title: 'Coal Burned (Pounds)',
      value: `${metrics.poundsCoal.toLocaleString()} lbs`,
      unit: 'lbs coal',
      desc: 'Sub-bituminous thermal power plant coal burned to generate equivalent greenhouse gas emissions.',
    },
  ];

  const filteredCards =
    activeCategory === 'all'
      ? cards
      : cards.filter((c) => c.category === activeCategory);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sprout className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Equivalence Decoders & Offset Intelligence
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Translate abstract metric tons (<code className="text-emerald-300 font-mono">tCO2e</code>) into tangible everyday environmental equivalents, calculate voluntary carbon credit budgets, and model verified net-zero neutralization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToEngine}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            Fine-tune Emissions in Engine
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Corporate Pulse Output Anchor */}
      <div className="glass-card rounded-2xl p-6 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_0_25px_-5px_rgba(16,185,129,0.15)]">
        <div>
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Enterprise Output Baseline
          </div>
          <div className="flex items-baseline gap-3 my-1">
            <span className="text-4xl sm:text-5xl font-extrabold font-mono text-white">
              {predicted_emissions_tco2e.toFixed(2)}
            </span>
            <span className="text-xl font-bold text-emerald-400">tCO2e per year</span>
          </div>
          <p className="text-xs text-slate-400">
            Current operational carbon pulse calculated for {inputs.industry_sector} ({inputs.region}) with {inputs.employee_count} employees and ${inputs.annual_revenue}M revenue.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900 rounded-xl border border-white/10 text-xs">
          {[
            { id: 'all', label: 'All Equivalencies' },
            { id: 'nature', label: 'Forestry & Nature' },
            { id: 'mobility', label: 'Transport & Travel' },
            { id: 'energy', label: 'Homes & Grid' },
            { id: 'fossil', label: 'Fossil Fuels' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeCategory === tab.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Decoded Equivalency Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredCards.map((card, idx) => (
          <div
            key={idx}
            className="glass-card rounded-xl p-5 border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all duration-200"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${card.color}`}>
                  {card.icon}
                </div>
                <span className="text-[10px] uppercase font-mono text-slate-400">EPA GHG</span>
              </div>
              <div className="text-2xl font-extrabold font-mono text-white tracking-tight">
                {card.value}
              </div>
              <div className="text-xs font-semibold text-slate-200 mt-0.5">{card.title}</div>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 leading-relaxed border-t border-white/5 pt-2">
              {card.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Part 2: Interactive Voluntary Carbon Credit Neutralization Planner */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              Voluntary Carbon Credit Neutralization Planner
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Model verified carbon credit purchasing budgets (VCS / Gold Standard) to neutralize your company's emissions.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-white/10 text-xs">
            <span className="text-slate-400">Market Credit Price:</span>
            <span className="font-mono font-bold text-emerald-400">${offsetPricePerTon} / credit</span>
            <input
              type="range"
              min={10}
              max={60}
              step={5}
              value={offsetPricePerTon}
              onChange={(e) => setOffsetPricePerTon(Number(e.target.value))}
              className="w-20 h-1.5 bg-slate-700 rounded cursor-pointer accent-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Target Slider */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-semibold">Corporate Neutralization Target:</span>
                <span className="font-mono font-bold text-emerald-400">{neutralizationTargetPct}% Neutralized</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={neutralizationTargetPct}
                onChange={(e) => setNeutralizationTargetPct(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>10% Low-Impact</span>
                <span>50% Scope 1 & 2 Neutral</span>
                <span>100% Full Net-Zero</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-900/60 p-3 rounded-lg border border-white/5">
                <span className="text-[11px] text-slate-400">Credits to Retire</span>
                <div className="text-xl font-bold font-mono text-white mt-0.5">
                  {tonsToOffset.toFixed(2)} <span className="text-xs text-slate-400">credits</span>
                </div>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-emerald-500/20">
                <span className="text-[11px] text-emerald-400 font-semibold">Total Annual Offset Budget</span>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                  ${totalOffsetCost.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Registry Standards */}
          <div className="lg:col-span-5 bg-slate-900/60 p-4 rounded-xl border border-white/5 space-y-3 text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              High-Integrity Verification Registries
            </span>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Verra VCS (Verified Carbon Standard):</strong> Nature-based forestry, soil carbon, and ARR methodologies.</span>
              </div>
              <div className="flex items-start gap-2 text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Gold Standard for the Global Goals:</strong> Clean cookstoves, renewable grid access, and biodiversity co-benefits.</span>
              </div>
              <div className="flex items-start gap-2 text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Puro.earth / CDR:</strong> Permanent biochar and direct air capture (DAC) carbon removal.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
