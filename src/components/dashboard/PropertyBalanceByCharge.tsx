import {createRef, useEffect, useState} from 'react';
import {Button, Col, Container, Row} from 'react-bootstrap';
import {Typeahead} from 'react-bootstrap-typeahead';
import {CSVLink} from 'react-csv';

import {ChargeAttr, PropertyBalanceByChargeView} from '../../Api';
import ModalContainer from '../@ui/ModalContainer';

type Props = {
  data: PropertyBalanceByChargeView[];
  charges: ChargeAttr[] | null;
};

const PropertyBalanceByCharge = ({data, charges}: Props) => {
  const ref = createRef<Typeahead<string>>();
  const [selectedCharges, setSelectedCharges] = useState(
    charges ? charges.map(c => c.code) : []
  );
  const [filteredData, setFilteredData] = useState(data);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    if (selectedCharges.length > 0) {
      setFilteredData(data.filter(d => selectedCharges.includes(d.chargeCode)));
    } else {
      setFilteredData(data);
    }
  }, [selectedCharges]);

  return (
    <>
      <Button className="ml-2" onClick={() => setToggle(true)}>
        View Breakdown
      </Button>
      <ModalContainer
        dialogClassName="mt-5"
        header={<h5>Property Balance Breakdown</h5>}
        toggle={toggle}
        onClose={() => setToggle(false)}
        size="lg"
        backdrop="static"
      >
        <Container className="p-3">
          <Row>
            <Col>
              <Typeahead
                ref={ref}
                id="charge-filter-typeahead"
                multiple
                placeholder="select charges to download"
                onChange={setSelectedCharges}
                options={charges?.map(c => c.code) ?? []}
                selected={selectedCharges}
                className="mb-3"
              />
            </Col>
          </Row>
          <Row className="text-right">
            <Col>
              <CSVLink
                data={filteredData}
                filename={'property-balance-by-charge.csv'}
                className="btn btn-primary ml-2"
                target="_blank"
              >
                Download
              </CSVLink>
            </Col>
          </Row>
        </Container>
      </ModalContainer>
    </>
  );
};

export default PropertyBalanceByCharge;
