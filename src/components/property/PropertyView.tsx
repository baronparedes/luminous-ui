import {Button, Col, Container, Row} from 'react-bootstrap';

import {roundOff} from '../../@utils/currencies';
import {getCurrentMonthYear} from '../../@utils/dates';
import {useGetPropertyAccount} from '../../Api';
import {useUrl} from '../../hooks/useUrl';
import {useRootState} from '../../store';
import Loading from '../@ui/Loading';
import RoundedPanel from '../@ui/RoundedPanel';
import PrintStatementOfAccount from './actions/PrintStatementOfAccount';
import ProcessPayment from './actions/ProcessPayment';
import ViewPreviousStatements from './actions/ViewPreviousStatements';
import PropertyAssignmentCard from './PropertyAssignmentCard';
import PropertyDetails from './PropertyDetails';
import PropertyStatementOfAccount from './PropertyStatementOfAccount';

export const PropertyView = () => {
  const {year, month} = getCurrentMonthYear();
  const {me} = useRootState(state => state.profile);
  const {id} = useUrl();
  const propertyId = Number(id);
  const {
    data: propertyAccountData,
    loading: propertyAccountLoading,
    refetch: refetchPropertyAccount,
  } = useGetPropertyAccount({
    propertyId,
  });
  const handleOnProcessedPayment = () => {
    refetchPropertyAccount();
  };
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
                  {propertyAccountData && (
                    <ProcessPayment
                      className="mb-2 w-100"
                      buttonLabel="process payment"
                      propertyId={propertyId}
                      onProcessedPayment={handleOnProcessedPayment}
                      amount={parseFloat(
                        roundOff(propertyAccountData.balance).toFixed(2)
                      )}
                    />
                  )}
                  <Button className="mb-2 w-100">adjustments</Button>
                </>
              )}
              <PrintStatementOfAccount
                className="mb-2 w-100"
                buttonLabel="print current statement"
                disabled={propertyAccountLoading}
                propertyAccount={propertyAccountData}
                year={year}
                month={month}
              />
              <ViewPreviousStatements
                className="mb-2 w-100"
                buttonLabel="view previous statements"
                disabled={id === undefined}
                propertyId={Number(id)}
              />
            </RoundedPanel>
            {propertyAccountLoading && <Loading />}
            <div>
              {!propertyAccountLoading &&
                propertyAccountData &&
                propertyAccountData.assignedProfiles && (
                  <>
                    <div>
                      {propertyAccountData.assignedProfiles.map(
                        (profile, i) => {
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
                        }
                      )}
                    </div>
                    {propertyAccountData.assignedProfiles.length > 0 && (
                      <div className="text-muted text-center">
                        <small>assigned to</small>
                      </div>
                    )}
                  </>
                )}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};
