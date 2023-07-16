import React, { useState } from "react";
import { Modal, Button } from 'react-bootstrap';
import FormBuilder from './FormBuilder';  // Import FormBuilder
import "./FormEditor.css";
import { firestore } from '../../firebaseConfig';

const FormEditor = ({company}) => {
    const [showFormModal, setShowFormModal] = useState(false);
    const [selectedForm, setSelectedForm] = useState(''); // form type selected in sidebar
    const [formData, setFormData] = useState(null); // State to keep the form data

    const handleOpenFormModal = () => {
        setShowFormModal(true);
    };

    const handleCloseFormModal = () => {
        setShowFormModal(false);
        setSelectedForm('');
    };

    const handleFormSelect = (formType) => {
        setSelectedForm(formType);
    };

    const saveFormToFirestore = async (e) => {
        console.log(formData)
        e.preventDefault();

        if (formData) {
            const db = firestore;
            await db.collection(`companies/${company}/forms`).add(formData);
        }
    }

    return (
        <>
            <Button onClick={handleOpenFormModal}>Create Form</Button>

            <Modal className="fullscreen-modal" show={showFormModal} onHide={handleCloseFormModal}>
                <Modal.Dialog>
                    <Modal.Header closeButton>
                        <Modal.Title>Create New Form</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-creation-container">
                            <div className="form-sidebar">
                                <div onClick={() => handleFormSelect('Safe Journey Plan')}>Safe Journey Plan</div>
                                <div onClick={() => handleFormSelect('Pre Trip Check')}>Pre Trip Check</div>
                            </div>
                            <div className="form-creation-content">
                                {selectedForm ? <FormBuilder formType={selectedForm} setFormData={setFormData}/> : <p>Select a form type from the sidebar to start creating.</p>}
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseFormModal}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={saveFormToFirestore}>
                            Save Form
                        </Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal>
        </>
    )
}

export default FormEditor;
