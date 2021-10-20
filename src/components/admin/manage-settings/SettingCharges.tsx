import {useEffect, useState} from 'react';
import {Button, Form} from 'react-bootstrap';
import {Controller, useForm} from 'react-hook-form';

import {ChargeAttr, useGetAllCharges, usePatchCharges} from '../../../Api';
import ErrorInfo from '../../@ui/ErrorInfo';
import {Table} from '../../@ui/Table';
import {decimalPatternRule, validateGreaterThanZero} from '../../@validation';
import {SettingContainer} from './SettingsView';

type FormData = {
  rate: number;
};

const ChargeRateInput = ({
  charge,
  onChange,
  onValidityChange,
}: {
  charge: ChargeAttr;
  onChange: (chargeId: number, rate: number) => void;
  onValidityChange?: (chargeId: number, isValid: boolean) => void;
}) => {
  const {control, formState, trigger} = useForm<FormData>({
    defaultValues: {
      rate: charge.rate,
    },
  });

  useEffect(() => {
    onValidityChange && onValidityChange(Number(charge.id), formState.isValid);
  }, [formState.isValid]);

  return (
    <Form role="form" style={{minWidth: '150px'}}>
      <Form.Group>
        <Controller
          name="rate"
          control={control}
          rules={{
            pattern: decimalPatternRule,
            validate: validateGreaterThanZero,
          }}
          render={({field}) => (
            <Form.Control
              {...field}
              onChange={e => {
                field.onChange(e);
                onChange &&
                  onChange(Number(charge.id), parseFloat(e.target.value));
                trigger('rate');
              }}
              type="number"
              required
              step="any"
              placeholder="charge rate"
              isInvalid={formState.errors.rate !== undefined}
            />
          )}
        />
        <Form.Control.Feedback type="invalid" className="text-right">
          {formState.errors.rate?.message}
        </Form.Control.Feedback>
      </Form.Group>
    </Form>
  );
};

const SettingCharges = () => {
  const [chargeErrors, setChargeErrors] = useState<number[]>([]);
  const [charges, setCharges] = useState<ChargeAttr[] | null>(null);
  const {data, loading, error, refetch} = useGetAllCharges({});
  const {
    mutate,
    loading: savingCharges,
    error: savingError,
  } = usePatchCharges({});

  const handleSave = () => {
    if (charges && confirm('Proceed saving charges?')) {
      mutate(charges)
        .then(() => refetch())
        .catch();
    }
  };

  const handleOnValidityChange = (chargeId: number, isValid: boolean) => {
    setChargeErrors(state => {
      if (isValid) {
        return state.filter(c => c !== chargeId);
      } else {
        return [...state, chargeId];
      }
    });
  };

  const handleChargeRateChange = (chargeId: number, rate: number) => {
    setCharges(state => {
      const newState =
        state?.map(c => {
          if (c.id === chargeId) {
            return {
              ...c,
              rate,
            };
          }
          return c;
        }) ?? null;
      return newState;
    });
  };

  useEffect(() => {
    setCharges(data);
  }, [data]);

  return (
    <>
      <SettingContainer
        heading="Charge Rates"
        renderRightContent={
          <Button
            onClick={() => handleSave()}
            disabled={
              loading || savingCharges || !charges || chargeErrors.length > 0
            }
          >
            Save
          </Button>
        }
      >
        {savingError && (
          <div className="pb-2">
            <ErrorInfo>{savingError.message}</ErrorInfo>
          </div>
        )}
        <Table
          loading={loading}
          headers={['id', 'code', 'posting type', 'charge type', 'rate']}
          renderFooterContent={
            <>
              {error && (
                <div className="m-2 pb-2">
                  <ErrorInfo>{error.message}</ErrorInfo>
                </div>
              )}
            </>
          }
          renderHeaderContent={<h4>Charges</h4>}
        >
          {charges && !loading && !error && (
            <tbody>
              {charges.map(row => {
                return (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.code}</td>
                    <td>{row.postingType}</td>
                    <td>{row.chargeType}</td>
                    <td>
                      <ChargeRateInput
                        charge={row}
                        onValidityChange={handleOnValidityChange}
                        onChange={handleChargeRateChange}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </Table>
      </SettingContainer>
    </>
  );
};

export default SettingCharges;
