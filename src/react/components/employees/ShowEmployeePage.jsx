import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import fetchFromBackEnd from '../../../util/fetchFromBackEnd.js';
import messageHelper from '../../../util/messageHelper.jsx';
import formatDateAndTime from '../../../util/formatDateAndTime.js';

const ShowEmployeePage = () => {
  const [employee, setEmployee] = useState({});
  const [department, setDepartment] = useState('');
  const [successMessages, setSuccessMessages] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const backEndUrl = import.meta.env.VITE_BACK_END_URL;

  const getDepartment = useCallback(
    async (departmentId) => {
      const fetchResult = await fetchFromBackEnd(
        `${backEndUrl}/api/v1/departments/${departmentId}`,
      );

      if (fetchResult.status >= 200 && fetchResult.status < 300) {
        setDepartment(fetchResult.data[0]);
        setErrorMessages([]);
        return;
      }

      setErrorMessages(['Error loading department']);
    },
    [backEndUrl],
  );

  const getEmployee = useCallback(async () => {
    setSuccessMessages([]);
    setErrorMessages([]);

    const fetchResult = await fetchFromBackEnd(
      `${backEndUrl}/api/v1/employees/${id}`,
    );

    if (fetchResult.status >= 200 && fetchResult.status < 300) {
      setEmployee(fetchResult.data[0]);
      getDepartment(fetchResult.data[0].department_id);
      return;
    }

    setErrorMessages(['Error loading employee']);
  }, [backEndUrl, id, getDepartment]);

  const deleteEmployee = async () => {
    setSuccessMessages([]);
    setErrorMessages([]);

    if (
      !window.confirm(`Delete ${employee.last_name}, ${employee.first_name}?`)
    ) {
      return;
    }

    const fetchResult = await fetchFromBackEnd(
      `${backEndUrl}/api/v1/employees/${employee.id}`,
      'DELETE',
    );

    if (fetchResult.status >= 200 && fetchResult.status < 300) {
      alert('Employee deleted successfully');
      navigate('/');
    }

    setErrorMessages(['Error deleting employee']);
  };

  useEffect(() => {
    getEmployee();
  }, [getEmployee]);

  const successMessageDisplay = messageHelper.showSuccesses(successMessages);
  const errorMessageDisplay = messageHelper.showErrors(errorMessages);

  return (
    <div className="container col-md-10 offset-md-1 my-4">
      {successMessageDisplay}
      {errorMessageDisplay}
      <h2>
        {employee.last_name}, {employee.first_name}
      </h2>

      <br />
      <table className="table table-bordered table-dark">
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ID</td>
            <td>{employee.id}</td>
          </tr>
          <tr>
            <td>First name</td>
            <td>{employee.first_name}</td>
          </tr>
          <tr>
            <td>Last name</td>
            <td>{employee.last_name}</td>
          </tr>
          <tr>
            <td>Job title</td>
            <td>{employee.title}</td>
          </tr>
          <tr>
            <td>Department</td>
            <td>{department.name}</td>
          </tr>
          <tr>
            <td>Email address</td>
            <td>{employee.email}</td>
          </tr>
          <tr>
            <td>Phone number</td>
            <td>
              {employee.country_code}
              {employee.phone_number}
            </td>
          </tr>
          <tr>
            <td>Active</td>
            <td>{employee.is_active === true ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <td>Hire date</td>
            <td>{formatDateAndTime(employee.hire_date, 'date')}</td>
          </tr>
          <tr>
            <td>Date created</td>
            <td>{formatDateAndTime(employee.created_at)}</td>
          </tr>
          <tr>
            <td>Date last updated</td>
            <td>{formatDateAndTime(employee.updated_at)}</td>
          </tr>
        </tbody>
      </table>

      <br />
      <div className="d-flex justify-content-between">
        <button
          onClick={() => navigate(`/employees/edit/${employee.id}`)}
          className="btn btn-primary mb-3 rounded-0"
        >
          Edit
        </button>
        <button
          onClick={deleteEmployee}
          className="btn btn-danger mb-3 rounded-0"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ShowEmployeePage;
