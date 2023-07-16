import React, {useEffect, useState} from 'react';
import { Button, Form } from 'react-bootstrap';
import Question from './Question';

function FormBuilder({setFormData, formType }) {

    const [questions, setQuestions] = useState([{ id: 0, inputType: 'shortAnswer', questionText: '', options: [{ id: 0, text: '', isCorrect: false }], correctAnswer: '' }]);

    const addQuestion = () => {
        setQuestions([...questions, { id: questions.length, inputType: 'shortAnswer', questionText: '', options: [{ id: 0, text: '', isCorrect: false }], correctAnswer: '' }]);
    }

    const removeQuestion = (id) => {
        setQuestions(questions.filter((question) => question.id !== id));
    }

    const handleUpdateQuestion = (newQuestionData) => {
        setQuestions(questions.map((question) =>
            question.id === newQuestionData.id ? { ...question, ...newQuestionData } : question
        ));
        let newFormData = {
            formTitle: formType,
            questions: questions
        };
        setFormData(newFormData);
    }


    return (
        <Form>
            <h1>{formType}</h1>
            {questions.map((question) => <Question key={question.id} id={question.id} removeQuestion={removeQuestion} updateQuestion={handleUpdateQuestion}/>)}
            <Button variant="primary" type="button" onClick={addQuestion}>Add Question</Button>
        </Form>
    );
}

export default FormBuilder;
