import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeTile from '../employees/EmployeeTile';
import fetchFromBackEnd from '../../../util/fetchFromBackEnd.js';
import messageHelper from '../../../util/messageHelper.jsx';

const DepartmentTile = ({ department }) => {
  const [employees, setEmployees] = useState([]);
  const [successMessages, setSuccessMessages] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);
  const navigate = useNavigate();
  const backEndUrl = import.meta.env.VITE_BACK_END_URL;

  const getEmployees = useCallback(async () => {
    setSuccessMessages([]);
    setErrorMessages([]);

    const fetchResult = await fetchFromBackEnd(
      `${backEndUrl}/api/v1/employees`,
    );

    if (fetchResult.status >= 200 && fetchResult.status < 300) {
      const departmentEmployees = fetchResult.data.filter(
        (employee) => employee.department_id === department.id,
      );
      const sortedEmployees = departmentEmployees.sort(
        (a, b) => a.last_name.localeCompare(b.last_name),
      );

      setEmployees(sortedEmployees);
      return;
    }

    setErrorMessages(['Error loading employees']);
  }, [backEndUrl, department.id]);

  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

  const successMessageDisplay = messageHelper.showSuccesses(successMessages);
  const errorMessageDisplay = messageHelper.showErrors(errorMessages);

  const employeeDisplay = employees.map((employee, index) => {
    return (
      <EmployeeTile key={index} backEndUrl={backEndUrl} employee={employee} />
    );
  });

  return (
    <div className="p-2">
      {successMessageDisplay}
      {errorMessageDisplay}
      <span
        onClick={() => navigate(`/departments/details/${department.id}`)}
        style={{ cursor: 'pointer' }}
        role="button"
      >
        <h2>{department.name}</h2>
      </span>
      {employeeDisplay}
    </div>
  );
};

export default DepartmentTile;
