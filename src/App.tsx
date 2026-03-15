/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scroll, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  ChevronRight, 
  RefreshCcw,
  History,
  Scale,
  BookOpen,
  Stethoscope
} from 'lucide-react';

// --- Types ---

type Question = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: 'Historia' | 'Ética' | 'Ciencia';
};

type GameState = 'start' | 'playing' | 'result';

// --- Data ---

const QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'Historia',
    question: "¿Quién fue el médico más influyente de la Antigua Roma, cuyas teorías dominaron la medicina durante más de 1500 años?",
    options: ["Hipócrates", "Galeno de Pérgamo", "Asclepio", "Celso"],
    correctIndex: 1,
    explanation: "Galeno fue el médico personal de varios emperadores y sus escritos sobre anatomía y fisiología fueron la base de la medicina occidental hasta el Renacimiento."
  },
  {
    id: 2,
    category: 'Ciencia',
    question: "¿En qué teoría se basaba principalmente el diagnóstico médico romano para explicar el equilibrio del cuerpo?",
    options: ["Teoría de los Gérmenes", "Teoría de los Miastmas", "Teoría de los Cuatro Humores", "Teoría Atómica"],
    correctIndex: 2,
    explanation: "La medicina romana heredó la idea de que la salud dependía del equilibrio entre sangre, flema, bilis amarilla y bilis negra."
  },
  {
    id: 3,
    category: 'Historia',
    question: "¿Cuál fue la mayor contribución de Roma a la salud pública y la prevención de enfermedades?",
    options: ["La invención del microscopio", "Acueductos, termas y alcantarillado", "La creación de la penicilina", "El uso de vacunas obligatorias"],
    correctIndex: 1,
    explanation: "Roma destacó por su ingeniería sanitaria, entendiendo que el agua limpia y la eliminación de residuos (Cloaca Maxima) eran vitales para la salud de la ciudad."
  },
  {
    id: 4,
    category: 'Ética',
    question: "En la ética médica romana, ¿qué significaba el concepto de 'Primum non nocere'?",
    options: ["Lo primero es cobrar", "Lo primero es no hacer daño", "El paciente siempre tiene la razón", "Curar a cualquier precio"],
    correctIndex: 1,
    explanation: "Es un principio fundamental que insta al médico a considerar siempre los riesgos de un tratamiento antes de aplicarlo."
  },
  {
    id: 5,
    category: 'Historia',
    question: "¿Cómo se llamaban los hospitales militares romanos diseñados para mantener la salud de las legiones?",
    options: ["Valetudinaria", "Tabernae", "Domus", "Insulae"],
    correctIndex: 0,
    explanation: "Los Valetudinaria fueron precursores de los hospitales modernos, con salas separadas y sistemas de ventilación avanzados."
  },
  {
    id: 6,
    category: 'Ciencia',
    question: "¿Por qué Galeno realizaba disecciones en cerdos y monos en lugar de humanos?",
    options: ["Por falta de herramientas", "Porque los humanos eran sagrados", "Por prohibición legal en Roma", "Porque no le interesaba la anatomía humana"],
    correctIndex: 2,
    explanation: "La ley romana prohibía la disección de cadáveres humanos, lo que llevó a Galeno a cometer algunos errores anatómicos al extrapolar de animales."
  },
  {
    id: 7,
    category: 'Ética',
    question: "¿Cuál era la principal crítica ética a los médicos que trabajaban en el 'Ludus' (escuela de gladiadores)?",
    options: ["Usar a los heridos para experimentos", "No cobrar lo suficiente", "Ser demasiado compasivos", "No usar anestesia"],
    correctIndex: 0,
    explanation: "Aunque era una gran oportunidad para aprender anatomía, existía el dilema de tratar a los gladiadores solo para que volvieran a morir en la arena."
  },
  {
    id: 8,
    category: 'Ciencia',
    question: "¿Qué herramienta quirúrgica romana, muy similar a las modernas, se utilizaba para extraer fragmentos de hueso o proyectiles?",
    options: ["El estetoscopio", "La pinza o fórceps", "El termómetro", "La jeringa de cristal"],
    correctIndex: 1,
    explanation: "Los cirujanos romanos contaban con un instrumental de bronce y hierro asombrosamente avanzado, incluyendo fórceps, bisturíes y espéculos."
  },
  {
    id: 9,
    category: 'Historia',
    question: "¿Quién escribió 'De Materia Medica', el manual de farmacología más importante de la antigüedad usado en Roma?",
    options: ["Julio César", "Dioscórides", "Séneca", "Nerón"],
    correctIndex: 1,
    explanation: "Dioscórides fue un médico griego que sirvió en el ejército romano, catalogando cientos de plantas y sus propiedades curativas."
  },
  {
    id: 10,
    category: 'Ética',
    question: "¿Cómo se llamaban las mujeres que ejercían la medicina o la obstetricia en la sociedad romana?",
    options: ["Vestales", "Medicae u Obstetrices", "Sibilas", "Patricias"],
    correctIndex: 1,
    explanation: "Aunque la medicina era mayoritariamente masculina, existían mujeres médicas (medicae) y parteras (obstetrices) muy respetadas en la sociedad."
  }
];

// --- Components ---

export default function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = QUESTIONS[currentQuestionIndex];

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === currentQuestion.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setGameState('result');
    }
  };

  const resetGame = () => {
    setGameState('start');
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f2ed] text-stone-900 font-sans selection:bg-stone-200">
      {/* Background Texture Overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

      <main className="max-w-2xl mx-auto px-6 py-12 min-h-screen flex flex-col">
        
        {/* Header */}
        <header className="mb-12 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-stone-300 text-[11px] uppercase tracking-[0.2em] font-bold mb-4"
          >
            <History size={14} />
            Quiz de Medicina Antigua
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-serif font-black tracking-tighter leading-none mb-4">
            MEDICVS <span className="text-stone-400 italic">QVIZ</span>
          </h1>
          <p className="text-stone-500 font-serif italic text-lg">Ética e Historia de la Medicina Romana</p>
        </header>

        <AnimatePresence mode="wait">
          {gameState === 'start' && (
            <motion.div 
              key="start"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-8"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-stone-200/50 rounded-full blur-2xl" />
                <Scroll size={80} className="relative text-stone-800" strokeWidth={1} />
              </div>
              <div className="space-y-4 max-w-md">
                <p className="text-lg leading-relaxed text-stone-600">
                  Demuestra tus conocimientos sobre los avances, dilemas y figuras clave de la medicina en el Imperio Romano.
                </p>
                <button 
                  onClick={() => setGameState('playing')}
                  className="group relative px-8 py-4 bg-stone-900 text-white rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
                >
                  <span className="relative z-10 font-bold tracking-widest uppercase text-sm flex items-center gap-2">
                    Empezar Cuestionario <ChevronRight size={18} />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-stone-800 to-stone-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div 
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col gap-6"
            >
              {/* Progress Bar */}
              <div className="w-full h-1 bg-stone-200 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-stone-800"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-stone-400">
                <span>Pregunta {currentQuestionIndex + 1} de {QUESTIONS.length}</span>
                <span className={`px-2 py-1 rounded border ${
                  currentQuestion.category === 'Ética' ? 'border-emerald-200 text-emerald-600' :
                  currentQuestion.category === 'Historia' ? 'border-blue-200 text-blue-600' :
                  'border-amber-200 text-amber-600'
                }`}>
                  {currentQuestion.category}
                </span>
              </div>

              {/* Question Card */}
              <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl shadow-stone-200/50 border border-stone-200">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-800 mb-8 leading-tight">
                  {currentQuestion.question}
                </h2>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => {
                    const isCorrect = idx === currentQuestion.correctIndex;
                    const isSelected = idx === selectedOption;
                    
                    let buttonClass = "border-stone-200 hover:border-stone-400";
                    if (isAnswered) {
                      if (isCorrect) buttonClass = "bg-emerald-50 border-emerald-500 text-emerald-800";
                      else if (isSelected) buttonClass = "bg-red-50 border-red-500 text-red-800";
                      else buttonClass = "opacity-50 border-stone-100";
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => handleOptionClick(idx)}
                        className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center justify-between group ${buttonClass}`}
                      >
                        <span className="font-medium">{option}</span>
                        {isAnswered && isCorrect && <CheckCircle2 size={20} className="text-emerald-500" />}
                        {isAnswered && isSelected && !isCorrect && <XCircle size={20} className="text-red-500" />}
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {isAnswered && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-8 pt-8 border-t border-stone-100"
                    >
                      <div className="flex gap-4 items-start">
                        <div className="p-2 bg-stone-100 rounded-lg shrink-0">
                          <BookOpen size={18} className="text-stone-600" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-widest font-bold text-stone-400 mb-1">Sabías que...</p>
                          <p className="text-stone-600 leading-relaxed italic">{currentQuestion.explanation}</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleNext}
                        className="mt-8 w-full py-4 bg-stone-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-stone-900 transition-colors"
                      >
                        {currentQuestionIndex === QUESTIONS.length - 1 ? 'Ver Resultados' : 'Siguiente Pregunta'}
                        <ChevronRight size={18} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {gameState === 'result' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-10"
            >
              <div className="relative">
                <div className="absolute -inset-8 bg-amber-100/50 rounded-full blur-3xl" />
                <Trophy size={80} className="relative text-amber-500" strokeWidth={1.5} />
              </div>

              <div className="space-y-2">
                <h2 className="text-4xl font-serif font-bold">¡Cuestionario Completado!</h2>
                <p className="text-stone-500">Has demostrado tu conocimiento médico.</p>
              </div>

              <div className="bg-white p-10 rounded-[2.5rem] border border-stone-200 shadow-xl w-full max-w-sm">
                <p className="text-6xl font-serif font-black text-stone-800 mb-2">{score}/{QUESTIONS.length}</p>
                <p className="text-xs uppercase tracking-[0.2em] font-bold text-stone-400">Puntuación Final</p>
                
                <div className="mt-8 pt-8 border-t border-stone-50">
                  <p className="text-stone-600 italic">
                    {score === QUESTIONS.length ? "¡Perfecto! Eres un verdadero sucesor de Galeno." :
                     score > QUESTIONS.length / 2 ? "¡Buen trabajo! Tienes una base sólida de historia médica." :
                     "Sigue estudiando los pergaminos antiguos para mejorar."}
                  </p>
                </div>
              </div>

              <button 
                onClick={resetGame}
                className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors font-bold uppercase tracking-widest text-xs"
              >
                <RefreshCcw size={16} /> Reintentar Cuestionario
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-auto pt-12 text-center">
          <div className="h-px bg-stone-200 w-24 mx-auto mb-6" />
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400">
            S.P.Q.R. • Medicina • Ética • Historia
          </p>
        </footer>
      </main>
    </div>
  );
}
