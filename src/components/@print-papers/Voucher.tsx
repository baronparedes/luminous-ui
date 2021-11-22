import {Col, Container, Row} from 'react-bootstrap';
import styled from 'styled-components';

import {getNames} from '../../@utils/helpers';
import {VoucherAttr} from '../../Api';
import {Currency} from '../@ui/Currency';
import DisbursementDetail from '../@ui/DisbursementDetail';
import {PageSection} from './PaperPdf';

const Label = styled('div')`
  font-size: 1.5em;
`;

type Props = {
  voucher: VoucherAttr | null;
};

const Voucher = ({voucher}: Props) => {
  if (!voucher) return null;

  const {expenses, disbursements} = voucher;

  return (
    <PageSection>
      <PageSection>
        <div className="text-center">
          <h1 className="brand">Luminous</h1>
          <h4>PURCHASE ORDER</h4>
        </div>
      </PageSection>
      <PageSection className="pt-3">
        <Label className="pb-2">
          <strong>V-{voucher.id}</strong>
        </Label>
        <Label>
          <small>
            <strong>Purpose of the request: </strong>
          </small>
          <p>{voucher.description}</p>
        </Label>
        <small>
          <Label>
            <strong>Requested on: </strong>
            {voucher.requestedDate}
          </Label>
        </small>
        <small>
          <Label>
            <strong>Requested by: </strong>
            {voucher.requestedByProfile?.name}
          </Label>
        </small>
        <small>
          <Label>
            <strong>Status: </strong>
            {voucher.status.toUpperCase()}
          </Label>
        </small>
        {voucher.status === 'approved' &&
          voucher.approverProfiles &&
          voucher.approverProfiles.length > 0 && (
            <span className="ml-2">
              by {getNames(voucher.approverProfiles)}
            </span>
          )}
        {voucher.status === 'rejected' && voucher.rejectedByProfile && (
          <span className="ml-2">by {voucher.rejectedByProfile?.name}</span>
        )}
        {voucher.comments && (
          <small>
            <Label>
              <strong>Comments: </strong>
              {voucher?.comments}
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
            currency={voucher.totalCost}
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
        <PageSection hasPageBreak>
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
    </PageSection>
  );
};

export default Voucher;
