import React, { useState } from 'react';
import { Button, Form, Col, Row } from 'react-bootstrap';

function OptionList({options, setOptions}) {


    const addOption = () => {
        setOptions([...options, { id: options.length, text: '', isCorrect: false }]);
    }

    const handleOptionTextChange = (event, id) => {
        let newOptions = [...options];
        newOptions[id].text = event.target.value;
        setOptions(newOptions);
    }

    const handleCorrectAnswerChange = (event, id) => {
        let newOptions = [...options];
        newOptions[id].isCorrect = event.target.checked;
        setOptions(newOptions);
    }

    return (
        <>
            {options.map((option, index) => (
                <Form.Group key={option.id} as={Row} className="mb-3">
                    <Col sm={8}>
                        <Form.Control type="text" placeholder={`Option ${index + 1}`} onChange={(event) => handleOptionTextChange(event, option.id)} />
                    </Col>
                    <Col sm={1}>
                        <Form.Check type="checkbox" label="Correct" onChange={(event) => handleCorrectAnswerChange(event, option.id)} />
                    </Col>
                </Form.Group>
            ))}
            <Button variant="primary" type="button" onClick={addOption}>Add Option</Button>
        </>
    );
}

export default OptionList;