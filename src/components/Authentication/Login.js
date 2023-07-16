import React, { useState } from "react";
import {Form, Button, ButtonGroup, Card} from "react-bootstrap";
import { auth, firestore, functions } from "../../firebaseConfig";
import axios from 'axios'
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/functions";

const LoginForm = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [verificationStarted, setVerificationStarted] = useState(false);

    const provider = new firebase.auth.GoogleAuthProvider();

    const signInWithGoogle = () => {
        firebase.auth()
            .signInWithPopup(provider)
            .then((result) => {
                console.log("User signed in with Google successfully");
            }).catch((error) => {
            console.error("Error signing in with Google:", error);
        });
    }

    function ensureAustralianNumber(number) {
        if (number.startsWith('04')) {
            number = '+61' + number.slice(2);
        }
        return number;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            console.log("Logged in successfully");

            const uid = userCredential.user.uid;
            const userDoc = await firestore.collection('users').doc(uid).get();
            console.log(userDoc.data())
            if (userDoc.exists) {
                const userData = userDoc.data();
                const phoneNumber = userData.mobileNumber;

                if (phoneNumber) {
                    // Start the verification process
                    let number = ensureAustralianNumber(phoneNumber)

                    // Use axios to make a POST request to the cloud function
                    const response = await axios.post('https://us-central1-fleetwise-dev.cloudfunctions.net/startVerification', {
                        phoneNumber: number,
                    });

                    const result = response.data;
                    console.log(result)
                    if (result.success) {
                        console.log("Verification process started successfully");
                        setVerificationStarted(true);
                    } else {
                        console.error("Error starting the verification process:", result.error);
                    }
                } else {
                    console.error("User's phone number not found in the database.");
                }
            } else {
                console.error("User's document not found in the database.");
            }
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    const handleVerificationCodeSubmit = async (e) => {
        e.preventDefault();

        try {
            // Complete the verification process
            const userCredential = await auth.currentUser;
            const uid = userCredential.uid;
            const userDoc = await firestore.collection('users').doc(uid).get();
            const userData = userDoc.data();
            const phoneNumber = userData.phone;

            if (phoneNumber) {
                let number = ensureAustralianNumber(phoneNumber);
                const response = await axios.post('https://us-central1-fleetwise-dev.cloudfunctions.net/completeVerification', {
                    phoneNumber: number,
                    verificationCode
                });

                const result = response.data;
                console.log(result)

                if (result.success) {
                    setVerificationStarted(false)
                    console.log("Verification process completed successfully");
                    onLogin();
                } else {
                    console.error("Error during the verification process:", result.error);
                }
            } else {
                console.error("User's phone number not found in the database.");
            }
        } catch (error) {
            console.error("Error during verification:", error);
        }
    };


    if (!verificationStarted) {
        return (
            <div style={{paddingLeft:"40%"}}>
            <Card style={{ width: '30%' }}>
                <Card.Body>
                    <Card.Title>Login</Card.Title>
                        <Form onSubmit={!verificationStarted ? handleSubmit : handleVerificationCodeSubmit}>
                            {!verificationStarted ? (
                                <>
                                    <Form.Group>
                                        <Form.Label>Email:</Form.Label>
                                        <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Password:</Form.Label>
                                        <Form.Control type="password" value={password}
                                                      onChange={(e) => setPassword(e.target.value)}/>
                                    </Form.Group>
                                    <Form.Group>
                                        <ButtonGroup vertical>
                                        <Button variant="warning" type="submit">Login</Button>
                                            <div></div>
                                        <Button variant="warning"onClick={signInWithGoogle}>Sign in with Google</Button>
                                        </ButtonGroup>
                                    </Form.Group>
                                </>
                            ) : (
                                <>
                                    <Form.Group>
                                        <Form.Label>Verification Code:</Form.Label>
                                        <Form.Control type="text" value={verificationCode}
                                                      onChange={(e) => setVerificationCode(e.target.value)}/>
                                    </Form.Group>
                                    <Form.Group>
                                        <Button type="submit">Submit Verification Code</Button>
                                    </Form.Group>
                                </>
                            )}
                        </Form>
                </Card.Body>
            </Card>
            </div>
        );
    }
}
export default LoginForm;
