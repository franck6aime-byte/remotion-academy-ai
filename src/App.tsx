import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Video, Award, Sparkles, Database, Cpu, Play, Pause, 
  RotateCcw, CheckCircle2, XCircle, Flame, ArrowRight, Lock, 
  Trophy, MessageSquare, HelpCircle, Send, Terminal, ChevronRight, 
  ChevronLeft, Trash2, Download, RefreshCw, Sliders, Eye, Code, 
  GraduationCap, TrendingUp, Settings, User, Compass, FolderOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUserProfile, getRankName } from './lib/useUserProfile';
import { ACADEMY_MODULES, BADGES } from './data/academyData';
import { Lesson, Module, RenderItem, Question } from './types';
import { RemotionPreview } from './components/RemotionPreview';
import { AITutor } from './components/AITutor';

export default function App() {
  const {
    profile,
    renders,
    lastNotification,
    completeLesson,
    submitQuizScore,
    submitExercise,
    recordRender,
    updateUsername,
    updateAvatar,
    resetProgress,
    fetchRenders
  } = useUserProfile();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'academy' | 'playground' | 'portfolio' | 'settings'>('dashboard');
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showTutor, setShowTutor] = useState(false);
  
  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Playground & Exercise state
  const [editorCode, setEditorCode] = useState<string>('');
  const [exercisePassed, setExercisePassed] = useState<boolean | null>(null);
  const [validationResults, setValidationResults] = useState<{ id: string; passed: boolean; desc: string }[]>([]);
  const [showSolution, setShowSolution] = useState(false);
  const [currentExerciseId, setCurrentExerciseId] = useState<string>('');
  const [activePlaygroundTab, setActivePlaygroundTab] = useState<'instructions' | 'logs'>('instructions');
  const [activeLogRender, setActiveLogRender] = useState<RenderItem | null>(null);

  // Setting States
  const [usernameInput, setUsernameInput] = useState(profile.username);
  const [avatarInput, setAvatarInput] = useState(profile.avatarUrl);

  useEffect(() => {
    setUsernameInput(profile.username);
    setAvatarInput(profile.avatarUrl);
  }, [profile]);

  // Synchronize render history every 2 seconds if any render is running
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    const hasActiveRenders = renders.some(r => r.status === 'queued' || r.status === 'rendering');
    
    if (hasActiveRenders) {
      interval = setInterval(() => {
        fetchRenders();
      }, 1500);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [renders]);

  // Handle auto-unlocking default code when lesson changes
  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);

    if (lesson.exercise) {
      setEditorCode(lesson.exercise.codeInitial);
      setExercisePassed(null);
      setCurrentExerciseId(lesson.exercise.id);
      setShowSolution(false);
      setValidationResults(lesson.exercise.validationCriteria.map(c => ({ id: c.id, passed: false, desc: c.description })));
    }
  };

  const handleLaunchExercise = (lesson: Lesson) => {
    handleSelectLesson(lesson);
    setActiveTab('playground');
  };

  // Run validation regex matches against the learner's code
  const handleTestCode = () => {
    if (!selectedLesson?.exercise) return;
    const exercise = selectedLesson.exercise;
    
    const results = exercise.validationCriteria.map(c => {
      const regex = new RegExp(c.pattern);
      const passed = regex.test(editorCode);
      return {
        id: c.id,
        passed,
        desc: c.description
      };
    });

    setValidationResults(results);
    const allPassed = results.every(r => r.passed);
    setExercisePassed(allPassed);

    // Save submission to profile state
    submitExercise(
      exercise.id,
      editorCode,
      allPassed,
      allPassed 
        ? "Excellent travail ! Votre code respecte toutes les consignes techniques et d'animations." 
        : "Certaines consignes n'ont pas encore été respectées. Ajustez votre code ou demandez de l'aide au Tuteur IA !"
    );
  };

  const handleExportVideo = async () => {
    if (!editorCode) return;
    
    try {
      const res = await fetch('/api/renders/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: editorCode,
          title: selectedLesson ? `Exercice : ${selectedLesson.title}` : "Composition Libre Playground",
          source: selectedLesson ? 'exercise' : 'playground',
          durationSeconds: selectedLesson?.id === 'm2-l2' ? 3.5 : 5
        })
      });

      if (res.ok) {
        const data = await res.json();
        recordRender(data);
        setActiveTab('portfolio');
      }
    } catch (e) {
      console.error("Failed to start render", e);
    }
  };

  // Submit Quiz scores
  const handleSubmitQuiz = (quiz: any) => {
    let correctCount = 0;
    quiz.questions.forEach((q: Question) => {
      if (quizAnswers[q.id] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / quiz.questions.length) * 100);
    setQuizScore(percentage);
    setQuizSubmitted(true);
    
    submitQuizScore(quiz.id, percentage);
  };

  // Set up general workspace statistics
  const lessonsCount = ACADEMY_MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedCount = profile.completedLessons.length;
  const progressPercent = Math.round((completedCount / lessonsCount) * 100) || 0;

  // Render a specific badge icon based on string name
  const renderBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-yellow-400" />;
      case 'BookOpen': return <BookOpen className="w-6 h-6 text-green-400" />;
      case 'Award': return <Award className="w-6 h-6 text-orange-400" />;
      case 'Video': return <Video className="w-6 h-6 text-blue-400" />;
      case 'Database': return <Database className="w-6 h-6 text-indigo-400" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-purple-400" />;
      default: return <Trophy className="w-6 h-6 text-yellow-500" />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0a0f1e] text-[#f9fafb] overflow-hidden font-sans">
      
      {/* Toast Notification for XP / Achievements */}
      <AnimatePresence>
        {lastNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 16, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#152042] border-2 border-orange-500/50 rounded-2xl p-4 shadow-2xl flex items-center gap-4 max-w-sm"
          >
            <div className="p-2.5 bg-orange-500/10 rounded-xl text-orange-400">
              {renderBadgeIcon(lastNotification.icon)}
            </div>
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-orange-400">Succès débloqué !</h4>
              <p className="text-xs font-bold text-white mt-0.5">{lastNotification.title}</p>
              <p className="text-[11px] text-slate-400 mt-1">{lastNotification.desc}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#101830] border-r border-[#1e293b] flex flex-col justify-between shrink-0">
        <div>
          {/* Header Brand */}
          <div className="p-6 border-b border-[#1e293b] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-orange-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/10">
              R
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight flex items-center gap-1.5">
                <span>REMOTION</span>
                <span className="text-xs bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded-md">ACADEMY</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Video as Code AI</p>
            </div>
          </div>

          {/* User Widget */}
          <div className="p-4 mx-3 my-4 bg-[#152042]/50 border border-[#1e293b] rounded-2xl flex items-center gap-3">
            <img 
              src={profile.avatarUrl} 
              alt={profile.username} 
              className="w-10 h-10 rounded-full border-2 border-blue-500/40 object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-xs font-bold text-white truncate">{profile.username}</h3>
              <p className="text-[10px] text-blue-400 font-semibold truncate mt-0.5">{getRankName(profile.level)}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] font-mono bg-blue-950 text-blue-300 px-1 py-0.5 rounded">Niv. {profile.level}</span>
                <span className="text-[9px] font-mono text-slate-400">{profile.xp} XP</span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="px-3 space-y-1">
            <button
              onClick={() => { setActiveTab('dashboard'); setSelectedLesson(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all ${
                activeTab === 'dashboard' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Compass className="w-4.5 h-4.5" />
              <span>Tableau de Bord</span>
            </button>

            <button
              onClick={() => { setActiveTab('academy'); setSelectedLesson(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all ${
                activeTab === 'academy' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-4.5 h-4.5" />
              <span>Académie (8 Modules)</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('playground');
                // Open default sample code if no lesson active
                if (!editorCode) {
                  setEditorCode(`import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';\n\nexport const MyVideo = () => {\n  const frame = useCurrentFrame();\n  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });\n  \n  return (\n    <AbsoluteFill className="bg-slate-950 flex flex-col items-center justify-center text-white">\n      <h1 className="text-4xl font-extrabold text-blue-500">Playground Libre</h1>\n      <p style={{ opacity }} className="text-slate-400 mt-2">Codez des compositions React !</p>\n    </AbsoluteFill>\n  );\n};`);
                  setValidationResults([]);
                  setExercisePassed(null);
                  setCurrentExerciseId('');
                }
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all ${
                activeTab === 'playground' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Code className="w-4.5 h-4.5" />
              <span>Atelier de Code (Sandbox)</span>
            </button>

            <button
              onClick={() => { setActiveTab('portfolio'); setSelectedLesson(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all ${
                activeTab === 'portfolio' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <FolderOpen className="w-4.5 h-4.5" />
              <span>Mes Créations</span>
              {renders.some(r => r.status === 'queued' || r.status === 'rendering') && (
                <span className="ml-auto w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              )}
            </button>

            <button
              onClick={() => { setActiveTab('settings'); setSelectedLesson(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all ${
                activeTab === 'settings' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Settings className="w-4.5 h-4.5" />
              <span>Configuration</span>
            </button>
          </nav>
        </div>

        {/* Brand Bottom Indicator */}
        <div className="p-4 border-t border-[#1e293b] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="text-xs font-bold">{profile.streakCount} Jour{profile.streakCount > 1 ? 's' : ''} de Série</span>
          </div>
          <button 
            onClick={() => setShowTutor(!showTutor)}
            className="flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:text-blue-300"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Tuteur IA</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        <div className="flex-1 flex flex-col overflow-y-auto p-6 md:p-8 space-y-6">
          
          {/* Active Tab Screen Routers */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Profile Card / Overview */}
              <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#131f47] to-[#0a1128] border border-[#1e293b] relative overflow-hidden">
                <div className="absolute right-0 top-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Bonjour, {profile.username} 👋</h2>
                    <p className="text-sm text-slate-400 mt-1">Vous progressez à pas de géant. Voici votre avancée dans l'Académie Remotion :</p>
                    
                    {/* Progress Bar */}
                    <div className="mt-6">
                      <div className="flex justify-between items-center text-xs font-mono mb-2">
                        <span className="text-blue-400 font-bold">Progression Académie</span>
                        <span className="text-slate-400 font-bold">{progressPercent}% • {completedCount}/{lessonsCount} Leçons</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-600 to-orange-500 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Fire Streak Widget */}
                  <div className="flex items-center gap-4 bg-[#152042] border border-[#1e293b] p-4 rounded-2xl shrink-0 self-start md:self-auto">
                    <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500">
                      <Flame className="w-8 h-8 fill-orange-500 animate-pulse" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Série quotidienne</div>
                      <div className="text-xl font-black font-mono mt-0.5">{profile.streakCount} Jour{profile.streakCount > 1 ? 's' : ''}</div>
                      <div className="text-[10px] text-orange-400 font-bold mt-1 uppercase tracking-wide">Maintenez le rythme !</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid content: Checklist & Badges */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Skill Checklist */}
                <div className="p-6 rounded-3xl bg-[#101830] border border-[#1e293b]">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Compétences Validées</span>
                  </h3>
                  
                  <div className="mt-4 space-y-3">
                    {[
                      { title: 'Video as Code concept', solved: completedCount >= 2 },
                      { title: 'Orchestrer les compositions', solved: completedCount >= 4 },
                      { title: 'Intégrer useCurrentFrame()', solved: completedCount >= 5 },
                      { title: 'Dresser des Séquences temporelles', solved: completedCount >= 6 },
                      { title: 'Interpolations linéaires', solved: completedCount >= 7 },
                      { title: 'Effets physiques spring()', solved: completedCount >= 8 },
                      { title: 'Vidéos pilotées par les données JSON', solved: completedCount >= 9 },
                      { title: 'Rendu cloud AWS Lambda', solved: completedCount >= 10 },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center gap-3 bg-[#152042]/40 border border-[#1e293b] p-3 rounded-xl">
                        {s.solved ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-700 shrink-0" />
                        )}
                        <span className={`text-xs font-medium ${s.solved ? 'text-slate-300' : 'text-slate-500'}`}>{s.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements Badges Showcase */}
                <div className="p-6 rounded-3xl bg-[#101830] border border-[#1e293b] flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-orange-400 flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      <span>Collection de Badges</span>
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {BADGES.map((b) => {
                        const isUnlocked = profile.unlockedBadges.includes(b.slug);
                        return (
                          <div 
                            key={b.id} 
                            className={`p-3 rounded-2xl border flex flex-col justify-between transition-all relative group ${
                              isUnlocked 
                                ? 'bg-[#152042] border-[#1e293b] hover:border-blue-500/40 opacity-100' 
                                : 'bg-[#0a0f1e]/40 border-[#1e293b]/40 opacity-45'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className={`p-1.5 rounded-lg ${isUnlocked ? 'bg-slate-800' : 'bg-slate-900/10'}`}>
                                {renderBadgeIcon(b.icon)}
                              </div>
                              <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                b.rarity === 'legendary' ? 'bg-purple-950 text-purple-400' :
                                b.rarity === 'epic' ? 'bg-orange-950 text-orange-400' :
                                b.rarity === 'rare' ? 'bg-blue-950 text-blue-400' : 'bg-slate-800 text-slate-400'
                              }`}>
                                {b.rarity}
                              </span>
                            </div>
                            
                            <div className="mt-4">
                              <h4 className="text-[11px] font-extrabold text-white">{b.title}</h4>
                              <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{b.description}</p>
                            </div>

                            {!isUnlocked && (
                              <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] rounded-2xl flex items-center justify-center">
                                <Lock className="w-5 h-5 text-slate-600" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {profile.certificates.length > 0 && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-orange-500/10 to-blue-500/10 border-2 border-orange-500/30 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/20 rounded-xl text-orange-400">
                          <GraduationCap className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-white">Certificat Obtenu ! 🎓</h4>
                          <p className="text-[10px] text-orange-400 font-semibold mt-0.5">Vérification : {profile.certificates[0].id}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => alert(`Certificat Officiel Remotion Academy AI\nDécerné à : ${profile.username}\nCode Unique : ${profile.certificates[0].id}\nDate : ${profile.certificates[0].date}`)}
                        className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition-all"
                      >
                        Afficher
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Academy Link */}
              <div className="p-6 rounded-3xl bg-[#101830] border border-[#1e293b] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 bg-blue-600/10 rounded-2xl text-blue-400">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">Prêt à reprendre vos leçons ?</h3>
                    <p className="text-xs text-slate-400 mt-1">Reprenez l'académie là où vous vous êtes arrêté pour cumuler plus de points d'XP.</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('academy')}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 self-start md:self-auto transition-all"
                >
                  <span>Accéder à l'Académie</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {activeTab === 'academy' && !selectedLesson && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between border-b border-[#1e293b] pb-4">
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight">Académie Remotion Video-as-Code</h2>
                  <p className="text-xs text-slate-400 mt-1">Parcourez les 8 modules interactifs complets pour maîtriser la programmation vidéo.</p>
                </div>
              </div>

              {/* Grid of Modules */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ACADEMY_MODULES.map((m) => {
                  // Lock condition: module is locked if previous module hasn't been completed at least 1 lesson
                  const isFirst = m.order === 0;
                  const prevModule = isFirst ? null : ACADEMY_MODULES.find(x => x.order === m.order - 1);
                  const isLocked = !isFirst && prevModule && !prevModule.lessons.some(l => profile.completedLessons.includes(l.id));

                  return (
                    <div 
                      key={m.id} 
                      className={`p-6 rounded-3xl border flex flex-col justify-between transition-all relative ${
                        isLocked 
                          ? 'bg-[#0a0f1e]/40 border-[#1e293b]/40 opacity-55' 
                          : 'bg-[#101830] border-[#1e293b] hover:border-blue-500/30'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono bg-blue-950 text-blue-400 border border-blue-500/10 px-2.5 py-0.5 rounded-full">
                            Module {m.order}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">{m.lessons.length} leçons • +{m.xpTotal} XP</span>
                        </div>

                        <h3 className="text-base font-extrabold mt-4 text-white flex items-center gap-2">
                          {isLocked && <Lock className="w-4 h-4 text-slate-500 shrink-0" />}
                          <span>{m.title}</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">{m.description}</p>

                        {/* List of lessons inside */}
                        <div className="mt-5 space-y-2">
                          {m.lessons.map((l) => {
                            const completed = profile.completedLessons.includes(l.id);
                            return (
                              <button
                                key={l.id}
                                disabled={isLocked}
                                onClick={() => handleSelectLesson(l)}
                                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#152042]/50 hover:bg-[#1d2b5a]/40 border border-[#1e293b] text-left transition-all"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  {completed ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                  ) : (
                                    <BookOpen className="w-4 h-4 text-slate-500 shrink-0" />
                                  )}
                                  <span className="text-xs font-bold text-slate-300 truncate">{l.title}</span>
                                </div>
                                <span className="text-[10px] font-mono text-slate-500 shrink-0">{l.durationMinutes} min</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Launch Quiz/Project button if unlocked */}
                      {!isLocked && (
                        <div className="mt-6 pt-4 border-t border-[#1e293b]/50 flex items-center justify-between">
                          <div className="text-[10px] text-slate-400">
                            Status : {m.lessons.every(l => profile.completedLessons.includes(l.id)) ? 'Complété' : 'En cours'}
                          </div>
                          <button
                            onClick={() => handleSelectLesson(m.lessons[0])}
                            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                          >
                            <span>Démarrer le module</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* Active Lesson Content Page */}
          {activeTab === 'academy' && selectedLesson && (
            <div className="space-y-6">
              
              {/* Breadcrumb Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e293b] pb-4">
                <div>
                  <button 
                    onClick={() => setSelectedLesson(null)} 
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-bold"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Retour aux modules</span>
                  </button>
                  <h2 className="text-xl font-extrabold mt-2 tracking-tight text-white">{selectedLesson.title}</h2>
                  <p className="text-xs text-slate-400 mt-1">Module {ACADEMY_MODULES.find(m => m.id === selectedLesson.moduleId)?.title}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
                    +{selectedLesson.xp} XP
                  </span>
                  
                  {profile.completedLessons.includes(selectedLesson.id) ? (
                    <span className="text-xs font-bold text-green-400 bg-green-950/30 border border-green-500/20 px-3 py-1 rounded-lg flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Complété
                    </span>
                  ) : (
                    <button
                      onClick={() => completeLesson(selectedLesson.id, selectedLesson.xp)}
                      className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded-lg transition-all"
                    >
                      Valider la théorie
                    </button>
                  )}
                </div>
              </div>

              {/* Course Markdown content body */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left hand: Lesson Content */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-[#101830] border border-[#1e293b] rounded-3xl p-6 md:p-8 space-y-4">
                    
                    {/* Render lesson textual contents beautifully */}
                    <div className="prose prose-invert max-w-none text-slate-300 text-xs leading-relaxed space-y-4">
                      {selectedLesson.content.split('\n\n').map((para, pIdx) => {
                        if (para.startsWith('###')) {
                          return <h3 key={pIdx} className="text-base font-extrabold text-white mt-6 mb-2">{para.replace('###', '').trim()}</h3>;
                        }
                        if (para.startsWith('####')) {
                          return <h4 key={pIdx} className="text-xs font-extrabold text-blue-400 uppercase tracking-wider mt-4 mb-1">{para.replace('####', '').trim()}</h4>;
                        }
                        if (para.startsWith('*')) {
                          return (
                            <ul key={pIdx} className="list-disc list-inside space-y-1 pl-2">
                              {para.split('\n').map((li, lIdx) => (
                                <li key={lIdx} className="text-slate-300">{li.replace('*', '').trim()}</li>
                              ))}
                            </ul>
                          );
                        }
                        if (para.startsWith('```')) {
                          const lines = para.split('\n');
                          const code = lines.slice(1, -1).join('\n');
                          return (
                            <pre key={pIdx} className="bg-[#050b1a] p-4 rounded-xl font-mono text-[11px] text-emerald-400 overflow-x-auto border border-[#1e293b] my-4 leading-tight">
                              <code>{code}</code>
                            </pre>
                          );
                        }
                        return <p key={pIdx} className="leading-relaxed">{para}</p>;
                      })}
                    </div>
                  </div>

                  {/* Quiz Section below Lesson */}
                  {selectedLesson && (
                    <div className="bg-[#101830] border border-[#1e293b] rounded-3xl p-6 md:p-8 space-y-6">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-orange-400 flex items-center gap-2">
                        <HelpCircle className="w-4.5 h-4.5" />
                        <span>Validation des Connaissances (Quiz)</span>
                      </h3>

                      <div className="space-y-6">
                        {ACADEMY_MODULES.find(m => m.id === selectedLesson.moduleId)?.quiz.questions.map((q, qIdx) => (
                          <div key={q.id} className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-300">
                              {qIdx + 1}. {q.statement}
                            </h4>
                            
                            <div className="grid gap-2">
                              {q.options.map((opt, oIdx) => {
                                const isSelected = quizAnswers[q.id] === oIdx;
                                const isCorrect = q.correctAnswerIndex === oIdx;
                                
                                let optionBg = "bg-[#152042]/50 hover:bg-[#1d2b5a]/40 border-[#1e293b]";
                                if (quizSubmitted) {
                                  if (isCorrect) optionBg = "bg-green-950/30 border-green-500 text-green-400";
                                  else if (isSelected) optionBg = "bg-red-950/30 border-red-500 text-red-400";
                                  else optionBg = "bg-[#0a0f1e]/30 border-[#1e293b]/50 opacity-50";
                                } else if (isSelected) {
                                  optionBg = "bg-blue-950/40 border-blue-500 text-blue-400";
                                }

                                return (
                                  <button
                                    key={oIdx}
                                    disabled={quizSubmitted}
                                    onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: oIdx }))}
                                    className={`p-3 text-left rounded-xl border text-xs font-medium transition-all ${optionBg}`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>

                            {quizSubmitted && q.explanation && (
                              <div className="p-3 bg-slate-900 rounded-xl text-[11px] text-slate-400 leading-relaxed border-l-2 border-blue-500">
                                <span className="font-bold text-blue-400 block mb-0.5">Explication :</span>
                                {q.explanation}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {!quizSubmitted ? (
                        <button
                          onClick={() => {
                            const module = ACADEMY_MODULES.find(m => m.id === selectedLesson.moduleId);
                            if (module) handleSubmitQuiz(module.quiz);
                          }}
                          className="w-full py-3 bg-orange-500 hover:bg-orange-600 rounded-xl text-xs font-extrabold transition-all"
                        >
                          Valider mes réponses
                        </button>
                      ) : (
                        <div className="p-4 bg-blue-950/20 border border-blue-500/20 rounded-2xl text-center space-y-2">
                          <div className="text-xl font-extrabold text-blue-400">Score obtenu : {quizScore}%</div>
                          <p className="text-xs text-slate-400">
                            {quizScore && quizScore >= 70 
                              ? "Félicitations ! Vous avez validé ce module avec succès." 
                              : "Vous n'avez pas atteint les 70% requis. Réessayez pour améliorer votre score !"}
                          </p>
                          <button
                            onClick={() => {
                              setQuizAnswers({});
                              setQuizSubmitted(false);
                              setQuizScore(null);
                            }}
                            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-all"
                          >
                            Recommencer le quiz
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                </div>

                {/* Right hand: Exercise Panel sidebar */}
                <div className="space-y-6">
                  {selectedLesson.exercise ? (
                    <div className="bg-[#101830] border-2 border-blue-500/20 rounded-3xl p-6 space-y-4">
                      <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl w-fit">
                        <Video className="w-6 h-6 animate-pulse" />
                      </div>
                      
                      <h3 className="font-extrabold text-sm text-white">Exercice Pratique Disponible !</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Pratiquez directement sur la timeline pour valider les notions d'animation de cette leçon.
                      </p>

                      <div className="bg-slate-900 p-3 rounded-xl border border-[#1e293b] space-y-2">
                        <div className="text-[10px] uppercase font-bold text-slate-500">Objectif :</div>
                        <p className="text-xs text-slate-300 font-medium leading-relaxed">
                          {selectedLesson.exercise.title}
                        </p>
                      </div>

                      <button
                        onClick={() => handleLaunchExercise(selectedLesson)}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/15"
                      >
                        <Code className="w-4 h-4" />
                        <span>Lancer l'Éditeur Interactif</span>
                      </button>
                    </div>
                  ) : (
                    <div className="bg-[#101830] border border-[#1e293b] rounded-3xl p-6 text-center space-y-3">
                      <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
                      <h4 className="font-bold text-xs text-slate-400">Pas d'exercice pour cette leçon</h4>
                      <p className="text-[11px] text-slate-500">Validez simplement le quiz théorique au bas de l'écran pour empocher vos XP.</p>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {activeTab === 'playground' && (
            <div className="space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e293b] pb-4">
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight text-white">
                    {selectedLesson?.exercise ? `Exercice : ${selectedLesson.exercise.title}` : "Atelier de Code Libre"}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {selectedLesson?.exercise ? "Complétez le code React et testez vos animations." : "Exprimez votre créativité sans aucune limite avec Remotion."}
                  </p>
                </div>
                
                {selectedLesson?.exercise && (
                  <button
                    onClick={() => {
                      setSelectedLesson(null);
                      setActiveTab('academy');
                    }}
                    className="text-xs font-bold text-slate-400 hover:text-white"
                  >
                    Retour à l'Académie
                  </button>
                )}
              </div>

              {/* Playground Editor Pane */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Area: Instructions (5cols) */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {selectedLesson?.exercise ? (
                    <div className="p-6 rounded-3xl bg-[#101830] border border-[#1e293b] space-y-4">
                      <h3 className="text-xs font-extrabold uppercase tracking-widest text-blue-400">Consignes de l'Exercice</h3>
                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                        {selectedLesson.exercise.instructions}
                      </p>

                      {/* Criteria validation list */}
                      <div className="space-y-2 pt-3 border-t border-[#1e293b]/50">
                        <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Critères de validation :</h4>
                        {validationResults.map((v, i) => (
                          <div key={v.id} className="flex items-start gap-2 bg-slate-900/50 p-2.5 rounded-xl border border-[#1e293b]">
                            {exercisePassed !== null && v.passed ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            ) : exercisePassed !== null && !v.passed ? (
                              <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0 mt-0.5" />
                            )}
                            <span className="text-[11px] text-slate-300 leading-tight">{v.desc}</span>
                          </div>
                        ))}
                      </div>

                      {exercisePassed === true && (
                        <div className="p-3 bg-green-950/20 border border-green-500/20 text-green-400 rounded-xl text-[11px] font-bold text-center animate-bounce">
                          Félicitations ! Vous avez résolu l'exercice ! +30 XP débloqués. 🎉
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 rounded-3xl bg-[#101830] border border-[#1e293b] space-y-4">
                      <h3 className="text-xs font-extrabold uppercase tracking-widest text-blue-400">Aide Mémoire Remotion</h3>
                      <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                        <p>Déclarez vos variables d'animation dans la fonction de composition principale :</p>
                        <pre className="bg-[#050b1a] p-2 rounded-lg text-[10px] font-mono text-emerald-400">
                          {`const frame = useCurrentFrame();\nconst opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });`}
                        </pre>
                        <p>Utilisez des structures absolues flexbox pour caler le contenu :</p>
                        <pre className="bg-[#050b1a] p-2 rounded-lg text-[10px] font-mono text-emerald-400">
                          {`<AbsoluteFill className="bg-slate-950 flex items-center justify-center">`}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Launch Video button block */}
                  <div className="p-6 bg-[#101830] border border-[#1e293b] rounded-3xl space-y-3">
                    <h3 className="text-xs font-bold text-white">Générer le rendu final MP4</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Lancer une compilation asynchrone côté serveur pour transformer votre code React en une véritable vidéo MP4 téléchargeable.
                    </p>
                    <button
                      onClick={handleExportVideo}
                      className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-500 hover:to-orange-400 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                      <Video className="w-4 h-4" />
                      <span>Exporter en MP4</span>
                    </button>
                  </div>

                </div>

                {/* Center Area: Editor Box & Visualizer (8cols) */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Visualizer Player */}
                  <RemotionPreview 
                    code={editorCode} 
                    defaultProps={{ productName: "iPhone 15 Pro", userName: profile.username }}
                    durationInFrames={selectedLesson?.id === 'm2-l2' ? 105 : 150}
                  />

                  {/* Code Editor Area */}
                  <div className="flex flex-col bg-[#050b1a] border border-[#1e293b] rounded-2xl overflow-hidden shadow-lg">
                    {/* Editor Toolbar */}
                    <div className="flex items-center justify-between px-4 py-2.5 bg-[#0d152a] border-b border-[#1e293b]">
                      <div className="flex items-center gap-2">
                        <Code className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-bold text-slate-300">Éditeur de Code TSX</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {selectedLesson?.exercise && (
                          <button
                            onClick={() => setShowSolution(!showSolution)}
                            className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md font-bold transition-all"
                          >
                            {showSolution ? "Cacher la solution" : "Afficher Solution"}
                          </button>
                        )}
                        <button
                          onClick={() => setEditorCode(selectedLesson?.exercise?.codeInitial || '')}
                          className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800"
                          title="Réinitialiser le code de l'exercice"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Textarea Code block wrapper */}
                    <div className="relative font-mono text-xs p-4 bg-[#0a101f] min-h-[250px] flex gap-4">
                      {/* Line numbers column */}
                      <div className="text-slate-600 text-right select-none pr-3 border-r border-[#1e293b]/50">
                        {Array.from({ length: editorCode.split('\n').length || 1 }).map((_, i) => (
                          <div key={i}>{i + 1}</div>
                        ))}
                      </div>
                      
                      <textarea
                        value={showSolution ? (selectedLesson?.exercise?.codeSolution || '') : editorCode}
                        onChange={(e) => {
                          if (showSolution) return;
                          setEditorCode(e.target.value);
                        }}
                        className="flex-1 bg-transparent text-emerald-400 font-mono text-xs outline-none resize-none leading-relaxed min-h-[200px]"
                        style={{ tabSize: 2 }}
                        spellCheck={false}
                      />
                    </div>

                    {/* Check Button bar */}
                    {selectedLesson?.exercise && (
                      <div className="p-3 bg-[#0d152a] border-t border-[#1e293b] flex justify-end">
                        <button
                          onClick={handleTestCode}
                          className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Tester mon Code</span>
                        </button>
                      </div>
                    )}
                  </div>

                </div>

              </div>

            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between border-b border-[#1e293b] pb-4">
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight">Mes Créations (Rendus MP4)</h2>
                  <p className="text-xs text-slate-400 mt-1">Suivez les compilations de vos vidéos Remotion en temps réel et téléchargez vos MP4.</p>
                </div>
              </div>

              {renders.length === 0 ? (
                <div className="text-center p-12 bg-[#101830] border border-[#1e293b] rounded-3xl space-y-4 max-w-xl mx-auto mt-6">
                  <Video className="w-12 h-12 text-slate-600 mx-auto animate-pulse" />
                  <h3 className="font-extrabold text-sm text-slate-300">Aucun rendu enregistré</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Dirigez-vous vers l'Atelier de Code (Sandbox) pour programmer votre première animation et cliquez sur "Exporter en MP4" pour lancer la file d'attente !
                  </p>
                  <button
                    onClick={() => setActiveTab('playground')}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all"
                  >
                    Lancer l'Éditeur
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {renders.map((r) => (
                    <div 
                      key={r.id} 
                      className="p-5 rounded-3xl bg-[#101830] border border-[#1e293b] flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3.5 bg-blue-600/10 text-blue-400 rounded-2xl shrink-0 mt-1">
                          <Video className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-white">{r.title}</h4>
                          <p className="text-[10px] text-slate-500 font-mono mt-1">
                            Lancé le : {new Date(r.createdAt).toLocaleTimeString()} • Durée : {r.durationSeconds}s • ID : {r.id}
                          </p>
                          
                          {/* Progress bar in compile time */}
                          {(r.status === 'queued' || r.status === 'rendering') && (
                            <div className="mt-3 space-y-1">
                              <div className="flex justify-between text-[9px] font-mono text-blue-400">
                                <span className="animate-pulse">{r.status === 'queued' ? "En file d'attente..." : "Compilation en cours..."}</span>
                                <span>{r.progress}%</span>
                              </div>
                              <div className="h-1.5 w-44 bg-slate-950 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${r.progress}%` }}></div>
                              </div>
                            </div>
                          )}

                          {r.status === 'done' && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-950/20 px-2 py-0.5 rounded-md mt-2">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Rendu réussi
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-auto">
                        <button
                          onClick={() => {
                            // Find matching simulated logs and open terminal view
                            setActiveLogRender(r as any);
                          }}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold flex items-center gap-1.5"
                        >
                          <Terminal className="w-3.5 h-3.5" />
                          <span>Logs de Rendu</span>
                        </button>
                        
                        {r.status === 'done' && r.url && (
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-blue-500/10"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Télécharger MP4</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Logs Drawer Popup */}
              {activeLogRender && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                  <div className="bg-[#050b1a] border border-[#1e293b] rounded-2xl p-6 w-full max-w-2xl text-[#f9fafb]">
                    <div className="flex items-center justify-between border-b border-[#1e293b] pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-orange-500" />
                        <h3 className="font-extrabold text-sm">Console Logs Remotion-Engine</h3>
                      </div>
                      <button 
                        onClick={() => setActiveLogRender(null)}
                        className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>

                    <pre className="bg-[#02050c] p-4 rounded-xl text-[10px] font-mono text-emerald-500 leading-normal overflow-y-auto max-h-[350px] space-y-1">
                      {/* Render real raw log streams from simulated renders */}
                      {(activeLogRender as any).logs?.map((l: string, i: number) => (
                        <div key={i}>{l}</div>
                      )) || (
                        <div>
                          [06:46:50] Initialisation Remotion CLI...\n
                          [06:46:51] Rendu finalisé avec succès !
                        </div>
                      )}
                    </pre>

                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => setActiveLogRender(null)}
                        className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold"
                      >
                        Fermer la console
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between border-b border-[#1e293b] pb-4">
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight">Configuration de l'Étudiant</h2>
                  <p className="text-xs text-slate-400 mt-1">Ajustez vos informations personnelles ou réinitialisez votre progression.</p>
                </div>
              </div>

              <div className="max-w-xl space-y-6">
                
                {/* Profile update details */}
                <div className="bg-[#101830] border border-[#1e293b] rounded-3xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <User className="w-4.5 h-4.5" />
                    <span>Identité de l'apprenant</span>
                  </h3>
                  
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pseudo de l'étudiant :</label>
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      className="w-full bg-slate-900 border border-[#1e293b] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">URL de l'avatar :</label>
                    <input
                      type="text"
                      value={avatarInput}
                      onChange={(e) => setAvatarInput(e.target.value)}
                      className="w-full bg-slate-900 border border-[#1e293b] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    onClick={() => {
                      updateUsername(usernameInput);
                      updateAvatar(avatarInput);
                      alert("Profil mis à jour avec succès !");
                    }}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Sauvegarder les modifications
                  </button>
                </div>

                {/* API Key info panel */}
                <div className="bg-[#101830] border border-[#1e293b] rounded-3xl p-6 space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Settings className="w-4.5 h-4.5 text-blue-500" />
                    <span>Clés API et Securité</span>
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Vos clés secrètes pour utiliser Gemini ou vos rendus AWS Lambda sont gérées directement et de manière sécurisée par l'interface d'AI Studio.
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed font-mono bg-slate-900/60 p-3 rounded-xl border border-[#1e293b]">
                    Variables système configurées :<br />
                    • GEMINI_API_KEY : Injecté<br />
                    • REMOTION_LAMBDA : Simulé
                  </p>
                </div>

                {/* Reset Progress zone */}
                <div className="bg-red-950/20 border border-red-500/20 rounded-3xl p-6 space-y-3">
                  <h3 className="text-sm font-extrabold text-red-400 flex items-center gap-2">
                    <Trash2 className="w-4.5 h-4.5" />
                    <span>Zone de danger</span>
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Cette action réinitialisera l'intégralité de votre avancée, effacera vos scores de quiz, réinitialisera votre XP et verrouillera les leçons de l'Académie.
                  </p>
                  <button
                    onClick={() => {
                      if (confirm("Êtes-vous sûr de vouloir réinitialiser toute votre progression de l'académie ? Cette action est irréversible !")) {
                        resetProgress();
                      }
                    }}
                    className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold transition-all"
                  >
                    Réinitialiser mes données
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Floating Sidebar AI Assistant Panel */}
        {showTutor && (
          <div className="absolute inset-y-0 right-0 z-40 h-full flex shrink-0">
            <AITutor 
              contexte={selectedLesson ? `Leçon active : ${selectedLesson.title}` : undefined} 
              codeActuel={editorCode || undefined}
              onClose={() => setShowTutor(false)}
            />
          </div>
        )}

        {/* Floating assistant bubble helper */}
        {!showTutor && (
          <button
            onClick={() => setShowTutor(true)}
            className="fixed bottom-6 right-6 z-30 p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-out text-xs font-bold whitespace-nowrap">
              Assistant IA Tuteur
            </span>
          </button>
        )}

      </main>
    </div>
  );
}
