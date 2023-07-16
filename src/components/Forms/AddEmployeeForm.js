// src/components/AddEmployeeForm.js
import React, { useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { auth, firestore } from "../../firebaseConfig";
import firebase from "firebase/compat/app";
import styles from "../css_modules/SelectDropdown.module.css";

const AddEmployeeForm = ({ onAddEmployee, companyName, show, onHide }) => {
  const [email, setEmail] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseState, setLicenseState] = useState("");
  const [licenseType, setLicenseType] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
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
  const [workRightStatus, setWorkRightStatus] = useState("");
  const [inductionDate, setInductionDate] = useState("");
  const [comments, setComments] = useState("");
  const [company, setCompany] = useState("");

  const handleRoleClick = (role) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Generate a temporary password
      const tempPassword = Math.random().toString(36).slice(-8);

      // Create a new user with the temporary password
      const userCredential = await auth.createUserWithEmailAndPassword(
        email,
        tempPassword
      );
      const { user } = userCredential;

      const updatedEmployeeData = {
        licenseNumber,
        licenseState,
        licenseType,
        mobileNumber,
        firstName,
        middleName,
        lastName,
        dob,
        street,
        suburb,
        state,
        postcode,
        email,
        licenseExpiry,
        driverDemeritsExp,
        fatigueStatus,
        bfmCertificationDate,
        bfmStartDate,
        bfmEndComments,
        medicalExpiryDate,
        policeExpiryDate,
        waFatigueExp,
        workRightExp,
        workRightStatus,
        inductionDate,
        roles: selectedRoles,
        comments,
        company: companyName,
      };

      await firestore
        .collection("users")
        .doc(user.uid)
        .set(updatedEmployeeData);

      // Call the Cloud Function to send the email
      const sendEmailFunction = firebase
        .functions()
        .httpsCallable("sendInvitationEmail");
      await sendEmailFunction({
        email: email,
        companyName: companyName,
        signUpUrl: `http://localhost:3000/signup?uid=${user.uid}&token=${tempPassword}`,
      });

      onAddEmployee(email);
      setEmail("");
      console.log("New employee account created:", email);
    } catch (error) {
      console.error("Error creating new employee account:", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Customer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Roles:</Form.Label>
            <Form.Select className={styles.selectDropdown} multiple required>
              <option
                value="admin"
                onClick={() => handleRoleClick("admin")}
                style={{
                  backgroundColor: selectedRoles.includes("admin")
                    ? "#007bff"
                    : "white",
                  color: selectedRoles.includes("admin") ? "white" : "black",
                }}
              >
                Admin
              </option>
              <option
                value="driver"
                onClick={() => handleRoleClick("driver")}
                style={{
                  backgroundColor: selectedRoles.includes("driver")
                    ? "#007bff"
                    : "white",
                  color: selectedRoles.includes("driver") ? "white" : "black",
                }}
              >
                Driver
              </option>
            </Form.Select>
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
          <Button type="submit">Add Employee</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddEmployeeForm;
