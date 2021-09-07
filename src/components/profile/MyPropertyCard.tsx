import {BiBuildingHouse} from 'react-icons/bi';
import {FaSquare} from 'react-icons/fa';
import {Link} from 'react-router-dom';

import routes from '../../@utils/routes';
import {PropertyAttr} from '../../Api';

type Props = {
  property: PropertyAttr;
};

const MyPropertyCard = ({property}: Props) => {
  return (
    <>
      <Link
        to={routes.PROPERTY(property.id)}
        style={{textDecorationLine: 'underline'}}
      >
        <h4>{property.code}</h4>
      </Link>
      <div>
        <BiBuildingHouse />
        <span className="text-wrap">{property.address}</span>
      </div>
      <div>
        <FaSquare />
        <small className="pl-1 text-muted">{property.floorArea} m2</small>
      </div>
    </>
  );
};

export default MyPropertyCard;
