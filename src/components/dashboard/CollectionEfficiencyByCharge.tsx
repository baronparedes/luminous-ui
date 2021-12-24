import {Accordion, Card} from 'react-bootstrap';

import {ChargeAttr, CollectionEfficiencyView} from '../../Api';
import RoundedPanel from '../@ui/RoundedPanel';
import CollectionEfficiency from './CollectionEfficiency';

type Props = {
  data: CollectionEfficiencyView[];
  charges: ChargeAttr[] | null;
};

const CollectionEfficiencyByCharge = ({data, charges}: Props) => {
  return (
    <>
      <RoundedPanel className="p-3 text-center">
        <Accordion defaultActiveKey="0">
          {charges &&
            charges.map((charge, i) => {
              return (
                <Card key={i}>
                  <Accordion.Toggle
                    as={Card.Header}
                    eventKey={i.toString()}
                    className="text-left"
                  >
                    <strong>{charge.code}</strong>
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey={i.toString()}>
                    <Card.Body>
                      <CollectionEfficiency
                        data={data}
                        filterByChargeCode={charge.code}
                      />
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              );
            })}
        </Accordion>
      </RoundedPanel>
    </>
  );
};

export default CollectionEfficiencyByCharge;
