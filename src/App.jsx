import { useState, useEffect } from "react";

function Mascot({ mood }) {
  const faces = {
    happy: "(◕‿◕)",
    neutral: "(•_•)",
    sad: "(╥﹏╥)"
  };

  return (
    <div className="flex flex-col items-center mt-3">
      <div className="text-5xl drop-shadow">{faces[mood]}</div>
    </div>
  );
}

export default function App() {
  const todayDate = new Date();
  const today = todayDate.getDate();
  const todayKey = todayDate.toDateString();

  const quotes = [
    "Disciplina é escolher o que queres mais sobre o que queres agora.",
    "Pequenos progressos diários constroem resultados extraordinários.",
    "Motivação começa o jogo, consistência ganha.",
    "Não esperes por vontade — cria hábito.",
    "O desconforto de hoje é a força de amanhã.",
    "Foco é dizer não ao que não importa.",
    "Resultados vêm de ações repetidas, não de intenções.",
    "Ser melhor 1% todos os dias muda tudo."
  ];

  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  const [goal, setGoal] = useState(() => JSON.parse(localStorage.getItem("goal")) || 2);
  const [water, setWater] = useState(() => JSON.parse(localStorage.getItem("water")) || 0);
  const [days, setDays] = useState(() => JSON.parse(localStorage.getItem("days")) || {});

  const [exerciseLog, setExerciseLog] = useState(() => JSON.parse(localStorage.getItem("exerciseLog")) || {});
  const [exercise, setExercise] = useState("");
  const [selectedDay, setSelectedDay] = useState(today);

  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem("notes")) || []);
  const [newNote, setNewNote] = useState("");

  const [challenges, setChallenges] = useState(() => JSON.parse(localStorage.getItem("challenges")) || []);
  const [newChallenge, setNewChallenge] = useState("");

  useEffect(() => {
    const lastDay = localStorage.getItem("lastDay");
    if (lastDay !== todayKey) {
      setWater(0);
      localStorage.setItem("lastDay", todayKey);
    }
  }, [todayKey]);

  useEffect(() => localStorage.setItem("water", JSON.stringify(water)), [water]);
  useEffect(() => localStorage.setItem("goal", JSON.stringify(goal)), [goal]);
  useEffect(() => localStorage.setItem("days", JSON.stringify(days)), [days]);
  useEffect(() => localStorage.setItem("exerciseLog", JSON.stringify(exerciseLog)), [exerciseLog]);
  useEffect(() => localStorage.setItem("notes", JSON.stringify(notes)), [notes]);
  useEffect(() => localStorage.setItem("challenges", JSON.stringify(challenges)), [challenges]);

  useEffect(() => {
    setExercise(exerciseLog[selectedDay] || "");
  }, [selectedDay, exerciseLog]);

  const saveDay = () => {
    const success = water >= goal;
    setDays(prev => ({ ...prev, [today]: success ? "✓" : "X" }));
  };

  const increase = () => setWater(w => +(w + 0.25).toFixed(2));
  const decrease = () => setWater(w => +(Math.max(0, w - 0.25)).toFixed(2));

  const saveExercise = () => {
    if (!exercise.trim()) return;
    setExerciseLog(prev => ({ ...prev, [selectedDay]: exercise.trim() }));
  };

  const removeExercise = () => {
    const updated = { ...exerciseLog };
    delete updated[selectedDay];
    setExerciseLog(updated);
    setExercise("");
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    setNotes([...notes, newNote.trim()]);
    setNewNote("");
  };

  const removeNote = (i) => {
    setNotes(notes.filter((_, index) => index !== i));
  };

  const addChallenge = () => {
    if (!newChallenge.trim()) return;
    setChallenges([...challenges, { name: newChallenge.trim(), streak: 0, lives: 3 }]);
    setNewChallenge("");
  };

  const updateChallenge = (i, success) => {
    const updated = [...challenges];
    if (success) updated[i].streak += 1;
    else {
      if (updated[i].lives > 0) updated[i].lives -= 1;
      else updated[i].streak = 0;
    }
    setChallenges(updated);
  };

  const removeChallenge = (i) => {
    setChallenges(challenges.filter((_, index) => index !== i));
  };

  let mood = "neutral";
  if (water >= goal) mood = "happy";
  if (water < goal && days[today] === "X") mood = "sad";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex justify-center p-6">
      <div className="w-full max-w-md space-y-5">
        <div className="bg-white rounded-3xl shadow-xl p-5 text-center">
          <h1 className="text-3xl font-bold">Alex 2.0</h1>
          <p className="text-sm text-gray-500 italic mt-2">"{quote}"</p>
          <Mascot mood={mood} />
        </div>
      </div>
    </div>
  );
}