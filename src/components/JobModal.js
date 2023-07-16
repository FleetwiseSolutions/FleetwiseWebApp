import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Dropdown } from "react-bootstrap";
import { firestore } from "../firebaseConfig";

const JobModal = ({
  showModal,
  handleClose,
  selectedJob,
  handleSaveChanges,
  isEditing,
  setIsEditing,
  company,
}) => {
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [trailers, setTrailers] = useState([]);

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
  const [delivered, setDelivered] = useState(false);
  const [invoiced, setInvoiced] = useState(false);

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

    const setInitialVariables = () => {
      setCustomer(selectedJob.customer);
      setPickup(selectedJob.pickup);
      setDropoff(selectedJob.dropoff);
      setPickupDate(selectedJob.pickupDate);
      setDeliveryDate(selectedJob.deliveryDate);
      setDeliveryType(selectedJob.deliveryType);
      setTrailerType(selectedJob.trailerType);
      setEmployee(selectedJob.driver);
      setTruck(selectedJob.truck);
      setTrailer1(selectedJob.trailer1);
      setTrailer2(selectedJob.trailer2);
      setTrailer3(selectedJob.trailer3);
      setTrailer4(selectedJob.trailer4);
      setPrice(selectedJob.price);
      setStatus(selectedJob.status);
      setPreTrip(selectedJob.preTrip);
      setSafeJourneyPlan(selectedJob.safeJourneyPlan);
      setPod(selectedJob.pod);
      setCustomerRate(selectedJob.customerRate);
      setCustomerGST(selectedJob.customerGST);
      setCustomerAmount(selectedJob.customerAmount);
      setDriverRate(selectedJob.driverRate);
      setDriverGST(selectedJob.driverGST);
      setDriverAmount(selectedJob.driverAmount);
      setComments(selectedJob.comments);
      setDelivered(selectedJob.delivered);
      setInvoiced(selectedJob.invoiced);
    };

      // Reset state variables when a new job is selected
      setPreTrip(false);
      setSafeJourneyPlan(false);

      // Query Firestore for submitted forms of the selected job
    console.log(selectedJob)
      const unsubscribeForms = firestore
          .collection(`companies/${company}/submittedForms`)
          .where("job", "==", selectedJob.id)
          .onSnapshot((snapshot) => {
            snapshot.forEach((doc) => {
              const form = doc.data();
              console.log(form)
              if (form.formTitle === 'Safe Journey Plan') {
                setSafeJourneyPlan(true);
              } else if (form.formTitle === 'Pre-Trip Check') {
                setPreTrip(true);
              }
            });
          });

    return () => {
      setInitialVariables();
      unsubscribeCustomers();
      unsubscribeEmployees();
      unsubscribeTrucks();
      unsubscribeTrailers();
      unsubscribeForms();
    };
  }, []);



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
          <Dropdown.Toggle variant="outline-primary" disabled={!isEditing}>
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

  const handleCustomerRateChange = (e) => {
    const rate = parseFloat(e.target.value) || 0;
    const gst = 0.1 * rate;
    const amount = rate + gst;
    setCustomerRate(e.target.value);
    setCustomerGST(gst.toFixed(2));
    setCustomerAmount(amount.toFixed(2));
  };

  const handleCustomerAmountChange = (e) => {
    const amount = parseFloat(e.target.value) || 0;
    const rate = (10 / 11) * amount;
    const gst = amount - rate;
    setCustomerRate(rate.toFixed(2));
    setCustomerGST(gst.toFixed(2));
    setCustomerAmount(e.target.value);
  };

  const handleDriverRateChange = (e) => {
    const rate = parseFloat(e.target.value) || 0;
    const gst = 0.1 * rate;
    const amount = rate + gst;
    setDriverRate(e.target.value);
    setDriverGST(gst.toFixed(2));
    setDriverAmount(amount.toFixed(2));
  };

  const handleDriverAmountChange = (e) => {
    const amount = parseFloat(e.target.value) || 0;
    const rate = (10 / 11) * amount;
    const gst = amount - rate;
    setDriverRate(rate.toFixed(2));
    setDriverGST(gst.toFixed(2));
    setDriverAmount(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSaveChanges({
      customer,
      pickup,
      dropoff,
      pickupDate,
      deliveryDate,
      deliveryType,
      trailerType,
      employee,
      truck,
      trailer1,
      trailer2,
      trailer3,
      trailer4,
      status,
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
      delivered,
      invoiced
    })
  }

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Job</Modal.Title>
        <Button
          variant="outline-primary"
          className="ml-2"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </Modal.Header>
      <Modal.Body>
        {selectedJob && (
          <Form>
            <Form.Group>
              <Form.Label>Customer</Form.Label>
              <Dropdown onSelect={(e) => setCustomer(e)} disabled={!isEditing}>
                <Dropdown.Toggle
                  variant="outline-primary"
                  disabled={!isEditing}
                >
                  {customer}
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
              <Dropdown onSelect={(e) => setPickup(e)} disabled={!isEditing}>
                <Dropdown.Toggle
                  variant="outline-primary"
                  disabled={!isEditing}
                >
                  {pickup}
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
              <Dropdown onSelect={(e) => setDropoff(e)} disabled={!isEditing}>
                <Dropdown.Toggle
                  variant="outline-primary"
                  disabled={!isEditing}
                >
                  {dropoff}
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
                disabled={!isEditing}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Delivery Date</Form.Label>
              <Form.Control
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                disabled={!isEditing}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Delivery Type</Form.Label>
              <Dropdown
                onSelect={(e) => setDeliveryType(e)}
                disabled={!isEditing}
              >
                <Dropdown.Toggle
                  variant="outline-primary"
                  disabled={!isEditing}
                >
                  {deliveryType}
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
                <Dropdown.Toggle
                  variant="outline-primary"
                  disabled={!isEditing}
                >
                  {trailerType}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="Semi">Semi</Dropdown.Item>
                  <Dropdown.Item eventKey="B-Double">B-Double</Dropdown.Item>
                  <Dropdown.Item eventKey="A-Triple">A-Triple</Dropdown.Item>
                  <Dropdown.Item eventKey="Road Train">
                    Road Train
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
            <Form.Group>
              <Form.Label>Employee</Form.Label>
              <Dropdown
                onSelect={(e) => {
                  setEmployee(JSON.parse(e));
                }}
                disabled={!isEditing}
              >
                <Dropdown.Toggle
                  variant="outline-primary"
                  disabled={!isEditing}
                >
                  {employee && employees.find((emp) => emp.id === employee)
                    ? `${employees.find((emp) => emp.id === employee).firstName}
      ${employees.find((emp) => emp.id === employee).middleName ? " " : ""}
      ${employees.find((emp) => emp.id === employee).middleName} 
      ${employees.find((emp) => emp.id === employee).lastName}`
                    : "Select Driver"}
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
              <Dropdown onSelect={(e) => setTruck(e)} disabled={!isEditing}>
                <Dropdown.Toggle
                  variant="outline-primary"
                  disabled={!isEditing}
                >
                  {truck}
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
            <Form.Group controlId="preTrip">
              <Form.Check
                type="checkbox"
                label="Pre-Trip"
                checked={preTrip}
                onChange={(e) => setPreTrip(e.target.checked)}
                disabled={!isEditing}
              />
            </Form.Group>
            <Form.Group controlId="safeJourneyPlan">
              <Form.Check
                type="checkbox"
                label="Safe Journey Plan"
                checked={safeJourneyPlan}
                onChange={(e) => setSafeJourneyPlan(e.target.checked)}
                disabled={!isEditing}
              />
            </Form.Group>
            <Form.Group controlId="pod">
              <Form.Check
                type="checkbox"
                label="PODs"
                checked={pod}
                onChange={(e) => setPod(e.target.checked)}
                disabled={!isEditing}
              />
            </Form.Group>
            <Form.Group controlId="customerRate">
              <Form.Label>Customer Rate</Form.Label>
              <Form.Control
                type="number"
                value={customerRate}
                onChange={handleCustomerRateChange}
                readOnly={!isEditing}
              />
            </Form.Group>

            <Form.Group controlId="customerGST">
              <Form.Label>Customer GST</Form.Label>
              <Form.Control type="number" value={customerGST} disabled />
            </Form.Group>

            <Form.Group controlId="customerAmount">
              <Form.Label>Customer Amount {"(including GST)"}</Form.Label>
              <Form.Control
                type="number"
                value={customerAmount}
                onChange={handleCustomerAmountChange}
                readOnly={!isEditing}
              />
            </Form.Group>
            <hr
              style={{
                border: "none",
                height: "5px",
                backgroundColor: "#333",
              }}
            />
            <Form.Group controlId="driverRate">
              <Form.Label>Driver Rate</Form.Label>
              <Form.Control
                type="number"
                value={driverRate}
                onChange={handleDriverRateChange}
                readOnly={!isEditing}
              />
            </Form.Group>

            <Form.Group controlId="customerGST">
              <Form.Label>Driver GST</Form.Label>
              <Form.Control type="number" value={driverGST} disabled />
            </Form.Group>

            <Form.Group controlId="customerAmount">
              <Form.Label>Driver Amount {"(including GST)"}</Form.Label>
              <Form.Control
                type="number"
                value={driverAmount}
                onChange={handleDriverAmountChange}
                readOnly={!isEditing}
              />
            </Form.Group>
            <Form.Group controlId="comments">
              <Form.Label>Comments</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                readOnly={!isEditing}
              />
            </Form.Group>
            <hr
                style={{
                  border: "none",
                  height: "5px",
                  backgroundColor: "#333",
                }}
            />
            <Form.Group controlId="delivered">
              <Form.Check
                  type="checkbox"
                  label="Delivered?"
                  checked={delivered}
                  onChange={(e) => setDelivered(e.target.checked)}
                  disabled={!isEditing}
              />
            </Form.Group>
            <Form.Group controlId="invoiced">
              <Form.Check
                  type="checkbox"
                  label="Invoiced?"
                  checked={invoiced}
                  onChange={(e) => setInvoiced(e.target.checked)}
                  disabled={!isEditing}
              />
            </Form.Group>

          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!isEditing}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default JobModal;
