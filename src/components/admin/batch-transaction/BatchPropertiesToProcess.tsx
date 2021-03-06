import {useEffect, useState} from 'react';
import {Alert, Button, Container, ProgressBar} from 'react-bootstrap';

import {
  ApiError,
  Period,
  PropertyAttr,
  usePostMonthlyCharges,
} from '../../../Api';
import ErrorInfo from '../../@ui/ErrorInfo';
import {Spacer} from '../../@ui/Spacer';

type Props = {
  period?: Period;
  properties: PropertyAttr[] | null;
  onComplete?: () => void;
  batchId?: string;
};

type ProcessError = {
  property: PropertyAttr;
  message: string;
};

const BatchPropertiesToProcess = ({
  period,
  properties,
  batchId,
  onComplete,
}: Props) => {
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
          const targetProperty = {...currentPropertyToProcess};
          mutate({
            propertyId: Number(targetProperty.id),
            year: period.year,
            month: period.month,
            batchId,
          })
            .catch(err => {
              const apiError = err.data as ApiError;
              const error: ProcessError = {
                property: targetProperty,
                message: apiError ? apiError.message : err.message,
              };
              setErrors(state => [...state, error]);
            })
            .finally(() => {
              setTimeout(() => {
                setProgress(state => state + 1);
              }, 100);
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
        setCurrentPropertyToProcess(undefined);
        setErrors([]);
        setToggleErrors(false);
        setProgress(0);
      }
    }
  }, [properties]);

  return (
    <>
      <Container>
        {period && properties && (
          <>
            <h5>
              Processed {progress} out of {properties.length} properties
            </h5>
            <ProgressBar now={calculatePercentage()} srOnly />
            {progress === properties?.length && errors.length === 0 && (
              <div>
                <Spacer />
                <Alert variant="success">Process Completed</Alert>
              </div>
            )}
          </>
        )}
        {properties && errors.length > 0 && (
          <div>
            <Spacer />
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
          <div>
            <Spacer />
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
