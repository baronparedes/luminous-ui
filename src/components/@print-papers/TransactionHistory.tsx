import styled from 'styled-components';

import {sum} from '../../@utils/helpers';
import {PropertyAttr, PropertyTransactionHistoryView} from '../../Api';
import TransactionHistoryDetail from '../@ui/TransactionHistoryDetail';
import {PageHeader, PageSection} from './PaperPdf';

const Label = styled('div')`
  font-size: 1.5em;
`;

type Props = {
  property: PropertyAttr;
  data: PropertyTransactionHistoryView;
};

const TransactionHistory = ({property, data}: Props) => {
  const {transactionHistory, targetYear} = data;
  const totalCharges = sum(
    transactionHistory
      .filter(d => d.transactionType === 'charged')
      ?.map(d => d.amount)
  );
  const totalCollected = sum(
    transactionHistory
      .filter(d => d.transactionType === 'collected')
      ?.map(d => d.amount)
  );
  const balance = totalCharges - totalCollected;
  return (
    <PageSection>
      <PageHeader title="TRANSACTION HISTORY" />
      <PageSection className="pt-3">
        <Label>
          <strong>Unit Number: </strong>
          {property?.code}
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
          <strong>Transaction History for: </strong>
          {`${targetYear}`}
        </Label>
        <hr />
      </PageSection>
      <PageSection>
        <TransactionHistoryDetail data={data} />
      </PageSection>
    </PageSection>
  );
};

export default TransactionHistory;
