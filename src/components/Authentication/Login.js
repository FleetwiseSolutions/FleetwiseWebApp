// src/components/LoginForm.js
import React, { useState } from "react";
import { Navigate } from "react-router-dom";

import { Form, Button } from "react-bootstrap";

import { auth, firestore } from "../../firebaseConfig";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [navigateToCompleteProfile, setNavigateToCompleteProfile] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      console.log("Logged in successfully");

      onLogin();
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        onLogin();
      })
      .catch((error) => {
        alert("Account not found");
      });
  };
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Email:</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Password:</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Button type="submit">Login</Button>
      </Form.Group>
      <Form.Group>
        <Button onClick={signInWithGoogle}>Sign in with Google</Button>
      </Form.Group>
    </Form>
  );
};

export default LoginForm;
