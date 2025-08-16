import {useEffect, useState} from 'react';
import {Button, Col, Container, Form, Row} from 'react-bootstrap';
import {useDispatch} from 'react-redux';

import {generateNumberedSeries} from '../../../@utils/helpers';
import {useUpdateSettingValue} from '../../../Api';
import {DEFAULTS, SETTING_KEYS} from '../../../constants';
import {useSettings} from '../../../hooks';
import {useRootState} from '../../../store';
import {settingActions} from '../../../store/reducers/setting.reducer';
import Loading from '../../@ui/Loading';
import {SettingContainer} from './SettingsView';

const SettingMinApprovers = () => {
  const dispatch = useDispatch();
  const {minApprovers: currentMinApprovers} = useSettings();
  const minApprovers = useRootState(state =>
    state.setting.values.find(v => v.key === SETTING_KEYS.MIN_APPROVERS)
  );
  const [minApproversState, setMinApproversState] = useState(
    minApprovers?.value || currentMinApprovers.toString()
  );
  const {mutate, loading} = useUpdateSettingValue({});
  const handleSave = () => {
    const value = minApproversState ?? DEFAULTS.MIN_APPROVERS.toString();
    mutate({
      key: SETTING_KEYS.MIN_APPROVERS,
      value,
    }).then(() => {
      dispatch(
        settingActions.updateSetting({
          key: SETTING_KEYS.MIN_APPROVERS,
          value,
        })
      );
    });
  };

  useEffect(() => {
    setMinApproversState(
      minApprovers?.value || DEFAULTS.MIN_APPROVERS.toString()
    );
  }, [minApprovers]);

  return (
    <>
      <SettingContainer
        heading="Disbursement Approval"
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
                  Minimum number of approvers required for disbursements:{' '}
                  <Form.Control
                    style={{width: '4.5em'}}
                    className="d-inline"
                    as="select"
                    name="minApprovers"
                    placeholder="minimum approvers"
                    onChange={e => setMinApproversState(e.target.value)}
                    value={minApproversState}
                  >
                    {generateNumberedSeries(10).map(i => {
                      return (
                        <option key={i} value={i.toString()}>
                          {i}
                        </option>
                      );
                    })}
                  </Form.Control>
                </p>
              )}
            </Col>
          </Row>
        </Container>
      </SettingContainer>
    </>
  );
};

export default SettingMinApprovers;
