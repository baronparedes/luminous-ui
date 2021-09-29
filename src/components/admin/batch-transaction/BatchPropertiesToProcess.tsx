import {useEffect, useState} from 'react';
import {Button, Container, ProgressBar} from 'react-bootstrap';

import {
  ApiError,
  Period,
  PropertyAttr,
  usePostMonthlyCharges,
} from '../../../Api';
import ErrorInfo from '../../@ui/ErrorInfo';

type Props = {
  period?: Period;
  properties: PropertyAttr[] | null;
  onComplete?: () => void;
};

type ProcessError = {
  property: PropertyAttr;
  message: string;
};

const BatchPropertiesToProcess = ({period, properties, onComplete}: Props) => {
  const [toggleErrors, setToggleErrors] = useState(false);
  const [errors, setErrors] = useState<ProcessError[]>([]);
  const [currentProps, setCurrentProps] = useState<{
    properties: string;
    period: string;
  }>({
    properties: 'new',
    period: 'new',
  });
  const [progress, setProgress] = useState(-1);
  const [currentPropertyToProcess, setCurrentPropertyToProcess] =
    useState<PropertyAttr>();
  const calculatePercentage = () => {
    if (properties) {
      return (progress / properties.length) * 100;
    }
    return 0;
  };
  const {mutate} = usePostMonthlyCharges({});

  useEffect(() => {
    if (properties) {
      if (progress <= properties.length - 1) {
        if (currentPropertyToProcess && period) {
          mutate({
            propertyId: Number(currentPropertyToProcess.id),
            year: period.year,
            month: period.month,
          })
            .then(() => {
              setProgress(state => state + 1);
            })
            .catch(err => {
              const apiError = err.data as ApiError;
              const error: ProcessError = {
                property: currentPropertyToProcess,
                message: apiError ? apiError.message : err.message,
              };
              setErrors(state => [...state, error]);
              setProgress(state => state + 1);
            });
        }
      } else {
        onComplete && onComplete();
      }
    }
  }, [currentPropertyToProcess?.id]);

  useEffect(() => {
    if (properties) {
      setCurrentPropertyToProcess(properties[progress]);
    }
  }, [progress]);

  useEffect(() => {
    const nextProperties = JSON.stringify(properties?.map(p => p.id));
    const nextPeriod = JSON.stringify(period);
    if (
      currentProps.properties === nextProperties &&
      currentProps.period === nextPeriod
    ) {
      onComplete && onComplete();
    } else {
      setCurrentProps({
        properties: nextProperties,
        period: nextPeriod,
      });
      if (properties) {
        setProgress(0);
        setErrors([]);
        setToggleErrors(false);
      }
    }
  }, [properties, period]);

  return (
    <>
      <Container>
        {period && properties && (
          <>
            <h5>
              Processed {progress} out of {properties.length} properties
            </h5>
            <ProgressBar now={calculatePercentage()} srOnly />
          </>
        )}
        {properties && errors.length > 0 && (
          <div className="pt-3">
            <ErrorInfo>
              Unable to process {errors.length} out of {properties.length}{' '}
              properties
              <Button
                variant="warning"
                size="sm"
                className="float-right"
                onClick={() => setToggleErrors(state => !state)}
              >
                {toggleErrors ? 'hide errors' : 'show errors'}
              </Button>
            </ErrorInfo>
          </div>
        )}
        {toggleErrors && errors.length > 0 && (
          <div className="pt-3">
            {errors.map((err, i) => {
              return (
                <ErrorInfo key={i}>
                  {`[${err.property.code}] - ${err.message}`}
                </ErrorInfo>
              );
            })}
          </div>
        )}
      </Container>
    </>
  );
};

export default BatchPropertiesToProcess;
