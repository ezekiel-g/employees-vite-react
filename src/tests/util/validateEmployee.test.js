import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import validateEmployee from '../../util/validateEmployee.js';
import validationHelper from '../../util/validationHelper.js';

vi.mock('../../util/validationHelper.js');

describe('validateEmployee', () => {
  const defaultInput = {
    firstName: 'John',
    lastName: 'Doe',
    title: 'Developer',
    email: 'john.doe@example.com',
    countryCode: '1',
    phoneNumber: '1234567890',
    isActive: true,
    departmentId: 1,
    hireDate: '2023-01-01',
  };

  const existingDepartments = [
    { id: 1, name: 'IT', code: 'IT1', location: 'New York' },
    { id: 2, name: 'HR', code: 'HR1', location: 'San Francisco' },
  ];

  const existingEmployees = [
    {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      title: 'Developer',
      email: 'john.doe@example.com',
      country_code: '1',
      phone_number: '1234567890',
      is_active: true,
      department_id: 1,
      hire_date: '2023-01-01',
    },
    {
      id: 2,
      first_name: 'Jane',
      last_name: 'Smith',
      title: 'Manager',
      email: 'jane.smith@example.com',
      country_code: '44',
      phone_number: '9876543210',
      is_active: true,
      department_id: 2,
      hire_date: '2022-06-15',
    },
  ];

  let inputObject;

  const shouldFail = async (field, badValues = []) => {
    for (let i = 0; i < badValues.length; i++) {
      inputObject[field] = badValues[i];
      const validationResult = await validateEmployee(inputObject);

      expect(validationResult.valid).toBe(false);
    }
  };

  beforeEach(() => {
    inputObject = Object.assign({}, defaultInput);
    validationHelper.checkForDuplicate.mockResolvedValue('pass');
    validationHelper.returnSuccess.mockReturnValue({
      valid: true,
      message: '',
    });
    vi.spyOn(validationHelper, 'getDepartments').mockResolvedValue(
      existingDepartments,
    );
    vi.spyOn(validationHelper, 'getEmployees').mockResolvedValue(
      existingEmployees,
    );
  });

  afterEach(() =>  vi.clearAllMocks());

  it('returns { valid: true } if no validation errors', async () => {
    const validationResult = await validateEmployee(inputObject);

    expect(validationResult.valid).toEqual(true);
  });

  it('validates first name format', async () => {
    await shouldFail('firstName', [
      'Mich&el',
      'Mich@el',
      'M'.repeat(101),
      '',
      null,
    ]);
  });

  it('validates last name format', async () => {
    await shouldFail('lastName', [
      'Smith%',
      'Smith#',
      'S'.repeat(101),
      '',
      null,
    ]);
  });

  it('validates title format', async () => {
    await shouldFail('title', [
      'Manager*',
      'Manager^',
      'M'.repeat(101),
      '',
      null,
    ]);
  });

  it('validates email format', async () => {
    await shouldFail('email', [
      'michael.smith&example.com',
      'michael.smith@examplecom',
      'michael&smith@example.com',
      '',
      null,
    ]);
  });

  it('validates email uniqueness', async () => {
    validationHelper.checkForDuplicate.mockResolvedValue('fail');
    const validationResult = await validateEmployee(inputObject);

    expect(validationResult).toEqual({
      valid: false,
      validationErrors: ['Email address taken'],
    });
  });

  it('validates country code format correctly', async () => {
    await shouldFail('countryCode', ['+1', '}', '11111', '', null]);
  });

  it('validates phone number format correctly', async () => {
    await shouldFail('phoneNumber', [
      '1111',
      '}',
      '1'.repeat(16),
      '',
      null,
    ]);
  });

  it('validates active status correctly', async () => {
    await shouldFail('isActive', ['true', 'false', 1, 0, '', null]);
  });

  it('validates hire date correctly', async () => {
    await shouldFail('hireDate', ['', null]);
  });

  it('returns error when no changes are detected', async () => {
    const validationResult = await validateEmployee(inputObject, 1);

    expect(validationResult).toEqual({
      valid: false,
      validationErrors: ['No changes detected'],
    });
  });
});
