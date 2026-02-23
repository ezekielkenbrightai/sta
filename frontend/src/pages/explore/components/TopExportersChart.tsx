import { Box, Typography } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { TOP_EXPORTERS } from '../data/tradeData';

const barData = TOP_EXPORTERS.map(e => ({
  name: `${e.flag} ${e.name}`,
  value: e.exportsBillion,
  share: e.share,
}));

export default function TopExportersChart() {
  return (
    <Box
      sx={{
        bgcolor: 'rgba(17, 17, 17, 0.75)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(212, 175, 55, 0.12)',
        borderRadius: 3,
        p: { xs: 2, md: 3 },
        height: '100%',
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
        Top Intra-African Exporters
      </Typography>
      <Typography sx={{ fontSize: 12, color: '#b0b0b0', mb: 2 }}>
        2024 intra-African export volumes (USD billions)
      </Typography>

      <ResponsiveContainer width="100%" height={360}>
        <BarChart
          data={barData}
          layout="vertical"
          margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.06)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: '#b0b0b0', fontSize: 10 }}
            axisLine={{ stroke: 'rgba(212,175,55,0.15)' }}
            tickLine={false}
            tickFormatter={(v) => `$${v}B`}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: '#f0f0f0', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={130}
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
            formatter={(value, _name, entry) => [
              `$${value}B (${entry.payload.share}%)`,
              'Intra-African Exports',
            ]}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
            {barData.map((_entry, idx) => (
              <Cell
                key={idx}
                fill={idx === 0 ? '#D4AF37' : `rgba(212, 175, 55, ${0.7 - idx * 0.05})`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <Typography sx={{ fontSize: 9, color: '#555', mt: 1, textAlign: 'center' }}>
        Source: Afreximbank African Trade Report 2025
      </Typography>
    </Box>
  );
}
