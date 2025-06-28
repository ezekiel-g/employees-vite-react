import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, waitFor, cleanup, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import App from '../../../react/components/App';

describe('App', () => {
  const routes = [
    '/',
    '/departments/details/1',
    '/departments/add',
    '/departments/edit/1',
    '/employees/details/1',
    '/employees/add',
    '/employees/edit/1',
  ];

  const LocationDisplay = () => {
    const location = useLocation();
    return <div data-testid="location-display">{location.pathname}</div>;
  };

  const renderComponent = (route) => {
    render(
      <MemoryRouter initialEntries={[route]}>
        <App />
        <LocationDisplay />
      </MemoryRouter>,
    );
  };

  beforeEach(() => {
    globalThis.fetch = vi.fn(
      () => Promise.resolve({
        status: 200,
        json: () => Promise.resolve([{ id: 1, name: 'Test' }]),
      }),
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  for (let i = 0; i < routes.length; i++) {
    it(`renders successfully and matches route ${routes[i]}`,
      async () => {
        renderComponent(routes[i]);

        await waitFor(() => {
          expect(screen.getByTestId('location-display').textContent).toBe(
            routes[i],
          );
        });
      });
  }

  it('redirects non-existent route to /',
    async () => {
      renderComponent('/some/invalid/path');

      await waitFor(() => {
        expect(screen.getByTestId('location-display').textContent).toBe('/');
      });
    });
});
