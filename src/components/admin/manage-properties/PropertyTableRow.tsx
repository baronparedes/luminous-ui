import classNames from 'classnames';
import {useState} from 'react';
import {Button, ButtonGroup} from 'react-bootstrap';
import {FaCheck, FaTimes} from 'react-icons/fa';
import {Link} from 'react-router-dom';

import routes from '../../../@utils/routes';
import {
  PropertyAttr,
  RecordStatus,
  useUpdatePropertyStatus,
} from '../../../Api';
import {STATUS_COLORS} from '../../../constants';
import PropertyAssignmentButton from './PropertyAssignmentButton';
import PropertyUpdateButton from './PropertyUpdateButton';

const PropertyTableRow: React.FC<{row: PropertyAttr}> = ({row}) => {
  const [rowState, setRowState] = useState<PropertyAttr>({...row});
  const {mutate} = useUpdatePropertyStatus({id: Number(row.id)});
  const toggleStatus = (status: RecordStatus) => {
    mutate(undefined, {
      queryParams: {
        status,
      },
    })
      .then(() => setRowState({...rowState, status}))
      .catch(() => {});
  };
  const handleOnUpdate = (formData: PropertyAttr) => setRowState({...formData});
  return (
    <tr>
      <td>{rowState.id}</td>
      <td>
        <Link className="text-underline" to={routes.PROPERTY(rowState.id)}>
          {rowState.code}
        </Link>
      </td>
      <td>{rowState.address}</td>
      <td>{rowState.floorArea}</td>
      <td
        className={classNames(
          STATUS_COLORS[rowState.status],
          'font-weight-bold'
        )}
      >
        {rowState.status}
      </td>
      <td>
        <ButtonGroup>
          <PropertyAssignmentButton
            propertyId={Number(rowState.id)}
            code={rowState.code}
          />
          <PropertyUpdateButton value={rowState} onUpdate={handleOnUpdate} />
          {rowState.status === 'active' && (
            <Button
              aria-label="update status"
              title="update status"
              variant="danger"
              size="sm"
              onClick={() => toggleStatus('inactive')}
            >
              <FaTimes />
            </Button>
          )}
          {rowState.status === 'inactive' && (
            <Button
              aria-label="update status"
              title="update status"
              variant="success"
              size="sm"
              onClick={() => toggleStatus('active')}
            >
              <FaCheck />
            </Button>
          )}
        </ButtonGroup>
      </td>
    </tr>
  );
};

export default PropertyTableRow;
