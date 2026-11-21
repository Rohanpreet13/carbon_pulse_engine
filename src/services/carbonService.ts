/**
 * CarbonPulse Core Financial & Environmental Engine
 * Mirrors app.py deterministic calculations and machine learning pipeline logic
 */

import { SimulationInputs, SimulationResult } from '../types/carbon';

export const HISTORICAL_DEFAULTS: SimulationInputs = {
  year: 2027,
  industry_sector: 'Manufacturing',
  region: 'Europe',
  employee_count: 518,
  annual_revenue: 3165.0,
  annual_output_volume: 9.6,
  electricity_consumption_mwh: 4.3,
  natural_gas_consumption_mmbtu: 17.2,
  diesel_consumption_liters: 75.0,
  renewable_electricity_share_pct: 45.0,
  fleet_size: 25,
  waste_generated_tons: 0.24,
  custom_tax_rate: 150.0,
};

export const PRESETS: Record<string, Partial<SimulationInputs>> = {
  manufacturing: {
    year: 2027,
    industry_sector: 'Manufacturing',
    region: 'Europe',
    employee_count: 518,
    annual_revenue: 3165.0,
    annual_output_volume: 9.6,
    electricity_consumption_mwh: 4.3,
    natural_gas_consumption_mmbtu: 17.2,
    diesel_consumption_liters: 75.0,
    renewable_electricity_share_pct: 45.0,
    fleet_size: 25,
    waste_generated_tons: 0.24,
  },
  tech_datacenter: {
    year: 2027,
    industry_sector: 'Technology',
    region: 'North America',
    employee_count: 920,
    annual_revenue: 14500.0,
    annual_output_volume: 90.0,
    electricity_consumption_mwh: 14.5,
    natural_gas_consumption_mmbtu: 2.4,
    diesel_consumption_liters: 12.0,
    renewable_electricity_share_pct: 85.0,
    fleet_size: 5,
    waste_generated_tons: 0.09,
  },
  fleet_logistics: {
    year: 2027,
    industry_sector: 'Transport & Logistics',
    region: 'Europe',
    employee_count: 460,
    annual_revenue: 4300.0,
    annual_output_volume: 52.0,
    electricity_consumption_mwh: 3.8,
    natural_gas_consumption_mmbtu: 9.0,
    diesel_consumption_liters: 290.0,
    renewable_electricity_share_pct: 30.0,
    fleet_size: 98,
    waste_generated_tons: 0.72,
  },
  heavy_industry: {
    year: 2028,
    industry_sector: 'Heavy Industry',
    region: 'Asia-Pacific',
    employee_count: 1600,
    annual_revenue: 9400.0,
    annual_output_volume: 42.0,
    electricity_consumption_mwh: 32.0,
    natural_gas_consumption_mmbtu: 98.0,
    diesel_consumption_liters: 380.0,
    renewable_electricity_share_pct: 12.0,
    fleet_size: 65,
    waste_generated_tons: 2.45,
  },
};

const INDUSTRY_FACTORS: Record<string, number> = {
  Manufacturing: 1.05,
  Energy: 1.35,
  'Heavy Industry': 1.40,
  Technology: 0.75,
  'Transport & Logistics': 1.25,
  Construction: 1.15,
  Healthcare: 0.85,
  Retail: 0.80,
};

const REGION_GRID_FACTORS: Record<string, number> = {
  Europe: 0.88,
  'North America': 0.98,
  'Asia-Pacific': 1.20,
  'Latin America': 0.90,
  'Middle East & Africa': 1.15,
};

export function calculateDeterministicEmissions(data: SimulationInputs): SimulationResult {
  const gas = Math.max(0, data.natural_gas_consumption_mmbtu || 17.2);
  const diesel = Math.max(0, data.diesel_consumption_liters || 75.0);
  const elec = Math.max(0, data.electricity_consumption_mwh || 4.3);
  const renewableShare = Math.max(0, Math.min(100, data.renewable_electricity_share_pct || 45.0)) / 100.0;
  const waste = Math.max(0, data.waste_generated_tons || 0.24);
  const fleet = Math.max(0, data.fleet_size || 25);
  const revenue = Math.max(1.0, data.annual_revenue || 3165.0);

  const indMultiplier = INDUSTRY_FACTORS[data.industry_sector] || 1.0;
  const regMultiplier = REGION_GRID_FACTORS[data.region] || 1.0;

  // GHG Protocol Scope 1: Direct emissions from stationary combustion & mobile fuel
  const scope1 = gas * 0.05307 + diesel * 0.00268;

  // GHG Protocol Scope 2: Indirect emissions from purchased grid electricity
  const scope2 = elec * 0.385 * (1.0 - renewableShare) * regMultiplier;

  // GHG Protocol Scope 3: Indirect emissions from solid waste & fleet activity
  const scope3 = waste * 0.142 + fleet * 0.0018;

  const totalRaw = (scope1 + scope2 + scope3) * (0.95 + 0.05 * indMultiplier);
  const totalEmissions = Math.round(totalRaw * 100) / 100;

  // Regional Policy Allowance
  const allowancePct = data.region === 'Europe' ? 0.20 : 0.25;
  const taxFreeAllowance = Math.round(totalEmissions * allowancePct * 100) / 100;
  const taxableEmissions = Math.max(0, Math.round((totalEmissions - taxFreeAllowance) * 100) / 100);

  // Scenarios
  const customRate = data.custom_tax_rate || 150.0;
  const scenarios = {
    rate_50: {
      rate_per_ton: 50.0,
      tax_liability: Math.round(taxableEmissions * 50.0),
      gross_liability: Math.round(totalEmissions * 50.0),
      policy_label: 'Conservative Baseline ($50/t)',
    },
    rate_100: {
      rate_per_ton: 100.0,
      tax_liability: Math.round(taxableEmissions * 100.0),
      gross_liability: Math.round(totalEmissions * 100.0),
      policy_label: 'Accelerated Transition ($100/t)',
    },
    rate_150: {
      rate_per_ton: 150.0,
      tax_liability: Math.round(taxableEmissions * 150.0),
      gross_liability: Math.round(totalEmissions * 150.0),
      policy_label: 'Net-Zero Stressed ($150/t)',
    },
    custom: {
      rate_per_ton: customRate,
      tax_liability: Math.round(taxableEmissions * customRate),
      gross_liability: Math.round(totalEmissions * customRate),
      policy_label: `Custom Policy Horizon ($${customRate}/t)`,
    },
  };

  // Intensity & Pulse Status
  const intensity = (totalEmissions / revenue) * 1000.0;

  let pulseStatus = 'Optimized Metabolism';
  let pulseColor = '#10B981';
  let riskLevel = 'Low';
  let pulseScore = Math.min(100, intensity * 20.0);

  if (intensity < 2.5 && totalEmissions < 10.0) {
    pulseStatus = 'Optimized Metabolism';
    pulseColor = '#10B981';
    riskLevel = 'Low';
    pulseScore = Math.min(40, Math.max(10, intensity * 15));
  } else if (intensity < 6.0 && totalEmissions < 35.0) {
    pulseStatus = 'Elevated Operational Pulse';
    pulseColor = '#F59E0B';
    riskLevel = 'Moderate';
    pulseScore = Math.min(70, Math.max(40, 35 + (intensity - 2.5) * 10));
  } else {
    pulseStatus = 'Critical Liability Alert';
    pulseColor = '#EF4444';
    riskLevel = 'High';
    pulseScore = Math.min(100, Math.max(70, 70 + (intensity - 6.0) * 8));
  }

  // Offset Equivalence
  const treeSeedlings = Math.round(totalEmissions * 16.5);
  const passengerKm = Math.round(totalEmissions * 4080.0);
  const barrelsOil = Math.round(totalEmissions * 2.32 * 10) / 10;

  return {
    predicted_emissions_tco2e: totalEmissions,
    tax_free_allowance_tco2e: taxFreeAllowance,
    taxable_emissions_tco2e: taxableEmissions,
    selected_tax_rate: customRate,
    projected_fiscal_liability: Math.round(taxableEmissions * customRate),
    scenarios,
    offset_equivalence: {
      tree_seedlings_10yr: treeSeedlings,
      passenger_vehicle_km: passengerKm,
      barrels_oil_equiv: barrelsOil,
    },
    pulse_metabolism: {
      status: pulseStatus,
      color: pulseColor,
      risk_level: riskLevel,
      strength_score: Math.round(pulseScore),
      intensity_ratio: Math.round(intensity * 100) / 100,
    },
    scope_decomposition: {
      scope1_direct: Math.round(scope1 * 100) / 100,
      scope2_electricity: Math.round(scope2 * 100) / 100,
      scope3_value_chain: Math.round(scope3 * 100) / 100,
    },
  };
}

export async function runPrediction(inputs: SimulationInputs): Promise<SimulationResult> {
  try {
    const response = await fetch('/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    });

    if (response.ok) {
      const result = await response.json();
      if (result && result.data) {
        return result.data as SimulationResult;
      }
    }
  } catch (err) {
    // Graceful fallback to client deterministic engine
    console.debug('Direct /api/predict fetch unavailable, computing via client pipeline', err);
  }

  return calculateDeterministicEmissions(inputs);
}
