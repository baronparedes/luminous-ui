import {ChangeEvent, useState} from 'react';
import {Button, Col, FormControl, InputGroup, Row} from 'react-bootstrap';
import {FaSearch} from 'react-icons/fa';

import {useGetAllProfiles} from '../../../Api';
import ErrorInfo from '../../@ui/ErrorInfo';
import RoundedPanel from '../../@ui/RoundedPanel';
import {Table} from '../../@ui/Table';
import ProfileTableRow from './ProfileTableRow';

const ProfilesView = () => {
  const [searchCriteria, setSearchCriteria] = useState<string | undefined>(
    undefined
  );
  const {data, loading, error, refetch} = useGetAllProfiles({
    debounce: 300,
    queryParams: {
      search: searchCriteria,
    },
  });
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchCriteria(e.currentTarget.value);
  };
  return (
    <>
      <RoundedPanel className="p-0 m-auto">
        <Table
          loading={loading}
          headers={[
            'id',
            'name',
            'username',
            'email',
            'mobile number',
            'type',
            'status',
            'action',
          ]}
          renderFooterContent={
            <>
              {error && (
                <div className="m-2 pb-2">
                  <ErrorInfo>{error.message}</ErrorInfo>
                </div>
              )}
            </>
          }
          renderHeaderContent={
            <Row>
              <Col sm={12} md={6}>
                <h4>Profiles</h4>
              </Col>
              <Col className="text-right">
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="search..."
                    onChange={handleOnChange}
                  />
                  <Button
                    variant="secondary"
                    aria-label="search user"
                    onClick={() => refetch()}
                  >
                    <FaSearch />
                  </Button>
                </InputGroup>
              </Col>
            </Row>
          }
        >
          {data && !loading && !error && (
            <tbody>
              {data.map(profile => {
                return <ProfileTableRow profile={profile} key={profile.id} />;
              })}
            </tbody>
          )}
        </Table>
      </RoundedPanel>
    </>
  );
};

export default ProfilesView;
