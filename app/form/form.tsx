'use client';

import { useState } from 'react';
import Button from '../components/ui/button/button';

export default function SignupForm() {

  // this is the state of the form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // This boolean tracks whether the form is valid
  // if the name and email are not empty, the form is valid
  const isFormValid = name.trim() !== '' && email.trim() !== '';

  const handleSubmit = () => {
    console.log('Form submitted:', { name, email });
    // Reset or perform further actions here
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4 max-w-md ">
      <div>

        <label className="block mb-1 font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <Button disabled={!isFormValid} onClick={handleSubmit}>
        Submit
      </Button>
    </form>
  );
}