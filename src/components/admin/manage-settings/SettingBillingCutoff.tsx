import {useEffect, useState} from 'react';
import {Button, Col, Container, Form, Row} from 'react-bootstrap';
import {useDispatch} from 'react-redux';

import {generateNumberedSeries} from '../../../@utils/helpers';
import {useUpdateSettingValue} from '../../../Api';
import {SETTING_KEYS} from '../../../constants';
import {useRootState} from '../../../store';
import {settingActions} from '../../../store/reducers/setting.reducer';
import Loading from '../../@ui/Loading';
import {SettingContainer} from './SettingsView';

const SettingBillingCutoff = () => {
  const dispatch = useDispatch();
  const billingCutoff = useRootState(state =>
    state.setting.values.find(v => v.key === SETTING_KEYS.BILLING_CUTOFF_DAY)
  );
  const [billingCutoffState, setBillingCutoffState] = useState(
    billingCutoff?.value
  );
  const {mutate, loading} = useUpdateSettingValue({});
  const handleSave = () => {
    const value = billingCutoffState ?? '';
    mutate({
      key: SETTING_KEYS.BILLING_CUTOFF_DAY,
      value,
    }).then(() => {
      dispatch(
        settingActions.updateSetting({
          key: SETTING_KEYS.BILLING_CUTOFF_DAY,
          value,
        })
      );
    });
  };

  useEffect(() => {
    setBillingCutoffState(billingCutoff?.value);
  }, [billingCutoff]);

  return (
    <>
      <SettingContainer
        heading="Billing"
        renderRightContent={
          <Button disabled={loading} onClick={() => handleSave()}>
            Save
          </Button>
        }
      >
        <Container>
          <Row>
            <Col>
              {loading && <Loading />}
              {!loading && (
                <p>
                  Billing Cutoff Date is every{' '}
                  <Form.Control
                    style={{width: '4.5em'}}
                    className="d-inline"
                    as="select"
                    name="billing"
                    placeholder="billing"
                    onChange={e => setBillingCutoffState(e.target.value)}
                    value={billingCutoffState}
                  >
                    {generateNumberedSeries(30).map(i => {
                      return (
                        <option key={i} value={i.toString()}>
                          {i}
                        </option>
                      );
                    })}
                  </Form.Control>{' '}
                  of the month
                </p>
              )}
            </Col>
          </Row>
        </Container>
      </SettingContainer>
    </>
  );
};

export default SettingBillingCutoff;
