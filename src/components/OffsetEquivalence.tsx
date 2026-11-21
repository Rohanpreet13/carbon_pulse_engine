import React from 'react';
import { Sprout, Car, Flame } from 'lucide-react';
import { SimulationResult } from '../types/carbon';

interface OffsetEquivalenceProps {
  result: SimulationResult;
}

export const OffsetEquivalence: React.FC<OffsetEquivalenceProps> = ({ result }) => {
  const { predicted_emissions_tco2e, offset_equivalence } = result;

  return (
    <div className="glass-card rounded-xl p-6 border border-white/10 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Sprout className="w-4 h-4 text-emerald-400" />
          <h3 className="text-base font-bold text-white tracking-tight">
            Offset Equivalence (Decode the Pulse)
          </h3>
        </div>
        <div className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
          {predicted_emissions_tco2e.toFixed(2)} tCO2e Output
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Tree Seedlings: Tons * 16.5 */}
        <div className="bg-slate-900/60 rounded-xl p-4 border border-white/5 flex items-start gap-4 hover:border-emerald-500/30 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold font-mono text-white">
              {offset_equivalence.tree_seedlings_10yr.toLocaleString()}
            </div>
            <div className="text-xs font-semibold text-slate-200 mt-0.5">
              Tree Seedlings
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              Grown for 10 years to sequester equivalent corporate carbon (EPA 16.5× factor)
            </p>
          </div>
        </div>

        {/* Passenger Vehicle KM: Tons * 4080 */}
        <div className="bg-slate-900/60 rounded-xl p-4 border border-white/5 flex items-start gap-4 hover:border-blue-500/30 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-400">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold font-mono text-white">
              {offset_equivalence.passenger_vehicle_km.toLocaleString()} km
            </div>
            <div className="text-xs font-semibold text-slate-200 mt-0.5">
              Vehicle Kilometers Driven
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              Distance driven by an average internal combustion passenger vehicle (EPA 4,080 km/t)
            </p>
          </div>
        </div>

        {/* Crude Oil Equivalence */}
        <div className="bg-slate-900/60 rounded-xl p-4 border border-white/5 flex items-start gap-4 sm:col-span-2 lg:col-span-1 hover:border-amber-500/30 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold font-mono text-white">
              {offset_equivalence.barrels_oil_equiv.toLocaleString()}
            </div>
            <div className="text-xs font-semibold text-slate-200 mt-0.5">
              Barrels of Crude Oil
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              Direct thermal combustion energy equivalent (2.32 barrels per metric ton CO2e)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
