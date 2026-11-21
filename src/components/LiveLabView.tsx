import React, { useCallback, useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Cloud,
  Database,
  Download,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';
import { LIVE_CLOUD_RUN_API_URL } from '../config/api';

interface LeaderboardRow {
  model: string;
  roc_auc: number;
  roc_auc_ci95: [number, number];
  pr_auc: number;
  ks_statistic: number;
  brier_score: number;
}

interface LeakageFinding {
  severity: string;
  vector: string;
  evidence: string;
  action: string;
}

interface SliceRow {
  slice: string;
  count: number;
  actual_default_rate: number;
  mean_predicted_pd: number;
  roc_auc: number;
  brier_score: number;
}

interface ModelInfoResponse {
  model_name: string;
  version: string;
  random_state: number;
  dataset: {
    total_rows: number;
    train_rows: number;
    val_rows: number;
    test_rows: number;
    overall_default_rate: number;
    test_default_rate: number;
    train_cutoff: string;
    val_window: string;
    test_window: string;
    missingness_pct: Record<string, number>;
  };
  excluded_leakage_columns: string[];
  leakage_audit: LeakageFinding[];
  oot_test_leaderboard: LeaderboardRow[];
  regional_slices: SliceRow[];
  sample_rows: Record<string, string | number | null>[];
}

interface PredictResponse {
  baseline_pd: number;
  challenger_pd: number;
  pd_spread: number;
  risk_tier: string;
  decision: string;
  approval_threshold: number;
  expected_loss_usd: number;
  lgd_assumption: number;
  top_risk_drivers: {
    feature: string;
    log_odds_impact: number;
    direction: 'increases_risk' | 'reduces_risk';
  }[];
  served_by: {
    service: string;
    revision: string;
  };
}

interface HealthResponse {
  status: string;
  service: string;
  revision: string;
  region: string;
  model_version: string;
}

const PRESETS = [
  {
    name: 'Prime Homeowner',
    credit_score: 770,
    annual_income: 125000,
    loan_amount: 16000,
    dti_ratio: 12,
    utilization_rate: 18,
    delinq_2yrs: 0,
    emp_length_yrs: 9,
    loan_purpose: 'home_improvement',
  },
  {
    name: 'Borderline Consolidator',
    credit_score: 660,
    annual_income: 74000,
    loan_amount: 22000,
    dti_ratio: 28,
    utilization_rate: 56,
    delinq_2yrs: 1,
    emp_length_yrs: 3,
    loan_purpose: 'debt_consolidation',
  },
  {
    name: 'High-Risk Small Biz',
    credit_score: 575,
    annual_income: 52000,
    loan_amount: 26000,
    dti_ratio: 41,
    utilization_rate: 84,
    delinq_2yrs: 2,
    emp_length_yrs: 1,
    loan_purpose: 'small_business',
  },
] as const;

export const LiveLabView: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfoResponse | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Interactive borrower inputs
  const [creditScore, setCreditScore] = useState<number>(675);
  const [annualIncome, setAnnualIncome] = useState<number>(82000);
  const [loanAmount, setLoanAmount] = useState<number>(19000);
  const [dtiRatio, setDtiRatio] = useState<number>(24);
  const [utilizationRate, setUtilizationRate] = useState<number>(45);
  const [delinq2yrs, setDelinq2yrs] = useState<number>(0);
  const [empLengthYrs, setEmpLengthYrs] = useState<number>(4);
  const [loanPurpose, setLoanPurpose] = useState<string>('debt_consolidation');
  const [threshold, setThreshold] = useState<number>(0.2);

  const [prediction, setPrediction] = useState<PredictResponse | null>(null);
  const [scoring, setScoring] = useState<boolean>(false);

  // Load health & model metadata from live GCP Cloud Run
  useEffect(() => {
    let cancelled = false;
    async function loadBackend() {
      try {
        const t0 = performance.now();
        const [hRes, mRes] = await Promise.all([
          fetch(`${LIVE_CLOUD_RUN_API_URL}/health`),
          fetch(`${LIVE_CLOUD_RUN_API_URL}/model-info`),
        ]);
        if (!hRes.ok || !mRes.ok) {
          throw new Error(`HTTP ${hRes.status}/${mRes.status}`);
        }
        const [hJson, mJson] = (await Promise.all([
          hRes.json(),
          mRes.json(),
        ])) as [HealthResponse, ModelInfoResponse];
        if (!cancelled) {
          setHealth(hJson);
          setModelInfo(mJson);
          setLatencyMs(Math.round(performance.now() - t0));
          setApiError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setApiError(err instanceof Error ? err.message : 'Unable to reach GCP Cloud Run API');
        }
      }
    }
    loadBackend();
    return () => {
      cancelled = true;
    };
  }, []);

  const scoreApplicant = useCallback(async () => {
    setScoring(true);
    try {
      const t0 = performance.now();
      const res = await fetch(`${LIVE_CLOUD_RUN_API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          annual_income: annualIncome,
          loan_amount: loanAmount,
          credit_score: creditScore,
          dti_ratio: dtiRatio,
          utilization_rate: utilizationRate,
          delinq_2yrs: delinq2yrs,
          emp_length_yrs: empLengthYrs,
          loan_purpose: loanPurpose,
          approval_threshold: threshold,
        }),
      });
      if (!res.ok) throw new Error(`Scoring failed (${res.status})`);
      const data = (await res.json()) as PredictResponse;
      setPrediction(data);
      setLatencyMs(Math.round(performance.now() - t0));
      setApiError(null);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Live scoring error');
    } finally {
      setScoring(false);
    }
  }, [
    annualIncome,
    creditScore,
    delinq2yrs,
    dtiRatio,
    empLengthYrs,
    loanAmount,
    loanPurpose,
    threshold,
    utilizationRate,
  ]);

  // Trigger live scoring whenever sliders settle (debounced 220ms)
  useEffect(() => {
    const id = setTimeout(() => {
      scoreApplicant();
    }, 220);
    return () => clearTimeout(id);
  }, [scoreApplicant]);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setCreditScore(p.credit_score);
    setAnnualIncome(p.annual_income);
    setLoanAmount(p.loan_amount);
    setDtiRatio(p.dti_ratio);
    setUtilizationRate(p.utilization_rate);
    setDelinq2yrs(p.delinq_2yrs);
    setEmpLengthYrs(p.emp_length_yrs);
    setLoanPurpose(p.loan_purpose);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header + Live GCP Cloud Run Status Bar */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 lg:flex-row lg:items-end">
        <div>
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-300">
            Live Flagship Dataset · FastAPI + Scikit-Learn on GCP Cloud Run
          </span>
          <h1 className="mt-1 text-3xl font-extrabold text-white">
            Credit Risk Scorecard Lab & Live GCP Backend
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-400">
            A real 6,000-loan out-of-time credit default lab complete with an intentional target
            leakage trap, Baseline vs. Challenger leaderboard, pytest verification suite, and live
            real-time inference hosted on your <strong className="text-white">Google Cloud Run</strong>{' '}
            project (<code className="font-mono text-cyan-300">claude-drive-501415</code>).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div
            className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold ${
              health
                ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'
                : apiError
                ? 'border-rose-400/40 bg-rose-500/10 text-rose-200'
                : 'border-slate-700 bg-surface-900 text-slate-300'
            }`}
          >
            <Cloud className="h-4 w-4" />
            {health ? (
              <>
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                GCP Cloud Run Live ({health.region}) · {latencyMs ?? '—'}ms
              </>
            ) : apiError ? (
              <>Backend Unreachable: {apiError}</>
            ) : (
              <>Connecting to GCP Cloud Run…</>
            )}
          </div>

          <a
            href={`${LIVE_CLOUD_RUN_API_URL}/docs`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-surface-900 px-3.5 py-2 text-xs font-semibold text-cyan-300 transition hover:border-cyan-400/50 hover:bg-surface-850"
          >
            Swagger API Docs <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <a
            href={`${LIVE_CLOUD_RUN_API_URL}/dataset/csv`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-500/20 px-3.5 py-2 text-xs font-semibold text-indigo-200 ring-1 ring-indigo-400/40 transition hover:bg-indigo-500/30"
          >
            <Download className="h-3.5 w-3.5" />
            Download CSV (6,000 rows)
          </a>
        </div>
      </div>

      {/* Live Interactive Scoring Playground */}
      <section className="grid gap-6 lg:grid-cols-12">
        {/* Controls Panel */}
        <div className="space-y-5 rounded-3xl border border-slate-800 bg-surface-900/85 p-6 lg:col-span-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <SlidersHorizontal className="h-4 w-4 text-indigo-300" />
              Borrower Application Inputs (Live POST /predict)
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => applyPreset(p)}
                  className="rounded-lg border border-slate-700 bg-surface-950 px-2.5 py-1 text-[11px] font-medium text-slate-300 transition hover:border-indigo-400/50 hover:text-white"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                label: 'Credit Score',
                value: creditScore,
                display: String(creditScore),
                min: 500,
                max: 840,
                step: 5,
                set: setCreditScore,
              },
              {
                label: 'Annual Income',
                value: annualIncome,
                display: `$${annualIncome.toLocaleString()}`,
                min: 25000,
                max: 250000,
                step: 2500,
                set: setAnnualIncome,
              },
              {
                label: 'Loan Amount',
                value: loanAmount,
                display: `$${loanAmount.toLocaleString()}`,
                min: 2500,
                max: 55000,
                step: 500,
                set: setLoanAmount,
              },
              {
                label: 'Debt-to-Income (DTI)',
                value: dtiRatio,
                display: `${dtiRatio}%`,
                min: 3,
                max: 55,
                step: 1,
                set: setDtiRatio,
              },
              {
                label: 'Credit Utilization',
                value: utilizationRate,
                display: `${utilizationRate}%`,
                min: 1,
                max: 99,
                step: 1,
                set: setUtilizationRate,
              },
              {
                label: 'Prior 2-Yr Delinquencies',
                value: delinq2yrs,
                display: String(delinq2yrs),
                min: 0,
                max: 4,
                step: 1,
                set: setDelinq2yrs,
              },
              {
                label: 'Employment Length',
                value: empLengthYrs,
                display: `${empLengthYrs} yrs`,
                min: 0,
                max: 20,
                step: 0.5,
                set: setEmpLengthYrs,
              },
              {
                label: 'Approval PD Threshold',
                value: threshold,
                display: `${Math.round(threshold * 100)}%`,
                min: 0.08,
                max: 0.4,
                step: 0.01,
                set: setThreshold,
              },
            ].map((ctrl) => (
              <label key={ctrl.label} className="block space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">{ctrl.label}</span>
                  <span className="font-mono font-semibold text-cyan-300">{ctrl.display}</span>
                </div>
                <input
                  type="range"
                  min={ctrl.min}
                  max={ctrl.max}
                  step={ctrl.step}
                  value={ctrl.value}
                  onChange={(e) => ctrl.set(Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer accent-indigo-400"
                />
              </label>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
            <label className="flex items-center gap-2.5 text-xs text-slate-300">
              <span>Loan Purpose</span>
              <select
                value={loanPurpose}
                onChange={(e) => setLoanPurpose(e.target.value)}
                className="rounded-lg border border-slate-700 bg-surface-950 px-3 py-1.5 text-xs font-medium text-white"
              >
                <option value="debt_consolidation">Debt Consolidation</option>
                <option value="home_improvement">Home Improvement</option>
                <option value="major_purchase">Major Purchase</option>
                <option value="small_business">Small Business</option>
                <option value="education">Education</option>
              </select>
            </label>

            <button
              onClick={scoreApplicant}
              disabled={scoring}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${scoring ? 'animate-spin' : ''}`} />
              Re-Score on GCP
            </button>
          </div>
        </div>

        {/* Live Prediction Output Panel */}
        <div className="flex flex-col justify-between space-y-5 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-surface-900 via-surface-950 to-surface-900 p-6 lg:col-span-6">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Activity className="h-4 w-4 text-emerald-300" />
              Live Cloud Run Model Response
            </div>
            {prediction && (
              <span className="font-mono text-[11px] text-slate-400">
                rev: {prediction.served_by.revision}
              </span>
            )}
          </div>

          {prediction ? (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-800 bg-surface-900/90 p-4">
                  <div className="text-[11px] text-slate-400">Challenger PD (GBDT)</div>
                  <div className="mt-1 font-mono text-2xl font-extrabold text-white">
                    {(prediction.challenger_pd * 100).toFixed(1)}%
                  </div>
                  <div className="mt-0.5 text-[11px] text-cyan-300">
                    Tier: {prediction.risk_tier}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-surface-900/90 p-4">
                  <div className="text-[11px] text-slate-400">Baseline PD (LogReg)</div>
                  <div className="mt-1 font-mono text-2xl font-extrabold text-indigo-200">
                    {(prediction.baseline_pd * 100).toFixed(1)}%
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-400">
                    Spread: {(prediction.pd_spread * 100).toFixed(1)}pp
                  </div>
                </div>

                <div className="col-span-2 rounded-2xl border border-slate-800 bg-surface-900/90 p-4 sm:col-span-1">
                  <div className="text-[11px] text-slate-400">Policy Decision</div>
                  <div
                    className={`mt-1 text-xl font-extrabold ${
                      prediction.decision === 'Approve'
                        ? 'text-emerald-300'
                        : prediction.decision === 'Manual Review'
                        ? 'text-amber-300'
                        : 'text-rose-400'
                    }`}
                  >
                    {prediction.decision}
                  </div>
                  <div className="mt-0.5 font-mono text-[11px] text-slate-400">
                    Est. Loss: ${prediction.expected_loss_usd.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Per-Applicant Explainability Drivers */}
              <div className="rounded-2xl border border-slate-800 bg-surface-900/80 p-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Top Applicant Risk Drivers (Scorecard Log-Odds Impact)
                </div>
                <div className="mt-3 space-y-2.5">
                  {prediction.top_risk_drivers.map((drv) => {
                    const widthPct = Math.min(100, Math.round(Math.abs(drv.log_odds_impact) * 45));
                    const isRiskUp = drv.direction === 'increases_risk';
                    return (
                      <div key={drv.feature} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-200">{drv.feature}</span>
                          <span
                            className={`font-mono font-semibold ${
                              isRiskUp ? 'text-rose-300' : 'text-emerald-300'
                            }`}
                          >
                            {isRiskUp ? '+' : ''}
                            {drv.log_odds_impact.toFixed(3)}
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                          <div
                            className={`h-full rounded-full ${
                              isRiskUp ? 'bg-rose-400' : 'bg-emerald-400'
                            }`}
                            style={{ width: `${Math.max(8, widthPct)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center rounded-2xl border border-slate-800 bg-surface-900/50 p-8 text-sm text-slate-400">
              {apiError
                ? `Could not score against live backend (${apiError}).`
                : 'Sending borrower profile to GCP Cloud Run…'}
            </div>
          )}
        </div>
      </section>

      {/* Real Model Leaderboard + Leakage Audit */}
      {modelInfo && (
        <section className="grid gap-6 lg:grid-cols-12">
          {/* OOT Leaderboard */}
          <div className="rounded-3xl border border-slate-800 bg-surface-900/85 p-6 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-white">
                  Out-of-Time Test Leaderboard ({modelInfo.dataset.test_rows.toLocaleString()} Loans)
                </h2>
                <p className="text-xs text-slate-400">
                  Window: {modelInfo.dataset.test_window} · Seed: {modelInfo.random_state}
                </p>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                Baseline-First Verified
              </span>
            </div>

            <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-surface-950 text-indigo-300">
                  <tr>
                    <th className="px-4 py-3">Model</th>
                    <th className="px-3 py-3">ROC-AUC (95% CI)</th>
                    <th className="px-3 py-3">PR-AUC</th>
                    <th className="px-3 py-3">KS Stat</th>
                    <th className="px-3 py-3">Brier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {modelInfo.oot_test_leaderboard.map((row) => (
                    <tr key={row.model} className="hover:bg-slate-800/30">
                      <td className="px-4 py-3 font-semibold text-white">{row.model}</td>
                      <td className="px-3 py-3 font-mono text-emerald-300">
                        {row.roc_auc.toFixed(4)}{' '}
                        <span className="text-[10px] text-slate-400">
                          ({row.roc_auc_ci95[0].toFixed(3)}–{row.roc_auc_ci95[1].toFixed(3)})
                        </span>
                      </td>
                      <td className="px-3 py-3 font-mono">{row.pr_auc.toFixed(4)}</td>
                      <td className="px-3 py-3 font-mono">{row.ks_statistic.toFixed(4)}</td>
                      <td className="px-3 py-3 font-mono">{row.brier_score.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              <strong className="text-cyan-300">Teaching Moment:</strong> Notice how the simple,
              interpretable Logistic Regression Scorecard ({modelInfo.oot_test_leaderboard[1].roc_auc.toFixed(4)}{' '}
              AUC) matches the Gradient Boosting challenger ({modelInfo.oot_test_leaderboard[2].roc_auc.toFixed(4)}{' '}
              AUC) on out-of-time loans—proving why <code className="font-mono">AGENTS.md</code>{' '}
              mandates benchmarking a transparent baseline before adding model complexity!
            </p>

            {/* Regional Slice Table */}
            <h3 className="mt-6 text-xs font-bold uppercase tracking-wider text-slate-300">
              Regional Subgroup Slice Diagnostics (OOT Test)
            </h3>
            <div className="mt-2.5 overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-surface-950 text-cyan-300">
                  <tr>
                    <th className="px-4 py-2.5">Region</th>
                    <th className="px-3 py-2.5">Loans</th>
                    <th className="px-3 py-2.5">Actual Default</th>
                    <th className="px-3 py-2.5">Mean Pred PD</th>
                    <th className="px-3 py-2.5">ROC-AUC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {modelInfo.regional_slices.map((s) => (
                    <tr key={s.slice}>
                      <td className="px-4 py-2.5 font-semibold text-white">{s.slice}</td>
                      <td className="px-3 py-2.5 font-mono">{s.count}</td>
                      <td className="px-3 py-2.5 font-mono">
                        {(s.actual_default_rate * 100).toFixed(1)}%
                      </td>
                      <td className="px-3 py-2.5 font-mono">
                        {(s.mean_predicted_pd * 100).toFixed(1)}%
                      </td>
                      <td className="px-3 py-2.5 font-mono text-emerald-300">
                        {s.roc_auc.toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Automated Leakage Audit Panel */}
          <div className="space-y-4 rounded-3xl border border-slate-800 bg-surface-900/85 p-6 lg:col-span-5">
            <div className="flex items-center gap-2 text-base font-bold text-white">
              <ShieldCheck className="h-5 w-5 text-amber-300" />
              Automated Leakage Audit (`leakage-auditor`)
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Our dataset intentionally embeds{' '}
              <code className="rounded bg-amber-500/15 px-1.5 py-0.5 font-mono text-amber-200">
                post_origination_collections_flag
              </code>{' '}
              so students can see how automated governance catches a 0.95+ AUC mirage before
              deployment.
            </p>

            <div className="space-y-3">
              {modelInfo.leakage_audit.map((item) => {
                const isCaught = item.severity !== 'Pass';
                return (
                  <div
                    key={item.vector}
                    className={`rounded-2xl border p-3.5 ${
                      isCaught
                        ? 'border-amber-400/40 bg-amber-500/10'
                        : 'border-slate-800 bg-surface-950/70'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white">{item.vector}</span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                          isCaught
                            ? 'bg-amber-400/20 text-amber-200'
                            : 'bg-emerald-500/15 text-emerald-300'
                        }`}
                      >
                        {isCaught ? (
                          <AlertTriangle className="h-3 w-3" />
                        ) : (
                          <CheckCircle2 className="h-3 w-3" />
                        )}
                        {item.severity}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-300">{item.evidence}</p>
                    <p className="mt-1 text-[11px] text-slate-400">{item.action}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Dataset Sample Preview */}
      {modelInfo && (
        <section className="rounded-3xl border border-slate-800 bg-surface-900/80 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-cyan-300" />
              <div>
                <h2 className="text-base font-bold text-white">
                  Dataset Sample (`credit_risk_loans.csv` — Out-of-Time Holdout Rows)
                </h2>
                <p className="text-xs text-slate-400">
                  Includes realistic NaNs (imputed inside sklearn Pipeline) and the highlighted
                  excluded leakage trap column.
                </p>
              </div>
            </div>
            <a
              href="./data/credit_risk_loans.csv"
              download="credit_risk_loans.csv"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-surface-950 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-cyan-400/50"
            >
              <Download className="h-3.5 w-3.5" />
              Static CSV Mirror
            </a>
          </div>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left font-mono text-[11px]">
              <thead className="border-b border-slate-800 bg-surface-950 text-slate-300">
                <tr>
                  <th className="px-3 py-2.5">loan_id</th>
                  <th className="px-3 py-2.5">origination_date</th>
                  <th className="px-3 py-2.5">credit_score</th>
                  <th className="px-3 py-2.5">income</th>
                  <th className="px-3 py-2.5">loan_amt</th>
                  <th className="px-3 py-2.5">dti</th>
                  <th className="px-3 py-2.5">util%</th>
                  <th className="px-3 py-2.5">purpose</th>
                  <th className="px-3 py-2.5 text-amber-300">collections_flag (TRAP)</th>
                  <th className="px-3 py-2.5 text-cyan-300">default_12m</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {modelInfo.sample_rows.slice(0, 8).map((r) => (
                  <tr key={String(r.loan_id)} className="hover:bg-slate-800/30">
                    <td className="px-3 py-2 text-white">{String(r.loan_id)}</td>
                    <td className="px-3 py-2">{String(r.origination_date)}</td>
                    <td className="px-3 py-2">{String(r.credit_score)}</td>
                    <td className="px-3 py-2">${Number(r.annual_income).toLocaleString()}</td>
                    <td className="px-3 py-2">${Number(r.loan_amount).toLocaleString()}</td>
                    <td className="px-3 py-2">{String(r.dti_ratio)}%</td>
                    <td className="px-3 py-2">
                      {r.utilization_rate === null ? (
                        <span className="text-rose-300">NaN</span>
                      ) : (
                        `${r.utilization_rate}%`
                      )}
                    </td>
                    <td className="px-3 py-2">{String(r.loan_purpose)}</td>
                    <td className="px-3 py-2 font-bold text-amber-300">
                      {String(r.post_origination_collections_flag)}
                    </td>
                    <td className="px-3 py-2 font-bold text-cyan-300">
                      {String(r.default_12m)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};
