import {Button, Col, Container, Row} from 'react-bootstrap';

import {getCurrentMonthYear} from '../../@utils/dates';
import {useGetPropertyAccount, useGetPropertyAssignments} from '../../Api';
import {useUrl} from '../../hooks/useUrl';
import {useRootState} from '../../store';
import Loading from '../@ui/Loading';
import RoundedPanel from '../@ui/RoundedPanel';
import PrintStatementOfAccount from './actions/PrintStatementOfAccount';
import ProcessPayment from './actions/ProcessPayment';
import PropertyAssignmentCard from './PropertyAssignmentCard';
import PropertyDetails from './PropertyDetails';
import PropertyStatementOfAccount from './PropertyStatementOfAccount';

export const PropertyView = () => {
  const {year, month} = getCurrentMonthYear();
  const {me} = useRootState(state => state.profile);
  const {id} = useUrl();
  const propertyId = Number(id);
  const {data: propertyAccountData, loading: propertyAccountLoading} =
    useGetPropertyAccount({
      propertyId,
    });
  const {data: assignedPropertyData, loading: assignedPropertyLoading} =
    useGetPropertyAssignments({propertyId});
  const assignedTo =
    (assignedPropertyData &&
      assignedPropertyData.map(a => a.profile?.name ?? '')) ??
    [];
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
            <RoundedPanel className="mb-2">
              {me?.type === 'admin' && (
                <>
                  <ProcessPayment amount={propertyAccountData?.balance} />
                  <Button className="mb-2 w-100">waive a transaction</Button>
                </>
              )}
              {propertyAccountData && (
                <PrintStatementOfAccount
                  propertyAccount={propertyAccountData}
                  assignedTo={assignedTo}
                  disabled={propertyAccountLoading}
                  year={year}
                  month={month}
                />
              )}
              <Button className="mb-2 w-100">view previous statements</Button>
            </RoundedPanel>
            {assignedPropertyLoading && <Loading />}
            <div>
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
            </div>
            <div className="text-muted text-center">
              <small>assigned to</small>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};
