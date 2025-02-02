//import React from "react";
import { useState } from "react";

export default function App() {

  const [count, setCount] = useState(1);

  return (
    <div>
      <h1>Home Page returned by App component</h1>
      <div>
        <button onClick={() => setCount((cc) => cc + 1)}>+
        </button>
      </div>
      <div>count is {count}</div>
      <div>
        <button onClick={() => setCount(count - 1)}>-
        </button>
      </div>
    </div>
  );
}
