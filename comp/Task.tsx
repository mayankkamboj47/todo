import { AppState, dispatchType } from "@/utils/types";
import React from "react";

interface propTypes {
    value : AppState['tasks'][number]['value'];
    id : number;
    points : AppState['tasks'][number]['points'];
    dispatch : dispatchType,
    selected : boolean
}

const Task = ({ value, id, points, dispatch, selected } : propTypes) => {
  const [taskValue, setTaskValue] = React.useState(value);
  const [editing, setEditing] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div
      style={{transform : `rotate(${random(id) * 4 - 2}deg)`}}
      className={`task ${randomColor(id)} shadow-lg p-4 mx-2 cursor-pointer ${selected ? "border-blue-500 border-2" : ""} mb-2`}
      onClick={() => dispatch({ type: "task.select", taskId: id })}
      data-testid={id}
    >
      <div className="flex justify-between items-center">
        {editing ? (
          <input
            className="w-full focus:outline-none bg-transparent"
            value={taskValue}
            ref={inputRef}
            onChange={(e) => setTaskValue(e.target.value)}
            onBlur={() => {
              dispatch({ type: "task.edit", id, value: taskValue });
              setEditing(false);
            }}
          />
        ) : (
          <span
            className="cursor-text"
            data-testid="task-value"
            onClick={() => {setEditing(true); setTimeout(() => inputRef.current?.focus(), 0)}}
          >
            {value}
          </span>
        )}

        <button
          className="text-red-500 hover:text-red-600 font-bold"
          onClick={() => dispatch({ type: "task.delete", taskId: id })}
        >
          &times;
        </button>
      </div>

      <Points points={points} />
    </div>
  );
};

export function Points({points} : {points : number}) {   
  type valueEmojiPair = [number, string];
  let values : valueEmojiPair[] = [[25, "🍩"], [10, "🍫"], [5, "🍭"], [1, "🍬"]]
  let emojis : {[emoji : string] : number} = {};
  for (let [value, emoji] of values) {
    for (let i = 0; i < Math.floor(points / value); i++) {
      emojis[emoji] = (emojis[emoji] || 0) + 1;
    }
    points = points % value;
  }
  let emojiString = values.map(([_, emoji]) => emojis[emoji] ? <span className="emoji">{emoji}x{emojis[emoji]}</span> : ' ');
  return <span className="emojis">{emojiString}</span>
}
// a pseudorandom number generator, that is seeded with a number
// and returns a function that returns a number between 0 and 1
// every time it is called
const random = (seed : number) => {
  let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

const randomColor = (seed : number) =>{
    let colors = ['bg-red-200', 'bg-yellow-200', 'bg-green-200', 'bg-blue-200', 'bg-indigo-200', 'bg-purple-200', 'bg-pink-200'];
    return colors[Math.floor(random(seed) * colors.length)];
}

export default Task;
