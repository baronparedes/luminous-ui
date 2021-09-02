import classNames from 'classnames';
import React from 'react';
import {Container} from 'react-bootstrap';
import styled from 'styled-components';

const Panel = styled(Container)`
  background-color: var(--light);
  padding: 0.5em;
`;

type Props = {
  className?: string;
};

const RoundedPanel: React.FC<Props> = props => {
  return (
    <Panel className={classNames('rounded-lg', props.className)}>
      {props.children}
    </Panel>
  );
};

export default RoundedPanel;
