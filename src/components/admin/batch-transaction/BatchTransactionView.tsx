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
  const handleOnSelect = (period: Period) => {
    const confirmed = confirm('Start Process?');
    if (confirmed) {
      setSelectedPeriod(period);
      setInProgress(true);
      refetch();
    }
  };
  const handleOnProcessComplete = () => {
    setInProgress(false);
  };
  const {data, loading, refetch} = useGetAllProperties({
    debounce: 300,
    lazy: true,
  });
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
        {selectedPeriod && !loading && (
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
