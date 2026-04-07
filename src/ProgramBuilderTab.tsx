import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronRight,
  ChevronLeft,
  Activity,
  Dumbbell,
  Shield,
  Zap,
  Info,
  PlayCircle,
  Clock,
  Edit2,
  Trash2,
  Check,
  X,
  FileDown,
  MessageCircle,
  Scale,
  Plus,
  Repeat,
  Save,
  User,
} from 'lucide-react';

// ==========================================
// 1. HELPER FUNCTIONS & DATA (CALENDAR)
// ==========================================
const START_YEAR = new Date().getFullYear();

const getPhaseInfo = (monthIndex: number) => {
  // 4, 5 = May, June (تأسيس)
  // 6, 7 = July, August (قوة قصوى)
  // 8, 9 = Sept, Oct (قدرة ومنافسات)
  if (monthIndex === 4 || monthIndex === 5)
    return {
      id: 'gpp',
      name: 'فترة التأسيس والتحمل العضلي',
      color: 'text-emerald-500 dark:text-emerald-400',
      bg: 'bg-emerald-100 dark:bg-emerald-900/20',
      border: 'border-emerald-200 dark:border-emerald-500/30',
    };
  if (monthIndex === 6 || monthIndex === 7)
    return {
      id: 'max_strength',
      name: 'فترة القوة القصوى (Max Strength)',
      color: 'text-blue-500 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-500/30',
    };
  return {
    id: 'power_comp',
    name: 'فترة القدرة والمنافسات',
    color: 'text-rose-500 dark:text-rose-400',
    bg: 'bg-rose-100 dark:bg-rose-900/20',
    border: 'border-rose-200 dark:border-rose-500/30',
  };
};

const MONTHS_AR = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];
const DAYS_AR = [
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
];

const generateMonthsList = () => {
  const months = [];
  for (let i = 4; i <= 11; i++) months.push({ year: START_YEAR, month: i });
  for (let i = 0; i <= 3; i++) months.push({ year: START_YEAR + 1, month: i });
  return months;
};

// 3 Days a week: Sat (6) = General A, Mon (1) = Circuit, Wed (3) = General B
const generateWorkout = (dayOfWeek: number, phaseId: string) => {
  if (
    dayOfWeek === 0 ||
    dayOfWeek === 2 ||
    dayOfWeek === 4 ||
    dayOfWeek === 5
  ) {
    return {
      isRest: true,
      title: 'راحة واستشفاء',
      content:
        'الراحة جزء أساسي من تطور القوة. يفضل عمل إطالات أو استخدام الفوم رولر اليوم.',
    };
  }

  const workout = { isRest: false, blocks: [] as any[] };

  // ================= DAY 1: GENERAL A (SATURDAY) =================
  if (dayOfWeek === 6) {
    workout.blocks.push({
      title: 'الإحماء والبلايومتركس الأولية',
      iconType: 'activity',
      exercises: [
        'إطالات حركية للمفاصل (Mobility) - 5 دقائق',
        'Pogo Jumps لتنشيط الكاحل - 3 × 15',
        'قفز من الجلوس (Seated Box Jumps) - 3 × 5',
      ],
    });
    workout.blocks.push({
      title: 'المجموعة الأساسية 1 (Squat & Push)',
      iconType: 'dumbbell',
      exercises:
        phaseId === 'gpp'
          ? [
              'سكوات (Back Squat) - 4 مجموعات × 10 عدات (تركيز على التكنيك)',
              'بنش برس (Bench Press) - 3 مجموعات × 10 عدات',
              'تمرين كور: V-Ups - 3 مجموعات × 15 عدة',
            ]
          : phaseId === 'max_strength'
          ? [
              'سكوات (Back Squat) - 5 مجموعات × 3-5 عدات (أوزان 85%+ وراحة 3 دقائق)',
              'بنش برس (Bench Press) - 5 مجموعات × 5 عدات',
              'تمرين كور: Anti-Rotation (Pallof Press) - 3 × 10',
            ]
          : [
              'سكوات حركي سريع - 3 × 3',
              'بنش برس سريع - 3 × 3',
              'Medicine Ball Throws - 3 × 5',
            ],
    });
    workout.blocks.push({
      title: 'المجموعة المساعدة (Olympic Tech & Core)',
      iconType: 'shield',
      exercises:
        phaseId === 'gpp'
          ? [
              'تعليم تكنيك الكلين (Clean Pulls) عصا أو بار فارغ - 3 × 8',
              'عقلة (Pull-ups) أقصى عدد - 3 مجموعات',
              'بطن عادي (Crunches) - 3 × 20',
            ]
          : phaseId === 'max_strength'
          ? [
              'باور كلين (Power Clean) من الركبة - 4 مجموعات × 3 عدات',
              'عقلة بأوزان (Weighted Pull-ups) - 4 × 5',
              'كور: ثبات بطن جانبي (Side Plank) - 3 × 45ث',
            ]
          : [
              'كلين كامل (Full Clean) - 3 × 2',
              'عقلة سريعة - 3 × أقصى عدد',
              'كور تخصصي دوران - 3 × 10',
            ],
    });
  }

  // ================= DAY 2: CIRCUIT / CONDITIONING (MONDAY) =================
  else if (dayOfWeek === 1) {
    workout.blocks.push({
      title: 'محطات التحمل العضلي والتكييف (Circuit)',
      iconType: 'repeat',
      exercises:
        phaseId === 'gpp'
          ? [
              'المدة: 3 جولات، 45 ثانية عمل / 15 ثانية راحة',
              'محطة 1: صعود على الصندوق (Step-ups) بالدمبلز',
              'محطة 2: ضغط كتف بالدمبلز (Shoulder Press)',
              'محطة 3: قفز القرفصاء (Squat Jumps)',
              'محطة 4: نورديك (Nordic Hamstring) بمساعدة زميل',
              'محطة 5: دوران روسي (Russian Twists)',
            ]
          : phaseId === 'max_strength'
          ? [
              'المدة: 4 جولات، التركيز على الأوزان المتوسطة بدون توقف',
              'محطة 1: Step-ups بأوزان أثقل (6 عدات لكل رجل)',
              'محطة 2: دفع كتف بالبار (Strict Press) - 8 عدات',
              'محطة 3: قفز فوق حواجز متتالية (Hurdle Hops)',
              'محطة 4: نورديك (Nordic) تحكم بطيء للأسفل - 5 عدات',
              'محطة 5: رمي كرة طبية للأسفل (Slams) - 10 عدات',
            ]
          : [
              'سيركيت رياضي متخصص (فترات راحة أطول، سرعة أعلى)',
              'جري مكوك (Shuttle Runs) - 10 متر',
              'Step-ups قفز متفجر',
              'تمارين رشاقة بالسلم (Agility Ladder)',
            ],
    });
  }

  // ================= DAY 3: GENERAL B (WEDNESDAY) =================
  else if (dayOfWeek === 3) {
    workout.blocks.push({
      title: 'الإحماء والتفعيل الأولي',
      iconType: 'activity',
      exercises: [
        'إطالات ديناميكية للكتف والحوض',
        'Pogo Jumps - 3 × 15',
        'قفز عمودي من الثبات (Squat Jumps) - 3 × 5',
      ],
    });
    workout.blocks.push({
      title: 'المجموعة الأساسية 2 (Hinge & Lunge)',
      iconType: 'zap',
      exercises:
        phaseId === 'gpp'
          ? [
              'هيب تراست (Hip Thrust) - 4 مجموعات × 12 عدة',
              'طعن متحرك (Walking Lunges) - 3 مجموعات × 10 لكل رجل',
              'تمرين قطنية (Back Extensions) - 3 × 15',
            ]
          : phaseId === 'max_strength'
          ? [
              'هيب تراست (Hip Thrust) - 5 مجموعات × 5 عدات (أوزان قصوى)',
              'طعن عكسي بالبار (Reverse Lunge) - 4 × 5 لكل رجل',
              'تمرين قطنية بالوزن - 3 × 10',
            ]
          : [
              'هيب تراست سريع - 3 × 4',
              'طعن قفز (Jumping Lunges) - 3 × 8',
              'قطنية - 3 × 12',
            ],
    });
    workout.blocks.push({
      title: 'المجموعة المساعدة (Olympic Tech & Core)',
      iconType: 'shield',
      exercises:
        phaseId === 'gpp'
          ? [
              'تعليم تكنيك الجيرك (Push Jerk Tech) عصا - 3 × 8',
              'ضغط كتف (Shoulder Press) - 3 × 10',
              'تمرين كور: Bridge Hold - 3 × 45ث',
            ]
          : phaseId === 'max_strength'
          ? [
              'بوش جيرك (Push Jerk) أوزان متوسطة لتعلم نقل القوة - 4 × 4',
              'ضغط كتف أمامي ثقيل - 4 × 6',
              'كور: Anti-Extension (Ab Wheel) - 3 × 8',
            ]
          : [
              'جيرك كامل (Split/Push Jerk) - 3 × 3',
              'ضغط كتف - 3 × 8',
              'كور تخصصي - 3 × المكس',
            ],
    });
  }

  return workout;
};

// ==========================================
// 2. MAIN BUILDER COMPONENT
// ==========================================
export default function ProgramBuilderTab({ theme, athletesDB = [] }: any) {
  // UI State
  const [selectedAthleteId, setSelectedAthleteId] = useState('');
  const [barbellCalc, setBarbellCalc] = useState({ weight: '', unit: 'KG' });

  // Calendar State
  const monthsList = useMemo(() => generateMonthsList(), []);
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(0);
  const [selectedDay, setSelectedDay] = useState(1);

  const [customWorkouts, setCustomWorkouts] = useState<any>({});
  const [editingState, setEditingState] = useState({
    blockIdx: null,
    exIdx: null,
  });
  const [editValue, setEditValue] = useState('');

  const [addingState, setAddingState] = useState({ blockIdx: null });
  const [addValue, setAddValue] = useState('');

  // Calendar Calculations
  const currentMonthData = monthsList[selectedMonthIdx];
  const daysInMonth = new Date(
    currentMonthData.year,
    currentMonthData.month + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentMonthData.year,
    currentMonthData.month,
    1
  ).getDay();
  const currentFullDate = new Date(
    currentMonthData.year,
    currentMonthData.month,
    selectedDay
  );
  const currentDayOfWeek = currentFullDate.getDay();
  const dateKey = `${currentMonthData.year}-${currentMonthData.month}-${selectedDay}`;

  const phaseInfo = getPhaseInfo(currentMonthData.month);
  const baseWorkout = generateWorkout(currentDayOfWeek, phaseInfo.id);

  const workoutData = customWorkouts[dateKey]
    ? JSON.parse(JSON.stringify(customWorkouts[dateKey]))
    : JSON.parse(JSON.stringify(baseWorkout));

  // Edit/Add Handlers
  const handleStartEdit = (blockIdx: any, exIdx: any, currentValue: any) => {
    setEditingState({ blockIdx, exIdx });
    setEditValue(currentValue);
    setAddingState({ blockIdx: null });
  };
  const handleCancelEdit = () => {
    setEditingState({ blockIdx: null, exIdx: null });
    setEditValue('');
  };
  const handleSaveEdit = (blockIdx: any, exIdx: any) => {
    const newWorkout = { ...workoutData };
    newWorkout.blocks[blockIdx].exercises[exIdx] = editValue;
    setCustomWorkouts((prev: any) => ({ ...prev, [dateKey]: newWorkout }));
    handleCancelEdit();
  };
  const handleDelete = (blockIdx: any, exIdx: any) => {
    const newWorkout = { ...workoutData };
    newWorkout.blocks[blockIdx].exercises.splice(exIdx, 1);
    setCustomWorkouts((prev: any) => ({ ...prev, [dateKey]: newWorkout }));
  };

  const handleStartAdd = (blockIdx: any) => {
    setAddingState({ blockIdx });
    setAddValue('');
    handleCancelEdit();
  };
  const handleCancelAdd = () => {
    setAddingState({ blockIdx: null });
    setAddValue('');
  };
  const handleSaveAdd = (blockIdx: any) => {
    if (!addValue.trim()) return handleCancelAdd();
    const newWorkout = { ...workoutData };
    newWorkout.blocks[blockIdx].exercises.push(addValue);
    setCustomWorkouts((prev: any) => ({ ...prev, [dateKey]: newWorkout }));
    handleCancelAdd();
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    handleCancelEdit();
    handleCancelAdd();
  };
  const nextMonth = () => {
    if (selectedMonthIdx < monthsList.length - 1) {
      setSelectedMonthIdx((p) => p + 1);
      setSelectedDay(1);
      handleCancelEdit();
      handleCancelAdd();
    }
  };
  const prevMonth = () => {
    if (selectedMonthIdx > 0) {
      setSelectedMonthIdx((p) => p - 1);
      setSelectedDay(1);
      handleCancelEdit();
      handleCancelAdd();
    }
  };

  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case 'activity':
        return (
          <Activity className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
        );
      case 'dumbbell':
        return (
          <Dumbbell className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
        );
      case 'shield':
        return <Shield className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
      case 'zap':
        return <Zap className="w-5 h-5 text-amber-500 dark:text-amber-400" />;
      case 'repeat':
        return (
          <Repeat className="w-5 h-5 text-purple-500 dark:text-purple-400" />
        );
      default:
        return <Activity className="w-5 h-5 text-slate-400" />;
    }
  };

  const calculatePlatesStandalone = () => {
    const weight = parseFloat(barbellCalc.weight);
    if (isNaN(weight) || weight <= 0) return [];
    const barWeight = barbellCalc.unit === 'KG' ? 20 : 45;
    let remainingWeight = (weight - barWeight) / 2;
    if (remainingWeight <= 0) return [];
    const availablePlates =
      barbellCalc.unit === 'KG'
        ? [25, 20, 15, 10, 5, 2.5, 1.25]
        : [45, 35, 25, 10, 5, 2.5];
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
    const athlete = athletesDB.find(
      (a: any) => String(a.id || a._id) === String(selectedAthleteId)
    );
    const athleteName = athlete
      ? athlete.playerData?.name || 'غير محدد'
      : 'عام';

    let message = `🏋️‍♂️ *التمرين اليومي*\n`;
    message += `👤 اللاعب: *${athleteName}*\n`;
    message += `📅 التاريخ: *${selectedDay} ${
      MONTHS_AR[currentMonthData.month]
    }*\n`;
    message += `🎯 المرحلة: *${phaseInfo.name}*\n\n`;
    message += `━━━━━━━━━━━━━━━\n`;

    if (workoutData.isRest) {
      message += `🛑 *يوم راحة واستشفاء*\n${workoutData.content}\n`;
    } else {
      workoutData.blocks.forEach((block: any) => {
        message += `\n🔹 *${block.title}*\n`;
        block.exercises.forEach((ex: string) => {
          message += `▪️ ${ex}\n`;
        });
      });
    }

    message += `\n💪 *عاش يا بطل!*\n`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const exportToPDF = () => {
    const printContents =
      document.getElementById('printable-program')?.innerHTML;
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    const iframeDoc = iframe.contentWindow?.document;

    const athlete = athletesDB.find(
      (a: any) => String(a.id || a._id) === String(selectedAthleteId)
    );
    const athleteName = athlete
      ? athlete.playerData?.name || 'غير محدد'
      : 'عام';

    if (iframeDoc) {
      iframeDoc.write(`
        <html dir="rtl">
          <head>
            <title>البرنامج التدريبي - ${athleteName}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body { font-family: Tahoma, sans-serif; padding: 20px; }
              .no-print { display: none !important; }
              * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            </style>
          </head>
          <body class="bg-white">
            <div style="text-align: center; border-bottom: 2px solid #1e293b; padding-bottom: 10px; margin-bottom: 20px;">
              <h1 style="font-size: 24px; font-weight: bold; color: #0f172a; margin-bottom: 5px;">تمرين اليوم (${selectedDay} ${
        MONTHS_AR[currentMonthData.month]
      })</h1>
              <p style="color: #64748b; font-weight: bold; font-size: 14px;">اللاعب: <span style="color: #0f172a;">${athleteName}</span></p>
              <p style="color: #94a3b8; font-size: 11px; margin-top: 5px;">المرحلة: ${
                phaseInfo.name
              }</p>
            </div>
            ${printContents}
            <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #64748b; font-weight: bold;">
              تم استخراج التقرير بواسطة نظام ProCoach
            </div>
          </body>
        </html>
      `);
      iframeDoc.close();
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 1500);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-right relative">
      {/* 🚀 قسم حاسبة البار المستقلة */}
      <div
        className={`p-4 md:p-6 rounded-2xl border ${theme.card} ${theme.border} shadow-sm bg-gradient-to-l from-slate-50 to-white dark:from-slate-900 dark:to-slate-800`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-xl text-blue-600 dark:text-blue-400">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">
                حاسبة طارات البار (Barbell Calc)
              </h3>
              <p className="text-xs text-slate-500 font-bold mt-1">
                احسب الطارات للبار الأولمبي
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner w-full md:w-auto">
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-lg p-1">
              <button
                onClick={() => setBarbellCalc({ ...barbellCalc, unit: 'KG' })}
                className={`px-3 py-1.5 text-xs font-black rounded-md transition-all ${
                  barbellCalc.unit === 'KG'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-500'
                }`}
              >
                KG
              </button>
              <button
                onClick={() => setBarbellCalc({ ...barbellCalc, unit: 'LBS' })}
                className={`px-3 py-1.5 text-xs font-black rounded-md transition-all ${
                  barbellCalc.unit === 'LBS'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-500'
                }`}
              >
                LBS
              </button>
            </div>
            <input
              type="number"
              value={barbellCalc.weight}
              onChange={(e) =>
                setBarbellCalc({ ...barbellCalc, weight: e.target.value })
              }
              placeholder="الوزن المطلوب"
              className="w-32 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 focus:border-blue-500 outline-none text-center font-black text-lg p-1 dark:text-white"
            />
          </div>

          <div className="flex-1 flex justify-start items-center gap-1.5 overflow-x-auto pb-2 scrollbar-hide w-full min-h-[50px]">
            {barbellCalc.weight ? (
              calculatePlatesStandalone().length > 0 ? (
                <>
                  <span className="text-sm font-bold text-slate-400 ml-2">
                    في كل ناحية:
                  </span>
                  {calculatePlatesStandalone().map((plate, idx) => (
                    <div
                      key={idx}
                      className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-black text-xs md:text-sm border-2 shadow-md ${
                        barbellCalc.unit === 'KG'
                          ? 'bg-slate-800 border-slate-600 text-white'
                          : 'bg-red-800 border-red-600 text-white'
                      }`}
                    >
                      {plate}
                    </div>
                  ))}
                </>
              ) : (
                <span className="text-sm font-bold text-red-500 px-4">
                  الوزن أقل من أو يساوي البار.
                </span>
              )
            ) : (
              <span className="text-sm font-bold text-slate-400 px-4 flex items-center gap-2">
                <Scale className="w-4 h-4" /> أدخل الوزن
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Header & Tools */}
      <div
        className={`rounded-2xl shadow-xl border p-6 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 ${theme.header} ${theme.headerText} ${theme.border}`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl bg-blue-500/10 text-blue-500`}>
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">التقويم التدريبي التفاعلي</h2>
            <p className="opacity-70 text-sm mt-1">
              اختر اليوم من التقويم ليتم توليد البرنامج بناءً على المرحلة
              الزمنية.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div
            className={`flex items-center gap-2 p-2 rounded-xl border w-full sm:w-auto bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700`}
          >
            <User className="w-5 h-5 text-blue-500 ml-1" />
            <select
              value={selectedAthleteId}
              onChange={(e) => setSelectedAthleteId(e.target.value)}
              className="bg-transparent text-sm font-bold outline-none cursor-pointer w-full sm:w-40 dark:text-white"
            >
              <option value="" className="text-slate-800 dark:text-white">
                -- اختر اللاعب --
              </option>
              {athletesDB.map((athlete: any, index: number) => (
                <option
                  key={athlete.id}
                  value={String(athlete.id)}
                  className="text-slate-800 dark:text-white"
                >
                  {athlete.playerData?.name || `لاعب ${index + 1}`}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={shareToWhatsApp}
            className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebd57] text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-md w-full sm:w-auto"
          >
            <MessageCircle className="w-5 h-5" /> إرسال WhatsApp
          </button>
          <button
            onClick={exportToPDF}
            className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-md w-full sm:w-auto"
          >
            <FileDown className="w-5 h-5" /> تصدير PDF
          </button>
        </div>
      </div>

      {/* 📅 Calendar and Workout Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Calendar */}
        <aside className="lg:col-span-4 xl:col-span-3 space-y-6">
          <div
            className={`p-5 rounded-2xl border ${phaseInfo.bg} ${phaseInfo.border} shadow-sm`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                المرحلة الحالية
              </span>
              <Info className={`w-4 h-4 ${phaseInfo.color}`} />
            </div>
            <h2 className={`text-xl font-black ${phaseInfo.color}`}>
              {phaseInfo.name}
            </h2>
          </div>

          <div
            className={`rounded-2xl border overflow-hidden shadow-md ${theme.card} ${theme.border}`}
          >
            <div
              className={`flex items-center justify-between p-4 border-b ${theme.header} ${theme.border}`}
            >
              <button
                onClick={prevMonth}
                disabled={selectedMonthIdx === 0}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg disabled:opacity-30 transition-colors"
              >
                <ChevronRight className={`w-5 h-5 ${theme.textDesc}`} />
              </button>
              <h3
                className={`text-lg font-bold flex gap-2 ${theme.headerText}`}
              >
                {MONTHS_AR[currentMonthData.month]}{' '}
                <span className="text-blue-500">{currentMonthData.year}</span>
              </h3>
              <button
                onClick={nextMonth}
                disabled={selectedMonthIdx === monthsList.length - 1}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className={`w-5 h-5 ${theme.textDesc}`} />
              </button>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'].map((d, i) => (
                  <div
                    key={i}
                    className="text-center text-xs font-semibold text-slate-400 dark:text-slate-500 py-1"
                  >
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-2"></div>
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const isSelected = selectedDay === dayNum;
                  // Training days: Sat(6), Mon(1), Wed(3)
                  const isTraining = [1, 3, 6].includes(
                    new Date(
                      currentMonthData.year,
                      currentMonthData.month,
                      dayNum
                    ).getDay()
                  );
                  return (
                    <button
                      key={dayNum}
                      onClick={() => handleDayClick(dayNum)}
                      className={`relative w-full aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md scale-110 z-10'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {dayNum}
                      {isTraining && !isSelected && (
                        <div className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-500"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Column: Workout Details */}
        <section className="lg:col-span-8 xl:col-span-9" id="printable-program">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-blue-500 font-semibold mb-1">
                {DAYS_AR[currentDayOfWeek]}
              </p>
              <h2
                className={`text-3xl md:text-4xl font-extrabold ${theme.textMain}`}
              >
                {selectedDay} {MONTHS_AR[currentMonthData.month]}{' '}
                {currentMonthData.year}
              </h2>
            </div>
            <div className="flex gap-3">
              {workoutData.isRest ? (
                <span className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" /> يوم راحة
                </span>
              ) : (
                <span className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 rounded-lg font-medium flex items-center gap-2">
                  {currentDayOfWeek === 1 ? (
                    <Repeat className="w-4 h-4" />
                  ) : (
                    <Dumbbell className="w-4 h-4" />
                  )}
                  {currentDayOfWeek === 1
                    ? 'يوم سيركيت (Circuit)'
                    : 'يوم تدريب أساسي (General)'}
                </span>
              )}
            </div>
          </div>

          {workoutData.isRest ? (
            <div
              className={`rounded-3xl p-10 text-center max-w-2xl mx-auto mt-10 shadow-sm border ${theme.card} ${theme.border}`}
            >
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Clock className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${theme.headerText}`}>
                {workoutData.title}
              </h3>
              <p className={`text-lg leading-relaxed ${theme.textDesc}`}>
                {workoutData.content}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {workoutData.blocks.map((block: any, idx: number) => (
                <div
                  key={idx}
                  className={`rounded-2xl overflow-hidden shadow-md border ${theme.card} ${theme.border} print-day-container`}
                >
                  <div
                    className={`px-6 py-4 border-b flex justify-between items-center ${theme.header} ${theme.border}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        {renderIcon(block.iconType)}
                      </div>
                      <h3 className={`text-xl font-bold ${theme.headerText}`}>
                        {block.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 bg-white dark:bg-slate-900">
                    <div className="space-y-3 mb-4">
                      {block.exercises.map((exercise: any, eIdx: number) => {
                        const isEditing =
                          editingState.blockIdx === idx &&
                          editingState.exIdx === eIdx;
                        if (isEditing) {
                          return (
                            <div
                              key={eIdx}
                              className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl bg-blue-50 dark:bg-slate-800 border border-blue-500 shadow-sm no-print"
                            >
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="w-full flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 dark:text-white focus:outline-none focus:border-blue-500"
                                autoFocus
                              />
                              <div className="flex gap-2 self-end sm:self-auto">
                                <button
                                  onClick={() => handleSaveEdit(idx, eIdx)}
                                  className="p-2 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-800/50"
                                >
                                  <Check className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="p-2 bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 rounded-lg hover:bg-rose-200 dark:hover:bg-rose-800/50"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div
                            key={eIdx}
                            className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-blue-500/50 group transition-colors"
                          >
                            <div className="flex items-center gap-4 flex-1">
                              <PlayCircle className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 transition-colors" />
                              <span className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                                {exercise}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity no-print">
                              <button
                                onClick={() =>
                                  handleStartEdit(idx, eIdx, exercise)
                                }
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg"
                                title="تعديل"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(idx, eIdx)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 rounded-lg"
                                title="حذف"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {addingState.blockIdx === idx ? (
                      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl bg-blue-50 dark:bg-slate-800/80 border border-blue-300 dark:border-blue-500/50 mt-4 no-print">
                        <input
                          type="text"
                          placeholder="اكتب التمرين الجديد هنا... (مثال: ضغط - 3 × 10)"
                          value={addValue}
                          onChange={(e) => setAddValue(e.target.value)}
                          className="w-full flex-1 bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-500/50 rounded-lg px-4 py-2 dark:text-white focus:outline-none focus:border-blue-500"
                          autoFocus
                          onKeyDown={(e) =>
                            e.key === 'Enter' && handleSaveAdd(idx)
                          }
                        />
                        <div className="flex gap-2 self-end sm:self-auto">
                          <button
                            onClick={() => handleSaveAdd(idx)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-2"
                          >
                            <Save className="w-4 h-4" /> حفظ
                          </button>
                          <button
                            onClick={handleCancelAdd}
                            className="px-4 py-2 bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 font-medium rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartAdd(idx)}
                        className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mt-2 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors no-print"
                      >
                        <Plus className="w-4 h-4" /> إضافة تمرين
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
