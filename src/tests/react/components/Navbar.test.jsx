import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../../../react/components/Navbar';

describe('Navbar', () => {
  it('renders all navigation links with correct hrefs', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    const home = screen.getByText('Home');
    const addDepartment = screen.getByText('Add Department');
    const addEmployee = screen.getByText('Add Employee');

    expect(home).toBeDefined();
    expect(home.closest('a').getAttribute('href')).toBe('/');

    expect(addDepartment).toBeDefined();
    expect(addDepartment.closest('a').getAttribute('href')).toBe(
      '/departments/add',
    );

    expect(addEmployee).toBeDefined();
    expect(addEmployee.closest('a').getAttribute('href')).toBe(
      '/employees/add',
    );
  });
});
