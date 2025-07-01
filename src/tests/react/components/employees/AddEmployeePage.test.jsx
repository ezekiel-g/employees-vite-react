import { vi, afterEach, describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AddEmployeePage
  from '../../../../react/components/employees/AddEmployeePage';
import fetchFromBackEnd from '../../../../util/fetchFromBackEnd.js';

vi.mock('../../../../util/fetchFromBackEnd.js');
vi.mock('../../../../util/validateEmployee.js', () => ({
  default: vi.fn(
    () => Promise.resolve({
      valid: true,
      validationErrors: [],
    }),
  ),
  getDepartments: vi.fn(() => Promise.resolve([{ id: 1, name: 'IT' }])),
}));
vi.mock('../../../../util/messageHelper.jsx', () => ({
  default: {
    showSuccesses: vi.fn((messages) => <div>{messages.join(', ')}</div>),
    showErrors: vi.fn((messages) => <div>{messages.join(', ')}</div>),
  },
}));

describe('AddEmployeePage', () => {
  const renderComponent = () => {
    render(
      <MemoryRouter>
        <AddEmployeePage />
      </MemoryRouter>,
    );
  };

  const employeeInput = {
    firstName: 'Jane',
    lastName: 'Doe',
    title: 'Engineer',
    departmentId: 1,
    email: 'jane.doe@example.com',
    countryCode: '1',
    phoneNumber: '5551234567',
    isActive: true,
    hireDate: '2023-01-01',
  };

  const departmentData = [{ id: 1, name: 'IT' }];

  afterEach(() => vi.clearAllMocks());

  it('submits and shows success message on valid input', async () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

    fetchFromBackEnd
      .mockResolvedValueOnce({ status: 200, data: departmentData })
      .mockResolvedValueOnce({ status: 201, data: {} });

    renderComponent();

    await waitFor(() => {
      expect(fetchFromBackEnd).toHaveBeenCalled();
    });

    fireEvent.change(screen.getByLabelText('First name'), {
      target: { value: employeeInput.firstName },
    });
    fireEvent.change(screen.getByLabelText('Last name'), {
      target: { value: employeeInput.lastName },
    });
    fireEvent.change(screen.getByLabelText('Job title'), {
      target: { value: employeeInput.title },
    });
    fireEvent.change(screen.getByLabelText('Department'), {
      target: { value: employeeInput.departmentId },
    });
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: employeeInput.email },
    });
    fireEvent.change(screen.getByLabelText('Country code for phone number'), {
      target: { value: employeeInput.countryCode },
    });
    fireEvent.change(
      screen.getByLabelText('Phone number without country code'),
      {
        target: { value: employeeInput.phoneNumber },
      },
    );
    fireEvent.change(screen.getByLabelText('Active status'), {
      target: { value: employeeInput.isActive },
    });
    fireEvent.change(screen.getByLabelText('Hire date'), {
      target: { value: employeeInput.hireDate },
    });
    fireEvent.click(screen.getAllByText('Submit')[0]);

    await waitFor(() => {
      expect(fetchFromBackEnd).toHaveBeenCalledTimes(2);
    });

    expect(screen.getByText('Employee added successfully')).toBeDefined();
  });

  it('shows error message on failed API call', async () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

    fetchFromBackEnd
      .mockResolvedValueOnce({ status: 200, data: departmentData })
      .mockResolvedValueOnce({ status: 500, data: null });

    renderComponent();

    await waitFor(() => {
      expect(fetchFromBackEnd).toHaveBeenCalled();
    });

    fireEvent.change(screen.getByLabelText('First name'), {
      target: { value: employeeInput.firstName },
    });
    fireEvent.change(screen.getByLabelText('Last name'), {
      target: { value: employeeInput.lastName },
    });
    fireEvent.change(screen.getByLabelText('Job title'), {
      target: { value: employeeInput.title },
    });
    fireEvent.change(screen.getByLabelText('Department'), {
      target: { value: employeeInput.departmentId },
    });
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: employeeInput.email },
    });
    fireEvent.change(screen.getByLabelText('Country code for phone number'), {
      target: { value: employeeInput.countryCode },
    });
    fireEvent.change(
      screen.getByLabelText('Phone number without country code'),
      {
        target: { value: employeeInput.phoneNumber },
      },
    );
    fireEvent.change(screen.getByLabelText('Active status'), {
      target: { value: employeeInput.activeStatus },
    });
    fireEvent.change(screen.getByLabelText('Hire date'), {
      target: { value: employeeInput.hireDate },
    });
    fireEvent.click(screen.getAllByText('Submit')[0]);

    await waitFor(() => {
      expect(fetchFromBackEnd).toHaveBeenCalledTimes(2);
    });

    expect(screen.getByText('Error adding employee')).toBeDefined();
  });
});
