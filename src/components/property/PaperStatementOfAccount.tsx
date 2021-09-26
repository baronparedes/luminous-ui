import React from 'react';
import styled from 'styled-components';

import {Month, PropertyAccount, PropertyAssignmentAttr} from '../../Api';
import {SETTING_KEYS} from '../../constants';
import {useRootState} from '../../store';
import {Currency} from '../@ui/Currency';
import Markup from '../@ui/Markup';
import {PageSection, PrintPaper} from '../@ui/PaperPdf';
import {calculateAccount} from './PropertyStatementOfAccount';

type Props = {
  propertyAccount: PropertyAccount | null;
  propertyAssignments: PropertyAssignmentAttr[] | null;
  month: Month;
  year: number;
};

const Label = styled('div')`
  font-size: 1.5em;
`;

function getNames(propertyAssignments: PropertyAssignmentAttr[] | null) {
  const assignedTo =
    (propertyAssignments &&
      propertyAssignments.map(a => a.profile?.name ?? '')) ??
    [];
  return assignedTo;
}

export const PaperStatementOfAccount = React.forwardRef<HTMLDivElement, Props>(
  ({propertyAccount, propertyAssignments, month, year}, ref) => {
    if (!propertyAccount) return null;
    const notes = useRootState(state =>
      state.setting.values.find(v => v.key === SETTING_KEYS.SOA_NOTES)
    );
    const {currentBalance, previousBalance} = calculateAccount(propertyAccount);
    const {transactions, property, balance} = propertyAccount;
    return (
      <div className="d-none">
        <PrintPaper ref={ref}>
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
              {getNames(propertyAssignments).sort().join(', ')}
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
                  transactions.map((t, i) => {
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
        </PrintPaper>
      </div>
    );
  }
);

export default PaperStatementOfAccount;
