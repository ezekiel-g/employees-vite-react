import { vi, afterEach, describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MainPage from '../../../react/components/MainPage';
import fetchFromBackEnd from '../../../util/fetchFromBackEnd.js';

vi.mock('../../../util/fetchFromBackEnd.js');

describe('MainPage', () => {
  const renderComponent = () => {
    render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>,
    );
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders departments on successful fetch', async () => {
    fetchFromBackEnd.mockResolvedValue({
      status: 200,
      data: [
        { id: 1, name: 'Dept 1' },
        { id: 2, name: 'Dept 2' },
      ],
    });

    renderComponent();

    await waitFor(() => {
      expect(fetchFromBackEnd).toHaveBeenCalled();
    });

    expect(screen.getByText('Dept 1')).toBeDefined();
    expect(screen.getByText('Dept 2')).toBeDefined();
  });

  it('displays error message on fetch failure', async () => {
    fetchFromBackEnd.mockResolvedValue({
      status: 500,
      data: null,
    });

    renderComponent();

    await waitFor(() => expect(fetchFromBackEnd).toHaveBeenCalled());

    const errorElements = screen.getAllByText('Error loading employees');

    expect(errorElements.length).toBeGreaterThan(0);
  });
});
