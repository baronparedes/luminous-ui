import {useEffect} from 'react';
import {Col, Container, Row} from 'react-bootstrap';
import {useDispatch} from 'react-redux';

import {sum} from '../../@utils/helpers';
import {PropertyAccount, useGetPropertyAccountsByProfile} from '../../Api';
import {useRootState} from '../../store';
import {profileActions} from '../../store/reducers/profile.reducer';
import ErrorInfo from '../@ui/ErrorInfo';
import {LabeledCurrency} from '../@ui/LabeledCurrency';
import Loading from '../@ui/Loading';
import RoundedPanel from '../@ui/RoundedPanel';
import PropertyDetails from '../property/PropertyDetails';
import MyProfileCard from './MyProfileCard';

const MyProfileView = () => {
  const dispatch = useDispatch();
  const {me} = useRootState(state => state.profile);
  const {data, loading, error} = useGetPropertyAccountsByProfile({
    profileId: Number(me?.id),
  });

  const renderProperties = (items: PropertyAccount[]) =>
    items.map((pa, i) => {
      return <PropertyDetails propertyAccount={pa} key={i}></PropertyDetails>;
    });

  useEffect(() => {
    if (data) {
      dispatch(profileActions.updatePropertyAccounts(data));
    }
  }, [data]);

  return (
    <>
      <Container>
        <Row>
          <Col md={5} lg={4} className="mb-3 m-0">
            {me && <MyProfileCard profile={me} />}
            {data && (
              <RoundedPanel className="mt-2 p-3">
                <LabeledCurrency
                  className="text-center"
                  pill
                  variant="danger"
                  label="total amount due"
                  currency={sum(data.map(d => d.balance))}
                  noCurrencyColor
                />
              </RoundedPanel>
            )}
          </Col>
          <Col className="mb-3 m-0">
            {loading && <Loading />}
            {!loading && data && renderProperties(data)}
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
