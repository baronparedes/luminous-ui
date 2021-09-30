import {useState} from 'react';
import {Container} from 'react-bootstrap';
import {Prompt} from 'react-router-dom';

import {Period, useGetAllProperties} from '../../../Api';
import RoundedPanel from '../../@ui/RoundedPanel';
import SelectPeriod from '../../@ui/SelectPeriod';
import BatchPropertiesToProcess from './BatchPropertiesToProcess';

const BatchTransactionView = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>();
  const [inProgress, setInProgress] = useState(false);
  const {data, loading, refetch} = useGetAllProperties({
    debounce: 300,
    lazy: true,
  });
  const handleOnSelect = (period: Period) => {
    if (confirm('Start Process?')) {
      refetch();
      setSelectedPeriod(period);
      setInProgress(true);
    }
  };
  const handleOnProcessComplete = () => {
    setInProgress(false);
  };
  return (
    <>
      <Prompt
        when={inProgress}
        message={() =>
          'Leaving or refreshing the page will interrupt the current process. Proceed?'
        }
      />
      <Container>
        <RoundedPanel className="p-4">
          <h5 className="pl-2">Select a period</h5>
          <SelectPeriod
            onPeriodSelect={handleOnSelect}
            buttonLabel="process"
            disabled={inProgress || loading}
          />
        </RoundedPanel>
        {selectedPeriod && !loading && data && (
          <RoundedPanel className="p-3 mt-2">
            <BatchPropertiesToProcess
              properties={data}
              period={selectedPeriod}
              onComplete={handleOnProcessComplete}
            />
          </RoundedPanel>
        )}
      </Container>
    </>
  );
};

export default BatchTransactionView;
