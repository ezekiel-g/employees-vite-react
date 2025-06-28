import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import EmployeeTile from '../../../../react/components/employees/EmployeeTile';

const renderComponent = () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route
          path="/"
          element={
            <EmployeeTile
              employee={{
                id: 1,
                first_name: 'John',
                last_name: 'Doe',
              }}
            />
          }
        />
        <Route
          path="/employees/details/:id"
          element={<div>Details Page</div>}
        />
      </Routes>
    </MemoryRouter>,
  );
};

describe('EmployeeTile', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('displays the employee name', () => {
    renderComponent();

    expect(screen.getByText('Doe, John')).toBeDefined();
  });

  it('navigates on name click', async () => {
    renderComponent();

    const nameButtons = screen.getAllByRole('button');

    fireEvent.click(nameButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Details Page')).toBeDefined();
    });
  });
});
