/**
 * CarbonPulse Domain Types
 */

export interface SimulationInputs {
  year: number;
  industry_sector: string;
  region: string;
  employee_count: number;
  annual_revenue: number;
  annual_output_volume: number;
  electricity_consumption_mwh: number;
  natural_gas_consumption_mmbtu: number;
  diesel_consumption_liters: number;
  renewable_electricity_share_pct: number;
  fleet_size: number;
  waste_generated_tons: number;
  custom_tax_rate: number;
}

export interface ScenarioResult {
  rate_per_ton: number;
  tax_liability: number;
  gross_liability: number;
  policy_label: string;
}

export interface SimulationResult {
  predicted_emissions_tco2e: number;
  tax_free_allowance_tco2e: number;
  taxable_emissions_tco2e: number;
  selected_tax_rate: number;
  projected_fiscal_liability: number;
  scenarios: {
    rate_50: ScenarioResult;
    rate_100: ScenarioResult;
    rate_150: ScenarioResult;
    custom: ScenarioResult;
  };
  offset_equivalence: {
    tree_seedlings_10yr: number;
    passenger_vehicle_km: number;
    barrels_oil_equiv: number;
  };
  pulse_metabolism: {
    status: string;
    color: string;
    risk_level: string;
    strength_score: number;
    intensity_ratio: number;
  };
  scope_decomposition: {
    scope1_direct: number;
    scope2_electricity: number;
    scope3_value_chain: number;
  };
}
