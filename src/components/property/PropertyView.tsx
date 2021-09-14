import {Col, Container, Row} from 'react-bootstrap';

import {useGetPropertyAccount, useGetPropertyAssignments} from '../../Api';
import {useUrl} from '../../hooks/useUrl';
import Loading from '../@ui/Loading';
import PropertyAssignmentCard from './PropertyAssignmentCard';
import PropertyDetails from './PropertyDetails';
import PropertyStatementOfAccount from './PropertyStatementOfAccount';

export const PropertyView = () => {
  const {id} = useUrl();
  const {data: propertyAccountData, loading: propertyAccountLoading} =
    useGetPropertyAccount({
      propertyId: Number(id),
    });
  const {data: assignedPropertyData, loading: assignedPropertyLoading} =
    useGetPropertyAssignments({propertyId: Number(id)});
  return (
    <>
      <Container>
        <Row>
          <Col>
            {propertyAccountLoading && <Loading className="mb-2" />}
            {!propertyAccountLoading && propertyAccountData && (
              <PropertyDetails propertyAccount={propertyAccountData} />
            )}
          </Col>
        </Row>
        <Row>
          <Col md={9} className="mb-2">
            {propertyAccountLoading && <Loading className="mb-2" />}
            {!propertyAccountLoading && propertyAccountData && (
              <PropertyStatementOfAccount
                propertyAccount={propertyAccountData}
              />
            )}
          </Col>
          <Col md={3}>
            {assignedPropertyLoading && <Loading />}
            {!assignedPropertyLoading &&
              assignedPropertyData &&
              assignedPropertyData.map((pa, i) => {
                const {profile} = pa;
                if (!profile) return null;
                return (
                  <PropertyAssignmentCard
                    key={i}
                    profileId={Number(profile.id)}
                    name={profile.name}
                    username={profile.username}
                    email={profile.email}
                    mobileNumber={profile.mobileNumber}
                  />
                );
              })}
            <div className="text-muted text-center">
              <small>assigned to</small>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};
