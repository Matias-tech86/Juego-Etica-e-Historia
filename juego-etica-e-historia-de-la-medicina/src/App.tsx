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
  BookOpen,
  ShieldCheck,
  Crown,
  Medal,
  User,
  MapPin
} from 'lucide-react';

// --- Types ---

type Period = {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
};

type Question = {
  id: number;
  story: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: 'Historia' | 'Ética' | 'Ciencia';
};

type GameState = 'start' | 'playing' | 'result';

// --- Data ---

const PERIODS: Period[] = [
  {
    name: "El Legado de Hipócrates",
    description: "He llegado a la isla de Cos. Aquí, el aire es puro y los hombres han dejado de culpar a los dioses por sus males. Debo aprender el arte de la observación.",
    icon: <History size={24} />,
    color: "stone"
  },
  {
    name: "Alejandría: El Saber Prohibido",
    description: "En la gran biblioteca, los sabios desafían los tabúes. Por primera vez, el interior del hombre es explorado con rigor científico.",
    icon: <BookOpen size={24} />,
    color: "stone"
  },
  {
    name: "Roma: Medicina de Guerra",
    description: "Las legiones marchan y con ellas, el ingenio médico. En los Valetudinaria, la supervivencia es una cuestión de disciplina y acero.",
    icon: <ShieldCheck size={24} />,
    color: "stone"
  },
  {
    name: "La Urbe y la Salud Pública",
    description: "Roma no solo cura con hierbas, sino con agua limpia y alcantarillas. La salud de la ciudad es la salud del Imperio.",
    icon: <MapPin size={24} />,
    color: "stone"
  },
  {
    name: "El Imperio de Galeno",
    description: "Claudio Galeno domina el saber médico desde la corte imperial. Sus escritos serán la ley por los siglos venideros.",
    icon: <Crown size={24} />,
    color: "stone"
  }
];

const QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'Historia',
    story: "He llegado a la isla de Cos. Un anciano de mirada serena me entrega un pergamino y me dice: 'La medicina no es magia, es observación'.",
    question: "¿A quién debo este primer gran juramento?",
    options: ["Galeno", "Hipócrates", "Aristóteles", "Avicena"],
    correctIndex: 1,
    explanation: "He aprendido que Hipócrates de Cos fue quien separó la medicina de la superstición, estableciendo las bases éticas que ahora guían mi pluma."
  },
  {
    id: 2,
    category: 'Ciencia',
    story: "En el Templo de Esculapio, el maestro me explica que mi cuerpo es un microcosmos de la naturaleza. Si mi bilis negra se desborda y pierdo el equilibrio...",
    question: "¿Qué teoría estoy presenciando?",
    options: ["Teoría de los Gérmenes", "Teoría de los Cuatro Humores", "Teoría de los Miastmas", "Teoría de la Evolución"],
    correctIndex: 1,
    explanation: "Entiendo ahora que la salud depende del equilibrio de mis fluidos internos: sangre, flema, bilis amarilla y negra."
  },
  {
    id: 3,
    category: 'Historia',
    story: "En el frente de batalla, veo a los cirujanos militares atendiendo a los heridos con una eficiencia asombrosa. Tienen hospitales dedicados solo para los soldados.",
    question: "¿Cómo llamamos a estos primeros hospitales militares de campaña en Roma?",
    options: ["Asklepiones", "Valetudinaria", "Tabernae", "Basílicas"],
    correctIndex: 1,
    explanation: "He visto cómo los Valetudinaria romanos sentaron las bases de la organización hospitalaria moderna, priorizando la recuperación de las tropas."
  },
  {
    id: 4,
    category: 'Ciencia',
    story: "En la Escuela de Alejandría, un sabio me muestra que los nervios no son tubos vacíos, sino que llevan la sensibilidad al cerebro. Ha distinguido entre venas y arterias.",
    question: "¿Quién es este pionero de la anatomía humana?",
    options: ["Herófilo", "Erasístrato", "Arquímedes", "Euclides"],
    correctIndex: 0,
    explanation: "Herófilo de Calcedonia es considerado el primer anatomista; sus disecciones en Alejandría revelaron secretos que el mundo antiguo apenas sospechaba."
  },
  {
    id: 5,
    category: 'Ciencia',
    story: "Un médico me explica que la digestión no es una cocción por calor, sino un proceso mecánico. Cree que el corazón es una bomba, no el asiento del alma.",
    question: "¿Cómo se llama este colega de Herófilo que estudió el sistema circulatorio?",
    options: ["Ptolomeo", "Erasístrato", "Aristarco", "Seleuco"],
    correctIndex: 1,
    explanation: "Erasístrato fue un visionario que entendió la función de las válvulas del corazón y la importancia de los vasos sanguíneos."
  },
  {
    id: 6,
    category: 'Historia',
    story: "Camino junto a la Cloaca Máxima. El Archiatra me explica que alejar los desperdicios de la ciudad previene las fiebres que matan a miles.",
    question: "¿Qué concepto de salud pública romana estoy presenciando?",
    options: ["Inmunización", "Saneamiento ambiental", "Cuarentena", "Cirugía estética"],
    correctIndex: 1,
    explanation: "Roma entendió antes que nadie que el agua limpia y el alcantarillado son las medicinas más poderosas para una gran población."
  },
  {
    id: 7,
    category: 'Ciencia',
    story: "Claudio Galeno me invita a ver una disección de un mono. Dice que lo que aprende de los animales se aplica al hombre, aunque a veces dudo de sus conclusiones.",
    question: "¿En qué ciudad comenzó Galeno su carrera como médico de gladiadores?",
    options: ["Atenas", "Pérgamo", "Cartago", "Bizancio"],
    correctIndex: 1,
    explanation: "En Pérgamo, Galeno aprendió sobre anatomía y trauma curando las heridas de los gladiadores, lo que lo llevó a ser el médico más famoso de Roma."
  },
  {
    id: 8,
    category: 'Ética',
    story: "Un ciudadano rico me pide que ponga fin al sufrimiento de su esclavo enfermo. Recuerdo las palabras del maestro de Cos: 'No daré veneno a nadie, aunque me lo pidan'.",
    question: "¿Qué principio ético del Juramento Hipocrático estoy defendiendo?",
    options: ["Justicia", "No maleficencia", "Autonomía", "Veracidad"],
    correctIndex: 1,
    explanation: "El 'Primum non nocere' (lo primero es no hacer daño) es el pilar que guía mi mano, incluso ante las presiones de los poderosos."
  },
  {
    id: 9,
    category: 'Historia',
    story: "En el mercado, veo a los 'Capsarii'. Llevan vendas y ungüentos en cajas circulares, listos para socorrer a los heridos en cualquier momento.",
    question: "¿A qué cuerpo pertenecían estos primeros 'enfermeros' de combate?",
    options: ["Pretorianos", "Legionarios médicos", "Gladiadores", "Vigiles"],
    correctIndex: 1,
    explanation: "Los Capsarii eran soldados entrenados para dar primeros auxilios en el campo de batalla, los ancestros de nuestros paramédicos."
  },
  {
    id: 10,
    category: 'Historia',
    story: "El Imperio es vasto, pero el saber se unifica. Galeno ha escrito cientos de tratados que resumen todo lo que sabemos. Siento que este es el fin de una era y el inicio de un dogma.",
    question: "¿Durante cuántos siglos dominaron las ideas de Galeno la medicina europea?",
    options: ["5 siglos", "10 siglos", "Más de 13 siglos", "20 siglos"],
    correctIndex: 2,
    explanation: "Es asombroso pensar que las observaciones de Galeno, con sus aciertos y errores, serían la verdad absoluta hasta el Renacimiento."
  }
];

const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

const RANKS = [
  { min: 0, title: "Estudiante Perdido", desc: "Me siento perdido en las calles de Roma. Mis notas son confusas y los maestros apenas me miran. Debo esforzarme más.", icon: User },
  { min: 4, title: "Aprendiz de la Isla Tiberina", desc: "He comenzado a entender los humores. Mis notas muestran promesa y empiezo a ganarme el respeto de mis tutores.", icon: BookOpen },
  { min: 7, title: "Médico de Campo", desc: "Mis viajes me han dado una visión clara. Siento que las legiones confiarían sus vidas en mis manos.", icon: ShieldCheck },
  { min: 9, title: "Maestro Archiatra", desc: "He completado mi diario. Siento que Galeno mismo pediría leer mis observaciones. Mi viaje ha sido un éxito.", icon: Crown }
];

// --- Components ---

const JournalBorder = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {/* Ornate Corners */}
    <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-stone-800 m-2 rounded-tl-lg" />
    <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-stone-800 m-2 rounded-tr-lg" />
    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-stone-800 m-2 rounded-bl-lg" />
    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-stone-800 m-2 rounded-br-lg" />
    
    {/* Inner Decorative Line */}
    <div className="absolute inset-6 border border-stone-400/30" />
    
    {/* Wax Seal Placeholder area */}
    <div className="absolute -top-4 -left-4 w-12 h-12 wax-seal rounded-full flex items-center justify-center text-amber-200/50 rotate-12">
      <Crown size={20} />
    </div>
  </div>
);

export default function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const currentRank = [...RANKS].reverse().find(r => score >= r.min) || RANKS[0];
  
  const currentPeriodIndex = Math.floor(currentQuestionIndex / 2);
  const currentPeriod = PERIODS[currentPeriodIndex];

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
    <div className="min-h-screen bg-[#e8e2d6] text-stone-900 font-sans selection:bg-stone-300 overflow-x-hidden">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.1)_100%)]" />
      
      {/* Floating Dust Particles Effect (CSS only) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-stone-400/20 rounded-full"
            animate={{
              y: [0, -1000],
              x: [0, Math.random() * 100 - 50],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              delay: Math.random() * 10
            }}
            style={{
              left: `${Math.random() * 100}%`,
              bottom: '-10px'
            }}
          />
        ))}
      </div>

      <main className="max-w-4xl mx-auto px-6 py-12 min-h-screen flex flex-col relative z-10">
        
        {/* Header */}
        <header className="mb-16 text-center relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block mb-6"
          >
            <div className="flex items-center justify-center gap-4 mb-2">
              <div className="h-px w-16 bg-stone-800" />
              <History size={20} className="text-stone-800" />
              <div className="h-px w-16 bg-stone-800" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.6em] font-bold text-stone-600">
              Codex Medicus • Roma Aeterna
            </p>
          </motion.div>
          
          <div className="relative inline-block">
            <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tighter leading-tight mb-2 text-stone-900 uppercase ink-bleed">
              Diario de un <span className="text-stone-500 italic block md:inline">Aprendiz</span>
            </h1>
            <div className="flex items-center justify-center gap-2 mt-6">
              <div className="w-2 h-2 rounded-full bg-stone-800" />
              <div className="h-1 w-32 bg-stone-800" />
              <div className="w-2 h-2 rounded-full bg-stone-800" />
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {gameState === 'start' && (
            <motion.div 
              key="start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, rotate: -2 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-12"
            >
              <div className="relative">
                <motion.div 
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 10, repeat: Infinity }}
                  className="relative w-64 h-80 parchment-bg shadow-2xl border-2 border-stone-800 p-8 flex flex-col items-center justify-center gap-6"
                >
                  <JournalBorder />
                  <Scroll size={80} className="text-stone-800 opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  <div className="relative z-10 space-y-4">
                    <div className="w-16 h-16 mx-auto bg-stone-900 rounded-full flex items-center justify-center text-amber-100 shadow-lg">
                      <BookOpen size={32} />
                    </div>
                    <h3 className="font-serif font-black text-xl uppercase tracking-widest">Anno Domini CLXIV</h3>
                    <div className="h-px w-full bg-stone-300" />
                    <p className="font-hand text-2xl text-stone-600 leading-tight">
                      "He llegado a las puertas de la Ciudad Eterna. Mi pluma está lista."
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-8 max-w-2xl">
                <div className="space-y-4">
                  <h2 className="text-4xl font-serif font-black text-stone-900 tracking-tight uppercase">El Viaje de un Sanador</h2>
                  <p className="text-xl leading-relaxed text-stone-700 font-sans italic">
                    Has cruzado mares y montañas para llegar a Roma. En tus manos llevas un pergamino en blanco que pronto se llenará con los secretos de la vida, la muerte y la moral.
                  </p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                  <button 
                    onClick={() => setGameState('playing')}
                    className="group relative px-12 py-6 bg-stone-900 text-white transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                  >
                    <span className="relative z-10 font-serif font-black tracking-[0.4em] uppercase text-sm flex items-center gap-4">
                      Comenzar mi Crónica <ChevronRight size={20} />
                    </span>
                    <div className="absolute inset-0 bg-stone-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div 
              key="playing"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col gap-10"
            >
              {/* Travel Map Progress */}
              <div className="relative h-12 flex items-center justify-between px-4 mb-4">
                <div className="absolute inset-0 h-1 bg-stone-800/20 top-1/2 -translate-y-1/2 rounded-full" />
                <motion.div 
                  className="absolute left-0 h-1 bg-stone-800 top-1/2 -translate-y-1/2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentQuestionIndex / (QUESTIONS.length - 1)) * 100}%` }}
                />
                {PERIODS.map((p, i) => (
                  <div key={i} className="relative z-10 flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                      i <= currentPeriodIndex ? 'bg-stone-900 border-stone-900 text-white scale-110' : 'bg-stone-100 border-stone-300 text-stone-400'
                    }`}>
                      {p.icon}
                    </div>
                    <span className="absolute -bottom-6 text-[8px] font-black uppercase tracking-widest whitespace-nowrap opacity-50">
                      {p.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Journal Page */}
              <div className="relative parchment-bg rounded-sm shadow-[0_40px_80px_rgba(0,0,0,0.2)] border-2 border-stone-800 overflow-hidden min-h-[600px]">
                <JournalBorder />
                
                {/* Ink Splatter Decoration */}
                <div className="absolute top-10 right-10 w-24 h-24 bg-stone-900/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-20 left-10 w-32 h-32 bg-stone-900/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="p-10 md:p-16 relative z-10">
                  {/* Period Header */}
                  <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8 border-b-2 border-stone-800/20 pb-10">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-full bg-stone-900 flex items-center justify-center text-amber-100 shadow-xl border-4 border-stone-200/20">
                        {currentPeriod.icon}
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.4em] font-black text-stone-500 mb-1">Capítulo del Codex</p>
                        <h3 className="text-2xl font-serif font-black text-stone-900 uppercase tracking-tight">{currentPeriod.name}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-1">Folio</p>
                        <p className="text-4xl font-serif font-black text-stone-900 leading-none">{ROMAN_NUMERALS[currentQuestionIndex]}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-12">
                    <div className="relative mb-10">
                      <div className="absolute -left-6 top-0 bottom-0 w-1 bg-stone-800/10" />
                      <p className="text-2xl font-hand text-stone-600 leading-relaxed pl-4 italic">
                        "{currentQuestion.story}"
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-px flex-1 bg-stone-200" />
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border-2 ${
                        currentQuestion.category === 'Ética' ? 'bg-emerald-900 border-emerald-700 text-emerald-50' :
                        currentQuestion.category === 'Historia' ? 'bg-blue-900 border-blue-700 text-blue-50' :
                        'bg-amber-900 border-amber-700 text-amber-50'
                      }`}>
                        {currentQuestion.category}
                      </span>
                      <div className="h-px flex-1 bg-stone-200" />
                    </div>

                    <h2 className="text-3xl md:text-5xl font-serif font-black text-stone-900 mb-16 leading-tight tracking-tighter ink-bleed">
                      {currentQuestion.question}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-5">
                    {currentQuestion.options.map((option, idx) => {
                      const isCorrect = idx === currentQuestion.correctIndex;
                      const isSelected = idx === selectedOption;
                      
                      let buttonClass = "bg-white/40 border-stone-300 hover:bg-white/80 hover:border-stone-800 hover:translate-x-2";
                      if (isAnswered) {
                        if (isCorrect) buttonClass = "bg-stone-900 text-white border-stone-900 scale-[1.02] shadow-2xl z-20";
                        else if (isSelected) buttonClass = "bg-red-900 text-red-50 border-red-700 opacity-80";
                        else buttonClass = "opacity-30 border-stone-200 grayscale scale-95";
                      }

                      return (
                        <button
                          key={idx}
                          disabled={isAnswered}
                          onClick={() => handleOptionClick(idx)}
                          className={`w-full text-left p-6 rounded-none border-2 transition-all duration-300 flex items-center justify-between group relative ${buttonClass}`}
                        >
                          <div className="flex items-center gap-8">
                            <span className={`text-lg font-serif font-black transition-colors ${isAnswered && isCorrect ? 'text-amber-400' : 'text-stone-400 group-hover:text-stone-900'}`}>
                              {ROMAN_NUMERALS[idx]}.
                            </span>
                            <span className="font-bold tracking-tight text-lg md:text-xl">{option}</span>
                          </div>
                          {isAnswered && isCorrect && <CheckCircle2 size={24} className="text-amber-400" />}
                          {isAnswered && isSelected && !isCorrect && <XCircle size={24} className="text-red-200" />}
                        </button>
                      );
                    })}
                  </div>

                  <AnimatePresence>
                    {isAnswered && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-16 pt-16 border-t-4 border-double border-stone-800/20"
                      >
                        <div className="bg-stone-900 text-stone-100 p-10 rounded-none relative shadow-2xl overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -mr-16 -mt-16 rounded-full blur-2xl" />
                          <div className="absolute -top-4 left-10 bg-amber-600 text-white px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] shadow-lg">
                            Reflexión del Maestro
                          </div>
                          <p className="text-stone-200 leading-relaxed font-hand text-3xl italic">
                            "{currentQuestion.explanation}"
                          </p>
                        </div>
                        
                        <button
                          onClick={handleNext}
                          className="mt-10 w-full py-8 bg-stone-900 text-white font-black uppercase tracking-[0.5em] text-xs hover:bg-stone-800 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex items-center justify-center gap-6 group"
                        >
                          {currentQuestionIndex === QUESTIONS.length - 1 ? 'Sellar mi Destino' : 'Continuar mi Viaje'}
                          <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'result' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-12"
            >
              <div className="relative">
                <motion.div 
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 0 }}
                  className="bg-white p-16 rounded-none border-4 border-stone-900 shadow-[0_40px_100px_rgba(0,0,0,0.4)] w-full max-w-md relative parchment-bg"
                >
                  <JournalBorder />
                  <div className="relative z-10">
                    <p className="text-9xl font-serif font-black text-stone-900 mb-4 leading-none ink-bleed">
                      {score}<span className="text-4xl text-stone-400">/10</span>
                    </p>
                    <div className="h-1 w-24 bg-stone-800 mx-auto mb-4" />
                    <p className="text-[12px] uppercase tracking-[0.5em] font-black text-stone-500">Sabiduría Alcanzada</p>
                  </div>
                </motion.div>
                
                {/* Decorative Stamp */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 wax-seal rounded-full flex items-center justify-center text-amber-200 shadow-2xl rotate-12 z-20 border-4 border-stone-900/20">
                  <Medal size={40} />
                </div>
              </div>

              <div className="space-y-8 max-w-xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <div className="h-px w-8 bg-stone-300" />
                    <currentRank.icon size={32} className="text-stone-800" />
                    <div className="h-px w-8 bg-stone-300" />
                  </div>
                  <h2 className="text-5xl font-serif font-black text-stone-900 tracking-tight uppercase">{currentRank.title}</h2>
                  <div className="relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-stone-800/10" />
                    <p className="text-2xl font-hand text-stone-600 leading-relaxed italic pl-6">
                      "{currentRank.desc}"
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={resetGame}
                    className="group relative px-12 py-6 bg-stone-900 text-white transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-4"
                  >
                    <RefreshCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                    <span className="font-serif font-black tracking-[0.4em] uppercase text-sm">Reiniciar mi Crónica</span>
                  </button>
                  
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">
                    Tu viaje ha sido registrado en los anales de la historia.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-20 pt-12 border-t-2 border-stone-800/10 text-center">
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="h-px w-12 bg-stone-300" />
            <div className="w-2 h-2 wax-seal rounded-full" />
            <div className="h-px w-12 bg-stone-300" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-stone-400 mb-2">
            Ex Officina Marcus • Roma
          </p>
          <p className="text-[9px] font-serif italic text-stone-400">
            "Ars longa, vita brevis"
          </p>
        </footer>
      </main>
    </div>
  );
}
