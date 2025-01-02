import { useState } from "react";

export default function RandomWordPage() {
  const [word, setWord] = useState<string>("null");
  const [loading, setLoading] = useState(false);

  const fetchRandomWord = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/randomWord");
      const data = await response.json();
      setWord(data.word);
    } catch (error) {
      console.error("Error fetching word:", error);
      setWord("Error fetching word");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center m-4">
      <button
        onClick={fetchRandomWord}
        disabled={loading}
        className="mt-4 border border-white text-white py-2 px-4 rounded-md"
      >
        {loading ? "Loading..." : "Get Random Word"}
      </button>
      {word && <p>Random Word: {word}</p>}
    </div>
  );
}
