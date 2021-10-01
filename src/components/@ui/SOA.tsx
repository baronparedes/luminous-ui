import styled from 'styled-components';

import {calculateAccount} from '../../@utils/helpers';
import {Month, ProfileAttr, PropertyAccount, SettingAttr} from '../../Api';
import {Currency} from './Currency';
import Markup from './Markup';
import {PageSection} from './PaperPdf';

const Label = styled('div')`
  font-size: 1.5em;
`;

function getNames(profiles?: ProfileAttr[]) {
  const assignedTo = (profiles && profiles.map(a => a.name)) ?? [];
  return assignedTo;
}

type Props = {
  propertyAccount: PropertyAccount | null;
  month: Month;
  year: number;
  notes?: SettingAttr;
};

const SOA = ({propertyAccount, month, year, notes}: Props) => {
  if (!propertyAccount) return null;
  const {currentBalance, previousBalance, collectionBalance} =
    calculateAccount(propertyAccount);
  const {transactions, property, balance} = propertyAccount;
  return (
    <PageSection hasPageBreak>
      <PageSection>
        <div className="text-center">
          <h1 className="brand">Luminous</h1>
          <h4>STATEMENT OF ACCOUNT</h4>
        </div>
      </PageSection>
      <PageSection className="pt-3">
        <Label>
          <strong>Unit Number: </strong>
          {property?.code}
        </Label>
        <Label>
          <strong>Unit owner: </strong>
          {getNames(propertyAccount.assignedProfiles).sort().join(', ')}
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
              <th className="float-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions &&
              transactions
                .filter(t => t.transactionType === 'charged')
                .map((t, i) => {
                  return (
                    <tr key={i}>
                      <td>{t.charge?.code}</td>
                      <td>{t.charge?.rate}</td>
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
