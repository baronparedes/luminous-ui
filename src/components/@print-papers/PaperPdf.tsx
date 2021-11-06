import React, {PropsWithChildren} from 'react';
import styled from 'styled-components';

const StyledPageSection = styled.div`
  @media all {
    .page-break {
      display: none;
    }
    .no-print {
      display: none;
    }
  }

  @media print {
    .page-break {
      padding-top: 1rem;
      display: block;
      page-break-before: always;
    }
  }
  @page {
    size: A4;
  }
`;

type PageSectionProps = {
  hasPageBreak?: boolean;
  className?: string;
};

export function PageSection({
  children,
  hasPageBreak,
  className,
}: PropsWithChildren<PageSectionProps>) {
  return (
    <StyledPageSection className={className}>
      {children}
      {hasPageBreak && <PageBreak />}
    </StyledPageSection>
  );
}

export const PageBreak = () => <div className="page-break" />;

export const PrintPaper = React.forwardRef<
  HTMLDivElement,
  PropsWithChildren<{}>
>((props, ref) => <div ref={ref}>{props.children}</div>);
