import { Box, Typography } from '@mui/material';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { ANNUAL_TREND } from '../data/tradeData';

export default function TradeGrowthChart() {
  return (
    <Box
      sx={{
        bgcolor: 'rgba(17, 17, 17, 0.75)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(212, 175, 55, 0.12)',
        borderRadius: 3,
        p: { xs: 2, md: 3 },
      }}
    >
      <Typography
        sx={{
          fontFamily: "'Lora', serif",
          fontWeight: 700,
          fontSize: '1.15rem',
          color: '#f0f0f0',
          mb: 0.5,
        }}
      >
        Intra-African Trade Growth
      </Typography>
      <Typography sx={{ fontSize: 12, color: '#b0b0b0', mb: 2 }}>
        Total intra-African merchandise trade, 2016-2024 (USD billions)
      </Typography>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={ANNUAL_TREND} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.06)" />
          <XAxis
            dataKey="year"
            tick={{ fill: '#b0b0b0', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(212,175,55,0.15)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#b0b0b0', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}B`}
            domain={[100, 240]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(17,17,17,0.95)',
              border: '1px solid rgba(212,175,55,0.25)',
              borderRadius: 8,
              fontSize: 12,
            }}
            itemStyle={{ color: '#f0f0f0' }}
            labelStyle={{ color: '#D4AF37', fontWeight: 600 }}
            formatter={(value) => [`$${value}B`, 'Total Trade']}
          />
          <Area
            type="monotone"
            dataKey="totalBillion"
            stroke="#D4AF37"
            strokeWidth={2.5}
            fill="url(#goldGradient)"
            dot={{ fill: '#D4AF37', r: 4, strokeWidth: 0 }}
            activeDot={{ fill: '#F0D060', r: 6, strokeWidth: 2, stroke: '#D4AF37' }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* COVID annotation */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
        <Typography sx={{ fontSize: 10, color: '#666', fontStyle: 'italic' }}>
          2020 dip reflects COVID-19 pandemic impact on global trade
        </Typography>
      </Box>
    </Box>
  );
}
