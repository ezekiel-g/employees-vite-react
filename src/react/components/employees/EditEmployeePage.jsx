import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import fetchFromBackEnd from '../../../util/fetchFromBackEnd.js';
import validateEmployee from '../../../util/validateEmployee.js';
import messageHelper from '../../../util/messageHelper.jsx';

const EditEmployeePage = () => {
  const [employee, setEmployee] = useState({});
  const [departments, setDepartments] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [title, setTitle] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [hireDate, setHireDate] = useState('');
  const [successMessages, setSuccessMessages] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const backEndUrl = import.meta.env.VITE_BACK_END_URL;

  const editEmployee = async (event) => {
    event.preventDefault();
    window.scrollTo(0, 0);
    setSuccessMessages([]);
    setErrorMessages([]);

    const validationResult = await validateEmployee(
      {
        firstName,
        lastName,
        title,
        departmentId,
        email,
        countryCode,
        phoneNumber,
        isActive,
        hireDate,
      },
      id,
    );

    if (!validationResult.valid) {
      setErrorMessages(validationResult.validationErrors);
      return;
    }

    if (
      !window.confirm(`Edit ${employee.last_name}, ${employee.first_name}?`)
    ) {
      return;
    }

    const fetchResult = await fetchFromBackEnd(
      `${backEndUrl}/api/v1/employees/${employee.id}`,
      'PATCH',
      'application/json',
      'same-origin',
      {
        first_name: firstName,
        last_name: lastName,
        title,
        department_id: departmentId,
        email,
        country_code: countryCode,
        phone_number: phoneNumber,
        is_active: isActive,
        hire_date: hireDate,
      },
    );

    if (fetchResult.status >= 200 && fetchResult.status < 300) {
      setSuccessMessages(['Employee edited successfully']);
      return;
    }

    setErrorMessages(fetchResult.data || ['Error editing employee']);
  };

  const getDepartments = useCallback(async () => {
    const fetchResult = await fetchFromBackEnd(
      `${backEndUrl}/api/v1/departments`,
    );

    if (fetchResult.status >= 200 && fetchResult.status < 300) {
      setDepartments(fetchResult.data);
      return;
    }

    setErrorMessages(['Error loading departments']);
  }, [backEndUrl]);

  const getEmployee = useCallback(async () => {
    const fetchResult = await fetchFromBackEnd(
      `${backEndUrl}/api/v1/employees/${id}`,
    );

    if (fetchResult.status >= 200 && fetchResult.status < 300) {
      setEmployee(fetchResult.data[0]);
      setFirstName(fetchResult.data[0]?.first_name);
      setLastName(fetchResult.data[0]?.last_name);
      setTitle(fetchResult.data[0]?.title);
      setDepartmentId(fetchResult.data[0]?.department_id);
      setEmail(fetchResult.data[0]?.email);
      setCountryCode(fetchResult.data[0]?.country_code);
      setPhoneNumber(fetchResult.data[0]?.phone_number);
      setIsActive(fetchResult.data[0]?.is_active);

      const fetchedHireDate = fetchResult.data[0]?.hire_date;

      if (fetchedHireDate && !isNaN(new Date(fetchedHireDate))) {
        setHireDate(new Date(fetchedHireDate).toISOString().split('T')[0]);
      } else {
        setHireDate('');
      }

      return;
    }

    setErrorMessages(['Error loading employee']);
  }, [backEndUrl, id]);

  useEffect(() => {
    setSuccessMessages([]);
    setErrorMessages([]);
    getDepartments();
    getEmployee();
  }, [getEmployee, getDepartments]);

  const successMessageDisplay = messageHelper.showSuccesses(successMessages);
  const errorMessageDisplay = messageHelper.showErrors(errorMessages);

  const departmentOptions = departments.map((department) => {
    return (
      <option key={department.id} value={department.id}>
        {department.name}
      </option>
    );
  });

  return (
    <div className="container col-md-10 offset-md-1 my-4">
      {successMessageDisplay}
      {errorMessageDisplay}
      <h2>
        Edit {employee.last_name}, {employee.first_name}
      </h2>

      <br />
      <form onSubmit={editEmployee}>
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">
            First name
          </label>
          <input
            type="text"
            className="form-control rounded-0"
            id="firstName"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">
            Last name
          </label>
          <input
            type="text"
            className="form-control rounded-0"
            id="lastName"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Job title
          </label>
          <input
            type="text"
            className="form-control rounded-0"
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="departmentId" className="form-label">
            Department
          </label>
          <select
            className="form-control rounded-0"
            id="departmentId"
            value={departmentId}
            onChange={(event) => {
              setDepartmentId(
                event.target.value === ''
                  ? ''
                  : parseInt(event.target.value, 10),
              );
            }}
          >
            <option value="">Select department...</option>
            {departmentOptions}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="text"
            className="form-control rounded-0"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="countryCode" className="form-label">
            Country code for phone number
          </label>
          <input
            type="text"
            className="form-control rounded-0"
            id="countryCode"
            value={countryCode}
            onChange={(event) => setCountryCode(event.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="phoneNumber" className="form-label">
            Phone number without country code
          </label>
          <input
            type="text"
            className="form-control rounded-0"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="isActive" className="form-label">
            Active status
          </label>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input rounded-0"
              id="isActive"
              checked={isActive === true}
              onChange={
                (event) => setIsActive(event.target.checked ? true : false)
              }
            />
            <label className="form-check-label" htmlFor="isActive">
              Active
            </label>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="hireDate" className="form-label">
            Hire date
          </label>
          <input
            type="date"
            className="form-control rounded-0"
            id="hireDate"
            value={hireDate}
            onChange={(event) => setHireDate(event.target.value)}
          />
        </div>

        <br />
        <button type="submit" className="btn btn-primary mb-3 rounded-0 me-2">
          Submit
        </button>
        <button
          onClick={(event) => {
            event.preventDefault();
            navigate(`/employees/details/${employee.id}`);
          }}
          className="btn btn-secondary mb-3 rounded-0"
        >
          Back to Details
        </button>
      </form>
    </div>
  );
};

export default EditEmployeePage;
