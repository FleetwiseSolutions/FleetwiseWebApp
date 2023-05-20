import React, { useState } from "react";
import {
  Modal,
  Form,
  Button,
  ButtonGroup,
  ToggleButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import { firestore } from "../../firebaseConfig";

const VehicleForm = ({ company, show, onHide }) => {
  const [registration, setRegistration] = useState("");
  const [vin, setVin] = useState("");
  const [make, setMake] = useState("");
  const [fleetNumber, setFleetNumber] = useState("");
  const [regoState, setRegoState] = useState("");
  const [status, setStatus] = useState("");
  const [regoExp, setRegoExp] = useState("");
  const [lastService, setLastService] = useState("");
  const [lastServiceDate, setLastServiceDate] = useState("");
  const [nextService, setNextService] = useState("");
  const [nextServiceDate, setNextServiceDate] = useState("");
  const [buildYear, setBuildYear] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const vehicleTypes = [
    { name: "Truck", value: "truck" },
    { name: "Trailer", value: "trailer" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Save the customer data to Firestore
    try {
      await firestore.collection(`companies/${company}/vehicles`).doc(vin).set({
        registration,
        vin,
        make,
        fleetNumber,
        regoState,
        status,
        regoExp,
        lastService,
        lastServiceDate,
        nextService,
        nextServiceDate,
        buildYear,
        vehicleType,
      });

      // Reset the form fields
      setRegistration("");
      setVin("");
      setMake("");
      setFleetNumber("");
      setRegoState("");
      setStatus("");
      setRegoExp("");
      setLastService("");
      setLastServiceDate("");
      setNextService("");
      setNextServiceDate("");
      setBuildYear("");
      setVehicleType("");

      // Close the modal
      onHide();
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add Vehicle</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Vehicle Type</Form.Label>

            <div className="d-inline-flex">
              <ButtonGroup
                vertical
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  variant={
                    vehicleType === "Truck" ? "primary" : "outline-primary"
                  }
                  onClick={() => setVehicleType("Truck")}
                >
                  Truck
                </Button>
                <Button
                  variant={
                    vehicleType === "Trailer" ? "primary" : "outline-primary"
                  }
                  onClick={() => setVehicleType("Trailer")}
                >
                  Trailer
                </Button>
              </ButtonGroup>
            </div>
          </Form.Group>
          <Form.Group>
            <Form.Label>Registration</Form.Label>
            <Form.Control
              type="text"
              value={registration}
              onChange={(e) => setRegistration(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>VIN</Form.Label>
            <Form.Control
              type="text"
              value={vin}
              onChange={(e) => setVin(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Make</Form.Label>
            <Form.Control
              type="text"
              value={make}
              onChange={(e) => setMake(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Fleet Number</Form.Label>
            <Form.Control
              type="text"
              value={fleetNumber}
              onChange={(e) => setFleetNumber(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Rego State</Form.Label>
            <Form.Control
              type="text"
              value={regoState}
              onChange={(e) => setRegoState(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Control
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Rego Exp</Form.Label>
            <Form.Control
              type="date"
              value={regoExp}
              onChange={(e) => setRegoExp(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Last Service</Form.Label>
            <Form.Control
              type="text"
              value={lastService}
              onChange={(e) => setLastService(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Last Service Date</Form.Label>
            <Form.Control
              type="date"
              value={lastServiceDate}
              onChange={(e) => setLastServiceDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Next Service</Form.Label>
            <Form.Control
              type="text"
              value={nextService}
              onChange={(e) => setNextService(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Next Service Date</Form.Label>
            <Form.Control
              type="date"
              value={nextServiceDate}
              onChange={(e) => setNextServiceDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Build Year</Form.Label>
            <Form.Control
              type="text"
              value={buildYear}
              onChange={(e) => setBuildYear(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Add Vehicle
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default VehicleForm;
