import React from 'react';
import {Button, Col, Container, Row, Table} from 'react-bootstrap';
import {useHistory} from 'react-router-dom';
import routes from '../../../@utils/routes';
import {
  EmailBatchLogAttr,
  useCancelBatch,
  useDeleteBatch,
  useGetBatch,
  useProcessBatch,
  useRetryFailed,
} from '../../../Api';
import ErrorInfo from '../../@ui/ErrorInfo';
import Loading from '../../@ui/Loading';
import RoundedPanel from '../../@ui/RoundedPanel';

type Props = {
  batchId: number;
  onBack: () => void;
};

const BatchEmailDetail: React.FC<Props> = ({batchId, onBack}) => {
  const history = useHistory();
  const {data: batch, loading, error, refetch} = useGetBatch({batchId});
  const {mutate: processBatch, loading: processing} = useProcessBatch({
    batchId,
  });
  const {mutate: retryFailed, loading: retrying} = useRetryFailed({
    batchId,
  });
  const {mutate: cancelBatch, loading: cancelling} = useCancelBatch({batchId});
  const {mutate: deleteBatch, loading: deleting} = useDeleteBatch({batchId});

  const handleProcess = async () => {
    if (confirm('Start sending emails?')) {
      try {
        await processBatch();
        refetch();
      } catch (err) {
        console.error('Failed to process batch:', err);
      }
    }
  };

  const handleRetry = async () => {
    if (confirm('Retry all failed emails?')) {
      try {
        await retryFailed();
        refetch();
      } catch (err) {
        console.error('Failed to retry emails:', err);
      }
    }
  };

  const handleCancel = async () => {
    if (confirm('Cancel this batch? This cannot be undone.')) {
      try {
        await cancelBatch();
        refetch();
      } catch (err) {
        console.error('Failed to cancel batch:', err);
      }
    }
  };

  const handleDelete = async () => {
    if (
      confirm(
        'Delete this batch? This will permanently remove the batch and all logs.'
      )
    ) {
      try {
        await deleteBatch();
        onBack();
        history.push(routes.ADMIN_BATCH_EMAIL);
      } catch (err) {
        console.error('Failed to delete batch:', err);
      }
    }
  };

  const handleBack = () => {
    onBack();
    history.push(routes.ADMIN_BATCH_EMAIL);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorInfo>{error.message}</ErrorInfo>;
  if (!batch) return <ErrorInfo>Batch not found</ErrorInfo>;

  const canProcess =
    batch.status === 'pending' || batch.status === 'in_progress';
  const canRetry = batch.status === 'in_progress' && batch.failedCount > 0;
  const canCancel = batch.status === 'in_progress';
  const canDelete = batch.status !== 'in_progress';

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'sent':
        return 'success';
      case 'failed':
        return 'danger';
      case 'skipped':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  return (
    <Container>
      <RoundedPanel className="p-3 mt-2">
        <Container>
          <Row>
            <Col>
              <h3>{batch.batchName}</h3>
            </Col>
            <Col className="text-right">
              <Button onClick={handleBack}>Back to List</Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <h5>Batch Summary</h5>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={3}>
              <strong>Period:</strong> {batch.periodMonth} {batch.periodYear}
            </Col>
            <Col md={3}>
              <strong>Status:</strong>{' '}
              <span className={`badge badge-${getStatusVariant(batch.status)}`}>
                {batch.status}
              </span>
            </Col>
            <Col md={3}>
              <strong>Total Properties:</strong> {batch.totalProperties}
            </Col>
            <Col md={3}>
              <strong>Created:</strong>{' '}
              {batch.createdAt && new Date(batch.createdAt).toLocaleString()}
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={4}>
              <strong>Sent:</strong> {batch.sentCount}
            </Col>
            <Col md={4}>
              <strong>Failed:</strong>{' '}
              <span className="text-danger">{batch.failedCount}</span>
            </Col>
            <Col md={4}>
              <strong>Remaining:</strong>{' '}
              {batch.totalProperties - batch.sentCount - batch.failedCount}
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <div className="progress">
                <div
                  className="progress-bar bg-success"
                  style={{
                    width: `${
                      (batch.sentCount / batch.totalProperties) * 100
                    }%`,
                  }}
                >
                  {batch.sentCount}
                </div>
                <div
                  className="progress-bar bg-danger"
                  style={{
                    width: `${
                      (batch.failedCount / batch.totalProperties) * 100
                    }%`,
                  }}
                >
                  {batch.failedCount}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </RoundedPanel>

      <RoundedPanel className="p-3 mt-2">
        <Container>
          <Row>
            <Col>
              <h5>Actions</h5>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={3}>
              <Button
                variant="primary"
                onClick={handleProcess}
                disabled={!canProcess || processing}
                className="w-100"
              >
                {processing
                  ? 'Sending...'
                  : batch.sentCount === 0
                  ? 'Start Sending'
                  : 'Continue Sending'}
              </Button>
            </Col>
            <Col md={3}>
              <Button
                variant="warning"
                onClick={handleRetry}
                disabled={!canRetry || retrying}
                className="w-100"
              >
                {retrying ? 'Retrying...' : 'Retry Failed'}
              </Button>
            </Col>
            <Col md={3}>
              <Button
                variant="secondary"
                onClick={handleCancel}
                disabled={!canCancel || cancelling}
                className="w-100"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Batch'}
              </Button>
            </Col>
            <Col md={3}>
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={!canDelete || deleting}
                className="w-100"
              >
                {deleting ? 'Deleting...' : 'Delete Batch'}
              </Button>
            </Col>
          </Row>
        </Container>
      </RoundedPanel>

      <RoundedPanel className="p-3 mt-2">
        <Container>
          <Row>
            <Col>
              <h5>Email Logs</h5>
            </Col>
          </Row>
          <Row>
            <Col>
              {batch.logs && batch.logs.length > 0 ? (
                <Table striped bordered hover responsive size="sm">
                  <thead>
                    <tr>
                      <th>Property ID</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Sent At</th>
                      <th>Error Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batch.logs.map((log: EmailBatchLogAttr) => (
                      <tr key={log.id}>
                        <td>{log.propertyId}</td>
                        <td>{log.email}</td>
                        <td>
                          <span
                            className={`badge badge-${getStatusVariant(
                              log.status
                            )}`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td>
                          {log.sentAt && new Date(log.sentAt).toLocaleString()}
                        </td>
                        <td>
                          {log.errorMessage && (
                            <small className="text-danger">
                              {log.errorMessage}
                            </small>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted">No email logs yet.</p>
              )}
            </Col>
          </Row>
        </Container>
      </RoundedPanel>
    </Container>
  );
};

export default BatchEmailDetail;
