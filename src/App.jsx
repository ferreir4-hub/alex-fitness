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

  const [goal, setGoal] = useState(() => {
    const saved = localStorage.getItem("goal");
    return saved ? JSON.parse(saved) : 2;
  });
  
  const [water, setWater] = useState(() => {
    const saved = localStorage.getItem("water");
    return saved ? JSON.parse(saved) : 0;
  });
  
  const [days, setDays] = useState(() => {
    const saved = localStorage.getItem("days");
    return saved ? JSON.parse(saved) : {};
  });

  // Reset diário CORRETO
  useEffect(() => {
    const lastDay = localStorage.getItem("lastDay");
    const savedWater = localStorage.getItem(`water_${todayKey}`);
    
    if (lastDay !== todayKey) {
      // Salva o water do dia anterior antes de resetar
      if (lastDay) {
        localStorage.setItem(`water_${lastDay}`, JSON.stringify(water));
      }
      
      // Carrega o water do dia atual se existir
      if (savedWater !== null) {
        setWater(JSON.parse(savedWater));
      } else {
        setWater(0);
      }
      
      localStorage.setItem("lastDay", todayKey);
    } else if (savedWater !== null && water === 0) {
      // Recupera o water do dia atual se a página foi recarregada
      setWater(JSON.parse(savedWater));
    }
  }, [todayKey]);

  // Persistir water específico por dia
  useEffect(() => {
    localStorage.setItem(`water_${todayKey}`, JSON.stringify(water));
  }, [water, todayKey]);
  
  // Persistir goal
  useEffect(() => {
    localStorage.setItem("goal", JSON.stringify(goal));
  }, [goal]);
  
  // Persistir days
  useEffect(() => {
    localStorage.setItem("days", JSON.stringify(days));
  }, [days]);

  const inc = () => setWater(v => +(v + 0.25).toFixed(2));
  const dec = () => setWater(v => +(Math.max(0, v - 0.25)).toFixed(2));

  const saveDay = () => {
    const ok = water >= goal;
    const newDays = { ...days, [today]: ok ? "✓" : "X" };
    setDays(newDays);
    
    // Feedback visual
    alert(ok ? `🥳 Parabéns! Hoje você atingiu sua meta de ${goal}L!` : `😔 Você bebeu ${water}L de ${goal}L. Tente amanhã!`);
  };

  const ok = water >= goal;
  const percent = Math.min(100, (water / goal) * 100);
  const remaining = Math.max(0, goal - water);

  return (
    <div className="min-h-screen flex justify-center p-6 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md space-y-5">
        
        <div className="bg-white rounded-3xl shadow-xl p-5 text-center transform transition-all hover:scale-105">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Alex App
          </h1>
          <p className="text-sm text-gray-500 mt-2">💪 Foco diário na hidratação</p>
          <Mascot ok={ok} />
          {!ok && remaining > 0 && (
            <p className="text-sm text-blue-600 mt-2">Faltam {remaining}L para sua meta!</p>
          )}
          {ok && (
            <p className="text-sm text-green-600 mt-2">🎉 Meta alcançada! Parabéns!</p>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-5">
          <div className="flex justify-between items-center mb-4">
            <label className="font-semibold text-gray-700">🎯 Meta diária</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.25"
                value={goal}
                onChange={(e) => setGoal(Number(e.target.value))}
                className="w-20 text-center border-2 border-gray-200 rounded-lg py-1 focus:border-blue-400 focus:outline-none"
              />
              <span className="text-gray-600">litros</span>
            </div>
          </div>

          <div className="text-center mb-4">
            <p className="text-5xl font-bold text-blue-600">{water}</p>
            <p className="text-gray-500">de {goal} litros</p>
          </div>

          {/* Barra de progresso */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="flex justify-center gap-6 mt-4">
            <button 
              onClick={dec} 
              className="w-12 h-12 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-all font-bold text-xl"
              disabled={water === 0}
            >
              -
            </button>
            <button 
              onClick={inc} 
              className="w-12 h-12 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-all font-bold text-xl"
            >
              +
            </button>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">📅 Fevereiro 2026</p>
            <div className="grid grid-cols-7 gap-1 text-xs">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(day => (
                <div key={day} className="text-center font-semibold text-gray-500 py-1">{day}</div>
              ))}
              {/* Ajuste para começar no dia correto (1º fevereiro 2026 é domingo) */}
              {Array.from({ length: 7 }, (_, i) => (
                <div key={`empty-${i}`} className="p-1"></div>
              ))}
              {Array.from({ length: 28 }, (_, i) => {
                const d = i + 1;
                const mark = days[d];
                const isToday = d === today;

                let bgClass = "bg-gray-50 hover:bg-gray-100";
                let textClass = "text-gray-700";
                
                if (mark === "✓") {
                  bgClass = "bg-green-200";
                  textClass = "text-green-800 font-bold";
                }
                if (mark === "X") {
                  bgClass = "bg-red-200";
                  textClass = "text-red-700";
                }
                if (isToday && !mark) {
                  bgClass = "bg-blue-500";
                  textClass = "text-white font-bold";
                }

                return (
                  <div key={d} className={`p-2 rounded-lg text-center transition-all ${bgClass} ${textClass}`}>
                    {d}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={saveDay}
            className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
          >
            💾 Guardar Dia
          </button>
        </div>

      </div>
    </div>
  );
}
