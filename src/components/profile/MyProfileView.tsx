import {useEffect} from 'react';
import {Badge, Col, Container, Row} from 'react-bootstrap';
import {useDispatch} from 'react-redux';

import {useGetAssignedProperties} from '../../Api';
import {useRootState} from '../../store';
import {profileActions} from '../../store/reducers/profile.reducer';
import ErrorInfo from '../@ui/ErrorInfo';
import Loading from '../@ui/Loading';
import RoundedPanel from '../@ui/RoundedPanel';
import MyProfileCard from './MyProfileCard';
import MyPropertyCard from './MyPropertyCard';

const MyProfileView = () => {
  const dispatch = useDispatch();
  const {me} = useRootState(state => state.profile);
  const {data, loading, error} = useGetAssignedProperties({
    profileId: Number(me?.id),
  });

  useEffect(() => {
    if (data) {
      dispatch(
        profileActions.updateAssignedProperties(data?.map(d => d.propertyId))
      );
    }
  }, [data]);

  return (
    <>
      <Container>
        <Row>
          <Col md={5} lg={4} className="mb-3 m-0">
            {me && <MyProfileCard profile={me} />}
            <RoundedPanel className="mt-2 p-3">
              <div className="text-center">
                <Badge pill variant="danger" className="mr-1">
                  total balance
                </Badge>
                <h5>Php 1,280.50</h5>
              </div>
            </RoundedPanel>
          </Col>
          <Col className="mb-3 m-0">
            {loading && <Loading />}
            {data && !loading && (
              <>
                {data.map((pa, i) => {
                  if (pa.property) {
                    return (
                      <RoundedPanel className="p-4 mb-3" key={i}>
                        <Row>
                          <Col md={8}>
                            <MyPropertyCard property={pa.property} />
                          </Col>
                          <Col md={4}>
                            <div className="text-right">
                              <Badge pill variant="danger">
                                balance
                              </Badge>
                              <h6>Php 1,280.50</h6>
                            </div>
                          </Col>
                        </Row>
                      </RoundedPanel>
                    );
                  }
                  return null;
                })}
              </>
            )}
            {error && (
              <ErrorInfo>
                unable to get assigned properties at this moment
              </ErrorInfo>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default MyProfileView;
