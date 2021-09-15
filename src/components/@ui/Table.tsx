import React, {ReactNode} from 'react';
import {Table as RBTable} from 'react-bootstrap';
import styled from 'styled-components';

import Loading from './Loading';

const TableContentHeader = styled('div')`
  color: white;
  padding: 1em;
`;

const TableContent = styled('div')`
  padding: 1em;
`;

type TableProps = {
  loading?: boolean;
  headers: ReactNode[];
  renderHeaderContent: ReactNode;
  renderFooterContent?: ReactNode;
};
export const Table: React.FC<TableProps> = ({
  children,
  headers,
  loading,
  renderHeaderContent,
  renderFooterContent,
}) => {
  return (
    <>
      <TableContentHeader className="bg-primary">
        {renderHeaderContent}
      </TableContentHeader>
      <TableContent>
        {loading && <Loading />}
        {!loading && (
          <RBTable responsive hover role="table">
            <thead>
              <tr>
                {headers.map((header, i) => {
                  return <th key={i}>{header}</th>;
                })}
              </tr>
            </thead>
            {children}
          </RBTable>
        )}
      </TableContent>
      {renderFooterContent}
    </>
  );
};
