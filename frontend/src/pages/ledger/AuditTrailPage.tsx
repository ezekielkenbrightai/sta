import { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import {
  Fingerprint,
  Search as SearchIcon,
  Download,
  Lock,
} from '@mui/icons-material';
import { useDataIsolation } from '../../hooks/useDataIsolation';

// ─── Mock data ───────────────────────────────────────────────────────────────

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  user_role: string;
  org_name: string;
  action: 'create' | 'update' | 'delete' | 'approve' | 'reverse' | 'login' | 'export' | 'view';
  entity_type: 'journal' | 'payment' | 'tax_assessment' | 'trade_document' | 'trader' | 'fx_settlement' | 'user' | 'system';
  entity_ref: string;
  description: string;
  ip_address: string;
  hash: string;
}

const MOCK_AUDIT: AuditEntry[] = [
  { id: 'aud-001', timestamp: '2026-02-22 14:30:15', user: 'System', user_role: 'system', org_name: 'Nairobi Exports Ltd', action: 'create', entity_type: 'journal', entity_ref: 'JNL-2026-04821', description: 'Auto-generated journal for import duty assessment ASM-2026-0415', ip_address: '10.0.1.1', hash: 'a7f3b2c1' },
  { id: 'aud-002', timestamp: '2026-02-22 14:28:42', user: 'Jane Mwangi', user_role: 'govt_admin', org_name: 'Kenya Revenue Authority', action: 'approve', entity_type: 'tax_assessment', entity_ref: 'ASM-2026-0415', description: 'Approved customs duty assessment for Nairobi Exports Ltd', ip_address: '196.201.214.50', hash: 'e4d2f891' },
  { id: 'aud-003', timestamp: '2026-02-22 13:15:08', user: 'System', user_role: 'system', org_name: 'Nairobi Exports Ltd', action: 'create', entity_type: 'payment', entity_ref: 'PAY-2026-0188', description: 'Payment processed: KES 48,500 via Bank Transfer', ip_address: '10.0.1.1', hash: 'b8c4a3e7' },
  { id: 'aud-004', timestamp: '2026-02-22 11:45:33', user: 'David Otieno', user_role: 'bank_officer', org_name: 'KCB Bank', action: 'approve', entity_type: 'fx_settlement', entity_ref: 'FX-2026-0892', description: 'Approved FX settlement KES→NGN via PAPSS', ip_address: '41.89.225.12', hash: '3f1a9c82' },
  { id: 'aud-005', timestamp: '2026-02-22 10:20:17', user: 'John Kipchoge', user_role: 'trader', org_name: 'Nairobi Exports Ltd', action: 'create', entity_type: 'trade_document', entity_ref: 'TZ-2026-0018', description: 'Submitted export declaration for Tanzania-bound cargo', ip_address: '102.68.42.7', hash: 'd5e7b3f4' },
  { id: 'aud-006', timestamp: '2026-02-22 09:45:01', user: 'Jane Mwangi', user_role: 'govt_admin', org_name: 'Kenya Revenue Authority', action: 'reverse', entity_type: 'journal', entity_ref: 'JNL-2026-04816', description: 'Reversed VAT journal — duplicate assessment correction', ip_address: '196.201.214.50', hash: '7c2e4a91' },
  { id: 'aud-007', timestamp: '2026-02-22 09:30:55', user: 'Grace Adeyemi', user_role: 'auditor', org_name: 'Office of the Auditor General', action: 'export', entity_type: 'journal', entity_ref: 'EXPORT-2026-0089', description: 'Exported journal entries for Feb 1-22 as CSV', ip_address: '105.112.48.3', hash: 'f1a3c8d2' },
  { id: 'aud-008', timestamp: '2026-02-22 09:15:12', user: 'Jane Mwangi', user_role: 'govt_admin', org_name: 'Kenya Revenue Authority', action: 'login', entity_type: 'user', entity_ref: 'USR-0042', description: 'Successful login via SSO (Kenya Revenue Authority)', ip_address: '196.201.214.50', hash: '2b4d6e8f' },
  { id: 'aud-009', timestamp: '2026-02-22 08:00:00', user: 'System', user_role: 'system', org_name: 'KCB Bank', action: 'create', entity_type: 'system', entity_ref: 'SYS-RECON-0222', description: 'Daily auto-reconciliation completed: 8 accounts, 3 matched, 2 differences', ip_address: '10.0.1.1', hash: 'c3f5a7b9' },
  { id: 'aud-010', timestamp: '2026-02-21 17:30:22', user: 'David Otieno', user_role: 'bank_officer', org_name: 'KCB Bank', action: 'update', entity_type: 'trader', entity_ref: 'TRD-0015', description: 'Updated credit rating for Cairo Trade House: B+ → B', ip_address: '41.89.225.12', hash: 'a9b1c3d5' },
  { id: 'aud-011', timestamp: '2026-02-21 16:50:44', user: 'System', user_role: 'system', org_name: 'Dar es Salaam Freight', action: 'create', entity_type: 'payment', entity_ref: 'PAY-2026-0184', description: 'Stable Coins payment processed: TZS 31,200 for Dar es Salaam Freight', ip_address: '10.0.1.1', hash: '4e6f8a2c' },
  { id: 'aud-012', timestamp: '2026-02-21 15:30:18', user: 'System', user_role: 'system', org_name: 'KCB Bank', action: 'create', entity_type: 'payment', entity_ref: 'PAY-2026-0183', description: 'Payment failed: EGP 45,000 for Cairo Trade House — bank timeout', ip_address: '10.0.1.1', hash: '8d2f4a6b' },
  { id: 'aud-013', timestamp: '2026-02-21 14:15:55', user: 'Grace Adeyemi', user_role: 'auditor', org_name: 'Office of the Auditor General', action: 'view', entity_type: 'journal', entity_ref: 'JNL-2026-04810', description: 'Viewed journal details for compliance check', ip_address: '105.112.48.3', hash: '1a3c5e7f' },
  { id: 'aud-014', timestamp: '2026-02-21 12:00:00', user: 'Admin', user_role: 'super_admin', org_name: 'Smart Trade Africa', action: 'update', entity_type: 'system', entity_ref: 'SYS-CONFIG', description: 'Updated FX settlement timeout from 5s to 3s', ip_address: '10.0.1.5', hash: '6b8d0f2a' },
];

const ACTION_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  create: { label: 'Create', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  update: { label: 'Update', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  delete: { label: 'Delete', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  approve: { label: 'Approve', color: '#D4AF37', bg: 'rgba(212,175,55,0.1)' },
  reverse: { label: 'Reverse', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  login: { label: 'Login', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
  export: { label: 'Export', color: '#06B6D4', bg: 'rgba(6,182,212,0.1)' },
  view: { label: 'View', color: '#999', bg: 'rgba(153,153,153,0.1)' },
};

const ENTITY_CONFIG: Record<string, { label: string; color: string }> = {
  journal: { label: 'Journal', color: '#D4AF37' },
  payment: { label: 'Payment', color: '#22C55E' },
  tax_assessment: { label: 'Tax', color: '#3B82F6' },
  trade_document: { label: 'Trade', color: '#E6A817' },
  trader: { label: 'Trader', color: '#8B5CF6' },
  fx_settlement: { label: 'FX', color: '#06B6D4' },
  user: { label: 'User', color: '#999' },
  system: { label: 'System', color: '#555' },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AuditTrailPage() {
  const { filterByOrgName } = useDataIsolation();

  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');

  const baseAudit = useMemo(
    () => filterByOrgName(MOCK_AUDIT, 'org_name'),
    [filterByOrgName],
  );

  const filtered = useMemo(() => {
    return baseAudit.filter((a) => {
      if (actionFilter !== 'all' && a.action !== actionFilter) return false;
      if (entityFilter !== 'all' && a.entity_type !== entityFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return a.user.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.entity_ref.toLowerCase().includes(q);
      }
      return true;
    });
  }, [baseAudit, search, actionFilter, entityFilter]);

  const uniqueUsers = new Set(baseAudit.map((a) => a.user)).size;
  const todayCount = baseAudit.filter((a) => a.timestamp.startsWith('2026-02-22')).length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Fingerprint sx={{ color: '#D4AF37' }} />
            <Typography variant="h4">Audit Trail</Typography>
          </Box>
          <Typography sx={{ color: 'text.secondary' }}>
            Immutable, tamper-proof record of all system activity. Every action is cryptographically hashed.
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<Download />} sx={{ borderColor: 'rgba(212,175,55,0.3)', color: '#D4AF37' }}>
          Export Audit Log
        </Button>
      </Box>

      {/* Immutability banner */}
      <Card sx={{ p: 2, mb: 3, backgroundColor: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Lock sx={{ fontSize: 18, color: '#8B5CF6' }} />
          <Typography sx={{ fontSize: 12, color: '#8B5CF6' }}>
            Blockchain-Secured Audit Trail — All entries are append-only and cryptographically linked. Records cannot be modified or deleted.
          </Typography>
        </Box>
      </Card>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Entries', value: baseAudit.length.toString(), color: '#D4AF37' },
          { label: "Today's Activity", value: todayCount.toString(), color: '#22C55E' },
          { label: 'Unique Users', value: uniqueUsers.toString(), color: '#3B82F6' },
          { label: 'Chain Integrity', value: 'Verified', color: '#8B5CF6' },
        ].map((s) => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>{s.label}</Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: "'Lora', serif", color: s.color }}>{s.value}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth size="small"
              placeholder="Search user, description, reference..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: '#777' }} /></InputAdornment> } }}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <TextField fullWidth size="small" select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} label="Action">
              <MenuItem value="all">All Actions</MenuItem>
              {Object.entries(ACTION_CONFIG).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <TextField fullWidth size="small" select value={entityFilter} onChange={(e) => setEntityFilter(e.target.value)} label="Entity">
              <MenuItem value="all">All Entities</MenuItem>
              {Object.entries(ENTITY_CONFIG).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>
      </Card>

      {/* Audit Timeline */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {filtered.map((a, i) => {
          const act = ACTION_CONFIG[a.action];
          const ent = ENTITY_CONFIG[a.entity_type];
          return (
            <Box key={a.id} sx={{ display: 'flex', gap: 2 }}>
              {/* Timeline line */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20, flexShrink: 0 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: act.color, flexShrink: 0 }} />
                {i < filtered.length - 1 && <Box sx={{ width: 1, flex: 1, backgroundColor: 'rgba(212,175,55,0.1)' }} />}
              </Box>

              {/* Entry card */}
              <Card sx={{ flex: 1, p: 2, mb: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{a.user}</Typography>
                    <Chip label={a.user_role.replace('_', ' ')} size="small" sx={{ fontSize: 9, height: 16, backgroundColor: 'rgba(212,175,55,0.06)', color: '#777' }} />
                    <Chip label={act.label} size="small" sx={{ fontSize: 9, height: 16, backgroundColor: act.bg, color: act.color }} />
                    <Chip label={ent.label} size="small" sx={{ fontSize: 9, height: 16, backgroundColor: `${ent.color}15`, color: ent.color }} />
                  </Box>
                  <Typography sx={{ fontSize: 11, color: '#555', whiteSpace: 'nowrap' }}>{a.timestamp}</Typography>
                </Box>
                <Typography sx={{ fontSize: 12, color: '#b0b0b0', mb: 0.75 }}>{a.description}</Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Typography sx={{ fontSize: 10, color: '#555' }}>Ref: <Box component="span" sx={{ color: '#D4AF37', fontFamily: 'monospace' }}>{a.entity_ref}</Box></Typography>
                  <Typography sx={{ fontSize: 10, color: '#555' }}>IP: <Box component="span" sx={{ color: '#777', fontFamily: 'monospace' }}>{a.ip_address}</Box></Typography>
                  <Typography sx={{ fontSize: 10, color: '#555' }}>Hash: <Box component="span" sx={{ color: '#8B5CF6', fontFamily: 'monospace' }}>{a.hash}</Box></Typography>
                </Box>
              </Card>
            </Box>
          );
        })}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography sx={{ fontSize: 12, color: '#777' }}>
          Showing {filtered.length} of {baseAudit.length} audit entries
        </Typography>
      </Box>
    </Box>
  );
}
