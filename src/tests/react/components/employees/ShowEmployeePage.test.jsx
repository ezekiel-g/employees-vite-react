import { vi, afterEach, describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ShowEmployeePage
  from '../../../../react/components/employees/ShowEmployeePage';
import fetchFromBackEnd from '../../../../util/fetchFromBackEnd.js';

vi.mock('../../../../util/fetchFromBackEnd.js');

describe('ShowEmployeePage', () => {
  const employeeData = [
    {
      id: 1,
      first_name: 'Alice',
      last_name: 'Smith',
      title: 'Manager',
      department_id: 1,
      email: 'alice.smith@example.com',
      country_code: '1',
      phone_number: '5551234567',
      is_active: 1,
      hire_date: '2024-05-01T00:00:00',
      created_at: '2025-06-10T01:26:09',
      updated_at: '2025-06-10T01:26:09',
    },
  ];

  const departmentData = [{ id: 2, name: 'IT' }];

  const renderComponent = () => {
    render(
      <MemoryRouter initialEntries={['/employees/1']}>
        <Routes>
          <Route path="/employees/:id" element={<ShowEmployeePage />} />
        </Routes>
      </MemoryRouter>,
    );
  };

  afterEach(() => vi.clearAllMocks());

  it('renders employee details on successful fetch', async () => {
    fetchFromBackEnd
      .mockResolvedValueOnce({ status: 200, data: employeeData })
      .mockResolvedValueOnce({ status: 200, data: departmentData });

    renderComponent();

    await waitFor(() => {
      expect(fetchFromBackEnd).toHaveBeenCalledTimes(2);
    });

    expect(screen.getAllByText('Smith, Alice').length).toBeGreaterThan(0);
    expect(screen.getByText('Alice')).toBeDefined();
    expect(screen.getByText('Smith')).toBeDefined();
    expect(screen.getByText('Manager')).toBeDefined();
    expect(screen.getByText('IT')).toBeDefined();
    expect(screen.getByText('alice.smith@example.com')).toBeDefined();
    expect(screen.getByText('15551234567')).toBeDefined();
    expect(screen.getByText('Yes')).toBeDefined();
    expect(screen.getByText('2024-05-01')).toBeDefined();
  });

  it('displays error message on employee fetch failure', async () => {
    fetchFromBackEnd.mockResolvedValue({ status: 500, data: null });

    renderComponent();

    await waitFor(() => {
      expect(fetchFromBackEnd).toHaveBeenCalled();
    });

    const errors = screen.getAllByText('Error loading employee');

    expect(errors.length).toBeGreaterThan(0);
  });
});
