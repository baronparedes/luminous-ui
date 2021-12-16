import {ResponsiveContainer} from 'recharts';

import {CategorizedExpenseView} from '../../Api';
import RoundedPanel from '../@ui/RoundedPanel';

type Props = {
  data: CategorizedExpenseView[];
};

const CategorizedExpense = ({data}: Props) => {
  return (
    <>
      <RoundedPanel className="p-4 text-center">
        <ResponsiveContainer width="100%" height={300}>
          <>{JSON.stringify(data)}</>
        </ResponsiveContainer>
      </RoundedPanel>
    </>
  );
};

export default CategorizedExpense;
