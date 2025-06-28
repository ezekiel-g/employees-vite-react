import { useState, useEffect, useCallback } from 'react';
import DepartmentTile from './departments/DepartmentTile';
import fetchFromBackEnd from '../../util/fetchFromBackEnd.js';
import messageHelper from '../../util/messageHelper.jsx';

const MainPage = () => {
  const [departments, setDepartments] = useState([]);
  const [successMessages, setSuccessMessages] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);
  const backEndUrl = import.meta.env.VITE_BACK_END_URL;

  const getDepartments = useCallback(async () => {
    setSuccessMessages([]);
    setErrorMessages([]);

    const fetchResult = await fetchFromBackEnd(
      `${backEndUrl}/api/v1/departments`,
    );

    if (fetchResult.status >= 200 && fetchResult.status < 300) {
      const sortedData = fetchResult.data.sort(
        (a, b) => a.name.localeCompare(b.name),
      );

      setDepartments(sortedData);
      return;
    }

    setErrorMessages(['Error loading departments']);
  }, [backEndUrl]);

  useEffect(() => {
    getDepartments();
  }, [getDepartments]);

  const successMessageDisplay = messageHelper.showSuccesses(successMessages);
  const errorMessageDisplay = messageHelper.showErrors(errorMessages);

  const departmentDisplay = departments.map((department, index) => {
    return (
      <div key={index} className="col-12 col-sm-6 col-lg-4 mb-3">
        <div className="card border border-light rounded-0">
          <DepartmentTile
            key={index}
            backEndUrl={backEndUrl}
            department={department}
          />
        </div>
      </div>
    );
  });

  return (
    <div className="container my-4">
      {successMessageDisplay}
      {errorMessageDisplay}
      <div className="container">
        <div className="row">{departmentDisplay}</div>
      </div>
    </div>
  );
};

export default MainPage;
