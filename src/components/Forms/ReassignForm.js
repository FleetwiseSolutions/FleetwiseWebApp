import React, { useState } from "react";
import { Form, Button, Dropdown } from "react-bootstrap";

const ReassignForm = ({ employees, onSubmit, onCancel }) => {
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(selectedEmployee);
    onSubmit(selectedEmployee);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="employee">
        <Form.Label>Select Employee</Form.Label>
        <Dropdown onSelect={(e) => setSelectedEmployee(e)}>
          <Dropdown.Toggle variant="outline-primary">
            {selectedEmployee || "Select Driver"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {employees.map((employee) => (
              <Dropdown.Item key={employee.id} eventKey={employee.id}>
                {employee.firstName}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Form.Group>
      <Button type="submit" disabled={!selectedEmployee}>
        Reassign
      </Button>
      <Button variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
    </Form>
  );
};

export default ReassignForm;
