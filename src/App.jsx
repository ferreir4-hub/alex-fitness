import { useEffect, useState } from "react";

function Mascot({ ok }) {
  return (
    <div className="text-4xl mt-2">
      {ok ? "😄" : "🙂"}
    </div>
  );
}

export default function App() {
  const todayDate = new Date();
  const today = todayDate.getDate();
  const todayKey = todayDate.toDateString();

  const [goal, setGoal] = useState(() => JSON.parse(localStorage.getItem("goal") || "2"));
  const [water, setWater] = useState(() => JSON.parse(localStorage.getItem("water") || "0"));
  const [days, setDays] = useState(() => JSON.parse(localStorage.getItem("days") || "{}"));

  // reset daily
  useEffect(() => {
    const last = localStorage.getItem("lastDay");
    if (last !== todayKey) {
      setWater(0);
      localStorage.setItem("lastDay", todayKey);
    }
  }, [todayKey]);

  // persist
  useEffect(() => localStorage.setItem("goal", JSON.stringify(goal)), [goal]);
  useEffect(() => localStorage.setItem("water", JSON.stringify(water)), [water]);
  useEffect(() => localStorage.setItem("days", JSON.stringify(days)), [days]);

  const inc = () => setWater(v => +(v + 0.25).toFixed(2));
  const dec = () => setWater(v => +(Math.max(0, v - 0.25)).toFixed(2));

  const saveDay = () => {
    const ok = water >= goal;
    setDays(prev => ({ ...prev, [today]: ok ? "✓" : "X" }));
  };

  const ok = water >= goal;

  return (
    <div className="min-h-screen flex justify-center p-6">
      <div className="w-full max-w-md space-y-5">

        <div className="bg-white rounded-3xl shadow-xl p-5 text-center">
          <h1 className="text-3xl font-bold">Alex App</h1>
          <p className="text-sm text-gray-500 mt-2">Foco diário</p>
          <Mascot ok={ok} />
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-5 text-center">
          <div className="flex justify-between mb-2">
            <span>💧 Água</span>
            <input
              type="number"
              step="0.25"
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
              className="w-16 text-center border rounded"
            />
          </div>

          <p className="text-3xl font-bold text-blue-600">{water} / {goal}L</p>

          <div className="flex justify-center gap-4 mt-3">
            <button onClick={dec} className="w-10 h-10 bg-gray-200 rounded-full">-</button>
            <button onClick={inc} className="w-10 h-10 bg-gray-200 rounded-full">+</button>
          </div>

          <div className="grid grid-cols-7 gap-1 mt-4 text-xs">
            {Array.from({ length: 31 }, (_, i) => {
              const d = i + 1;
              const mark = days[d];
              const isToday = d === today;

              let bg = "bg-gray-100";
              if (mark === "✓") bg = "bg-green-200 text-green-800";
              if (mark === "X") bg = "bg-red-200 text-red-700";
              if (isToday && !mark) bg = "bg-gray-800 text-white";

              return (
                <div key={d} className={`p-2 rounded ${bg}`}>
                  {d}
                </div>
              );
            })}
          </div>

          <button
            onClick={saveDay}
            className="mt-4 w-full bg-gray-800 text-white py-2 rounded-xl"
          >
            Guardar Dia
          </button>
        </div>

      </div>
    </div>
  );
}
