import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import validateDepartment from '../../util/validateDepartment.js';
import validationHelper from '../../util/validationHelper.js';

vi.mock('../../util/validationHelper.js');

describe('validateDepartment', () => {
  const defaultInput = { name: 'IT', code: 'IT1', location: 'New York' };
  const existingDepartments = [
    { id: 1, name: 'IT', code: 'IT1', location: 'New York' },
    { id: 2, name: 'HR', code: 'HR1', location: 'San Francisco' },
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
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns validation error for empty name', async () => {
    inputObject.name = '';
    const validationResult = await validateDepartment(inputObject);

    expect(validationResult).toEqual({
      valid: false,
      validationErrors: ['Name required'],
    });
  });

  it('returns validation error for invalid name format', async () => {
    inputObject.name = 'Name&';
    const validationResult = await validateDepartment(inputObject);

    expect(validationResult).toEqual({
      valid: false,
      validationErrors: expect.arrayContaining([
        expect.stringContaining('can be'),
      ]),
    });
  });

  it('returns validation error for empty code', async () => {
    inputObject.code = '';
    const validationResult = await validateDepartment(inputObject);

    expect(validationResult).toEqual({
      valid: false,
      validationErrors: ['Code required'],
    });
  });

  it('returns validation error for invalid code format', async () => {
    inputObject.code = 'A&';
    const validationResult = await validateDepartment(inputObject);

    expect(validationResult).toEqual({
      valid: false,
      validationErrors: expect.arrayContaining([
        expect.stringContaining('can be'),
      ]),
    });
  });

  it('returns validation error for duplicate code', async () => {
    validationHelper.checkForDuplicate.mockResolvedValue('fail');
    const validationResult = await validateDepartment(inputObject);

    expect(validationResult).toEqual({
      valid: false,
      validationErrors: ['Code taken'],
    });
  });

  it('returns validation error for empty location', async () => {
    inputObject.location = '';
    const validationResult = await validateDepartment(inputObject);

    expect(validationResult).toEqual({
      valid: false,
      validationErrors: ['Location required'],
    });
  });

  it('returns validation error for invalid location', async () => {
    inputObject.location = 'Chicago';
    const validationResult = await validateDepartment(inputObject);

    expect(validationResult).toEqual({
      valid: false,
      validationErrors: expect.arrayContaining([
        expect.stringContaining('Location no'),
      ]),
    });
  });

  it('returns error when no changes are detected', async () => {
    const validationResult = await validateDepartment(inputObject, 1);

    expect(validationResult).toEqual({
      valid: false,
      validationErrors: ['No changes detected'],
    });
  });

  it('returns { valid: true } if no validation errors', async () => {
    const validationResult = await validateDepartment(inputObject);

    expect(validationResult.valid).toEqual(true);
  });
});
