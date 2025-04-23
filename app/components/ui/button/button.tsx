
export default function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="bg-blue-600 text-white px-4 py-2 rounded w-[400px] h-[52px]">
      {children}
    </button>
  )
}

// children is a prop that is passed to the button component -- this makes the button component reusable