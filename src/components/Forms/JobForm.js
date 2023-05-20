import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Col, Row, Dropdown } from "react-bootstrap";
import { firestore } from "../../firebaseConfig";
import { v4 as uuidv4 } from "uuid";

const JobForm = ({ company, show, onHide }) => {
  const [jobID, setJobID] = useState(uuidv4().substring(0, 8));
  const [customer, setCustomer] = useState("");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryType, setDeliveryType] = useState("");
  const [trailerType, setTrailerType] = useState("");
  const [employee, setEmployee] = useState({});
  const [truck, setTruck] = useState("");
  const [trailer1, setTrailer1] = useState("");
  const [trailer2, setTrailer2] = useState("");
  const [trailer3, setTrailer3] = useState("");
  const [trailer4, setTrailer4] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");
  const [preTrip, setPreTrip] = useState("");
  const [safeJourneyPlan, setSafeJourneyPlan] = useState("");
  const [pod, setPod] = useState("");
  const [customerRate, setCustomerRate] = useState("");
  const [customerGST, setCustomerGST] = useState("");
  const [customerAmount, setCustomerAmount] = useState("");
  const [driverRate, setDriverRate] = useState("");
  const [driverGST, setDriverGST] = useState("");
  const [driverAmount, setDriverAmount] = useState("");
  const [comments, setComments] = useState("");

  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [trailers, setTrailers] = useState([]);

  const cities = [
    "BNE",
    "MEL",
    "SYD",
    "ADE",
    "GEX",
    "NTL",
    "PER",
    "YCDS",
    "CANB",
    "OTHER",
  ];

  useEffect(() => {
    const unsubscribeCustomers = firestore
      .collection(`companies/${company}/companies`)
      .onSnapshot((snapshot) => {
        const customersData = [];
        snapshot.forEach((doc) =>
          customersData.push({ id: doc.id, ...doc.data() })
        );
        setCustomers(customersData);
      });

    const unsubscribeEmployees = firestore
      .collection("users")
      .where("company", "==", company)
      .onSnapshot((snapshot) => {
        const employeesData = [];
        snapshot.forEach((doc) =>
          employeesData.push({ id: doc.id, ...doc.data() })
        );
        setEmployees(employeesData);
      });

    const unsubscribeTrucks = firestore
      .collection(`companies/${company}/vehicles`)
      .where("vehicleType", "==", "Truck")
      .onSnapshot((snapshot) => {
        const trucksData = [];
        snapshot.forEach((doc) =>
          trucksData.push({ id: doc.id, ...doc.data() })
        );
        setTrucks(trucksData);
      });

    const unsubscribeTrailers = firestore
      .collection(`companies/${company}/vehicles`)
      .where("vehicleType", "==", "Trailer")
      .onSnapshot((snapshot) => {
        const trailersData = [];
        snapshot.forEach((doc) =>
          trailersData.push({ id: doc.id, ...doc.data() })
        );
        setTrailers(trailersData);
      });

    return () => {
      unsubscribeCustomers();
      unsubscribeEmployees();
      unsubscribeTrucks();
      unsubscribeTrailers();
    };
  }, [company]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Save the job data to Firestore
    try {
      await firestore.collection(`companies/${company}/jobs`).doc(jobID).set({
        jobID,
        customer,
        pickup,
        dropoff,
        pickupDate,
        deliveryDate,
        deliveryType,
        trailerType,
        driver: employee.id,
        truck,
        trailer1,
        trailer2,
        trailer3,
        trailer4,
        price,
        status: "created",
        preTrip,
        safeJourneyPlan,
        pod,
        customerRate,
        customerGST,
        customerAmount,
        driverRate,
        driverGST,
        driverAmount,
        comments,
        history: [],
        invoiced: "",
        delivered: ""
      });

      // Reset the form fields
      setJobID(uuidv4().substring(0, 8));
      setCustomer("");
      setPickup("");
      setDropoff("");
      setPickupDate("");
      setDeliveryDate("");
      setDeliveryType("");
      setTrailerType("");
      setEmployee("");
      setTruck("");
      setTrailer1("");
      setTrailer2("");
      setTrailer3("");
      setTrailer4("");
      setPrice("");
      setStatus("");
      setPreTrip("");
      setSafeJourneyPlan("");
      setPod("");
      setCustomerRate("");
      setCustomerGST("");
      setCustomerAmount("");
      setDriverRate("");
      setDriverGST("");
      setDriverAmount("");
      setComments("");

      // Close the modal
      onHide();
    } catch (error) {
      console.error("Error adding job:", error);
    }
  };

  const getNumberOfTrailers = () => {
    switch (trailerType) {
      case "Semi":
        return 1;
      case "B-Double":
        return 2;
      case "A-Triple":
        return 3;
      case "Road Train":
        return 4;
      default:
        return 0;
    }
  };

  const getTrailerText = (i) => {
    switch (i) {
      case 1:
        return trailer1 !== "" ? trailer1 : `Select Trailer ${i}`;
      case 2:
        return trailer2 !== "" ? trailer2 : `Select Trailer ${i}`;
      case 3:
        return trailer3 !== "" ? trailer3 : `Select Trailer ${i}`;
      case 4:
        return trailer4 !== "" ? trailer4 : `Select Trailer ${i}`;
      default:
        return `Select Trailer ${i}`;
    }
  };

  // Trailer selects
  const trailerSelects = [];
  for (let i = 1; i <= getNumberOfTrailers(); i++) {
    console.log(i);
    trailerSelects.push(
      <Form.Group key={`trailer-${i}`}>
        <Form.Label>{`Trailer ${i}`}</Form.Label>
        <Dropdown
          onSelect={(e) => {
            switch (i) {
              case 1:
                setTrailer1(e);
                break;
              case 2:
                setTrailer2(e);
                break;
              case 3:
                setTrailer3(e);
                break;
              case 4:
                setTrailer4(e);
                break;
            }
            console.log(trailer1);
          }}
        >
          <Dropdown.Toggle variant="outline-primary">
            {getTrailerText(i)}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {trailers.map((trailer) => (
              <Dropdown.Item
                key={trailer.registration}
                eventKey={trailer.registration}
              >
                {trailer.registration}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Form.Group>
    );
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Create Job</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Customer</Form.Label>
            <Dropdown onSelect={(e) => setCustomer(e)}>
              <Dropdown.Toggle variant="outline-primary">
                {customer || "Select Customer"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {customers.map((customer) => (
                  <Dropdown.Item key={customer.id} eventKey={customer.id}>
                    {customer.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
          <Form.Group>
            <Form.Label>Pickup</Form.Label>
            <Dropdown onSelect={(e) => setPickup(e)}>
              <Dropdown.Toggle variant="outline-primary">
                {pickup || "Select Pickup City"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {cities.map((city) => (
                  <Dropdown.Item key={city} eventKey={city}>
                    {city}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
          <Form.Group>
            <Form.Label>Dropoff</Form.Label>
            <Dropdown onSelect={(e) => setDropoff(e)}>
              <Dropdown.Toggle variant="outline-primary">
                {dropoff || "Select Dropoff City"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {cities.map((city) => (
                  <Dropdown.Item key={city} eventKey={city}>
                    {city}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
          <Form.Group>
            <Form.Label>Pickup Date</Form.Label>
            <Form.Control
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Delivery Date</Form.Label>
            <Form.Control
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Delivery Type</Form.Label>
            <Dropdown onSelect={(e) => setDeliveryType(e)}>
              <Dropdown.Toggle variant="outline-primary">
                {deliveryType || "Select Delivery Type"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="D2D">D2D</Dropdown.Item>
                <Dropdown.Item eventKey="C2C">C2C</Dropdown.Item>
                <Dropdown.Item eventKey="D2C">D2C</Dropdown.Item>
                <Dropdown.Item eventKey="C2D">C2D</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
          <Form.Group>
            <Form.Label>Trailer Type</Form.Label>
            <Dropdown onSelect={(e) => setTrailerType(e)}>
              <Dropdown.Toggle variant="outline-primary">
                {trailerType || "Select Trailer Type"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="Semi">Semi</Dropdown.Item>
                <Dropdown.Item eventKey="B-Double">B-Double</Dropdown.Item>
                <Dropdown.Item eventKey="A-Triple">A-Triple</Dropdown.Item>
                <Dropdown.Item eventKey="Road Train">Road Train</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>

          <Form.Group>
            <Form.Label>Employee</Form.Label>
            <Dropdown
              onSelect={(e) => {
                setEmployee(JSON.parse(e));
              }}
            >
              <Dropdown.Toggle variant="outline-primary">
                {Object.keys(employee).length === 0
                  ? "Select Driver"
                  : `${employee.firstName}
                    ${employee.middleName ? " " : ""}
                    ${employee.middleName} ${employee.lastName}`}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {employees.map((employee) => (
                  <Dropdown.Item
                    key={`${employee.firstName}${
                      employee.middleName ? " " : ""
                    }${employee.middleName} ${employee.lastName}`}
                    eventKey={JSON.stringify(employee)}
                  >
                    {employee.firstName}
                    {employee.middleName ? " " : ""}
                    {employee.middleName} {employee.lastName}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
          <Form.Group>
            <Form.Label>Truck</Form.Label>
            <Dropdown onSelect={(e) => setTruck(e)}>
              <Dropdown.Toggle variant="outline-primary">
                {truck || "Select Truck"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {trucks.map((truck) => (
                  <Dropdown.Item
                    key={truck.registration}
                    eventKey={truck.registration}
                  >
                    {truck.registration}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>

          {trailerSelects}

          <Form.Group controlId="comments">
            <Form.Label>Comments</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Create Job
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default JobForm;
