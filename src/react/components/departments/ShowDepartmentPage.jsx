import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import fetchFromBackEnd from '../../../util/fetchFromBackEnd.js';
import messageHelper from '../../../util/messageHelper.jsx';
import formatDateAndTime from '../../../util/formatDateAndTime.js';

const ShowDepartmentPage = () => {
  const [department, setDepartment] = useState({});
  const [successMessages, setSuccessMessages] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const backEndUrl = import.meta.env.VITE_BACK_END_URL;

  const getDepartment = useCallback(async () => {
    setSuccessMessages([]);
    setErrorMessages([]);

    const fetchResult = await fetchFromBackEnd(
      `${backEndUrl}/api/v1/departments/${id}`,
    );

    if (fetchResult.status >= 200 && fetchResult.status < 300) {
      setDepartment(fetchResult.data[0]);
      return;
    }

    setErrorMessages(['Error loading department']);
  }, [backEndUrl, id]);

  const deleteDepartment = async () => {
    setSuccessMessages([]);
    setErrorMessages([]);

    if (!window.confirm(`Delete ${department.name}?`)) return;

    const fetchResult = await fetchFromBackEnd(
      `${backEndUrl}/api/v1/departments/${department.id}`,
      'DELETE',
    );

    if (fetchResult.status >= 200 && fetchResult.status < 300) {
      alert('Department deleted successfully');
      navigate('/');
    }

    setErrorMessages(['Error deleting department']);
  };

  useEffect(() => {
    getDepartment();
  }, [getDepartment]);

  const successMessageDisplay = messageHelper.showSuccesses(successMessages);
  const errorMessageDisplay = messageHelper.showErrors(errorMessages);

  return (
    <div className="container col-md-10 offset-md-1 my-4">
      {successMessageDisplay}
      {errorMessageDisplay}
      <h2>{department.name}</h2>

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
            <td>{department.id}</td>
          </tr>
          <tr>
            <td>Name</td>
            <td>{department.name}</td>
          </tr>
          <tr>
            <td>Code</td>
            <td>{department.code}</td>
          </tr>
          <tr>
            <td>Location</td>
            <td>{department.location}</td>
          </tr>
          <tr>
            <td>Date created</td>
            <td>{formatDateAndTime(department.created_at)}</td>
          </tr>
          <tr>
            <td>Date last updated</td>
            <td>{formatDateAndTime(department.updated_at)}</td>
          </tr>
        </tbody>
      </table>

      <br />
      <div className="d-flex justify-content-between">
        <button
          onClick={() => navigate(`/departments/edit/${department.id}`)}
          className="btn btn-primary mb-3 rounded-0"
        >
          Edit
        </button>
        <button
          onClick={deleteDepartment}
          className="btn btn-danger mb-3 rounded-0"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ShowDepartmentPage;
