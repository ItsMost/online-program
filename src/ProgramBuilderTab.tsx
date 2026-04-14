import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, ChevronRight, ChevronLeft, Activity, Dumbbell, 
  Shield, Zap, Info, PlayCircle, Clock, Edit2, Trash2, Check, X, 
  FileDown, MessageCircle, Scale, Plus, Repeat, Save, User, BookOpen, LayoutTemplate, Flame, Percent
} from 'lucide-react';
import { exerciseLibrary } from './exercises';
import { supabase } from './supabaseClient'; // ☁️ السحابة

// ==========================================
// 1. HELPER FUNCTIONS & DATA (CALENDAR)
// ==========================================
const START_YEAR = new Date().getFullYear();

const getPhaseInfo = (monthIndex: number) => {
  if (monthIndex === 3 || monthIndex === 4 || monthIndex === 5) return { id: 'gpp', name: 'فترة التأسيس والتحمل', color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-500/30' };
  if (monthIndex === 6 || monthIndex === 7) return { id: 'max_strength', name: 'فترة القوة القصوى', color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-500/30' };
  return { id: 'power_comp', name: 'فترة القدرة والمنافسات', color: 'text-rose-500 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-900/20', border: 'border-rose-200 dark:border-rose-500/30' };
};

const MONTHS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const DAYS_AR = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

const generateMonthsList = () => {
  const months = [];
  for (let i = 3; i <= 11; i++) months.push({ year: START_YEAR, month: i });
  for (let i = 0; i <= 2; i++) months.push({ year: START_YEAR + 1, month: i });
  return months;
};

const generateWorkout = (dayOfWeek: number, phaseId: string) => {
  return { isRest: false, blocks: [] as any[] };
};

// ==========================================
// 2. MAIN BUILDER COMPONENT
// ==========================================
export default function ProgramBuilderTab({ theme, athletesDB = [] }: any) {
  const [selectedAthleteId, setSelectedAthleteId] = useState('');
  const [loadedAthleteId, setLoadedAthleteId] = useState(''); 
  const [barbellCalc, setBarbellCalc] = useState({ weight: '', unit: 'KG' });

  const monthsList = useMemo(() => generateMonthsList(), []);
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(0); 
  const [selectedDay, setSelectedDay] = useState(1);

  const [customWorkouts, setCustomWorkouts] = useState<any>({});
  
  const [editingState, setEditingState] = useState({ blockIdx: null, exIdx: null });
  const [editNameValue, setEditNameValue] = useState('');
  const [editDetailsValue, setEditDetailsValue] = useState('');
  const [editWeightValue, setEditWeightValue] = useState('');
  const [editPercentValue, setEditPercentValue] = useState(''); // 🌟 النسبة المئوية للتعديل
  
  const [addingState, setAddingState] = useState({ blockIdx: null });
  const [addNameValue, setAddNameValue] = useState('');
  const [addDetailsValue, setAddDetailsValue] = useState('');
  const [addWeightValue, setAddWeightValue] = useState('');
  const [addPercentValue, setAddPercentValue] = useState(''); // 🌟 النسبة المئوية للإضافة

  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [libraryBlocks, setLibraryBlocks] = useState<any[]>([]);

  const flatExercises = useMemo(() => Object.values(exerciseLibrary).flat(), []);

  // 🌟 استخراج اللاعب الحالي عشان نحسب منه الـ 1RM
  const currentAthlete = useMemo(() => {
    return athletesDB.find((a: any) => String(a.id || a._id) === selectedAthleteId);
  }, [selectedAthleteId, athletesDB]);

  useEffect(() => {
    const fetchLibrary = async () => {
      const { data } = await supabase.from('shared_data').select('data').eq('id', 2).single();
      if (data && data.data) {
        setLibraryBlocks(data.data);
      }
    };
    fetchLibrary();
    
    const channel = supabase
      .channel('realtime_library_programs')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'shared_data', filter: 'id=eq.2' }, (payload) => {
        if (payload.new && payload.new.data) setLibraryBlocks(payload.new.data);
      })
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (selectedAthleteId !== loadedAthleteId) {
      if (selectedAthleteId) {
        if (currentAthlete) {
          setCustomWorkouts(currentAthlete.workouts || {});
          setLoadedAthleteId(selectedAthleteId);
        }
      } else {
        setCustomWorkouts({});
        setLoadedAthleteId('');
      }
    }
  }, [selectedAthleteId, athletesDB, loadedAthleteId, currentAthlete]);

  const saveAthleteProgram = async () => {
    if (!selectedAthleteId) {
      alert('يرجى اختيار لاعب من القائمة أولاً لحفظ برنامجه!');
      return;
    }

    const updatedDB = athletesDB.map((a: any) => {
      if (String(a.id || a._id) === selectedAthleteId) {
        return { ...a, workouts: customWorkouts };
      }
      return a;
    });

    const { error } = await supabase.from('shared_data').upsert({ id: 1, data: updatedDB });
    if (error) {
      alert('حدث خطأ أثناء الحفظ! يرجى المحاولة مرة أخرى.');
    } else {
      alert('تم حفظ البرنامج التدريبي للاعب بنجاح! 🚀');
    }
  };

  const currentMonthData = monthsList[selectedMonthIdx];
  const daysInMonth = new Date(currentMonthData.year, currentMonthData.month + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonthData.year, currentMonthData.month, 1).getDay();
  const currentFullDate = new Date(currentMonthData.year, currentMonthData.month, selectedDay);
  const currentDayOfWeek = currentFullDate.getDay();
  const dateKey = `${currentMonthData.year}-${currentMonthData.month}-${selectedDay}`;
  
  const phaseInfo = getPhaseInfo(currentMonthData.month);
  const baseWorkout = generateWorkout(currentDayOfWeek, phaseInfo.id);

  const workoutData = customWorkouts[dateKey] 
    ? JSON.parse(JSON.stringify(customWorkouts[dateKey])) 
    : JSON.parse(JSON.stringify(baseWorkout));

  const currentDayTitle = workoutData.dayTitle !== undefined ? workoutData.dayTitle : DAYS_AR[currentDayOfWeek];

  // 🌟 دالة الذكاء الاصطناعي لحساب الوزن من النسبة واسم التمرين 🌟
  const autoCalcWeight = (exName: string, percentStr: string) => {
    if (!currentAthlete || !currentAthlete.testScores || !percentStr) return '';
    const p = parseFloat(percentStr);
    if (isNaN(p) || p <= 0) return '';

    const nameLower = exName.toLowerCase();
    let maxRM = 0;

    if (nameLower.includes('squat') || nameLower.includes('سكوات') || nameLower.includes('اسكوات')) {
      maxRM = parseFloat(currentAthlete.testScores.squat1RM);
    } else if (nameLower.includes('bench') || nameLower.includes('بنش')) {
      maxRM = parseFloat(currentAthlete.testScores.bench1RM);
    } else if (nameLower.includes('clean') || nameLower.includes('كلين')) {
      maxRM = parseFloat(currentAthlete.testScores.clean1RM);
    }

    if (maxRM && !isNaN(maxRM)) {
      // حساب الوزن وتقريبه لأقرب نص كيلو (0.5) عشان الطارات
      const calculated = maxRM * (p / 100);
      return (Math.round(calculated * 2) / 2).toString();
    }
    return '';
  };

  // --- Handlers for Add ---
  const handleAddNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAddNameValue(val);
    const calcWeight = autoCalcWeight(val, addPercentValue);
    if (calcWeight) setAddWeightValue(calcWeight);
  };

  const handleAddPercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAddPercentValue(val);
    const calcWeight = autoCalcWeight(addNameValue, val);
    if (calcWeight) setAddWeightValue(calcWeight);
  };

  // --- Handlers for Edit ---
  const handleEditNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEditNameValue(val);
    const calcWeight = autoCalcWeight(val, editPercentValue);
    if (calcWeight) setEditWeightValue(calcWeight);
  };

  const handleEditPercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEditPercentValue(val);
    const calcWeight = autoCalcWeight(editNameValue, val);
    if (calcWeight) setEditWeightValue(calcWeight);
  };


  const handleStartEdit = (blockIdx: any, exIdx: any, currentEx: any) => { 
    setEditingState({ blockIdx, exIdx }); 
    setEditNameValue(currentEx.name || currentEx); 
    setEditDetailsValue(currentEx.details || '');
    setEditWeightValue(currentEx.weight || ''); 
    setEditPercentValue(currentEx.percent || ''); 
    setAddingState({ blockIdx: null }); 
  };
  const handleCancelEdit = () => { setEditingState({ blockIdx: null, exIdx: null }); };
  const handleSaveEdit = (blockIdx: any, exIdx: any) => {
    const newWorkout = { ...workoutData };
    if (typeof newWorkout.blocks[blockIdx].exercises[exIdx] === 'string') {
      newWorkout.blocks[blockIdx].exercises[exIdx] = { id: Date.now(), name: editNameValue, details: editDetailsValue, weight: editWeightValue, percent: editPercentValue };
    } else {
      newWorkout.blocks[blockIdx].exercises[exIdx].name = editNameValue;
      newWorkout.blocks[blockIdx].exercises[exIdx].details = editDetailsValue;
      newWorkout.blocks[blockIdx].exercises[exIdx].weight = editWeightValue;
      newWorkout.blocks[blockIdx].exercises[exIdx].percent = editPercentValue;
    }
    setCustomWorkouts((prev: any) => ({ ...prev, [dateKey]: newWorkout }));
    handleCancelEdit();
  };
  const handleDeleteEx = (blockIdx: any, exIdx: any) => {
    const newWorkout = { ...workoutData };
    newWorkout.blocks[blockIdx].exercises.splice(exIdx, 1);
    setCustomWorkouts((prev: any) => ({ ...prev, [dateKey]: newWorkout }));
  };

  const handleStartAdd = (blockIdx: any) => { 
    setAddingState({ blockIdx }); 
    setAddNameValue(''); 
    setAddDetailsValue('3 × 10'); 
    setAddWeightValue(''); 
    setAddPercentValue('');
    handleCancelEdit(); 
  };
  const handleCancelAdd = () => { setAddingState({ blockIdx: null }); };
  const handleSaveAdd = (blockIdx: any) => {
    if(!addNameValue.trim()) return handleCancelAdd();
    const newWorkout = { ...workoutData };
    newWorkout.blocks[blockIdx].exercises.push({ id: Date.now(), name: addNameValue, details: addDetailsValue, weight: addWeightValue, percent: addPercentValue });
    setCustomWorkouts((prev: any) => ({ ...prev, [dateKey]: newWorkout }));
    handleCancelAdd();
  };

  const addNewBlock = () => {
    const newWorkout = { ...workoutData };
    if (newWorkout.isRest) { newWorkout.isRest = false; newWorkout.blocks = []; }
    newWorkout.blocks.push({ title: 'مجموعة تدريبية جديدة', iconType: 'dumbbell', exercises: [] });
    setCustomWorkouts((prev: any) => ({ ...prev, [dateKey]: newWorkout }));
  };

  const deleteBlock = (blockIdx: number) => {
    if(!window.confirm('حذف هذه المجموعة بالكامل؟')) return;
    const newWorkout = { ...workoutData };
    newWorkout.blocks.splice(blockIdx, 1);
    setCustomWorkouts((prev: any) => ({ ...prev, [dateKey]: newWorkout }));
  };

  const addLibraryBlock = (block: any) => {
    const newWorkout = { ...workoutData };
    if (newWorkout.isRest) { newWorkout.isRest = false; newWorkout.blocks = []; }
    newWorkout.blocks.push({
      title: block.name,
      iconType: block.type,
      exercises: JSON.parse(JSON.stringify(block.exercises))
    }); 
    setCustomWorkouts((prev: any) => ({ ...prev, [dateKey]: newWorkout }));
    setIsLibraryModalOpen(false);
  };

  const toggleRestDay = () => {
    const newWorkout = { ...workoutData, isRest: !workoutData.isRest };
    if (newWorkout.isRest) {
      newWorkout.title = 'راحة واستشفاء';
      newWorkout.content = 'الراحة جزء أساسي من تطور القوة. يفضل عمل إطالات خفيفة أو استخدام الفوم رولر.';
    }
    setCustomWorkouts((prev: any) => ({ ...prev, [dateKey]: newWorkout }));
  };

  const handleDayClick = (day: number) => { setSelectedDay(day); handleCancelEdit(); handleCancelAdd(); };
  const nextMonth = () => { if (selectedMonthIdx < monthsList.length - 1) { setSelectedMonthIdx(p => p + 1); setSelectedDay(1); handleCancelEdit(); handleCancelAdd(); }};
  const prevMonth = () => { if (selectedMonthIdx > 0) { setSelectedMonthIdx(p => p - 1); setSelectedDay(1); handleCancelEdit(); handleCancelAdd(); }};

  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case 'activity': case 'warmup': return <Flame className="w-5 h-5 text-orange-500" />;
      case 'dumbbell': case 'main': return <Dumbbell className="w-5 h-5 text-blue-500" />;
      case 'shield': case 'core': return <Shield className="w-5 h-5 text-emerald-500" />;
      case 'zap': case 'power': return <Zap className="w-5 h-5 text-amber-500" />;
      default: return <Activity className="w-5 h-5 text-slate-400" />;
    }
  };

  const calculatePlatesStandalone = () => {
    const weight = parseFloat(barbellCalc.weight);
    if (isNaN(weight) || weight <= 0) return [];
    const barWeight = barbellCalc.unit === 'KG' ? 20 : 45;
    let remainingWeight = (weight - barWeight) / 2;
    if (remainingWeight <= 0) return []; 
    const availablePlates = barbellCalc.unit === 'KG' ? [25, 20, 15, 10, 5, 2.5, 1.25] : [45, 35, 25, 10, 5, 2.5]; 
    const platesToUse: number[] = [];
    for (let plate of availablePlates) {
      while (remainingWeight >= plate) {
        platesToUse.push(plate);
        remainingWeight -= plate;
      }
    }
    return platesToUse;
  };

  const shareToWhatsApp = () => {
    const athleteName = currentAthlete ? (currentAthlete.playerData?.name || 'غير محدد') : 'عام';
    let message = `🏋️‍♂️ *تمرين: ${currentDayTitle}*\n👤 اللاعب: *${athleteName}*\n📅 التاريخ: *${selectedDay} ${MONTHS_AR[currentMonthData.month]}*\n🎯 المرحلة: *${phaseInfo.name}*\n━━━━━━━━━━━━━━━\n`;
    if (workoutData.isRest) { message += `🛑 *يوم راحة واستشفاء*\n${workoutData.content}\n`; } else {
      workoutData.blocks.forEach((block: any) => {
        message += `\n🔹 *${block.title || block.name}*\n`;
        block.exercises.forEach((ex: any) => { 
          const percentStr = ex.percent ? ` (${ex.percent}%)` : '';
          const weightStr = ex.weight ? ` - ⚖️ ${ex.weight}KG${percentStr}` : '';
          message += `▪️ ${ex.name || ex} (${ex.details || ''})${weightStr}\n`; 
        });
      });
    }
    message += `\n💪 *عاش يا بطل!*\n`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const exportToPDF = () => {
    const printContents = document.getElementById('printable-program')?.innerHTML;
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    const iframeDoc = iframe.contentWindow?.document;
    const athleteName = currentAthlete ? (currentAthlete.playerData?.name || 'غير محدد') : 'عام';
    if(iframeDoc) {
      iframeDoc.write(`
        <html dir="rtl">
          <head>
            <title>البرنامج التدريبي - ${athleteName}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body { font-family: Tahoma, sans-serif; padding: 20px; background: #f8fafc; }
              .no-print { display: none !important; }
              * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            </style>
          </head>
          <body>
            <div style="text-align: center; border-bottom: 2px solid #1e293b; padding-bottom: 10px; margin-bottom: 20px;">
              <h1 style="font-size: 24px; font-weight: bold; color: #0f172a; margin-bottom: 5px;">تمرين: ${currentDayTitle} (${selectedDay} ${MONTHS_AR[currentMonthData.month]})</h1>
              <p style="color: #64748b; font-weight: bold; font-size: 14px;">اللاعب: <span style="color: #0f172a;">${athleteName}</span></p>
            </div>
            ${printContents}
          </body>
        </html>
      `);
      iframeDoc.close();
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => { document.body.removeChild(iframe); }, 1000);
      }, 1500);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-right relative z-10">
      
      <datalist id="library-exercises">
        {flatExercises.map((ex: any, idx: number) => (
          <option key={idx} value={ex.name} />
        ))}
      </datalist>

      {/* 🚀 قسم حاسبة البار المستقلة */}
      <div className={`p-4 md:p-6 rounded-2xl border ${theme.card} ${theme.border} shadow-sm bg-gradient-to-l from-slate-50 to-white dark:from-slate-900 dark:to-slate-800`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-xl text-blue-600 dark:text-blue-400">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">حاسبة طارات البار (Barbell Calc)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1">احسب الطارات للبار الأولمبي</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner w-full md:w-auto">
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-lg p-1">
              <button onClick={() => setBarbellCalc({ ...barbellCalc, unit: 'KG' })} className={`px-3 py-1.5 text-xs font-black rounded-md transition-all ${barbellCalc.unit === 'KG' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400'}`}>KG</button>
              <button onClick={() => setBarbellCalc({ ...barbellCalc, unit: 'LBS' })} className={`px-3 py-1.5 text-xs font-black rounded-md transition-all ${barbellCalc.unit === 'LBS' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400'}`}>LBS</button>
            </div>
            <input type="number" value={barbellCalc.weight} onChange={(e) => setBarbellCalc({ ...barbellCalc, weight: e.target.value })} placeholder="الوزن المطلوب" className="w-32 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 focus:border-blue-500 outline-none text-center font-black text-lg p-1 text-slate-900 dark:text-white" />
          </div>

          <div className="flex-1 flex justify-start items-center gap-1.5 overflow-x-auto pb-2 scrollbar-hide w-full min-h-[50px]">
            {barbellCalc.weight ? (
              calculatePlatesStandalone().length > 0 ? (
                <>
                  <span className="text-sm font-bold text-slate-400 ml-2">في كل ناحية:</span>
                  {calculatePlatesStandalone().map((plate, idx) => (
                    <div key={idx} className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-black text-xs md:text-sm border-2 shadow-md ${barbellCalc.unit === 'KG' ? 'bg-slate-800 border-slate-600 text-white' : 'bg-red-800 border-red-600 text-white'}`}>{plate}</div>
                  ))}
                </>
              ) : <span className="text-sm font-bold text-red-500 px-4">الوزن أقل من أو يساوي البار.</span>
            ) : <span className="text-sm font-bold text-slate-400 px-4 flex items-center gap-2"><Scale className="w-4 h-4" /> أدخل الوزن</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <aside className="lg:col-span-4 xl:col-span-3 space-y-6">
          <div className={`p-5 rounded-2xl border ${phaseInfo.bg} ${phaseInfo.border} shadow-sm`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">المرحلة الحالية</span>
              <Info className={`w-4 h-4 ${phaseInfo.color}`} />
            </div>
            <h2 className={`text-xl font-black ${phaseInfo.color}`}>{phaseInfo.name}</h2>
          </div>

          <div className={`rounded-2xl border overflow-hidden shadow-md ${theme.card} ${theme.border}`}>
            <div className={`flex items-center justify-between p-4 border-b ${theme.header} ${theme.border}`}>
              <button onClick={prevMonth} disabled={selectedMonthIdx === 0} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg disabled:opacity-30 transition-colors">
                <ChevronRight className={`w-5 h-5 ${theme.textDesc}`} />
              </button>
              <h3 className={`text-lg font-bold flex gap-2 ${theme.headerText}`}>
                {MONTHS_AR[currentMonthData.month]} <span className="text-blue-500">{currentMonthData.year}</span>
              </h3>
              <button onClick={nextMonth} disabled={selectedMonthIdx === monthsList.length - 1} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg disabled:opacity-30 transition-colors">
                <ChevronLeft className={`w-5 h-5 ${theme.textDesc}`} />
              </button>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'].map((d, i) => <div key={i} className="text-center text-xs font-semibold text-slate-400 dark:text-slate-500 py-1">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} className="p-2"></div>)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const isSelected = selectedDay === dayNum;
                  const loopDateKey = `${currentMonthData.year}-${currentMonthData.month}-${dayNum}`;
                  const loopSavedWorkout = customWorkouts[loopDateKey];
                  const loopDayOfWeek = new Date(currentMonthData.year, currentMonthData.month, dayNum).getDay();
                  
                  const isTraining = loopSavedWorkout && loopSavedWorkout.blocks && loopSavedWorkout.blocks.length > 0;
                  const hasCustomTitle = loopSavedWorkout?.dayTitle && loopSavedWorkout.dayTitle !== DAYS_AR[loopDayOfWeek];

                  return (
                    <button 
                      key={dayNum} 
                      onClick={() => handleDayClick(dayNum)} 
                      className={`relative w-full aspect-square flex flex-col items-center justify-center rounded-lg text-sm font-medium transition-all ${
                        isSelected 
                          ? 'bg-blue-600 text-white shadow-md scale-110 z-10' 
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className={hasCustomTitle ? 'mb-2' : ''}>{dayNum}</span>
                      
                      {hasCustomTitle ? (
                        <span className={`absolute bottom-1 text-[8px] font-black truncate w-11/12 text-center px-0.5 ${isSelected ? 'text-blue-100' : 'text-blue-600 dark:text-blue-400'}`}>
                          {loopSavedWorkout.dayTitle}
                        </span>
                      ) : (
                        isTraining && !isSelected && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-500"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        <section className="lg:col-span-8 xl:col-span-9 relative">
          
          <div className={`p-4 rounded-2xl shadow-sm border flex flex-col md:flex-row flex-wrap justify-between items-start md:items-center gap-4 mb-6 ${theme.card} ${theme.border}`}>
             
             <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button onClick={exportToPDF} className="w-full sm:w-auto flex justify-center items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all"><FileDown className="w-5 h-5" /> <span>تصدير PDF</span></button>
                <button onClick={shareToWhatsApp} className="w-full sm:w-auto flex justify-center items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all"><MessageCircle className="w-5 h-5" /> <span>إرسال WhatsApp</span></button>
             </div>

             <div className="flex items-center gap-3 w-full md:w-auto">
               <div className={`flex items-center gap-2 p-2 rounded-xl border w-full md:w-64 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700`}>
                 <User className="w-5 h-5 text-blue-500 ml-1 shrink-0" />
                 <select value={selectedAthleteId} onChange={(e) => setSelectedAthleteId(e.target.value)} className="bg-transparent text-sm font-bold outline-none cursor-pointer w-full text-slate-900 dark:text-white truncate">
                   <option value="" className="text-slate-800 dark:text-white">-- اختر لاعب (برنامج عام) --</option>
                   {athletesDB.map((athlete: any, index: number) => <option key={athlete.id} value={String(athlete.id)} className="text-slate-800 dark:text-white">{athlete.playerData?.name || `لاعب ${index + 1}`}</option>)}
                 </select>
               </div>
               
               <button 
                 onClick={saveAthleteProgram}
                 disabled={!selectedAthleteId}
                 className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all shrink-0 ${selectedAthleteId ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600'}`}
               >
                 <Save className="w-4 h-4" /> حفظ للاعب
               </button>
             </div>
          </div>

          <div id="printable-program">
            <div className={`p-5 rounded-2xl shadow-sm border flex flex-col md:flex-row justify-between items-center gap-6 mb-6 ${theme.card} ${theme.border}`}>
               
               <div className="flex flex-wrap gap-2 w-full md:w-auto order-2 md:order-1 no-print">
                  <button onClick={() => setIsLibraryModalOpen(true)} className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2.5 rounded-xl font-bold shadow-sm transition-all">
                    <BookOpen className="w-4 h-4" /> + من المكتبة
                  </button>
                  <button onClick={addNewBlock} className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white px-4 py-2.5 rounded-xl font-bold shadow-sm transition-all">
                    <LayoutTemplate className="w-4 h-4" /> + مجموعة
                  </button>
                  <button onClick={toggleRestDay} className={`flex-1 md:flex-none flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl font-bold shadow-sm transition-all ${workoutData.isRest ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white'}`}>
                    <Clock className="w-4 h-4" /> {workoutData.isRest ? 'إلغاء الراحة' : 'تعيين كراحة 🛌'}
                  </button>
               </div>
               
               <div className="text-center md:text-right order-1 md:order-2 flex flex-col items-center md:items-end">
                 <div className="flex items-center gap-2 group mb-1 w-full justify-center md:justify-end">
                   <h2 className={`text-2xl sm:text-3xl font-black ${theme.textMain} shrink-0`}>
                     تمرين: 
                   </h2>
                   <input 
                     type="text"
                     value={currentDayTitle}
                     onChange={(e) => {
                       const newWorkout = { ...workoutData, dayTitle: e.target.value };
                       setCustomWorkouts((prev: any) => ({ ...prev, [dateKey]: newWorkout }));
                     }}
                     className={`text-2xl sm:text-3xl font-black text-blue-500 bg-transparent border-b-2 border-transparent hover:border-blue-200 dark:hover:border-blue-900 focus:border-blue-500 outline-none w-32 sm:w-48 transition-all px-1`}
                     placeholder="اسم اليوم..."
                   />
                   <Edit2 className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity no-print shrink-0" />
                 </div>
                 <p className={`text-sm font-bold ${theme.textDesc}`}>{selectedDay} {MONTHS_AR[currentMonthData.month]} {currentMonthData.year} - {phaseInfo.name}</p>
               </div>
            </div>

            {workoutData.isRest ? (
              <div className={`rounded-3xl p-10 text-center max-w-2xl mx-auto mt-10 shadow-sm border ${theme.card} ${theme.border}`}>
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Clock className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${theme.headerText}`}>{workoutData.title}</h3>
                <p className={`text-lg leading-relaxed ${theme.textDesc}`}>{workoutData.content}</p>
              </div>
            ) : workoutData.blocks.length === 0 ? (
              <div className={`rounded-3xl p-12 text-center max-w-2xl mx-auto mt-10 shadow-sm border border-dashed ${theme.card} ${theme.border}`}>
                <Dumbbell className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className={`text-xl font-bold mb-2 ${theme.textMain}`}>هذا اليوم فارغ</h3>
                <p className={`${theme.textDesc} mb-6`}>ابدأ بإضافة مجموعة تدريبية جديدة أو اسحب قالب جاهز من المكتبة.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {workoutData.blocks.map((block: any, idx: number) => (
                  <div key={idx} className={`rounded-3xl p-4 md:p-6 shadow-sm border transition-all ${theme.card} ${theme.border} print-day-container`}>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 border-b border-slate-100 dark:border-slate-800 pb-4">
                      <div className="flex items-center gap-3 w-full sm:w-auto order-2 sm:order-1">
                        <button onClick={() => deleteBlock(idx)} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-sm font-bold no-print">
                          حذف <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-end gap-3 w-full sm:w-auto order-1 sm:order-2">
                        <input 
                          type="text" 
                          value={block.title || block.name} 
                          onChange={(e) => {
                            const newWorkout = { ...workoutData };
                            newWorkout.blocks[idx].title = e.target.value;
                            setCustomWorkouts((prev: any) => ({ ...prev, [dateKey]: newWorkout }));
                          }}
                          className={`text-lg sm:text-xl font-black bg-transparent border-b-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-blue-500 outline-none text-right text-slate-900 dark:text-white w-full sm:w-auto`}
                        />
                        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
                          {renderIcon(block.iconType || block.type)}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 shadow-sm">
                      {block.exercises.map((exercise: any, eIdx: number) => {
                        const isEditing = editingState.blockIdx === idx && editingState.exIdx === eIdx;
                        const exName = exercise.name || exercise;
                        const exDetails = exercise.details || '';
                        const exWeight = exercise.weight || '';
                        const exPercent = exercise.percent || '';

                        if (isEditing) {
                          return (
                            <div key={eIdx} className="flex flex-col gap-3 p-4 border-b border-blue-500 bg-blue-50 dark:bg-slate-800/80 last:border-b-0 no-print">
                              <input type="text" list="library-exercises" value={editNameValue} onChange={handleEditNameChange} placeholder="اسم التمرين (مثال: Squat)..." className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500" autoFocus />
                              
                              <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full">
                                <input type="text" value={editDetailsValue} onChange={(e) => setEditDetailsValue(e.target.value)} placeholder="العدادات / الوقت" className="flex-1 sm:w-32 text-center bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                
                                {/* 🌟 النسبة المئوية 🌟 */}
                                <div className="relative flex-1 sm:w-24">
                                  <input type="number" value={editPercentValue} onChange={handleEditPercentChange} placeholder="%" className="w-full text-center bg-purple-50 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700 rounded-xl px-4 py-2.5 text-purple-800 dark:text-purple-300 font-bold focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                  <Percent className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                                </div>

                                <input type="text" value={editWeightValue} onChange={(e) => setEditWeightValue(e.target.value)} placeholder="الوزن (KG)" className="flex-1 sm:w-28 text-center bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-xl px-4 py-2.5 text-blue-800 dark:text-blue-300 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500" />
                              </div>

                              <div className="flex gap-2 w-full justify-end">
                                <button onClick={() => handleSaveEdit(idx, eIdx)} className="flex-1 sm:flex-none p-2.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 rounded-xl hover:bg-emerald-200 transition-colors flex justify-center items-center"><Check className="w-5 h-5" /></button>
                                <button onClick={handleCancelEdit} className="flex-1 sm:flex-none p-2.5 bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 rounded-xl hover:bg-rose-200 transition-colors flex justify-center items-center"><X className="w-5 h-5" /></button>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div key={eIdx} className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-b border-slate-200 dark:border-slate-700/50 last:border-0 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                             
                             <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-1/3 order-1 sm:order-3 text-right">
                                <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-lg text-blue-600 dark:text-blue-400 shadow-inner shrink-0 hidden sm:block">
                                   <PlayCircle className="w-4 h-4" />
                                </div>
                                <span className="text-base font-black text-slate-900 dark:text-white truncate flex-1 sm:flex-none">{exName}</span>
                                <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-lg text-blue-600 dark:text-blue-400 shadow-inner shrink-0 sm:hidden">
                                   <PlayCircle className="w-4 h-4" />
                                </div>
                             </div>

                             <div className="flex items-center justify-start sm:justify-center gap-2 w-full sm:w-1/3 order-2 sm:order-2 py-1 sm:py-0">
                                <span className="text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-lg shrink-0">{exDetails}</span>
                                
                                {exPercent && (
                                   <span className="text-xs font-black bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400 px-2 py-1.5 rounded-lg border border-purple-200 dark:border-purple-800 shrink-0">{exPercent}%</span>
                                )}

                                {exWeight && (
                                   <span className="text-xs font-black bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800 shrink-0">⚖️ {exWeight} KG</span>
                                )}
                             </div>

                             <div className="flex items-center justify-end sm:justify-start gap-2 w-full sm:w-1/3 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity no-print border-t sm:border-0 border-slate-100 dark:border-slate-700 pt-3 sm:pt-0 mt-2 sm:mt-0 order-3 sm:order-1">
                                <button onClick={() => handleDeleteEx(idx, eIdx)} className="p-2 text-slate-400 hover:text-rose-500 bg-slate-100 dark:bg-slate-900 rounded-lg transition-colors shadow-sm" title="حذف"><Trash2 className="w-4 h-4" /></button>
                                <button onClick={() => handleStartEdit(idx, eIdx, exercise)} className="p-2 text-slate-400 hover:text-blue-500 bg-slate-100 dark:bg-slate-900 rounded-lg transition-colors shadow-sm" title="تعديل"><Edit2 className="w-4 h-4" /></button>
                             </div>
                          </div>
                        );
                      })}
                    </div>

                    {addingState.blockIdx === idx ? (
                      <div className="flex flex-col gap-3 p-4 rounded-2xl bg-teal-50 dark:bg-teal-900/20 border border-teal-300 dark:border-teal-700 mt-4 no-print">
                        <input type="text" list="library-exercises" placeholder="اسم التمرين (مثال: Squat)..." value={addNameValue} onChange={handleAddNameChange} className="w-full bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-teal-500" autoFocus />
                        
                        <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full">
                          <input type="text" placeholder="مثال: 3 × 10" value={addDetailsValue} onChange={(e) => setAddDetailsValue(e.target.value)} className="flex-1 sm:w-32 text-center bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-teal-500" />
                          
                          {/* 🌟 النسبة المئوية 🌟 */}
                          <div className="relative flex-1 sm:w-24">
                            <input type="number" placeholder="%" value={addPercentValue} onChange={handleAddPercentChange} className="w-full text-center bg-purple-50 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700 rounded-xl px-4 py-2.5 text-purple-800 dark:text-purple-300 font-bold focus:outline-none focus:ring-2 focus:ring-purple-500" />
                            <Percent className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                          </div>

                          <input type="text" placeholder="الوزن (KG)" value={addWeightValue} onChange={(e) => setAddWeightValue(e.target.value)} className="flex-1 sm:w-28 text-center bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-600 rounded-xl px-4 py-2.5 text-teal-700 dark:text-teal-300 font-bold focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-teal-300 dark:placeholder-teal-600/50" />
                        </div>

                        <div className="flex gap-2 w-full justify-end mt-2 sm:mt-0">
                          <button onClick={() => handleSaveAdd(idx)} className="flex-1 sm:flex-none px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl flex justify-center items-center gap-2 transition-colors"><Save className="w-4 h-4"/> حفظ</button>
                          <button onClick={handleCancelAdd} className="flex-1 sm:flex-none px-4 py-2.5 bg-white dark:bg-slate-700 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 font-bold rounded-xl transition-colors flex justify-center items-center"><X className="w-5 h-5"/></button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => handleStartAdd(idx)} className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 font-bold hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-300 dark:hover:border-teal-800/50 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-2xl transition-all mt-4 no-print flex justify-center items-center gap-2">
                        <Plus className="w-4 h-4" /> إضافة تمرين جديد
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* 🌟 الشاشة المنبثقة (Modal) لاختيار القوالب 🌟 */}
      {isLibraryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
           <div className={`w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden ${theme.card} ${theme.border}`}>
             <div className={`p-6 border-b flex justify-between items-center ${theme.header} ${theme.border}`}>
               <h2 className={`text-2xl font-black ${theme.headerText} flex items-center gap-3`}>
                 <BookOpen className="w-6 h-6 text-teal-500" /> اختر قالب من المكتبة لجدول اليوم
               </h2>
               <button onClick={() => setIsLibraryModalOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors"><X className="w-5 h-5" /></button>
             </div>
             <div className="p-6 bg-slate-50 dark:bg-slate-900 max-h-[60vh] overflow-y-auto">
               {libraryBlocks.length === 0 ? (
                 <div className="text-center py-10 text-slate-500 font-bold border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">المكتبة فارغة يا كابتن. اذهب إلى شاشة "مكتبة القوالب" لإنشاء قوالب جديدة.</div>
               ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {libraryBlocks.map((block) => (
                     <button key={block.id} onClick={() => addLibraryBlock(block)} className="text-right p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 hover:shadow-md transition-all group">
                       <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-lg">{renderIcon(block.type)}</div>
                          <h3 className={`font-black text-lg text-slate-900 dark:text-white`}>{block.name}</h3>
                       </div>
                       <p className={`text-xs font-bold text-slate-500 dark:text-slate-400`}>يحتوي على ({block.exercises.length}) تمارين</p>
                       <div className="mt-4 text-xs font-bold text-teal-600 dark:text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                         إضافة للجدول <Plus className="w-3 h-3" />
                       </div>
                     </button>
                   ))}
                 </div>
               )}
             </div>
           </div>
        </div>
      )}
    </div>
  );
}