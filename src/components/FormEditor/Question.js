// Question.js
import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Col, Row } from 'react-bootstrap';
import OptionList from './OptionList';

function Question({ id, removeQuestion, updateQuestion }) {
    const [inputType, setInputType] = useState('shortAnswer');
    const [questionText, setQuestionText] = useState('');
    const [options, setOptions] = useState([{ id: 0, text: '', isCorrect: false }]);
    const [correctAnswer, setCorrectAnswer] = useState('');

    const handleInputTypeChange = (event) => {
        setInputType(event.target.value);
    }

    const handleQuestionTextChange = (event) => {
        setQuestionText(event.target.value);
    }

    const handleOptionsChange = (newOptions) => {
        setOptions(newOptions);
    }

    const handleCorrectAnswerChange = (event) => {
        setCorrectAnswer(event.target.value);
    }

    useEffect(() => {
        console.log(id, inputType, questionText, options, correctAnswer)
        updateQuestion({
            id: id,
            type: inputType,
            question: questionText,
            options: options,
            correctAnswer: correctAnswer
        });


    }, [id, inputType, questionText, options, correctAnswer]);

    return (
        <Card className="mb-4">
            <Card.Body>
                <Form.Group as={Row} className="mb-3">
                    <Col sm={8}>
                        <Form.Control
                            type="text"
                            placeholder="Enter Question"
                            value={questionText}
                            onChange={handleQuestionTextChange}
                            className="mb-3"
                        />
                    </Col>
                    <Col sm={3}>
                        <Form.Control
                            as="select"
                            value={inputType}
                            onChange={handleInputTypeChange}
                            className="mb-3"
                        >
                            <option value="shortAnswer">Short Answer</option>
                            <option value="multipleChoice">Multiple Choice</option>
                            <option value="checkBox">Check Box</option>
                            <option value="date">Date</option>
                            {/* Add more options as needed */}
                        </Form.Control>
                    </Col>
                </Form.Group>
                {inputType === 'shortAnswer' || inputType === 'date' ? (
                    <Form.Group as={Row}>
                        <Col sm={8}>
                            <Form.Control
                                type={inputType === 'date' ? 'date' : 'text'}
                                placeholder="Correct Answer"
                                value={correctAnswer}
                                onChange={handleCorrectAnswerChange}
                            />
                        </Col>
                    </Form.Group>
                ) : null}
                {inputType === 'multipleChoice' || inputType === 'checkBox' ? (
                    <OptionList options={options} setOptions={handleOptionsChange}/>
                ) : null}
                <Button variant="danger" className="float-right" onClick={() => removeQuestion(id)}>Delete</Button>
            </Card.Body>
        </Card>
    );
}

export default Question;
