import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, firestore } from "../../firebaseConfig";
import { Form, Button } from "react-bootstrap";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import './SignUp.css'

const SignUp = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const uid = params.get("uid");
  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [employeeData, setEmployeeData] = useState(null);
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

  useEffect(() => {
    const fetchEmployeeData = async () => {
      const employeeDoc = await firestore.collection("users").doc(uid).get();
      const employeeData = employeeDoc.data();

      setLicenseNumber(employeeData.licenseNumber || "");
      setLicenseState(employeeData.licenseState || "");
      setLicenseType(employeeData.licenseType || "");
      setMobileNumber(employeeData.mobileNumber || "");
      setFirstName(employeeData.firstName || "");
      setMiddleName(employeeData.middleName || "");
      setLastName(employeeData.lastName || "");
      setDob(employeeData.dob || "");
      setStreet(employeeData.street || "");
      setSuburb(employeeData.suburb || "");
      setState(employeeData.state || "");
      setPostcode(employeeData.postcode || "");
      setLicenseExpiry(employeeData.licenseExpiry || "");
      setDriverDemeritsExp(employeeData.driverDemeritsExp || "");
      setFatigueStatus(employeeData.fatigueStatus || "");
      setBfmCertificationDate(employeeData.bfmCertificationDate || "");
      setBfmStartDate(employeeData.bfmStartDate || "");
      setBfmEndComments(employeeData.bfmEndComments || "");
      setMedicalExpiryDate(employeeData.medicalExpiryDate || "");
      setPoliceExpiryDate(employeeData.policeExpiryDate || "");
      setWaFatigueExp(employeeData.waFatigueExp || "");
      setWorkRightExp(employeeData.workRightExp || "");
      setWorkRightStatus(employeeData.workRightStatus || "");
      setInductionDate(employeeData.inductionDate || "");
      setComments(employeeData.comments || "");
      setCompany(employeeData.company || "");
    };

    fetchEmployeeData();
  }, [uid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Retrieve the user's email using the UID
      const userDoc = await firestore.collection("users").doc(uid).get();
      const userData = userDoc.data();
      console.log(userDoc);

      const email = userData.email || "";

      // Sign in the user with the email and the temporary password (token)
      await auth.signInWithEmailAndPassword(email, token);

      // Wait for the user to be logged in before updating the password
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          // Update the password for the signed-in user
          await user.updatePassword(password);

          // Create an object with all the employee data
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
            comments,
            company,
          };

          await firestore
            .collection("users")
            .doc(uid)
            .update(updatedEmployeeData);
        }
      });
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    // Update the employee data in Firestore
    // ...

    // Redirect to the desired page after updating the profile
  };

  const handleLinkGoogleAccount = async () => {
    const auth = firebase.auth();
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
      const result = await auth.currentUser.linkWithPopup(provider);
      // The Google user account is now linked with the existing user account.
      console.log("Google account linked:", result);
    } catch (error) {
      console.error("Error linking Google account:", error);
    }
  };

  const handleLinkFacebookAccount = async () => {
    // Link a Facebook account
    // ...
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>New Password:</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Confirm Password:</Form.Label>
        <Form.Control
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
        <Form.Select value={state} onChange={(e) => setState(e.target.value)}>
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
      <Form.Group>
        <Button type="submit">Sign Up</Button>
      </Form.Group>
      <Form.Group>
        <Button variant="secondary" onClick={handleLinkGoogleAccount}>
          Link Google Account
        </Button>
      </Form.Group>
      <Form.Group>
        <Button variant="secondary" onClick={handleLinkFacebookAccount}>
          Link Facebook Account
        </Button>
      </Form.Group>
    </Form>
  );
};

export default SignUp;
