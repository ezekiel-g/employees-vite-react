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

  const shouldFail = async (field, badValues = []) => {
    for (let i = 0; i < badValues.length; i++) {
      inputObject[field] = badValues[i];
      const validationResult = await validateDepartment(inputObject);

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
  });

  afterEach(() => vi.clearAllMocks());

  it('returns { valid: true } if no validation errors', async () => {
    const validationResult = await validateDepartment(inputObject);

    expect(validationResult.valid).toEqual(true);
  });

  it('validates name format', async () => {
    await shouldFail('name', ['IT&', '}', 'I'.repeat(101), '', null]);
  });

  it('validates code format', async () => {
    await shouldFail('code', ['it', 'IT@', 'I'.repeat(21), '', null]);
  });

  it('validates code uniqueness', async () => {
    validationHelper.checkForDuplicate.mockResolvedValue('fail');
    const validationResult = await validateDepartment(inputObject);

    expect(validationResult).toEqual({
      valid: false,
      validationErrors: ['Code taken'],
    });
  });

  it('validates location', async () => {
    await shouldFail('location', ['Chicago', 'Ur', '', null]);
  });

  it('returns error when no changes are detected', async () => {
    const validationResult = await validateDepartment(inputObject, 1);

    expect(validationResult).toEqual({
      valid: false,
      validationErrors: ['No changes detected'],
    });
  });
});
