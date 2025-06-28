import { vi, afterEach, describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ShowDepartmentPage
  from '../../../../react/components/departments/ShowDepartmentPage';
import fetchFromBackEnd from '../../../../util/fetchFromBackEnd.js';

vi.mock('../../../../util/fetchFromBackEnd.js');

describe('ShowDepartmentPage', () => {
  const departmentData = [
    {
      id: 1,
      name: 'IT',
      code: 'IT1',
      location: 'New York',
      created_at: '2023-01-01T12:00:00Z',
      updated_at: '2023-06-01T15:00:00Z',
    },
  ];

  const renderComponent = () => {
    render(
      <MemoryRouter initialEntries={['/departments/1']}>
        <Routes>
          <Route path="/departments/:id" element={<ShowDepartmentPage />} />
        </Routes>
      </MemoryRouter>,
    );
  };

  afterEach(() => vi.clearAllMocks());

  it('renders department details on successful fetch', async () => {
    fetchFromBackEnd.mockResolvedValue({
      status: 200,
      data: departmentData,
    });

    renderComponent();

    await waitFor(() => {
      expect(fetchFromBackEnd).toHaveBeenCalled();
    });

    expect(screen.getByText('ID')).toBeDefined();
    expect(screen.getAllByText('IT').length).toBeGreaterThan(0);
    expect(screen.getByText('IT1')).toBeDefined();
    expect(screen.getByText('New York')).toBeDefined();
  });

  it('displays error message on fetch failure', async () => {
    fetchFromBackEnd.mockResolvedValue({
      status: 500,
      data: null,
    });

    renderComponent();

    await waitFor(() => {
      expect(fetchFromBackEnd).toHaveBeenCalled();
    });

    const errors = screen.getAllByText('Error loading department');

    expect(errors.length).toBeGreaterThan(0);
  });
});
