import {ChangeEvent, useState} from 'react';
import {Button, Col, FormControl, InputGroup, Row} from 'react-bootstrap';
import {FaSearch} from 'react-icons/fa';

import {useGetAllProperties} from '../../../Api';
import ErrorInfo from '../../@ui/ErrorInfo';
import RoundedPanel from '../../@ui/RoundedPanel';
import {Table} from '../../@ui/Table';
import PropertyCreateButton from './PropertyCreateButton';
import PropertyTableRow from './PropertyTableRow';

const PropertiesView = () => {
  const [searchCriteria, setSearchCriteria] = useState<string | undefined>(
    undefined
  );
  const {data, loading, error, refetch} = useGetAllProperties({
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
          headers={['id', 'code', 'address', 'floor area', 'status', 'action']}
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
                <h4>Properties</h4>
              </Col>
              <Col className="text-right">
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="search..."
                    onChange={handleOnChange}
                  />
                  <Button
                    variant="secondary"
                    aria-label="search property"
                    onClick={() => refetch()}
                  >
                    <FaSearch />
                  </Button>
                  <PropertyCreateButton
                    onCreate={() => {
                      refetch();
                    }}
                  />
                </InputGroup>
              </Col>
            </Row>
          }
        >
          {data && !loading && !error && (
            <tbody>
              {data.map(row => {
                return <PropertyTableRow row={row} key={row.id} />;
              })}
            </tbody>
          )}
        </Table>
      </RoundedPanel>
    </>
  );
};

export default PropertiesView;
