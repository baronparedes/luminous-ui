import {useState} from 'react';
import {Button, ButtonProps, Form} from 'react-bootstrap';
import {Controller, useForm} from 'react-hook-form';

import {useRejectPurchaseOrder} from '../../../Api';
import ErrorInfo from '../../@ui/ErrorInfo';
import ModalContainer from '../../@ui/ModalContainer';
import {validateNotEmpty} from '../../@validation';

type Props = {
  purchaseOrderId: number;
  buttonLabel: React.ReactNode;
  onRejectPurchaseOrder?: () => void;
};

type FormData = {
  comments: string;
};

const RejectPurchaseOrder = ({
  buttonLabel,
  purchaseOrderId,
  onRejectPurchaseOrder,
  ...buttonProps
}: Props & ButtonProps) => {
  const [toggle, setToggle] = useState(false);
  const {handleSubmit, control, formState} = useForm<FormData>({
    defaultValues: {
      comments: '',
    },
  });
  const {mutate, loading, error} = useRejectPurchaseOrder({});

  const onSubmit = (formData: FormData) => {
    if (confirm('Proceed?')) {
      mutate({
        comments: formData.comments,
        id: purchaseOrderId,
      }).then(() => {
        setToggle(false);
        onRejectPurchaseOrder && onRejectPurchaseOrder();
      });
    }
  };

  return (
    <>
      <Button {...buttonProps} onClick={() => setToggle(true)}>
        {buttonLabel}
      </Button>
      <ModalContainer
        header={<h5>Reject PO-{purchaseOrderId}</h5>}
        toggle={toggle}
        onClose={() => setToggle(false)}
      >
        <Form onSubmit={handleSubmit(onSubmit)} role="form">
          <Form.Group className="mb-3" controlId="form-comments">
            <Controller
              name="comments"
              control={control}
              rules={{
                validate: validateNotEmpty,
              }}
              render={({field}) => (
                <Form.Control
                  {...field}
                  as="textarea"
                  rows={5}
                  required
                  placeholder="comments"
                  isInvalid={formState.errors.comments !== undefined}
                />
              )}
            />
            <Form.Control.Feedback type="invalid" className="text-right">
              {formState.errors.comments?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="text-right">
            <Button variant="danger" type="submit" disabled={loading}>
              reject
            </Button>
          </div>
        </Form>
        {error && <ErrorInfo>{error.message}</ErrorInfo>}
      </ModalContainer>
    </>
  );
};

export default RejectPurchaseOrder;
