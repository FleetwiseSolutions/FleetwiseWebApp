// src/components/Sidebar.js
import React from "react";
import {Button} from 'react-bootstrap'
import "./Sidebar.css";

const Sidebar = ({ role, onButtonClick, close, showClose }) => {
  const renderButtons = () => {
    switch (role) {
      case "admin":
        return (
          <>
            <li onClick={() => onButtonClick("addJob")}>Add Job</li>
            <li onClick={() => onButtonClick("addCustomer")}>Add Customer</li>
            <li onClick={() => onButtonClick("addVehicle")}>Add Vehicle</li>
              <li onClick={() => onButtonClick("editEmployee")}>Update Driver</li>
              <li onClick={() => onButtonClick("editVehicle")}>Update Vehicle</li>
            {/* Add more admin buttons here */}
          </>
        );
      case "company":
        return (
          <>
            <li onClick={() => onButtonClick("addEmployee")}>Add Employee</li>
            {/* Add more employee buttons here */}
          </>
        );
      default:
        return <p>No actions available.</p>;
    }
  };

  return (
    <div className="Sidebar">
        {!showClose &&
            <Button className="d-md-none" variant="primary" onClick={close}>
                X
            </Button>
        }
        <h3>Actions</h3>
      <ul>{renderButtons()}</ul>
    </div>
  );
};

export default Sidebar;
