'use client';

import { useState } from 'react';
import Button from '../components/ui/button/button';
import Link from 'next/link';

export default function SignupForm() {

  // this is the state of the form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // This boolean tracks whether the form is valid
  const isFormValid = name.trim() !== '' && email.trim() !== '';

  const handleSubmit = () => {
    console.log('Form submitted:', { name, email });
    // Reset or perform further actions here
  };

  return (
    <>

    {/* could be a header component */}
    <Link href='/' className='bg-blue-600 text-white px-4 py-2 rounded'>Back</Link> 

    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="p-6 mx-auto w-1/4 flex flex-col gap-8 justify-center h-screen">
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
    </>
  );
}