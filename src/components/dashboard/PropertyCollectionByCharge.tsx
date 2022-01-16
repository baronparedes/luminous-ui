import {createRef, useEffect, useState} from 'react';
import {Button, Col, Container, Row} from 'react-bootstrap';
import {Typeahead} from 'react-bootstrap-typeahead';
import {CSVLink} from 'react-csv';

import {Month, PropertyCollectionByChargeView} from '../../Api';
import ModalContainer from '../@ui/ModalContainer';

type Props = {
  data: PropertyCollectionByChargeView[];
  selectedYear: number;
  selectedMonth: Month;
};

const PropertyCollectionByCharge = ({
  data,
  selectedYear,
  selectedMonth,
}: Props) => {
  const ref = createRef<Typeahead<string>>();
  const charges = [...new Set(data.map(d => d.chargeCode))];
  const [selectedCharges, setSelectedCharges] = useState([...charges]);
  const [toggle, setToggle] = useState(false);
  const [filteredData, setFilteredData] = useState<
    PropertyCollectionByChargeView[]
  >([]);

  useEffect(() => {
    setFilteredData(data.filter(d => selectedCharges.includes(d.chargeCode)));
  }, [selectedCharges]);

  return (
    <>
      <Button
        size="sm"
        variant="warning"
        className="ml-2 d-print-none"
        onClick={() => setToggle(true)}
      >
        View Breakdown
      </Button>
      <ModalContainer
        dialogClassName="mt-5"
        header={<h5>Property Collection Breakdown</h5>}
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
                options={charges}
                selected={selectedCharges}
                className="mb-3"
              />
            </Col>
          </Row>
          {filteredData.length > 0 && (
            <Row className="text-right">
              <Col>
                <CSVLink
                  data={filteredData}
                  filename={`property-collection-by-charge-${selectedYear}-${selectedMonth}.csv`}
                  className="btn btn-primary ml-2"
                  target="_blank"
                >
                  Download
                </CSVLink>
              </Col>
            </Row>
          )}
        </Container>
      </ModalContainer>
    </>
  );
};

export default PropertyCollectionByCharge;
