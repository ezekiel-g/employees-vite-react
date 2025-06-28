import { vi, afterEach, describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DepartmentTile
  from '../../../../react/components/departments/DepartmentTile';
import fetchFromBackEnd from '../../../../util/fetchFromBackEnd.js';

vi.mock('../../../../util/fetchFromBackEnd.js');
vi.mock('../../../../util/messageHelper.jsx', () => ({
  default: {
    showSuccesses: vi.fn((messages) => <div>{messages.join(', ')}</div>),
    showErrors: vi.fn((messages) => <div>{messages.join(', ')}</div>),
  },
}));
vi.mock('../../../../react/components/employees/EmployeeTile', () => ({
  default: ({ employee }) => (
    <div>
      {employee.last_name}, {employee.first_name}
    </div>
  ),
}));

describe('DepartmentTile', () => {
  const renderComponent = () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={<DepartmentTile department={{ id: 1, name: 'IT' }} />}
          />
          <Route
            path="/departments/details/:id"
            element={<div>Details Page</div>}
          />
        </Routes>
      </MemoryRouter>,
    );
  };

  const employees = [
    {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      department_id: 1,
    },
    {
      id: 2,
      first_name: 'Jane',
      last_name: 'Smith',
      department_id: 1,
    },
    {
      id: 3,
      first_name: 'Alice',
      last_name: 'Williams',
      department_id: 2,
    },
  ];

  afterEach(() => vi.clearAllMocks());

  it('displays sorted employees in the department', async () => {
    fetchFromBackEnd.mockResolvedValueOnce({
      status: 200,
      data: employees,
    });

    renderComponent();

    await waitFor(() => {
      expect(fetchFromBackEnd).toHaveBeenCalled();
    });

    expect(screen.getByText('Doe, John')).toBeDefined();
    expect(screen.getByText('Smith, Jane')).toBeDefined();
    expect(screen.queryByText('Williams, Alice')).toBeNull();
  });

  it('displays error message on fetch failure', async () => {
    fetchFromBackEnd.mockResolvedValueOnce({
      status: 500,
      data: null,
    });

    renderComponent();

    await waitFor(() => {
      expect(fetchFromBackEnd).toHaveBeenCalled();
    });

    expect(screen.getByText('Error loading employees')).toBeDefined();
  });

  it('navigates on department name click', async () => {
    fetchFromBackEnd.mockResolvedValueOnce({
      status: 200,
      data: employees,
    });

    renderComponent();

    await waitFor(() => {
      expect(fetchFromBackEnd).toHaveBeenCalled();
    });

    const buttons = screen.getAllByRole('button');

    fireEvent.click(buttons[0]);

    await waitFor(() => {
      expect(screen.getByText('Details Page')).toBeDefined();
    });
  });
});
