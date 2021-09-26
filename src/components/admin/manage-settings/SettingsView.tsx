import {Container} from 'react-bootstrap';

import RoundedPanel from '../../@ui/RoundedPanel';
import SettingSOA from './SettingSOA';

export const SettingContainer: React.FC<{heading: string}> = ({
  heading,
  children,
}) => {
  return (
    <RoundedPanel className="p-3 mb-3">
      <h5>{heading}</h5>
      <hr />
      {children}
    </RoundedPanel>
  );
};

const SettingsView = () => {
  return (
    <>
      <Container>
        <SettingSOA />
      </Container>
    </>
  );
};

export default SettingsView;
