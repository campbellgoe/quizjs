import React, { useEffect, useState } from 'react';
import { baseUrl } from '../config';

const Quiz = () => {
  const [quiz, setQuiz] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [result, setResult] = useState(null);

  // Fetch quiz questions from the API
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(baseUrl+'/api/quiz');
        const data = await response.json();
        setQuiz(data.quiz);
      } catch (error) {
        console.error('Failed to fetch quiz data', error);
      }
    };

    fetchQuiz();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare answers array based on user selections
    const answers = quiz.map((_, index) => userAnswers[index] || '');

    try {
      const response = await fetch(baseUrl+'/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });

      const data = await response.json();
      setResult(data.results);
    } catch (error) {
      console.error('Failed to submit quiz', error);
    }
  };

  // Handle radio button change
  const handleChange = (questionIndex, answer) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: answer,
    }));
  };

  return (
    <div>
      <h1>Quiz</h1>
      {quiz.length === 0 ? (
        <p>Loading quiz...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {quiz.map((question, index) => (
            <div key={index}>
              <p>{question.question}</p>
              {question.options.map((option) => (
                <label key={option}>
                  <input
                    type="radio"
                    name={`q${index}`}
                    value={option}
                    onChange={() => handleChange(index, option)}
                    checked={userAnswers[index] === option}
                  />
                  {option}
                </label>
              ))}
              <br />
            </div>
          ))}
          <button type="submit">Submit</button>
        </form>
      )}

      {result && (
        <div>
          <h2>Results</h2>
          {result.map((res, index) => (
            <p key={index}>
              {res.question}: {res.correct ? 'Correct' : `Incorrect (Correct: ${res.correctAnswer})`}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Quiz;