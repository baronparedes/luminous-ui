import {
  Button,
  Col,
  Container,
  FormControl,
  InputGroup,
  Row,
} from 'react-bootstrap';
import BalanceSummary from '../../dashboard/BalanceSummary';
import {useChargeBalance, useSettings} from '../../../hooks';
import {Spacer} from '../../@ui/Spacer';
import RoundedPanel from '../../@ui/RoundedPanel';
import SelectPeriod from '../../@ui/SelectPeriod';
import {Table} from '../../@ui/Table';
import {FaSearch} from 'react-icons/fa';
import {
  PaymentDetailAttr,
  Period,
  TransactionAttr,
  useGetAllTransactions,
  usePostCollections,
} from '../../../Api';
import CollectPaymentButton from './CollectPaymentButton';
import {useState} from 'react';
import {getCurrentMonthYear} from '../../../@utils/dates';
import ErrorInfo from '../../@ui/ErrorInfo';
import CollectionTableRow from './CollectionTableRow';
import {useRootState} from '../../../store';

const CollectionsView: React.FC = () => {
  const {
    chargeIds: {commonChargeId},
  } = useSettings();
  const {availableBalances, refetch: refetchBalances} = useChargeBalance();
  const {me} = useRootState(state => state.profile);

  const [searchCriteria, setSearchCriteria] = useState<string | undefined>(
    undefined
  );
  const [period, setPeriod] = useState<Period>(getCurrentMonthYear());

  const {
    mutate,
    loading: loadingCollections,
    error: errorPostCollections,
  } = usePostCollections({});

  const {data, loading, error, refetch} = useGetAllTransactions({
    debounce: 300,
    year: period.year,
    month: period.month,
    chargeId: Number(commonChargeId),
    queryParams: {
      search: searchCriteria,
    },
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCriteria(e.currentTarget.value);
  };

  const handleOnPeriodSelect = (period: Period) => {
    setPeriod(period);
    handleOnRefreshData();
  };

  const handleOnRefreshData = () => {
    refetch();
    refetchBalances();
  };

  const handleOnCollect = (formData: TransactionAttr & PaymentDetailAttr) => {
    const getPaymentDetail = (): PaymentDetailAttr => {
      switch (formData.paymentType) {
        case 'check':
          return {
            orNumber: formData.orNumber,
            collectedBy: Number(me?.id),
            paymentType: 'check',
            checkIssuingBank: formData.checkIssuingBank,
            checkNumber: formData.checkNumber,
            checkPostingDate: formData.checkPostingDate,
          };
        case 'bank-transfer':
          return {
            orNumber: formData.orNumber,
            collectedBy: Number(me?.id),
            paymentType: 'bank-transfer',
            referenceNumber: formData.referenceNumber,
            transferBank: formData.transferBank,
            transferDate: formData.transferDate,
          };
        case 'gcash':
          return {
            orNumber: formData.orNumber,
            collectedBy: Number(me?.id),
            paymentType: 'gcash',
            referenceNumber: formData.referenceNumber,
            transferFrom: formData.transferFrom,
            transferDate: formData.transferDate,
          };
        case 'cash':
        default:
          return {
            orNumber: formData.orNumber,
            collectedBy: Number(me?.id),
            paymentType: 'cash',
          };
      }
    };

    const transactionsCleaned: TransactionAttr = {
      chargeId: formData.chargeId,
      propertyId: formData.propertyId,
      transactionPeriod: formData.transactionPeriod,
      amount: parseFloat(formData.amount.toString()),
      details: formData.details,
      categoryId: formData.categoryId,
      category: formData.category,
      transactionType: 'collected',
    };
    const paymentDetail = getPaymentDetail();

    mutate({
      paymentDetail,
      transactions: [transactionsCleaned],
    }).then(() => {
      handleOnRefreshData();
    });
  };

  return (
    <Container className="pb-4">
      <BalanceSummary
        availableBalances={availableBalances.filter(
          b => b.chargeId === commonChargeId
        )}
      />
      <Spacer />
      <RoundedPanel className="p-3">
        <SelectPeriod size="lg" onPeriodSelect={handleOnPeriodSelect} />
      </RoundedPanel>
      <Spacer />
      <RoundedPanel className="p-0 m-auto">
        <Table
          loading={loading}
          headers={['description', 'payment detail', 'category', 'action']}
          renderFooterContent={
            <>
              {error && (
                <div className="m-2 pb-2">
                  <ErrorInfo>{error.message}</ErrorInfo>
                </div>
              )}
              {errorPostCollections && (
                <div className="m-2 pb-2">
                  <ErrorInfo>{errorPostCollections.message}</ErrorInfo>
                </div>
              )}
            </>
          }
          renderHeaderContent={
            <Row>
              <Col sm={12} md={6}>
                <h4>Collections</h4>
              </Col>
              <Col className="text-right">
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="search..."
                    onChange={handleOnChange}
                  />
                  <InputGroup.Append>
                    <Button
                      variant="secondary"
                      aria-label="search collections"
                      onClick={handleOnRefreshData}
                    >
                      <FaSearch />
                    </Button>
                  </InputGroup.Append>
                  {commonChargeId && (
                    <CollectPaymentButton
                      onCollect={handleOnCollect}
                      chargeId={commonChargeId}
                      period={period}
                      loading={loadingCollections}
                    />
                  )}
                </InputGroup>
              </Col>
            </Row>
          }
        >
          {data && !loading && !error && (
            <tbody>
              {data.map((row, index) => {
                return (
                  <CollectionTableRow
                    key={index}
                    transaction={row}
                    refetch={handleOnRefreshData}
                  />
                );
              })}
            </tbody>
          )}
        </Table>
      </RoundedPanel>
    </Container>
  );
};

export default CollectionsView;
