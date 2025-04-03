import { useState } from 'react';
import './App.css'
import { GoogleGenerativeAI } from "@google/generative-ai";
import SyncLoader from "react-spinners/SyncLoader";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

function App() {
  const apiKey = import.meta.env.VITE_API_GEMINI_KEY;

  const [prompt, setPrompt] = useState("");

  const [response, setResponse] = useState([
    {
      prompt: "Hi",
      response: "Hello, How can I help you today?"
    },
  ]);

  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#ffffff");

  async function fetchChatResponseFromGemini() {

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    setLoading(true);
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    setResponse([...response, { prompt: prompt, response: await result.response.text() }]);
    setPrompt("");
    setLoading(false);
  }
  
  return (
    <>
      <h1 className='heading'>Jan.Ai</h1>
      <div className='chatbot_container'>
        <div className='chatbot_response_container'>
          {
            response.map((res, index) => {
              return (
                <div key={index}>
                  <p className='chatbot_prompt'><strong>Question: </strong>{res.prompt}</p>
                  <p className='chatbot_response'><strong>Answer: </strong>{res.response}</p>
                </div>
              )
            })

          }
          <SyncLoader
            color={color}
            loading={loading}
            cssOverride={override}
            size={10}
            aria-label="Loading Spinner"
            data-testid="loader"
          />

        </div>

        <div className='chatbot_input'>

          <input type='text' placeholder='Type your message here...' className='input'
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
            }} />
          <button onClick={fetchChatResponseFromGemini}>Submit</button>
        </div>
      </div>
    </>
  )
}

export default App
