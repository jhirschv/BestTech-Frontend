import React, { useState } from 'react';
import { generateText } from './GenerativeAiApi';
import { Button } from '../ui/button';

const GenerativeAIChatbot = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
    const generatedText = await generateText(input);
    setResponse(generatedText);
    
    } catch (err) {
      setError('Failed to generate text. Please try again.');
    } finally {
      setLoading(false);
      setInput("")
    }
  };

  return (
    
    <div className="chat-container max-w-md mx-auto">
      {loading && <p className='font-semibold'>Loading...</p>}
      {error && <p>{error}</p>}
      {response && <p className="response bg-blue-500 rounded-md p-2 text-white">{response}</p>}
      <form onSubmit={handleSubmit} className="pt-2 flex items-center">
      <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          className="w-full p-2 border border-gray-300 rounded-md resize-none h-12 rounded-r-none"
          rows="4"
        />
         <Button
          type="submit"
          className="w-12 h-12 rounded-md rounded-l-none"
        >
          Send
        </Button>
      </form>
    </div>
  );
};

export default GenerativeAIChatbot;
