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

type Props = {
  settingKey: string;
  heading: string;
};

const SettingMarkup = ({settingKey, heading}: Props) => {
  const dispatch = useDispatch();
  const notes = useRootState(state =>
    state.setting.values.find(v => v.key === settingKey)
  );
  const [header, setHeader] = useState(() => EditorState.createEmpty());
  const {mutate, loading} = useUpdateSettingValue({});
  const handleSave = () => {
    const rawContentState = convertToRaw(header.getCurrentContent());
    const markup = sanitize(draftToHtml(rawContentState));
    mutate({key: settingKey, value: markup}).then(() => {
      dispatch(
        settingActions.updateSetting({
          key: settingKey,
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
      <SettingContainer
        heading={heading}
        renderRightContent={
          <Button disabled={loading} onClick={() => handleSave()}>
            Save
          </Button>
        }
      >
        <Container>
          <Row>
            <Col>
              <h6>Notes</h6>
              {loading && <Loading />}
              {!loading && (
                <Editor
                  editorState={header}
                  onEditorStateChange={setHeader}
                  placeholder="enter notes"
                />
              )}
            </Col>
          </Row>
        </Container>
      </SettingContainer>
    </>
  );
};

export default SettingMarkup;
