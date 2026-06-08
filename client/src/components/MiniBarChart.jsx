import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="recharts-default-tooltip">
        <p className="label">{`${payload[0].name} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const MiniBarChart = ({ data, xKey, yKey, height = 180, barName = 'Sessions' }) => {
  return (
    <div style={{ width: '100%', height: height }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 5,
            left: -20,
            bottom: 5,
          }}
        >
          <XAxis
            dataKey={xKey}
            tickLine={false}
            axisLine={{ stroke: '#2E2E2E' }}
          />
          <YAxis
            tickLine={false}
            axisLine={{ stroke: '#2E2E2E' }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1A1A1A' }} />
          <Bar
            dataKey={yKey}
            name={barName}
            fill="#FFB1EE"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MiniBarChart;
