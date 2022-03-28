import {Col, Container, Row} from 'react-bootstrap';
import styled from 'styled-components';

import {getNames} from '../../@utils/helpers';
import {PurchaseOrderAttr, SettingAttr} from '../../Api';
import {Currency} from '../@ui/Currency';
import DisbursementDetail from '../@ui/DisbursementDetail';
import Markup from '../@ui/Markup';
import {PageHeader, PageSection} from './PaperPdf';

const Label = styled('div')`
  font-size: 1.5em;
`;

type Props = {
  purchaseOrder: PurchaseOrderAttr | null;
  notes?: SettingAttr;
};

const PurchaseOrder = ({purchaseOrder, notes}: Props) => {
  if (!purchaseOrder) return null;

  const {expenses, disbursements} = purchaseOrder;

  return (
    <PageSection>
      <PageHeader title="PURCHASE ORDER" />
      <PageSection className="pt-3">
        <Label className="pb-2">
          <strong>PO-{purchaseOrder.series}</strong>
        </Label>
        <Label>
          <small>
            <strong>Purpose of the request: </strong>
          </small>
          <p>{purchaseOrder.description}</p>
        </Label>
        <Row>
          <Col>
            <small>
              <Label>
                <strong>Requested on: </strong>
                <p>{purchaseOrder.requestedDate}</p>
              </Label>
            </small>
          </Col>
          <Col>
            <small>
              <Label>
                <strong>Requested by: </strong>
                <p>{purchaseOrder.requestedByProfile?.name}</p>
              </Label>
            </small>
          </Col>
        </Row>
        <Row>
          <Col>
            <small>
              <Label>
                <strong>Status: </strong>
                {purchaseOrder.status.toUpperCase()}
              </Label>
            </small>
            {purchaseOrder.status === 'approved' &&
              purchaseOrder.approverProfiles &&
              purchaseOrder.approverProfiles.length > 0 && (
                <span className="ml-2">
                  by {getNames(purchaseOrder.approverProfiles)}
                </span>
              )}
            {['rejected', 'cancelled'].includes(purchaseOrder.status) &&
              purchaseOrder.rejectedByProfile && (
                <span className="ml-2">
                  by {purchaseOrder.rejectedByProfile?.name}
                </span>
              )}
          </Col>
        </Row>
        {purchaseOrder.comments && (
          <small>
            <Label>
              <strong>Comments: </strong>
              {purchaseOrder?.comments}
            </Label>
          </small>
        )}
        <hr />
      </PageSection>
      <PageSection>
        <Row>
          <Col>
            <small>
              <Label>
                <strong>Vendor name: </strong>
                <p>{purchaseOrder.vendorName}</p>
              </Label>
            </small>
          </Col>
          <Col>
            <small>
              <Label>
                <strong>Fulfillment date: </strong>
                <p>{purchaseOrder.fulfillmentDate}</p>
              </Label>
            </small>
          </Col>
          <Col>
            <small>
              <Label>
                <strong>Other details: </strong>
                <p>{purchaseOrder.otherDetails}</p>
              </Label>
            </small>
          </Col>
        </Row>

        <hr />
      </PageSection>
      <PageSection>
        <h3 className="text-right">
          Total Cost
          <Currency
            className="ml-2"
            noCurrencyColor
            currency={purchaseOrder.totalCost}
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
        <hr />
      </PageSection>
      {disbursements && disbursements.length > 0 && (
        <PageSection>
          <small>
            <Label>
              <strong>Disbursements</strong>
            </Label>
          </small>
          <br />
          <Container>
            {disbursements.map((item, i) => {
              return (
                <Row key={i}>
                  <Col className="p-0 m-0">
                    <div>
                      <DisbursementDetail disbursement={item} noCurrencyColor />
                    </div>
                  </Col>
                </Row>
              );
            })}
          </Container>
          <hr />
        </PageSection>
      )}
      {notes && notes.value !== '' && (
        <PageSection className="pt-3">
          <Markup value={notes.value} />
        </PageSection>
      )}
    </PageSection>
  );
};

export default PurchaseOrder;
