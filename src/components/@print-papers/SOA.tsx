import {Col, Container, Row} from 'react-bootstrap';
import styled from 'styled-components';

import {WaterReading} from '../../@types';
import {calculateAccount, getNames, sum} from '../../@utils/helpers';
import {Month, PropertyAccount, SettingAttr, TransactionAttr} from '../../Api';
import {DEFAULTS} from '../../constants';
import {Currency} from '../@ui/Currency';
import Markup from '../@ui/Markup';
import PaymentDetail from '../@ui/PaymentDetail';
import {PageHeader, PageSection} from './PaperPdf';

const Label = styled('div')`
  font-size: 1.5em;
`;

type Props = {
  hasPageBreak?: boolean;
  propertyAccount: PropertyAccount | null;
  month: Month;
  year: number;
  notes?: SettingAttr;
};

const SOA = ({hasPageBreak, propertyAccount, month, year, notes}: Props) => {
  if (!propertyAccount) return null;
  const {currentBalance, previousBalance, collectionBalance} =
    calculateAccount(propertyAccount);
  const {transactions, property, balance, paymentDetails} = propertyAccount;
  return (
    <PageSection hasPageBreak={hasPageBreak}>
      <PageHeader title="STATEMENT OF ACCOUNT" />
      <PageSection className="pt-3">
        <Label>
          <strong>Unit Number: </strong>
          {property?.code}
        </Label>
        <Label>
          <strong>Unit owner: </strong>
          {getNames(propertyAccount.assignedProfiles)}
        </Label>
        <small>
          <Label>
            <strong>Address: </strong>
            {property?.address}
          </Label>
        </small>
        <small>
          <Label>
            <strong>Floor area: </strong>
            {property?.floorArea}
          </Label>
        </small>
        <hr />
      </PageSection>
      <PageSection className="pt-3">
        <Label>
          <strong>Billing Period: </strong>
          {`${month} ${year}`}
        </Label>
        <hr />
        <table className="w-100">
          <thead>
            <tr>
              <th>Charge Description</th>
              <th>Rate</th>
              <th>Unit</th>
              <th className="float-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions &&
              transactions
                .filter(t => t.transactionType === 'charged')
                .map((t, i) => {
                  const getWaterUsage = (t: TransactionAttr) => {
                    try {
                      const result = (
                        JSON.parse(t.comments ?? '') as WaterReading
                      ).usage;
                      return result;
                    } catch {
                      return undefined;
                    }
                  };
                  const unit =
                    t.chargeId === DEFAULTS.WATER_CHARGE_ID
                      ? getWaterUsage(t)
                      : property?.floorArea;
                  return (
                    <tr key={i}>
                      <td>{t.charge?.code}</td>
                      <td>{t.rateSnapshot}</td>
                      <td>{unit}</td>
                      <td className="float-right">
                        <strong>
                          <Currency noCurrencyColor currency={t.amount} />
                        </strong>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
        <hr />
      </PageSection>
      {paymentDetails && paymentDetails.length > 0 && (
        <PageSection>
          <small>
            <Label>
              <strong className="text-muted">Received Payments</strong>
            </Label>
          </small>
          <Container>
            {paymentDetails.map((item, i) => {
              const transactions = propertyAccount.transactions?.filter(
                t => t.paymentDetailId === item.id
              );
              const totalCollected = transactions
                ? sum(transactions.map(t => t.amount))
                : 0;
              return (
                <Row key={i}>
                  <Col className="p-0 m-0">
                    <div>
                      <PaymentDetail
                        paymentDetail={item}
                        totalCollected={totalCollected}
                        noCurrencyColor
                      />
                    </div>
                  </Col>
                </Row>
              );
            })}
          </Container>
          <hr />
        </PageSection>
      )}
      <PageSection className="pt-1">
        <small>
          <Label>
            <strong className="text-muted">Current Balance</strong>
            <strong className="float-right">
              <Currency noCurrencyColor currency={currentBalance} />
            </strong>
          </Label>
        </small>
        <small>
          <Label>
            <strong className="text-muted">Previous Balance</strong>
            <strong className="float-right">
              <Currency noCurrencyColor currency={previousBalance} />
            </strong>
          </Label>
        </small>
        <small>
          <Label>
            <strong className="text-muted">Less Payments</strong>
            <strong className="float-right">
              <Currency noCurrencyColor currency={collectionBalance} />
            </strong>
          </Label>
        </small>
        <hr />
        <Label>
          <strong className="text-muted">Total Amount Due</strong>
          <strong className="float-right">
            <Currency noCurrencyColor currency={balance} />
          </strong>
        </Label>
      </PageSection>
      {notes && notes.value !== '' && (
        <PageSection className="pt-3">
          <hr />
          <Markup value={notes.value} />
        </PageSection>
      )}
    </PageSection>
  );
};

export default SOA;
