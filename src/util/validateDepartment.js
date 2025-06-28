import validationHelper from './validationHelper.js';

const validateName = (input, currentValue = null) => {
  if (!input || input.trim() === '') {
    return { valid: false, message: 'Name required' };
  }

  if (!/^[A-Za-z0-9\s\-'.,]{1,100}$/.test(input)) {
    return {
      valid: false,
      message:
        'Name can be maximum 100 characters and can contain ' +
        'only letters, numbers, spaces, hyphens, ' +
        'apostrophes and periods',
    };
  }

  return validationHelper.returnSuccess('Name', input, currentValue);
};

const validateCode = async (
  input,
  currentValue = null,
  excludeId = null,
  skipDuplicateCheck = null,
) => {
  if (!input || input.trim() === '') {
    return { valid: false, message: 'Code required' };
  }

  if (!/^[A-Z0-9]{1,20}$/.test(input)) {
    return {
      valid: false,
      message:
        'Code can be maximum 20 characters and can contain  ' +
        'only numbers and capital letters',
    };
  }

  if (!skipDuplicateCheck) {
    const duplicateCheck = await validationHelper.checkForDuplicate(
      { code: input },
      validationHelper.getDepartments,
      excludeId,
    );

    if (duplicateCheck !== 'pass') {
      return { valid: false, message: 'Code taken' };
    }
  }

  return validationHelper.returnSuccess('Code', input, currentValue);
};

const validateLocation = (input, currentValue = null) => {
  const validLocations = new Set(['New York', 'San Francisco', 'London']);

  if (!input || input === 'Select location...') {
    return { valid: false, message: 'Location required' };
  }

  if (!validLocations.has(input)) {
    return { valid: false, message: 'Location not currently valid' };
  }

  return validationHelper.returnSuccess('Location', input, currentValue);
};

const validateDepartment = async (
  inputObject,
  excludeIdParam = null,
  skipDuplicateCheck = null,
) => {
  const { name, code, location } = inputObject;
  const validationErrors = [];
  const successfulUpdates = [];
  let excludeId = null;
  let currentDetails = null;

  if (excludeIdParam) {
    excludeId = Number(excludeIdParam);
    const departments = await validationHelper.getDepartments();
    currentDetails = departments.find((row) => row.id === excludeId);
  }

  const nameValid = validateName(name, currentDetails?.name);

  if (!nameValid.valid) {
    validationErrors.push(nameValid.message);
  } else {
    if (nameValid.message) successfulUpdates.push(nameValid.message);
  }

  const codeValid = await validateCode(
    code,
    currentDetails?.code,
    excludeId,
    skipDuplicateCheck,
  );

  if (!codeValid.valid) {
    validationErrors.push(codeValid.message);
  } else {
    if (codeValid.message) successfulUpdates.push(codeValid.message);
  }

  const locationValid = validateLocation(location, currentDetails?.location);

  if (!locationValid.valid) {
    validationErrors.push(locationValid.message);
  } else {
    if (locationValid.message) successfulUpdates.push(locationValid.message);
  }

  if (
    excludeId &&
    validationErrors.length === 0 &&
    successfulUpdates.length === 0
  ) {
    validationErrors.push('No changes detected');
  }

  if (validationErrors.length > 0) {
    return { valid: false, validationErrors };
  }

  return { valid: true };
};

export default validateDepartment;
