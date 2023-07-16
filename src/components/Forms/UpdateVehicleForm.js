import React, {useEffect, useState} from "react";
import {
    Modal,
    Form,
    Button,
    Dropdown,
} from "react-bootstrap";
import { firestore } from "../../firebaseConfig";

const AddVehicleForm = ({ company, show, onHide }) => {
    const [vehicles, setVehicles] = useState([])
    const [selectedVehicle, setSelectedVehicle] = useState()
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

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const snapshot = await firestore.collection(`companies/${company}/vehicles`).get();
                const vehicleList = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
                setVehicles(vehicleList);
            } catch (err) {
                console.error('Failed to fetch vehicles:', err);
            }
        };

        fetchVehicles();
    }, []);

    // Fetch selected employee's data when a new employee is selected
    useEffect(() => {
        if (selectedVehicle) {
            const v = vehicles.find(vec => vec.id === selectedVehicle);
            if (v) {
                setRegistration(v.registration)
                setVin(v.vin)
                setMake(v.make)
                setFleetNumber(v.fleetNumber)
                setRegoState(v.regoState)
                setStatus(v.status)
                setRegoExp(v.regoExp)
                setLastService(v.lastService)
                setLastServiceDate(v.lastServiceDate)
                setNextService(v.nextService)
                setNextServiceDate(v.nextServiceDate)
                setBuildYear(v.buildYear)
                setVehicleType(v.vehicleType)
            }
        }
    }, [selectedVehicle, vehicles]);

    const handleVehicleChange = (e) => {
        setSelectedVehicle(e.target.value);
    }

    const handleUpdate = () => {
        const userRef = firestore
            .collection(`companies/${company}/vehicles`)
            .doc(selectedVehicle);
        userRef.update(
            {
                vehicles,
                selectedVehicle,
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
                vehicleType
            }
        )
        onHide()
    }

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Update Vehicle</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Select vehicle to update:</Form.Label>
                        <Form.Control as="select" onChange={handleVehicleChange}>
                            <option value="">-- Select an Vehicle --</option>
                            {vehicles.map(v => (
                                <option key={v.id} value={v.id}>
                                    {v.registration}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Vehicle Type</Form.Label>
                        <div className="d-flex justify-content-center">
                            <Dropdown onSelect={(e) => {setVehicleType(e)}}>
                                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                    {vehicleType || 'Select Vehicle Type'}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item eventKey="Truck">Truck</Dropdown.Item>
                                    <Dropdown.Item eventKey="Trailer">Trailer</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
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
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Close</Button>
                <Button variant="primary" onClick={handleUpdate}>Update</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddVehicleForm;
