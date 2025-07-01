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

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns validation error for empty first name', async () => {
    inputObject.firstName = '';
    const validationResult = await validateEmployee(inputObject);

    expect(validationResult).toEqual({
      valid: false,
      validationErrors: ['First name required'],
    });
  });

  it('returns validation error for invalid first name format', async () => {
    inputObject.firstName = 'John@';
    const validationResult = await validateEmployee(inputObject);

    expect(validationResult).toEqual({
      valid: false,
      validationErrors: expect.arrayContaining([
        expect.stringContaining('can be'),
      ]),
    });
  });

  it('returns validation error for empty last name', async () => {
    inputObject.lastName = '';
    const validationResult = await validateEmployee(inputObject);

    expect(validationResult).toEqual({
      valid: false,
      validationErrors: ['Last name required'],
    });
  });

  it('returns validation error for invalid last name format', async () => {
    inputObject.lastName = 'Doe123';
    const validationResult = await validateEmployee(inputObject);

    expect(validationResult).toEqual({
      valid: false,
      validationErrors: expect.arrayContaining([
        expect.stringContaining('can be'),
      ]),
    });
  });

  it('returns validation error for empty title', async () => {
    inputObject.title = '';
    const validationResult = await validateEmployee(inputObject);

    expect(validationResult).toEqual({
      valid: false,
      validationErrors: ['Job title required'],
    });
  });

  it('returns validation error for invalid title format', async () => {
    inputObject.title = 'Dev@1';
    const validationResult = await validateEmployee(inputObject);

    expect(validationResult).toEqual({
      valid: false,
      validationErrors: expect.arrayContaining([
        expect.stringContaining('can be'),
      ]),
    });
  });

  it('returns validation error for empty email', async () => {
    inputObject.email = '';
    const validationResult = await validateEmployee(inputObject);

    expect(validationResult).toEqual({
      valid: false,
      validationErrors: ['Email address required'],
    });
  });

  it('returns validation error for invalid email format', async () => {
    inputObject.email = 'john.doe@';
    const validationResult = await validateEmployee(inputObject);

    expect(validationResult).toEqual({
      valid: false,
      validationErrors: expect.arrayContaining([
        expect.stringContaining('must contain'),
      ]),
    });
  });

  it('returns validation error for duplicate email', async () => {
    validationHelper.checkForDuplicate.mockResolvedValue('fail');
    const validationResult = await validateEmployee(inputObject);

    expect(validationResult).toEqual({
      valid: false,
      validationErrors: ['Email address taken'],
    });
  });

  it('returns validation error for invalid department ID', async () => {
    inputObject.departmentId = 999;
    const validationResult = await validateEmployee(inputObject);

    expect(validationResult).toEqual({
      valid: false,
      validationErrors: ['Invalid department'],
    });
  });

  it('returns validation error for empty phone number', async () => {
    inputObject.phoneNumber = '';
    const validationResult = await validateEmployee(inputObject);

    expect(validationResult).toEqual({
      valid: false,
      validationErrors: ['Phone number required'],
    });
  });

  it('returns validation error for invalid phone number format', async () => {
    inputObject.phoneNumber = '123';
    const validationResult = await validateEmployee(inputObject);

    expect(validationResult).toEqual({
      valid: false,
      validationErrors: expect.arrayContaining([
        expect.stringContaining('must be'),
      ]),
    });
  });

  it('returns validation error for empty country code', async () => {
    inputObject.countryCode = '';
    const validationResult = await validateEmployee(inputObject);

    expect(validationResult).toEqual({
      valid: false,
      validationErrors: ['Country code required'],
    });
  });

  it('returns validation error for invalid country code format', async () => {
    inputObject.countryCode = 'abc';
    const validationResult = await validateEmployee(inputObject);

    expect(validationResult).toEqual({
      valid: false,
      validationErrors: expect.arrayContaining([
        expect.stringContaining('must be'),
      ]),
    });
  });

  it('returns validation error for invalid isActive status', async () => {
    inputObject.isActive = 2;
    const validationResult = await validateEmployee(inputObject);

    expect(validationResult).toEqual({
      valid: false,
      validationErrors: ['Active status must be true or false'],
    });
  });

  it('returns validation error for empty hire date', async () => {
    inputObject.hireDate = '';
    const validationResult = await validateEmployee(inputObject);

    expect(validationResult).toEqual({
      valid: false,
      validationErrors: ['Hire date required'],
    });
  });

  it('returns error when no changes are detected', async () => {
    const validationResult = await validateEmployee(inputObject, 1);

    expect(validationResult).toEqual({
      valid: false,
      validationErrors: ['No changes detected'],
    });
  });

  it('returns { valid: true } if no validation errors', async () => {
    const validationResult = await validateEmployee(inputObject);

    expect(validationResult.valid).toEqual(true);
  });
});
