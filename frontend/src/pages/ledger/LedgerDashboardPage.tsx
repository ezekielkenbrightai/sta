import { useMemo } from 'react';
import {
  Box,
  Card,
  Chip,
  Grid,
  LinearProgress,
  Typography,
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  TrendingDown,
  SwapHoriz,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface LedgerStat {
  label: string;
  value: string;
  color: string;
  change?: string;
  changeUp?: boolean;
  icon?: React.ReactNode;
}

interface RecentJournal {
  id: string;
  reference: string;
  date: string;
  description: string;
  source_type: 'trade_document' | 'tax_assessment' | 'payment' | 'fx_settlement' | 'manual';
  debit_total: number;
  credit_total: number;
  status: 'posted' | 'pending' | 'reversed';
}

interface AccountBalance_ {
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  balance: number;
  currency: string;
}

const RECENT_JOURNALS: RecentJournal[] = [
  { id: 'jnl-001', reference: 'JNL-2026-04821', date: '2026-02-22 14:30', description: 'Import duty — KE-2026-0042 (Nairobi Exports Ltd)', source_type: 'tax_assessment', debit_total: 485000, credit_total: 485000, status: 'posted' },
  { id: 'jnl-002', reference: 'JNL-2026-04820', date: '2026-02-22 13:15', description: 'Payment received — PAY-2026-0188', source_type: 'payment', debit_total: 48500, credit_total: 48500, status: 'posted' },
  { id: 'jnl-003', reference: 'JNL-2026-04819', date: '2026-02-22 11:45', description: 'FX settlement KES→NGN — FX-2026-0892', source_type: 'fx_settlement', debit_total: 1250000, credit_total: 1250000, status: 'posted' },
  { id: 'jnl-004', reference: 'JNL-2026-04818', date: '2026-02-22 10:20', description: 'Trade document — Export declaration TZ-2026-0018', source_type: 'trade_document', debit_total: 320000, credit_total: 320000, status: 'pending' },
  { id: 'jnl-005', reference: 'JNL-2026-04817', date: '2026-02-21 16:50', description: 'Manual adjustment — Reclassification of account 4200', source_type: 'manual', debit_total: 150000, credit_total: 150000, status: 'posted' },
  { id: 'jnl-006', reference: 'JNL-2026-04816', date: '2026-02-21 15:30', description: 'VAT collection — Assessment ASM-2026-0412', source_type: 'tax_assessment', debit_total: 92000, credit_total: 92000, status: 'reversed' },
];

const TOP_ACCOUNTS: AccountBalance_[] = [
  { code: '1100', name: 'Trade Receivables', type: 'asset', balance: 245000000, currency: 'KES' },
  { code: '1200', name: 'Cash & Bank', type: 'asset', balance: 890000000, currency: 'KES' },
  { code: '2100', name: 'Trade Payables', type: 'liability', balance: 178000000, currency: 'KES' },
  { code: '2200', name: 'Tax Liabilities', type: 'liability', balance: 342000000, currency: 'KES' },
  { code: '4100', name: 'Customs Duty Revenue', type: 'revenue', balance: 1240000000, currency: 'KES' },
  { code: '4200', name: 'VAT Revenue', type: 'revenue', balance: 680000000, currency: 'KES' },
  { code: '4300', name: 'Excise Revenue', type: 'revenue', balance: 125000000, currency: 'KES' },
  { code: '5100', name: 'FX Settlement Costs', type: 'expense', balance: 45000000, currency: 'KES' },
];

interface DailyEntry {
  date: string;
  journals: number;
  totalDebits: number;
}

const DAILY_ENTRIES: DailyEntry[] = [
  { date: 'Feb 16', journals: 142, totalDebits: 48000000 },
  { date: 'Feb 17', journals: 128, totalDebits: 42000000 },
  { date: 'Feb 18', journals: 167, totalDebits: 56000000 },
  { date: 'Feb 19', journals: 153, totalDebits: 51000000 },
  { date: 'Feb 20', journals: 189, totalDebits: 64000000 },
  { date: 'Feb 21', journals: 174, totalDebits: 58000000 },
  { date: 'Feb 22', journals: 156, totalDebits: 52000000 },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  posted: { label: 'Posted', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  pending: { label: 'Pending', color: '#E6A817', bg: 'rgba(230,168,23,0.1)' },
  reversed: { label: 'Reversed', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
};

const SOURCE_CONFIG: Record<string, { label: string; color: string }> = {
  trade_document: { label: 'Trade', color: '#3B82F6' },
  tax_assessment: { label: 'Tax', color: '#22C55E' },
  payment: { label: 'Payment', color: '#D4AF37' },
  fx_settlement: { label: 'FX', color: '#8B5CF6' },
  manual: { label: 'Manual', color: '#999' },
};

const TYPE_COLORS: Record<string, string> = {
  asset: '#3B82F6',
  liability: '#EF4444',
  equity: '#8B5CF6',
  revenue: '#22C55E',
  expense: '#E6A817',
};

function formatAmount(v: number): string {
  if (v >= 1_000_000_000) return `KSh ${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000) return `KSh ${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1000) return `KSh ${(v / 1000).toFixed(0)}K`;
  return `KSh ${v.toLocaleString()}`;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LedgerDashboardPage() {
  const todayEntry = DAILY_ENTRIES[DAILY_ENTRIES.length - 1];
  const yesterdayEntry = DAILY_ENTRIES[DAILY_ENTRIES.length - 2];
  const journalChange = ((todayEntry.journals - yesterdayEntry.journals) / yesterdayEntry.journals * 100).toFixed(1);
  const isUp = todayEntry.journals >= yesterdayEntry.journals;

  const maxDaily = Math.max(...DAILY_ENTRIES.map((d) => d.totalDebits));

  const postedCount = useMemo(() => RECENT_JOURNALS.filter((j) => j.status === 'posted').length, []);
  const pendingCount = useMemo(() => RECENT_JOURNALS.filter((j) => j.status === 'pending').length, []);

  const stats: LedgerStat[] = [
    {
      label: "Today's Journals",
      value: todayEntry.journals.toString(),
      color: '#D4AF37',
      change: `${isUp ? '+' : ''}${journalChange}% vs yesterday`,
      changeUp: isUp,
    },
    { label: 'Total Debits Today', value: formatAmount(todayEntry.totalDebits), color: '#3B82F6' },
    { label: 'Posted', value: postedCount.toString(), color: '#22C55E', icon: <CheckCircle sx={{ fontSize: 16, color: '#22C55E' }} /> },
    { label: 'Pending Review', value: pendingCount.toString(), color: '#E6A817', icon: <Schedule sx={{ fontSize: 16, color: '#E6A817' }} /> },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <AccountBalance sx={{ color: '#D4AF37' }} />
          <Typography variant="h4">Ledger Dashboard</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>
          Automated double-entry ledger — immutable, real-time, and audit-ready.
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map((s) => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>{s.label}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                {s.icon}
                <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: s.color }}>{s.value}</Typography>
              </Box>
              {s.change && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  {s.changeUp ? <TrendingUp sx={{ fontSize: 14, color: '#22C55E' }} /> : <TrendingDown sx={{ fontSize: 14, color: '#EF4444' }} />}
                  <Typography sx={{ fontSize: 11, color: s.changeUp ? '#22C55E' : '#EF4444' }}>{s.change}</Typography>
                </Box>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Daily Volume */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
              7-Day Journal Volume
            </Typography>
            {DAILY_ENTRIES.map((d) => {
              const pct = (d.totalDebits / maxDaily) * 100;
              return (
                <Box key={d.date} sx={{ mb: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ fontSize: 12, color: '#999', minWidth: 55 }}>{d.date}</Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Typography sx={{ fontSize: 11, color: '#777' }}>{d.journals} journals</Typography>
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#f0f0f0' }}>{formatAmount(d.totalDebits)}</Typography>
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={pct}
                    sx={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(212,175,55,0.08)', '& .MuiLinearProgress-bar': { backgroundColor: '#D4AF37', borderRadius: 4 } }}
                  />
                </Box>
              );
            })}
          </Card>
        </Grid>

        {/* Top Accounts */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', mb: 2 }}>
              Top Account Balances
            </Typography>
            {TOP_ACCOUNTS.map((a) => (
              <Box key={a.code} sx={{ mb: 2, pb: 1.5, borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.25 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ fontSize: 12, fontFamily: 'monospace', color: '#D4AF37' }}>{a.code}</Typography>
                    <Typography sx={{ fontSize: 13, color: '#f0f0f0' }}>{a.name}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: TYPE_COLORS[a.type] }}>
                    {formatAmount(a.balance)}
                  </Typography>
                </Box>
                <Chip
                  label={a.type.charAt(0).toUpperCase() + a.type.slice(1)}
                  size="small"
                  sx={{ fontSize: 9, height: 16, backgroundColor: `${TYPE_COLORS[a.type]}15`, color: TYPE_COLORS[a.type] }}
                />
              </Box>
            ))}
          </Card>
        </Grid>

        {/* Recent Journals */}
        <Grid size={12}>
          <Card sx={{ overflow: 'hidden' }}>
            <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SwapHoriz sx={{ fontSize: 18, color: '#D4AF37' }} />
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>Recent Journal Entries</Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr 80px 100px 100px 80px 130px',
                gap: 1, px: 2.5, py: 1.5,
                borderBottom: '1px solid rgba(212,175,55,0.08)',
                backgroundColor: 'rgba(212,175,55,0.03)',
              }}
            >
              {['Reference', 'Description', 'Source', 'Debits', 'Credits', 'Status', 'Date'].map((h) => (
                <Typography key={h} sx={{ fontSize: 11, fontWeight: 600, color: '#777', textTransform: 'uppercase' }}>{h}</Typography>
              ))}
            </Box>
            {RECENT_JOURNALS.map((j, i) => {
              const sts = STATUS_CONFIG[j.status];
              const src = SOURCE_CONFIG[j.source_type];
              return (
                <Box
                  key={j.id}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr 80px 100px 100px 80px 130px',
                    gap: 1, px: 2.5, py: 1.75,
                    alignItems: 'center',
                    borderBottom: i < RECENT_JOURNALS.length - 1 ? '1px solid rgba(212,175,55,0.05)' : 'none',
                    '&:hover': { backgroundColor: 'rgba(212,175,55,0.03)' },
                    cursor: 'pointer',
                  }}
                >
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#D4AF37' }}>{j.reference}</Typography>
                  <Typography sx={{ fontSize: 12, color: '#b0b0b0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.description}</Typography>
                  <Chip label={src.label} size="small" sx={{ fontSize: 10, height: 20, backgroundColor: `${src.color}15`, color: src.color }} />
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0', fontFamily: 'monospace' }}>{j.debit_total.toLocaleString()}</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0', fontFamily: 'monospace' }}>{j.credit_total.toLocaleString()}</Typography>
                  <Chip label={sts.label} size="small" sx={{ fontSize: 10, height: 20, backgroundColor: sts.bg, color: sts.color }} />
                  <Typography sx={{ fontSize: 11, color: '#777' }}>{j.date}</Typography>
                </Box>
              );
            })}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
