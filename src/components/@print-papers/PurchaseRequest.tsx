import styled from 'styled-components';

import {getNames} from '../../@utils/helpers';
import {PurchaseRequestAttr, SettingAttr} from '../../Api';
import {Currency} from '../@ui/Currency';
import Markup from '../@ui/Markup';
import {PageHeader, PageSection} from './PaperPdf';

const Label = styled('div')`
  font-size: 1.5em;
`;

type Props = {
  purchaseRequest: PurchaseRequestAttr | null;
  notes?: SettingAttr;
};

const PurchaseRequest = ({purchaseRequest, notes}: Props) => {
  if (!purchaseRequest) return null;

  const {expenses} = purchaseRequest;

  return (
    <PageSection>
      <PageHeader title="PURCHASE REQUEST" />
      <PageSection className="pt-3">
        <Label className="pb-2">
          <strong>PR-{purchaseRequest.series}</strong>
        </Label>
        <Label>
          <small>
            <strong>Purpose of the request: </strong>
          </small>
          <p>{purchaseRequest.description}</p>
        </Label>
        <small>
          <Label>
            <strong>Requested on: </strong>
            {purchaseRequest.requestedDate}
          </Label>
        </small>
        <small>
          <Label>
            <strong>Requested by: </strong>
            {purchaseRequest.requestedByProfile?.name}
          </Label>
        </small>
        <small>
          <Label>
            <strong>Status: </strong>
            {purchaseRequest.status.toUpperCase()}
          </Label>
        </small>
        {purchaseRequest.status === 'approved' &&
          purchaseRequest.approverProfiles &&
          purchaseRequest.approverProfiles.length > 0 && (
            <span className="ml-2">
              by {getNames(purchaseRequest.approverProfiles)}
            </span>
          )}
        {purchaseRequest.status === 'rejected' &&
          purchaseRequest.rejectedByProfile && (
            <span className="ml-2">
              by {purchaseRequest.rejectedByProfile?.name}
            </span>
          )}
        {purchaseRequest.comments && (
          <small>
            <Label>
              <strong>Comments: </strong>
              {purchaseRequest?.comments}
            </Label>
          </small>
        )}
        <hr />
      </PageSection>
      <PageSection>
        <h3 className="text-right">
          Total Cost
          <Currency
            className="ml-2"
            noCurrencyColor
            currency={purchaseRequest.totalCost}
          />
        </h3>
        <hr />
      </PageSection>
      <PageSection>
        <small>
          <Label>
            <strong>Expenses</strong>
          </Label>
        </small>
        <br />
        <table className="w-100">
          <thead>
            <tr>
              <th style={{maxWidth: '20%', minWidth: '20%', width: '20%'}}>
                category
              </th>
              <th style={{maxWidth: '50%', minWidth: '50%', width: '50%'}}>
                description
              </th>
              <th className="text-center">qty</th>
              <th className="text-right">unit</th>
              <th className="text-right">total cost</th>
            </tr>
          </thead>
          <tbody>
            {expenses &&
              expenses.map((item, i) => {
                return (
                  <tr key={i}>
                    <td>{item.category}</td>
                    <td>{item.description}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">
                      <Currency noCurrencyColor currency={item.unitCost} />
                    </td>
                    <td className="text-right">
                      <strong>
                        <Currency noCurrencyColor currency={item.totalCost} />
                      </strong>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
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

export default PurchaseRequest;
