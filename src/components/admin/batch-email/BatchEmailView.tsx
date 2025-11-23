import React from 'react';
import {Col, Container, Row, Table} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import routes from '../../../@utils/routes';
import {
  EmailBatchAttr,
  Period,
  useCreateBatch,
  useGetAllBatches,
} from '../../../Api';
import {useUrl} from '../../../hooks';
import ErrorInfo from '../../@ui/ErrorInfo';
import Loading from '../../@ui/Loading';
import RoundedPanel from '../../@ui/RoundedPanel';
import SelectPeriod from '../../@ui/SelectPeriod';
import BatchEmailDetail from './BatchEmailDetail';

const BatchEmailView = () => {
  const {id} = useUrl();

  const {data: batches, loading, error, refetch} = useGetAllBatches({});
  const {mutate, loading: creating, error: createError} = useCreateBatch({});

  const handleOnSelect = (period: Period) => {
    if (confirm('Create email batch for this period?')) {
      mutate({
        year: period.year,
        month: period.month,
      }).then(() => {
        refetch();
      });
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'info';
      case 'failed':
        return 'danger';
      case 'cancelled':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  if (id) {
    return <BatchEmailDetail batchId={id} onBack={refetch} />;
  }

  return (
    <Container>
      <RoundedPanel className="p-4">
        <h5 className="pl-2">
          Create Email Batch for Statement of Accounts for the period of
        </h5>
        <SelectPeriod
          onPeriodSelect={handleOnSelect}
          buttonLabel="create batch"
          disabled={creating || loading}
        />
      </RoundedPanel>
      {creating && <Loading />}
      {createError && <ErrorInfo>{createError.message}</ErrorInfo>}
      {batches && batches.length > 0 && (
        <RoundedPanel className="p-3 mt-2">
          <Container>
            <Row>
              <Col>
                <h5>Email Batches</h5>
              </Col>
            </Row>
            <Row>
              <Col>
                {loading && <Loading />}
                {error && <ErrorInfo>{error.message}</ErrorInfo>}

                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Batch Name</th>
                      <th>Status</th>
                      <th>Progress</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batches.map((batch: EmailBatchAttr) => (
                      <tr key={batch.id}>
                        <td>{batch.batchName}</td>
                        <td>
                          <span
                            className={`badge badge-${getStatusVariant(
                              batch.status
                            )}`}
                          >
                            {batch.status}
                          </span>
                        </td>
                        <td>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{
                                width: `${
                                  (batch.sentCount / batch.totalProperties) *
                                  100
                                }%`,
                              }}
                              aria-valuenow={batch.sentCount}
                              aria-valuemin={0}
                              aria-valuemax={batch.totalProperties}
                            >
                              {batch.sentCount} / {batch.totalProperties}
                            </div>
                          </div>
                          {batch.failedCount > 0 && (
                            <small className="text-danger">
                              {batch.failedCount} failed
                            </small>
                          )}
                        </td>
                        <td>
                          {batch.createdAt &&
                            new Date(batch.createdAt).toLocaleString()}
                        </td>
                        <td>
                          <Link
                            to={`${routes.ADMIN_BATCH_EMAIL}/${batch.id}`}
                            className="btn btn-sm btn-primary"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Container>
        </RoundedPanel>
      )}
      {batches && batches.length === 0 && !loading && (
        <RoundedPanel className="p-3 mt-2">
          <p className="text-muted">
            No email batches found. Create one using the form above.
          </p>
        </RoundedPanel>
      )}
    </Container>
  );
};

export default BatchEmailView;
