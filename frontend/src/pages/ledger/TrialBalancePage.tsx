import { useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  Typography,
} from '@mui/material';
import {
  Balance,
  Download,
  CheckCircle,
} from '@mui/icons-material';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface TrialBalanceRow {
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  debit: number;
  credit: number;
  is_parent: boolean;
}

const TRIAL_BALANCE: TrialBalanceRow[] = [
  // Assets
  { code: '1000', name: 'Current Assets', type: 'asset', debit: 1272000000, credit: 0, is_parent: true },
  { code: '1100', name: 'Trade Receivables', type: 'asset', debit: 245000000, credit: 0, is_parent: false },
  { code: '1200', name: 'Cash & Bank (KES)', type: 'asset', debit: 890000000, credit: 0, is_parent: false },
  { code: '1210', name: 'Bank — NGN Nostro', type: 'asset', debit: 42000000, credit: 0, is_parent: false },
  { code: '1220', name: 'Bank — ZAR Nostro', type: 'asset', debit: 28000000, credit: 0, is_parent: false },
  { code: '1300', name: 'Export Receivables', type: 'asset', debit: 67000000, credit: 0, is_parent: false },

  // Liabilities
  { code: '2000', name: 'Current Liabilities', type: 'liability', debit: 0, credit: 520000000, is_parent: true },
  { code: '2100', name: 'Trade Payables', type: 'liability', debit: 0, credit: 178000000, is_parent: false },
  { code: '2200', name: 'Tax Liabilities', type: 'liability', debit: 0, credit: 342000000, is_parent: false },

  // Equity
  { code: '3000', name: 'Equity & Reserves', type: 'equity', debit: 0, credit: 250000000, is_parent: true },
  { code: '3100', name: 'FX Revaluation Reserve', type: 'equity', debit: 0, credit: 15000000, is_parent: false },
  { code: '3200', name: 'Retained Earnings', type: 'equity', debit: 0, credit: 235000000, is_parent: false },

  // Revenue
  { code: '4000', name: 'Revenue', type: 'revenue', debit: 0, credit: 2087150000, is_parent: true },
  { code: '4100', name: 'Customs Duty Revenue', type: 'revenue', debit: 0, credit: 1240000000, is_parent: false },
  { code: '4200', name: 'VAT Revenue', type: 'revenue', debit: 0, credit: 680000000, is_parent: false },
  { code: '4210', name: 'VAT Revenue — Corrected', type: 'revenue', debit: 0, credit: 150000, is_parent: false },
  { code: '4300', name: 'Excise Revenue', type: 'revenue', debit: 0, credit: 125000000, is_parent: false },
  { code: '4400', name: 'Export Processing Revenue', type: 'revenue', debit: 0, credit: 42000000, is_parent: false },

  // Expenses
  { code: '5000', name: 'Expenses', type: 'expense', debit: 85000000, credit: 0, is_parent: true },
  { code: '5100', name: 'FX Settlement Costs', type: 'expense', debit: 45000000, credit: 0, is_parent: false },
  { code: '5200', name: 'Bank Charges', type: 'expense', debit: 18000000, credit: 0, is_parent: false },
  { code: '5300', name: 'Processing Fees', type: 'expense', debit: 22000000, credit: 0, is_parent: false },
];

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  asset: { label: 'Asset', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  liability: { label: 'Liability', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  equity: { label: 'Equity', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
  revenue: { label: 'Revenue', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  expense: { label: 'Expense', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
};

function formatAmount(v: number): string {
  if (v === 0) return '—';
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(3)}B`;
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return v.toLocaleString();
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function TrialBalancePage() {
  const totalDebits = useMemo(() => TRIAL_BALANCE.filter((r) => r.is_parent).reduce((s, r) => s + r.debit, 0), []);
  const totalCredits = useMemo(() => TRIAL_BALANCE.filter((r) => r.is_parent).reduce((s, r) => s + r.credit, 0), []);
  const isBalanced = Math.abs(totalDebits - totalCredits) < 1;
  const difference = Math.abs(totalDebits - totalCredits);

  const parentSummary = useMemo(() => {
    return TRIAL_BALANCE.filter((r) => r.is_parent).map((r) => ({
      ...r,
      net: r.debit - r.credit,
    }));
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Balance sx={{ color: '#D4AF37' }} />
            <Typography variant="h4">Trial Balance</Typography>
          </Box>
          <Typography sx={{ color: 'text.secondary' }}>
            Period: February 2026 — All amounts in KES.
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<Download />} sx={{ borderColor: 'rgba(212,175,55,0.3)', color: '#D4AF37' }}>
          Export PDF
        </Button>
      </Box>

      {/* Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Debits', value: `KSh ${(totalDebits / 1_000_000_000).toFixed(3)}B`, color: '#3B82F6' },
          { label: 'Total Credits', value: `KSh ${(totalCredits / 1_000_000_000).toFixed(3)}B`, color: '#22C55E' },
          { label: 'Difference', value: difference < 1 ? 'KSh 0' : `KSh ${formatAmount(difference)}`, color: isBalanced ? '#22C55E' : '#EF4444' },
          {
            label: 'Status',
            value: isBalanced ? 'Balanced' : 'Unbalanced',
            color: isBalanced ? '#22C55E' : '#EF4444',
            icon: isBalanced ? <CheckCircle sx={{ fontSize: 18, color: '#22C55E' }} /> : null,
          },
        ].map((s) => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>{s.label}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                {'icon' in s && s.icon}
                <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: s.color }}>{s.value}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Category Summary */}
      <Card sx={{ p: 2.5, mb: 3 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>Account Category Summary</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px 120px', gap: 1, mb: 1 }}>
          {['Category', 'Debits', 'Credits', 'Net Balance'].map((h) => (
            <Typography key={h} sx={{ fontSize: 11, fontWeight: 600, color: '#555', textTransform: 'uppercase' }}>{h}</Typography>
          ))}
        </Box>
        {parentSummary.map((r) => {
          const tp = TYPE_CONFIG[r.type];
          return (
            <Box key={r.code} sx={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px 120px', gap: 1, py: 1.25, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: tp.color }} />
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: tp.color }}>{r.name}</Typography>
              </Box>
              <Typography sx={{ fontSize: 13, fontFamily: 'monospace', color: r.debit > 0 ? '#f0f0f0' : '#333' }}>{formatAmount(r.debit)}</Typography>
              <Typography sx={{ fontSize: 13, fontFamily: 'monospace', color: r.credit > 0 ? '#f0f0f0' : '#333' }}>{formatAmount(r.credit)}</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 600, fontFamily: 'monospace', color: r.net >= 0 ? '#3B82F6' : '#22C55E' }}>
                {r.net >= 0 ? '' : '('}{formatAmount(Math.abs(r.net))}{r.net < 0 ? ')' : ''}
              </Typography>
            </Box>
          );
        })}
      </Card>

      {/* Detailed Trial Balance */}
      <Card sx={{ overflow: 'hidden' }}>
        <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>Detailed Trial Balance</Typography>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '70px 1fr 80px 130px 130px',
            gap: 1, px: 2.5, py: 1.5,
            borderBottom: '1px solid rgba(212,175,55,0.08)',
            backgroundColor: 'rgba(212,175,55,0.03)',
          }}
        >
          {['Code', 'Account Name', 'Type', 'Debit (KES)', 'Credit (KES)'].map((h) => (
            <Typography key={h} sx={{ fontSize: 11, fontWeight: 600, color: '#777', textTransform: 'uppercase' }}>{h}</Typography>
          ))}
        </Box>

        {TRIAL_BALANCE.map((r, i) => {
          const tp = TYPE_CONFIG[r.type];
          return (
            <Box
              key={r.code}
              sx={{
                display: 'grid',
                gridTemplateColumns: '70px 1fr 80px 130px 130px',
                gap: 1, px: 2.5, py: r.is_parent ? 2 : 1.5,
                alignItems: 'center',
                borderBottom: i < TRIAL_BALANCE.length - 1 ? '1px solid rgba(212,175,55,0.05)' : 'none',
                backgroundColor: r.is_parent ? 'rgba(212,175,55,0.03)' : 'transparent',
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: r.is_parent ? 700 : 500, color: '#D4AF37', fontFamily: 'monospace' }}>{r.code}</Typography>
              <Typography sx={{ fontSize: 13, color: '#f0f0f0', fontWeight: r.is_parent ? 600 : 400, pl: r.is_parent ? 0 : 2 }}>
                {!r.is_parent && <Box component="span" sx={{ color: '#333', mr: 0.5 }}>└</Box>}
                {r.name}
              </Typography>
              <Chip label={tp.label} size="small" sx={{ fontSize: 9, height: 18, backgroundColor: tp.bg, color: tp.color }} />
              <Typography sx={{ fontSize: 13, fontWeight: r.is_parent ? 700 : 500, fontFamily: 'monospace', color: r.debit > 0 ? '#f0f0f0' : '#333', textAlign: 'right' }}>
                {formatAmount(r.debit)}
              </Typography>
              <Typography sx={{ fontSize: 13, fontWeight: r.is_parent ? 700 : 500, fontFamily: 'monospace', color: r.credit > 0 ? '#f0f0f0' : '#333', textAlign: 'right' }}>
                {formatAmount(r.credit)}
              </Typography>
            </Box>
          );
        })}

        {/* Grand Total */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '70px 1fr 80px 130px 130px',
            gap: 1, px: 2.5, py: 2,
            borderTop: '2px solid rgba(212,175,55,0.2)',
            backgroundColor: 'rgba(212,175,55,0.05)',
          }}
        >
          <Box />
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#D4AF37' }}>Grand Total</Typography>
          <Box />
          <Typography sx={{ fontSize: 14, fontWeight: 700, fontFamily: 'monospace', color: '#f0f0f0', textAlign: 'right' }}>
            {(totalDebits / 1_000_000_000).toFixed(3)}B
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 700, fontFamily: 'monospace', color: '#f0f0f0', textAlign: 'right' }}>
            {(totalCredits / 1_000_000_000).toFixed(3)}B
          </Typography>
        </Box>

        {/* Balance status */}
        <Box sx={{ px: 2.5, py: 1.5, display: 'flex', justifyContent: 'flex-end' }}>
          <Chip
            icon={isBalanced ? <CheckCircle sx={{ fontSize: 14 }} /> : undefined}
            label={isBalanced ? 'Trial Balance is balanced' : `Imbalance: KSh ${formatAmount(difference)}`}
            size="small"
            sx={{
              fontSize: 11, height: 24,
              backgroundColor: isBalanced ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              color: isBalanced ? '#22C55E' : '#EF4444',
              '& .MuiChip-icon': { color: '#22C55E' },
            }}
          />
        </Box>
      </Card>
    </Box>
  );
}
