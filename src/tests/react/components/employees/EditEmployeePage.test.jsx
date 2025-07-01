import { vi, afterEach, describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import EditEmployeePage
  from '../../../../react/components/employees/EditEmployeePage';
import fetchFromBackEnd from '../../../../util/fetchFromBackEnd.js';

vi.mock('../../../../util/fetchFromBackEnd.js');
vi.mock('../../../../util/validateEmployee.js', () => ({
  default: vi.fn(() => ({
    valid: true,
    validationErrors: [],
  })),
  getEmployees: vi.fn(
    () => Promise.resolve([
      {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        title: 'Developer',
        department_id: 1,
        email: 'john.doe@example.com',
        country_code: '1',
        phone_number: '1234567890',
        is_active: true,
        hire_date: '2020-01-01',
      },
    ]),
  ),
}));
vi.mock('../../../../util/messageHelper.jsx', () => ({
  default: {
    showSuccesses: vi.fn((messages) => <div>{messages.join(', ')}</div>),
    showErrors: vi.fn((messages) => <div>{messages.join(', ')}</div>),
  },
}));

const renderComponent = () => {
  render(
    <MemoryRouter initialEntries={['/employees/edit/1']}>
      <Routes>
        <Route path="/employees/edit/:id" element={<EditEmployeePage />} />
      </Routes>
    </MemoryRouter>,
  );
};

const originalEmployee = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  title: 'Developer',
  departmentId: 1,
  email: 'john.doe@example.com',
  countryCode: '1',
  phoneNumber: '1234567890',
  isActive: true,
  hireDate: '2020-01-01',
};

const updatedEmployee = {
  firstName: 'Michael',
  lastName: 'Smith',
  title: 'Senior Developer',
  departmentId: 1,
  email: 'michael.smith@example.com',
  countryCode: '1',
  phoneNumber: '9876543210',
  isActive: false,
  hireDate: '2021-05-10',
};

const departments = [{ id: 1, name: 'IT' }];

describe('EditEmployeePage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('submits and shows success message on valid edit', async () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    fetchFromBackEnd
      .mockResolvedValueOnce({ status: 200, data: departments })
      .mockResolvedValueOnce({ status: 200, data: [originalEmployee] })
      .mockResolvedValueOnce({ status: 200, data: {} });

    renderComponent();

    await waitFor(() => {
      expect(fetchFromBackEnd).toHaveBeenCalledTimes(2);
    });

    fireEvent.change(screen.getByLabelText('First name'), {
      target: { value: updatedEmployee.firstName },
    });
    fireEvent.change(screen.getByLabelText('Last name'), {
      target: { value: updatedEmployee.lastName },
    });
    fireEvent.change(screen.getByLabelText('Job title'), {
      target: { value: updatedEmployee.title },
    });
    fireEvent.change(screen.getByLabelText('Department'), {
      target: { value: updatedEmployee.departmentId },
    });
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: updatedEmployee.email },
    });
    fireEvent.change(screen.getByLabelText('Country code for phone number'), {
      target: { value: updatedEmployee.countryCode },
    });
    fireEvent.change(
      screen.getByLabelText('Phone number without country code'),
      {
        target: { value: updatedEmployee.phoneNumber },
      },
    );
    fireEvent.change(screen.getByLabelText('Active status'), {
      target: { value: updatedEmployee.isActive },
    });
    fireEvent.change(screen.getByLabelText('Hire date'), {
      target: { value: updatedEmployee.hireDate },
    });
    fireEvent.click(screen.getAllByText('Submit')[0]);

    await waitFor(() => {
      expect(fetchFromBackEnd).toHaveBeenCalledTimes(3);
    });

    expect(screen.getByText('Employee edited successfully')).toBeDefined();
  });

  it('shows error message on failed API call', async () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    fetchFromBackEnd
      .mockResolvedValueOnce({ status: 200, data: departments })
      .mockResolvedValueOnce({ status: 200, data: [originalEmployee] })
      .mockResolvedValueOnce({ status: 500, data: null });

    renderComponent();

    await waitFor(() => {
      expect(fetchFromBackEnd).toHaveBeenCalledTimes(2);
    });

    fireEvent.change(screen.getByLabelText('First name'), {
      target: { value: updatedEmployee.firstName },
    });
    fireEvent.change(screen.getByLabelText('Last name'), {
      target: { value: updatedEmployee.lastName },
    });
    fireEvent.change(screen.getByLabelText('Job title'), {
      target: { value: updatedEmployee.title },
    });
    fireEvent.change(screen.getByLabelText('Department'), {
      target: { value: updatedEmployee.departmentId },
    });
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: updatedEmployee.email },
    });
    fireEvent.change(screen.getByLabelText('Country code for phone number'), {
      target: { value: updatedEmployee.countryCode },
    });
    fireEvent.change(
      screen.getByLabelText('Phone number without country code'),
      {
        target: { value: updatedEmployee.phoneNumber },
      },
    );
    fireEvent.change(screen.getByLabelText('Active status'), {
      target: { value: updatedEmployee.isActive },
    });
    fireEvent.change(screen.getByLabelText('Hire date'), {
      target: { value: updatedEmployee.hireDate },
    });
    fireEvent.click(screen.getAllByText('Submit')[0]);

    await waitFor(() => {
      expect(fetchFromBackEnd).toHaveBeenCalledTimes(3);
    });

    expect(screen.getByText('Error editing employee')).toBeDefined();
  });
});
