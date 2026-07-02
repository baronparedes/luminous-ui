import {useEffect, useState} from 'react';
import {Button, Col, Container, Form, Row} from 'react-bootstrap';
import {useDispatch} from 'react-redux';
import {useUpdateSettingValue} from '../../../Api';
import config, {DEFAULTS, SETTING_KEYS} from '../../../config';
import {useRootState} from '../../../store';
import {settingActions} from '../../../store/reducers/setting.reducer';
import Loading from '../../@ui/Loading';
import {SettingContainer} from './SettingsView';

const SettingEmailBatchLimit = () => {
  const dispatch = useDispatch();
  const emailBatchLimit = useRootState(state =>
    state.setting.values.find(v => v.key === SETTING_KEYS.EMAIL_BATCH_LIMIT)
  );
  const [emailBatchLimitState, setEmailBatchLimitState] = useState(
    emailBatchLimit?.value || DEFAULTS.EMAIL_BATCH_LIMIT.toString()
  );
  const {mutate, loading} = useUpdateSettingValue({});
  const handleSave = () => {
    const value = emailBatchLimitState ?? DEFAULTS.EMAIL_BATCH_LIMIT.toString();
    mutate({
      key: SETTING_KEYS.EMAIL_BATCH_LIMIT,
      value,
    }).then(() => {
      dispatch(
        settingActions.updateSetting({
          key: SETTING_KEYS.EMAIL_BATCH_LIMIT,
          value,
        })
      );
    });
  };

  useEffect(() => {
    setEmailBatchLimitState(
      emailBatchLimit?.value || DEFAULTS.EMAIL_BATCH_LIMIT.toString()
    );
  }, [emailBatchLimit]);

  return (
    <>
      <SettingContainer
        heading="Email Batch Limit"
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
                  Maximum number of emails to send per batch process:{' '}
                  <Form.Control
                    style={{width: '6em'}}
                    className="d-inline"
                    type="number"
                    name="emailBatchLimit"
                    min="1"
                    max={config.EMAIL_BATCH_LIMIT_MAX.toString()}
                    onChange={e => setEmailBatchLimitState(e.target.value)}
                    value={emailBatchLimitState}
                  />
                </p>
              )}
            </Col>
          </Row>
        </Container>
      </SettingContainer>
    </>
  );
};

export default SettingEmailBatchLimit;
