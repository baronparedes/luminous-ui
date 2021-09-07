import styled from 'styled-components';

import {getInitials} from '../../@utils/strings';

const AvatarContainer = styled('div')<AvatarProps>`
  border: 1px solid white;
  border-radius: 50%;
  height: ${props => props.avatarSize};
  text-align: center;
  width: ${props => props.avatarSize};
  cursor: pointer;
  margin: auto;
`;

const Initials = styled('span')<AvatarProps>`
  font-size: calc(${props => props.avatarSize} / 2); /* 50% of parent */
  line-height: 1;
  position: relative;
  top: calc(${props => props.avatarSize} / 4); /* 25% of parent */
`;

type AvatarProps = {
  avatarSize?: string;
};

type Props = {
  name: string;
  onClick?: () => void;
};

const Avatar: React.FC<Props & AvatarProps> = ({
  name,
  onClick,
  avatarSize = '2.5rem',
}) => {
  return (
    <AvatarContainer
      className="bg-primary"
      onClick={onClick}
      avatarSize={avatarSize}
    >
      <Initials avatarSize={avatarSize} className="text-white">
        {getInitials(name)}
      </Initials>
    </AvatarContainer>
  );
};

export default Avatar;
