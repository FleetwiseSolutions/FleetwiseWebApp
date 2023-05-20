import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { firestore } from "../../firebaseConfig";

const CustomerForm = ({ company, show, onHide }) => {
  const [name, setName] = useState("");
  const [abn, setAbn] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [suburb, setSuburb] = useState("");
  const [state, setState] = useState("");
  const [postcode, setPostcode] = useState("");
  const [comments, setComments] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Save the customer data to Firestore
    try {
      await firestore
        .collection(`companies/${company}/companies`)
        .doc(name)
        .set({
          name,
          abn,
          email,
          street,
          suburb,
          state,
          postcode,
          comments,
        });

      // Reset the form fields
      setName("");
      setAbn("");
      setEmail("");
      setStreet("");
      setSuburb("");
      setState("");
      setPostcode("");
      setComments("");

      // Close the modal
      onHide();
    } catch (error) {
      console.error("Error adding customer:", error);
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
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>ABN</Form.Label>
            <Form.Control
              type="text"
              value={abn}
              onChange={(e) => setAbn(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Street</Form.Label>
            <Form.Control
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Suburb</Form.Label>
            <Form.Control
              type="text"
              value={suburb}
              onChange={(e) => setSuburb(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>State</Form.Label>
            <Form.Control
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Postcode</Form.Label>
            <Form.Control
              type="text"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Comments</Form.Label>
            <Form.Control
              as="textarea"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Add Customer
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CustomerForm;
