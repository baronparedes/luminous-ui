import {Col, Container, Row} from 'react-bootstrap';

import {roundOff} from '../../@utils/currencies';
import {useGetPropertyAccount} from '../../Api';
import {useUrl} from '../../hooks/useUrl';
import {useRootState} from '../../store';
import Loading from '../@ui/Loading';
import RoundedPanel from '../@ui/RoundedPanel';
import AdjustTransactions from './actions/AdjustTransactions';
import ProcessPayment from './actions/ProcessPayment';
import ViewPaymentHistory from './actions/ViewPaymentHistory';
import ViewPreviousStatements from './actions/ViewPreviousStatements';
import PropertyAssignmentCard from './PropertyAssignmentCard';
import PropertyDetails from './PropertyDetails';
import PropertyStatementOfAccount from './PropertyStatementOfAccount';

const PropertyView = () => {
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
  const handleOnRefresh = () => {
    refetchPropertyAccount();
  };

  if (propertyAccountLoading) {
    return <Loading />;
  }

  return (
    <>
      <Container>
        <Row>
          <Col>
            {propertyAccountData && (
              <PropertyDetails propertyAccount={propertyAccountData} />
            )}
          </Col>
        </Row>
        <Row>
          <Col md={9} className="mb-2">
            {propertyAccountData && (
              <PropertyStatementOfAccount
                propertyAccount={propertyAccountData}
              />
            )}
          </Col>
          <Col md={3}>
            {propertyAccountData && (
              <RoundedPanel className="mb-2">
                {me?.type === 'admin' && (
                  <>
                    <ProcessPayment
                      className="mb-2 w-100"
                      buttonLabel="process payment"
                      propertyId={propertyId}
                      onProcessedPayment={handleOnRefresh}
                      amount={parseFloat(
                        roundOff(propertyAccountData.balance).toFixed(2)
                      )}
                    />
                    <AdjustTransactions
                      className="mb-2 w-100"
                      buttonLabel="adjustments"
                      propertyId={propertyId}
                      onSaveAdjustments={handleOnRefresh}
                      currentTransactions={propertyAccountData.transactions?.filter(
                        t => t.transactionType === 'charged'
                      )}
                    />
                  </>
                )}
                {propertyAccountData.property && (
                  <>
                    <ViewPreviousStatements
                      className="mb-2 w-100"
                      buttonLabel="view previous statements"
                      disabled={id === undefined}
                      property={propertyAccountData.property}
                    />
                    <ViewPaymentHistory
                      className="mb-2 w-100"
                      buttonLabel="view payment history"
                      disabled={id === undefined}
                      property={propertyAccountData.property}
                    />
                  </>
                )}
              </RoundedPanel>
            )}
            <div>
              {propertyAccountData && propertyAccountData.assignedProfiles && (
                <>
                  <div>
                    {propertyAccountData.assignedProfiles.map((profile, i) => {
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

export default PropertyView;
