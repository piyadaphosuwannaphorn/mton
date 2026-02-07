
import React, { useState, useEffect } from 'react';
import { CURRICULUM } from './constants';
import { Subject, LessonItem, ViewState, QuizQuestion } from './types';
import SpeechButton from './components/SpeechButton';
import { playSound } from './services/ttsService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
  const [activeLesson, setActiveLesson] = useState<LessonItem | null>(null);
  
  // Quiz states
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    playSound("สวัสดีจ้า ยินดีต้อนรับสู่ SmartLearn คลังความรู้ ม.ต้น ฉบับเรียนลัดเข้าใจง่าย พร้อมสอบเข้า ม.4 แล้วนะจ๊ะ", 0.9);
  }, []);

  const handleSubjectClick = (subject: Subject) => {
    setActiveSubject(subject);
    setView('subject');
    playSound(`วิชา ${subject.name}. มาเจาะลึกบทเรียนกันเลยจ้า`);
  };

  const handleLessonClick = (lesson: LessonItem) => {
    setActiveLesson(lesson);
    setView('lesson');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    playSound(`บทเรียนเรื่อง ${lesson.title.split(': ')[1] || lesson.title}`);
  };

  const startQuiz = () => {
    if (!activeLesson?.quiz) return;
    setQuizAnswers([]);
    setCurrentQuizIndex(0);
    setScore(0);
    setShowExplanation(false);
    setView('quiz');
    playSound("มาลองทำข้อสอบวัดความรู้ 10 ข้อกันจ้า ตั้งใจนะ");
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...quizAnswers, optionIndex];
    setQuizAnswers(newAnswers);

    if (currentQuizIndex < (activeLesson?.quiz?.length || 0) - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    } else {
      let finalScore = 0;
      activeLesson?.quiz?.forEach((q, idx) => {
        if (q.correctIndex === newAnswers[idx]) finalScore++;
      });
      setScore(finalScore);
      setView('result');
      playSound(`ทำเสร็จแล้วจ้า! คุณได้คะแนน ${finalScore} เต็ม 10 คะแนน`);
    }
  };

  const goBack = () => {
    if (view === 'result') setView('lesson');
    else if (view === 'quiz') setView('lesson');
    else if (view === 'lesson') setView('subject');
    else if (view === 'subject') setView('dashboard');
  };

  return (
    <div className="min-h-screen pb-24 bg-orange-50/50 text-slate-800 font-sans">
      <header className="bg-white/95 backdrop-blur-2xl border-b border-orange-100 p-4 sticky top-0 z-50 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('dashboard')}>
          <div className="bg-orange-600 w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg ring-4 ring-orange-50 transition-transform hover:scale-105">SL</div>
          <div>
            <h1 className="text-lg font-black text-slate-900 leading-none">SmartLearn</h1>
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mt-0.5">M.1-M.3</span>
          </div>
        </div>
        
        {view !== 'dashboard' && (
          <button onClick={goBack} className="bg-white hover:bg-orange-50 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 border border-orange-100 shadow-sm transition-all active:scale-95 flex items-center gap-2">
             <span className="text-lg text-orange-600">←</span> ย้อนกลับ
          </button>
        )}
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        
        {/* DASHBOARD */}
        {view === 'dashboard' && (
          <div className="space-y-12 py-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">ถ้างง ทักมาหาพี่<span className="text-orange-600">เนย</span></h2>
              <p className="text-slate-800 text-lg max-w-2xl mx-auto font-medium">สรุปเนื้อหาบทเรียน พร้อมคลังข้อสอบเตรียมเข้า ม.4</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
              {CURRICULUM.map((sub) => (
                <div key={sub.id} onClick={() => handleSubjectClick(sub)} className="bg-white border-2 border-orange-50 p-12 rounded-[3.5rem] shadow-sm cursor-pointer hover:shadow-2xl hover:border-orange-200 transition-all group flex flex-col items-center gap-6">
                  <div className={`${sub.color} w-24 h-24 rounded-[2rem] flex items-center justify-center text-6xl text-white shadow-2xl group-hover:scale-110 transition-transform`}>{sub.icon}</div>
                  <h3 className="text-3xl font-black text-slate-900">{sub.name}</h3>
                  <p className="text-slate-400 text-center font-medium leading-relaxed">{sub.description}</p>
                  <div className="mt-4 px-8 py-3 bg-orange-50 rounded-2xl text-orange-600 font-black text-sm group-hover:bg-orange-600 group-hover:text-white transition-all">เข้าสู่คลังเนื้อหาและข้อสอบ ⮕</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBJECT VIEW */}
        {view === 'subject' && activeSubject && (
          <div className="space-y-10 animate-in slide-in-from-right">
             <div className={`${activeSubject.color} p-12 rounded-[3.5rem] text-white flex flex-col items-center gap-4 shadow-2xl relative overflow-hidden`}>
                <div className="absolute top-0 right-0 text-[12rem] opacity-10 pointer-events-none transform translate-x-12 translate-y-4">{activeSubject.icon}</div>
                <span className="text-7xl z-10">{activeSubject.icon}</span>
                <h2 className="text-5xl font-black z-10">{activeSubject.name}</h2>
                <p className="text-white/80 font-bold z-10 text-center">เลือกบทเรียนที่ต้องการศึกษา เนื้อหาจัดเต็มทุกหัวข้อ</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeSubject.lessons.map(lesson => (
                  <div key={lesson.id} onClick={() => handleLessonClick(lesson)} className="bg-white p-8 rounded-[2.5rem] border-2 border-transparent shadow-sm hover:border-orange-400 cursor-pointer transition-all group flex flex-col justify-between h-full">
                    <div>
                      <div className="bg-orange-50 w-fit px-3 py-1 rounded-lg text-[10px] font-black text-orange-600 uppercase tracking-widest mb-3">
                        {lesson.title.split(':')[0]}
                      </div>
                      <h4 className="text-2xl font-black text-slate-800 group-hover:text-orange-600 transition-colors">{lesson.title.split(': ')[1] || lesson.title}</h4>
                      <p className="text-slate-400 mt-2 text-sm line-clamp-2 leading-relaxed font-medium">{lesson.explanation}</p>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                       <div className="flex gap-2">
                         <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight">Lecture</span>
                         {lesson.quiz && <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight">Quiz (10)</span>}
                       </div>
                       <span className="text-orange-600 font-black text-xs group-hover:translate-x-1 transition-transform">เรียนบทนี้ ⮕</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* LESSON VIEW (DIGITAL TEXTBOOK) */}
        {view === 'lesson' && activeLesson && (
          <div className="space-y-10 animate-in zoom-in-95 max-w-4xl mx-auto">
             <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-orange-100">
                <div className={`${activeSubject?.color} p-12 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-lg`}>
                  <div className="space-y-2">
                    <span className="bg-white/20 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">{activeLesson.title.split(':')[0]}</span>
                    <h2 className="text-4xl md:text-5xl font-black leading-tight">{activeLesson.title.split(': ')[1] || activeLesson.title}</h2>
                  </div>
                  <button onClick={() => playSound(activeLesson.explanation + ". " + activeLesson.content)} className="bg-white text-slate-900 px-8 py-4 rounded-3xl text-xl hover:scale-110 transition-all shadow-xl flex items-center gap-3 font-black shrink-0">
                     <span className="text-2xl text-orange-600">🔊</span>
                     <span>ฟังบรรยาย</span>
                  </button>
                </div>
                
                <div className="p-10 md:p-16 space-y-12">
                   {/* Intro Section */}
                   <section className="bg-orange-50/50 p-10 rounded-[3rem] border-2 border-orange-100/50">
                      <h3 className="text-sm font-black text-orange-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></span>
                        เกริ่นนำบทเรียน
                      </h3>
                      <p className="text-2xl text-slate-700 leading-relaxed font-academic font-bold italic">"{activeLesson.explanation}"</p>
                   </section>

                   {/* Main Content Section */}
                   <section className="space-y-8">
                      <h3 className="text-3xl font-black text-slate-900 flex items-center gap-4">
                         <span className="w-12 h-12 bg-slate-700 text-white rounded-2xl flex items-center justify-center text-lg shadow-lg">📖</span>
                         เนื้อหาบทเรียน (Core Lecture)
                      </h3>
                      <div className="prose prose-slate max-w-none">
                         <div className="grid grid-cols-1 gap-4">
                            {activeLesson.content.split('\n').map((line, i) => (
                              <div key={i} className="flex gap-5 items-start p-8 bg-white border border-orange-50 rounded-[2rem] hover:bg-orange-50/30 transition-all duration-300 group hover:shadow-md">
                                 <span className="text-orange-600 mt-1 font-black text-2xl group-hover:scale-125 transition-transform shrink-0">•</span>
                                 <p className="text-xl font-medium text-slate-700 leading-relaxed">{line.replace('• ', '')}</p>
                              </div>
                            ))}
                         </div>
                      </div>
                   </section>
                   
                   {/* Examples Section */}
                   <section className="space-y-8">
                     <h3 className="text-3xl font-black text-slate-900 flex items-center gap-4">
                        <span className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center text-lg shadow-lg">💡</span>
                        ตัวอย่างประกอบ (Key Concept)
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {activeLesson.examples.map((ex, i) => (
                          <div key={i} className="bg-white p-8 rounded-[2.5rem] flex items-start gap-6 border-2 border-orange-50 shadow-sm hover:shadow-xl transition-all group">
                            <span className="text-6xl bg-orange-50 w-24 h-24 flex items-center justify-center rounded-3xl shrink-0 group-hover:rotate-6 transition-transform">{ex.icon}</span>
                            <div className="space-y-2">
                              <h5 className="text-xl font-black text-orange-700">{ex.title}</h5>
                              <p className="text-slate-500 text-lg font-bold leading-relaxed">{ex.detail}</p>
                            </div>
                          </div>
                        ))}
                     </div>
                   </section>
                   
                   {/* Quiz Entry Section */}
                   {activeLesson.quiz && (
                     <div className="pt-16 border-t border-orange-100">
                        <div className="bg-gradient-to-br from-slate-700 to-slate-900 p-12 rounded-[4rem] text-white text-center space-y-8 shadow-2xl relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-1 bg-orange-500"></div>
                          <div className="space-y-3">
                            <h4 className="text-4xl font-black tracking-tight">เรียนจบแล้ว... พร้อมลุยโจทย์ไหม?</h4>
                            <p className="text-white/60 text-xl font-medium">ข้อสอบระดับสูง 10 ข้อ รอคุณอยู่เพื่อทดสอบความแม่นยำ</p>
                          </div>
                          <button onClick={startQuiz} className="bg-orange-600 text-white px-16 py-6 rounded-[2rem] text-2xl font-black shadow-xl hover:-translate-y-2 transition-all active:scale-95 border-b-8 border-orange-800">
                             ✏️ เริ่มทำข้อสอบทันที
                          </button>
                        </div>
                     </div>
                   )}
                </div>
             </div>
          </div>
        )}

        {/* QUIZ VIEW */}
        {view === 'quiz' && activeLesson?.quiz && (
          <div className="space-y-10 animate-in slide-in-from-bottom-12 max-w-3xl mx-auto">
             <div className="flex justify-between items-center bg-white p-6 rounded-[2.5rem] shadow-sm border border-orange-100">
                <div className="flex gap-2.5">
                   {activeLesson.quiz.map((_, i) => (
                     <div key={i} className={`h-3 w-8 rounded-full ${i <= currentQuizIndex ? 'bg-orange-600 shadow-orange-200 shadow-lg' : 'bg-orange-100'} transition-all`}></div>
                   ))}
                </div>
                <span className="font-black text-slate-500 uppercase tracking-[0.15em] text-xs">ข้อ {currentQuizIndex + 1} / 10</span>
             </div>
             
             <div className="bg-white p-12 md:p-16 rounded-[4rem] shadow-2xl border border-orange-100 relative">
                <div className="absolute top-8 left-12 text-6xl text-orange-100 font-black pointer-events-none opacity-50">Q</div>
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-16 relative z-10">{activeLesson.quiz[currentQuizIndex].question}</h3>
                <div className="grid grid-cols-1 gap-6 relative z-10">
                   {activeLesson.quiz[currentQuizIndex].options.map((opt, i) => (
                     <button 
                       key={i} 
                       onClick={() => handleAnswer(i)}
                       className="p-8 text-left bg-orange-50/30 hover:bg-orange-600 hover:text-white rounded-[2.5rem] text-2xl font-bold transition-all border-4 border-orange-50 hover:border-orange-400 active:scale-95 flex items-center gap-8 group shadow-sm"
                     >
                        <span className="w-14 h-14 rounded-2xl bg-white text-orange-600 flex items-center justify-center font-black shadow-md group-hover:scale-110 transition-transform text-3xl">{String.fromCharCode(65 + i)}</span>
                        {opt}
                     </button>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* RESULT VIEW */}
        {view === 'result' && activeLesson?.quiz && (
          <div className="space-y-12 animate-in zoom-in-95 max-w-4xl mx-auto">
             <div className="bg-slate-900 p-20 rounded-[5rem] text-white text-center shadow-2xl ring-[24px] ring-orange-500/10 border-t-8 border-orange-600">
                <div className="text-[10rem] mb-10 animate-bounce drop-shadow-2xl">
                   {score >= 8 ? '🏆' : score >= 5 ? '⭐' : '💪'}
                </div>
                <h2 className="text-6xl font-black mb-6">
                  {score >= 8 ? 'สุดยอดไปเลย!' : score >= 5 ? 'ผ่านเกณฑ์จ้า!' : 'สู้ต่อไปนะ!'}
                </h2>
                <div className="text-8xl font-black text-orange-500 mb-10">{score} <span className="text-4xl text-slate-500">/ 10</span></div>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                   <button onClick={() => setShowExplanation(!showExplanation)} className="bg-white text-slate-900 px-12 py-6 rounded-[2.5rem] font-black text-2xl hover:bg-orange-50 transition-all active:scale-95 shadow-xl">
                      {showExplanation ? '🔒 ปิดเฉลย' : '🔓 ดูเฉลยละเอียด'}
                   </button>
                   <button onClick={() => setView('lesson')} className="bg-orange-600 text-white px-12 py-6 rounded-[2.5rem] font-black text-2xl hover:bg-orange-700 transition-all active:scale-95 shadow-xl">
                      กลับไปทบทวน
                   </button>
                </div>
             </div>

             {showExplanation && (
               <div className="space-y-8 animate-in slide-in-from-top-12">
                  <div className="flex items-center gap-4 px-6">
                    <div className="h-10 w-3 bg-orange-500 rounded-full"></div>
                    <h3 className="text-4xl font-black text-slate-800">บทวิเคราะห์ข้อสอบ</h3>
                  </div>
                  {activeLesson.quiz.map((q, idx) => (
                    <div key={idx} className="bg-white p-12 rounded-[3.5rem] border-2 border-orange-50 shadow-sm relative overflow-hidden group">
                       <div className={`absolute top-0 left-0 w-4 h-full ${quizAnswers[idx] === q.correctIndex ? 'bg-orange-500' : 'bg-slate-400'}`}></div>
                       <div className="flex items-start gap-8">
                          <span className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-black text-2xl shadow-md ${quizAnswers[idx] === q.correctIndex ? 'bg-orange-500 text-white' : 'bg-slate-400 text-white'}`}>
                             {idx + 1}
                          </span>
                          <div className="space-y-6 flex-1">
                             <h4 className="text-3xl font-black text-slate-900 leading-tight">{q.question}</h4>
                             <div className="p-8 bg-orange-50/30 rounded-[2.5rem] border-2 border-orange-100/50 space-y-4">
                                <div className="flex flex-col gap-2">
                                   <span className="font-black text-orange-600 text-xl flex items-center gap-2">
                                     <span className="w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center text-[10px] text-white">✓</span>
                                     คำตอบที่ถูกต้อง:
                                   </span>
                                   <span className="font-bold text-slate-700 text-2xl pl-7">{q.options[q.correctIndex]}</span>
                                </div>
                                <div className="text-slate-500 text-xl leading-relaxed pl-7">
                                   <span className="font-black text-slate-800 block mb-2 underline decoration-orange-200 decoration-4">คำอธิบาย:</span>
                                   {q.explanation}
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
             )}
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
