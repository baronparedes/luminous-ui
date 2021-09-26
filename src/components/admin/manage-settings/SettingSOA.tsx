import {
  ContentState,
  convertFromHTML,
  convertToRaw,
  EditorState,
} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import {useEffect, useState} from 'react';
import {Button, Col, Container, Row} from 'react-bootstrap';
import {Editor} from 'react-draft-wysiwyg';
import {useDispatch} from 'react-redux';
import sanitize from 'sanitize-html';

import {useUpdateSettingValue} from '../../../Api';
import {SETTING_KEYS} from '../../../constants';
import {useRootState} from '../../../store';
import {settingActions} from '../../../store/reducers/setting.reducer';
import Loading from '../../@ui/Loading';
import {SettingContainer} from './SettingsView';

function contentFromMarkup(markup: string) {
  const blocks = convertFromHTML(markup);
  const state = ContentState.createFromBlockArray(
    blocks.contentBlocks,
    blocks.entityMap
  );
  return state;
}

const SettingSOA = () => {
  const dispatch = useDispatch();
  const notes = useRootState(state =>
    state.setting.values.find(v => v.key === SETTING_KEYS.SOA_NOTES)
  );
  const [header, setHeader] = useState(() => EditorState.createEmpty());
  const {mutate, loading} = useUpdateSettingValue({});
  const handleSave = () => {
    const rawContentState = convertToRaw(header.getCurrentContent());
    const markup = sanitize(draftToHtml(rawContentState));
    mutate({key: SETTING_KEYS.SOA_NOTES, value: markup}).then(() => {
      dispatch(
        settingActions.updateSetting({
          key: SETTING_KEYS.SOA_NOTES,
          value: markup,
        })
      );
    });
  };

  useEffect(() => {
    setHeader(
      EditorState.createWithContent(contentFromMarkup(notes?.value ?? ''))
    );
  }, [notes]);

  return (
    <>
      <SettingContainer heading="Statement of Account">
        <Container>
          <Row>
            <Col>
              <h6>Notes</h6>
              <Editor
                editorState={header}
                onEditorStateChange={setHeader}
                placeholder="Enter statement of account notes"
              />
            </Col>
          </Row>
          <Row>
            <Col className="text-right">
              <Button disabled={loading} onClick={() => handleSave()}>
                {loading && <Loading />}
                Save
              </Button>
            </Col>
          </Row>
        </Container>
      </SettingContainer>
    </>
  );
};

export default SettingSOA;
