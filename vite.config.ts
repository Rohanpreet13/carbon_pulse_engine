import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

// Built-in dev server API middleware for /api/predict and /api/health
function carbonApiDevPlugin(): Plugin {
  return {
    name: 'carbon-api-dev-middleware',
    configureServer(server) {
      server.middlewares.use('/api/health', (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: 'healthy', service: 'CarbonPulse Vite Dev Engine' }));
      });

      server.middlewares.use('/api/predict', (req, res, next) => {
        if (req.method !== 'POST') return next();

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', () => {
          try {
            const data = JSON.parse(body || '{}');
            const gas = Math.max(0, parseFloat(data.natural_gas_consumption_mmbtu || 17.2));
            const diesel = Math.max(0, parseFloat(data.diesel_consumption_liters || 75.0));
            const elec = Math.max(0, parseFloat(data.electricity_consumption_mwh || 4.3));
            const ren = Math.max(0, Math.min(100, parseFloat(data.renewable_electricity_share_pct || 45.0))) / 100.0;
            const waste = Math.max(0, parseFloat(data.waste_generated_tons || 0.24));
            const fleet = Math.max(0, parseFloat(data.fleet_size || 25));
            const rev = Math.max(1, parseFloat(data.annual_revenue || 3165.0));
            const customRate = parseFloat(data.custom_tax_rate || 150.0);

            const indMultiplier = data.industry_sector === 'Energy' ? 1.35 : data.industry_sector === 'Heavy Industry' ? 1.4 : 1.05;
            const regMultiplier = data.region === 'Asia-Pacific' ? 1.2 : data.region === 'North America' ? 0.98 : 0.88;

            const scope1 = gas * 0.05307 + diesel * 0.00268;
            const scope2 = elec * 0.385 * (1.0 - ren) * regMultiplier;
            const scope3 = waste * 0.142 + fleet * 0.0018;
            const totalEmissions = Math.round((scope1 + scope2 + scope3) * (0.95 + 0.05 * indMultiplier) * 100) / 100;

            const allowPct = data.region === 'Europe' ? 0.2 : 0.25;
            const taxFreeAllowance = Math.round(totalEmissions * allowPct * 100) / 100;
            const taxable = Math.max(0, Math.round((totalEmissions - taxFreeAllowance) * 100) / 100);

            const intensity = (totalEmissions / rev) * 1000.0;
            let status = 'Optimized Metabolism', color = '#10B981', risk = 'Low';
            if (intensity < 2.5 && totalEmissions < 10.0) {
              status = 'Optimized Metabolism'; color = '#10B981'; risk = 'Low';
            } else if (intensity < 6.0 && totalEmissions < 35.0) {
              status = 'Elevated Operational Pulse'; color = '#F59E0B'; risk = 'Moderate';
            } else {
              status = 'Critical Liability Alert'; color = '#EF4444'; risk = 'High';
            }

            const responsePayload = {
              success: true,
              data: {
                predicted_emissions_tco2e: totalEmissions,
                tax_free_allowance_tco2e: taxFreeAllowance,
                taxable_emissions_tco2e: taxable,
                selected_tax_rate: customRate,
                projected_fiscal_liability: Math.round(taxable * customRate),
                scenarios: {
                  rate_50: { rate_per_ton: 50, tax_liability: Math.round(taxable * 50), gross_liability: Math.round(totalEmissions * 50), policy_label: 'Conservative Baseline ($50/t)' },
                  rate_100: { rate_per_ton: 100, tax_liability: Math.round(taxable * 100), gross_liability: Math.round(totalEmissions * 100), policy_label: 'Accelerated Transition ($100/t)' },
                  rate_150: { rate_per_ton: 150, tax_liability: Math.round(taxable * 150), gross_liability: Math.round(totalEmissions * 150), policy_label: 'Net-Zero Stressed ($150/t)' },
                  custom: { rate_per_ton: customRate, tax_liability: Math.round(taxable * customRate), gross_liability: Math.round(totalEmissions * customRate), policy_label: `Custom ($${customRate}/t)` },
                },
                offset_equivalence: {
                  tree_seedlings_10yr: Math.round(totalEmissions * 16.5),
                  passenger_vehicle_km: Math.round(totalEmissions * 4080),
                  barrels_oil_equiv: Math.round(totalEmissions * 2.32 * 10) / 10,
                },
                pulse_metabolism: {
                  status,
                  color,
                  risk_level: risk,
                  strength_score: Math.min(100, Math.round(intensity * 15)),
                  intensity_ratio: Math.round(intensity * 100) / 100,
                },
                scope_decomposition: {
                  scope1_direct: Math.round(scope1 * 100) / 100,
                  scope2_electricity: Math.round(scope2 * 100) / 100,
                  scope3_value_chain: Math.round(scope3 * 100) / 100,
                },
              },
            };

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(responsePayload));
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: String(err) }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), carbonApiDevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
