import {Cell, Pie, PieChart, ResponsiveContainer} from 'recharts';

import {currencyFormat, roundOff} from '../../@utils/currencies';
import {sum} from '../../@utils/helpers';
import {CategorizedExpenseView} from '../../Api';
import RoundedPanel from '../@ui/RoundedPanel';

type Props = {
  data: CategorizedExpenseView[];
};

type ChartData = {
  name: string;
  value: number;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const RADIAN = Math.PI / 180;

function getChartData(data: CategorizedExpenseView[]) {
  const uniqueParentCategories = [...new Set(data.map(d => d.parentCategory))];
  const chartData = uniqueParentCategories.map(parentCategory => {
    const items = data
      .filter(d => d.parentCategory === parentCategory)
      .map(d => d.totalCost);
    return {
      name: parentCategory,
      value: Number(sum(items)),
    } as ChartData;
  });
  return chartData;
}

const CategorizedExpense = ({data}: Props) => {
  const chartData = getChartData(data);
  if (chartData.length === 0) {
    return (
      <>
        <RoundedPanel className="p-4 text-center">
          No data available at the moment
        </RoundedPanel>
      </>
    );
  }
  return (
    <>
      <RoundedPanel className="p-4 text-center">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={180}
              fill="#8884d8"
              dataKey="value"
              label={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                value,
                index,
              }) => {
                const radius = 25 + innerRadius + (outerRadius - innerRadius);
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                return (
                  <text
                    x={x}
                    y={y}
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                  >
                    {chartData[index].name} ({currencyFormat(roundOff(value))})
                  </text>
                );
              }}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </RoundedPanel>
    </>
  );
};

export default CategorizedExpense;
