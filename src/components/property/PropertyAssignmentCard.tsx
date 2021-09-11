import {Button, Card, Col} from 'react-bootstrap';
import {FaEnvelope, FaMobile, FaTimes, FaUser} from 'react-icons/fa';

export type AssignedProfile = {
  profileId: number;
  name: string;
  username: string;
  email: string;
  mobileNumber?: string;
};

type Props = {
  onRemove?: (profileId: number) => void;
};

const PropertyAssignmentCard = ({
  name,
  email,
  mobileNumber,
  profileId,
  username,
  onRemove,
}: Props & AssignedProfile) => {
  return (
    <>
      <Card
        className="border p-2 mb-1"
        data-testid={`property-assignment-${profileId}`}
      >
        <Col>
          <strong>{name}</strong>
          {onRemove && (
            <Button
              variant="danger"
              size="sm"
              className="float-right"
              aria-label="remove"
              title="remove"
              onClick={() => {
                onRemove(profileId);
              }}
            >
              <FaTimes />
            </Button>
          )}
        </Col>
        <Col>
          <small>
            <FaUser className="mr-1" />
            {username}
          </small>
        </Col>
        <Col>
          <small>
            <FaEnvelope className="mr-1" />
            {email}
          </small>
        </Col>
        {mobileNumber && (
          <Col>
            <small>
              <FaMobile className="mr-1" />
              {mobileNumber}
            </small>
          </Col>
        )}
      </Card>
    </>
  );
};

export default PropertyAssignmentCard;
