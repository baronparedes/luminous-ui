import {render} from '@testing-library/react';

import Footer from '../Footer';

// Mock the version module
jest.mock('../../../version', () => ({
  VERSION: '1.2.3',
  BUILD_DATE: '2025-08-03T12:00:00.000Z',
}));

describe('Footer', () => {
  it('should render copyright with current year', () => {
    const {getByText} = render(<Footer />);

    expect(
      getByText('© 2025 Luminous. All rights reserved.')
    ).toBeInTheDocument();
  });

  it('should render version information', () => {
    const {getByText} = render(<Footer />);

    expect(getByText('Version 1.2.3')).toBeInTheDocument();
  });

  it('should apply correct footer styling', () => {
    const {getByRole} = render(<Footer />);

    const footer = getByRole('contentinfo');
    expect(footer).toHaveStyle({
      'text-align': 'center',
      'font-size': '0.875rem',
    });
  });

  it('should have proper semantic HTML structure', () => {
    const {getByRole} = render(<Footer />);

    const footer = getByRole('contentinfo');
    expect(footer.tagName).toBe('FOOTER');
  });

  it('should display copyright and version', () => {
    const {getByRole} = render(<Footer />);

    const footer = getByRole('contentinfo');

    expect(footer).toHaveTextContent('© 2025 Luminous. All rights reserved.');
    expect(footer).toHaveTextContent('Version 1.2.3');
  });

  it('should use responsive layout', () => {
    const {getByRole} = render(<Footer />);

    const footer = getByRole('contentinfo');
    const container = footer.querySelector('.container');

    expect(container).toBeInTheDocument();
  });
});
