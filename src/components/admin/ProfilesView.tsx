import {
  Button,
  ButtonGroup,
  Col,
  FormControl,
  InputGroup,
  Row,
} from 'react-bootstrap';
import {FaPencilAlt, FaSearch, FaTrash, FaUserPlus} from 'react-icons/fa';

import {useGetAllProfiles} from '../../Api';
import ErrorInfo from '../@ui/ErrorInfo';
import RoundedPanel from '../@ui/RoundedPanel';
import {Table} from '../@ui/Table';

const ProfilesView = () => {
  const {data, loading, error} = useGetAllProfiles({});
  return (
    <>
      <RoundedPanel className="p-0 m-auto">
        <Table
          loading={loading}
          headers={['id', 'name', 'username', 'email', 'type', 'action']}
          renderFooterContent={<>{error && <ErrorInfo>{error}</ErrorInfo>}</>}
          renderHeaderContent={
            <Row>
              <Col sm={12} md={6}>
                <h4>Profiles</h4>
              </Col>
              <Col className="text-right">
                <InputGroup className="mb-3">
                  <FormControl placeholder="search..." />
                  <Button variant="secondary" aria-label="search user">
                    <FaSearch />
                  </Button>
                  <Button
                    variant="success"
                    className="ml-2"
                    aria-label="create user"
                  >
                    <FaUserPlus />
                  </Button>
                </InputGroup>
              </Col>
            </Row>
          }
        >
          {data && !loading && (
            <tbody>
              {data.map(profile => {
                return (
                  <tr key={profile.id}>
                    <td>{profile.id}</td>
                    <td>{profile.name}</td>
                    <td>{profile.username}</td>
                    <td>{profile.email}</td>
                    <td>{profile.type}</td>
                    <td>
                      <ButtonGroup>
                        <Button variant="primary" size="sm">
                          <FaPencilAlt />
                        </Button>
                        <Button variant="danger" size="sm">
                          <FaTrash />
                        </Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </Table>
      </RoundedPanel>
    </>
  );
};

export default ProfilesView;
