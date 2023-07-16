import React, { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { firestore } from '../../firebaseConfig';

const UpdateEmployeeForm = ({ show, onHide, company}) => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [licenseNumber, setLicenseNumber] = useState('');
    const [licenseState, setLicenseState] = useState("");
    const [licenseType, setLicenseType] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [dob, setDob] = useState("");
    const [street, setStreet] = useState("");
    const [suburb, setSuburb] = useState("");
    const [state, setState] = useState("");
    const [postcode, setPostcode] = useState("");
    const [licenseExpiry, setLicenseExpiry] = useState("");
    const [driverDemeritsExp, setDriverDemeritsExp] = useState("");
    const [fatigueStatus, setFatigueStatus] = useState("");
    const [bfmCertificationDate, setBfmCertificationDate] = useState("");
    const [bfmStartDate, setBfmStartDate] = useState("");
    const [bfmEndComments, setBfmEndComments] = useState("");
    const [medicalExpiryDate, setMedicalExpiryDate] = useState("");
    const [policeExpiryDate, setPoliceExpiryDate] = useState("");
    const [waFatigueExp, setWaFatigueExp] = useState("");
    const [workRightExp, setWorkRightExp] = useState("");
    // Fetch all employees when component mounts
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const snapshot = await firestore.collection('users').where("company", "==", company).get();
                const employeeList = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
                setEmployees(employeeList);
            } catch (err) {
                console.error('Failed to fetch employees:', err);
            }
        };

        fetchEmployees();
    }, []);

    // Fetch selected employee's data when a new employee is selected
    useEffect(() => {
        if (selectedEmployee) {
            const e = employees.find(emp => emp.id === selectedEmployee);
            if (e) {
                setFirstName(e.firstName);
                setLastName(e.lastName);
                setEmail(e.email);
                setLicenseNumber(e.licenseNumber);
                setLicenseType(e.licenseType);
                setLicenseState(e.licenseState);
                setMiddleName(e.middleName);
                setDob(e.dob);
                setStreet(e.street)
                setSuburb(e.suburb)
                setState(e.state)
                setPostcode(e.postcode)
                setMobileNumber(e.mobileNumber)
                setLicenseExpiry(e.licenseExpiry)
                setDriverDemeritsExp(e.driverDemeritsExp)
                setFatigueStatus(e.fatigueStatus)
                setBfmCertificationDate(e.bfmCertificationDate)
                setBfmStartDate(e.bfmStartDate)
                setBfmEndComments(e.bfmEndComments)
                setMedicalExpiryDate(e.medicalExpiryDate)
                setPoliceExpiryDate(e.policeExpiryDate)
                setWaFatigueExp(e.waFatigueExp)
                setWorkRightExp(e.workRightExp)
            }
        }
    }, [selectedEmployee, employees]);

    // handle dropdown change
    const handleEmployeeChange = (e) => {
        setSelectedEmployee(e.target.value);
    }

    const handleUpdate = (e) => {
        const userRef = firestore
            .collection("users")
            .doc(selectedEmployee);
        userRef.update(
            {
                firstName,
                middleName,
                lastName,
                email,
                licenseNumber,
                licenseState,
                dob,
                street,
                suburb,
                state,
                postcode,
                mobileNumber,
                licenseExpiry,
                driverDemeritsExp,
                fatigueStatus,
                bfmCertificationDate,
                bfmStartDate,
                bfmEndComments,
                medicalExpiryDate,
                waFatigueExp,
                workRightExp,
                policeExpiryDate
            }
        )
        onHide()
    }



    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Update Employee</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Select employee to update:</Form.Label>
                        <Form.Control as="select" onChange={handleEmployeeChange}>
                            <option value="">-- Select an Employee --</option>
                            {employees.filter(emp => emp.roles && !emp.roles.includes('company')).map(employee => (
                                <option key={employee.id} value={employee.id}>
                                    {employee.firstName} {employee.lastName}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>First Name:</Form.Label>
                        <Form.Control
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Middle Name:</Form.Label>
                        <Form.Control
                            type="text"
                            value={middleName}
                            onChange={(e) => setMiddleName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Last Name:</Form.Label>
                        <Form.Control
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Email:</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>License Number:</Form.Label>
                        <Form.Control
                            type="text"
                            value={licenseNumber}
                            onChange={(e) => setLicenseNumber(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>License State:</Form.Label>
                        <Form.Select
                            value={licenseState}
                            onChange={(e) => setLicenseState(e.target.value)}
                        >
                            <option value="">Select a state</option>
                            <option value="NSW">NSW</option>
                            <option value="VIC">VIC</option>
                            <option value="QLD">QLD</option>
                            <option value="SA">SA</option>
                            <option value="WA">WA</option>
                            <option value="NT">NT</option>
                            <option value="ACT">ACT</option>
                            <option value="TAS">TAS</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>License Type:</Form.Label>
                        <Form.Control
                            type="text"
                            value={licenseType}
                            onChange={(e) => setLicenseType(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Mobile Number:</Form.Label>
                        <Form.Control
                            type="tel"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>DOB:</Form.Label>
                        <Form.Control
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Street:</Form.Label>
                        <Form.Control
                            type="text"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Suburb:</Form.Label>
                        <Form.Control
                            type="text"
                            value={suburb}
                            onChange={(e) => setSuburb(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>State:</Form.Label>
                        <Form.Select
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                        >
                            <option value="">Select a state</option>
                            <option value="NSW">NSW</option>
                            <option value="VIC">VIC</option>
                            <option value="QLD">QLD</option>
                            <option value="SA">SA</option>
                            <option value="WA">WA</option>
                            <option value="NT">NT</option>
                            <option value="ACT">ACT</option>
                            <option value="TAS">TAS</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Postcode:</Form.Label>
                        <Form.Control
                            type="text"
                            value={postcode}
                            onChange={(e) => setPostcode(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>License Expiry:</Form.Label>
                        <Form.Control
                            type="date"
                            value={licenseExpiry}
                            onChange={(e) => setLicenseExpiry(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Driver Demerits Exp:</Form.Label>
                        <Form.Control
                            type="date"
                            value={driverDemeritsExp}
                            onChange={(e) => setDriverDemeritsExp(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Fatigue Status:</Form.Label>
                        <Form.Control
                            type="text"
                            value={fatigueStatus}
                            onChange={(e) => setFatigueStatus(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>BFM Certification Date:</Form.Label>
                        <Form.Control
                            type="date"
                            value={bfmCertificationDate}
                            onChange={(e) => setBfmCertificationDate(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>BFM Start Date:</Form.Label>
                        <Form.Control
                            type="date"
                            value={bfmStartDate}
                            onChange={(e) => setBfmStartDate(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>BFM End Comments:</Form.Label>
                        <Form.Control
                            as="textarea"
                            value={bfmEndComments}
                            onChange={(e) => setBfmEndComments(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Medical Expiry Date:</Form.Label>
                        <Form.Control
                            type="date"
                            value={medicalExpiryDate}
                            onChange={(e) => setMedicalExpiryDate(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Police Expiry Date:</Form.Label>
                        <Form.Control
                            type="date"
                            value={policeExpiryDate}
                            onChange={(e) => setPoliceExpiryDate(e.target.value)}
                        />
                    </Form.Group>

                        <Form.Group>
                        <Form.Label>WA Fatigue Exp:</Form.Label>
                        <Form.Control
                            type="date"
                            value={waFatigueExp}
                            onChange={(e) => setWaFatigueExp(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Work Right Exp:</Form.Label>
                        <Form.Control
                            type="date"
                            value={workRightExp}
                            onChange={(e) => setWorkRightExp(e.target.value)}
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
}

export default UpdateEmployeeForm;
