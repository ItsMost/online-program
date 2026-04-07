import React, { useState } from 'react';
import {
  Calendar,
  Layers,
  Target,
  Activity,
  Printer,
  CalendarDays,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

export default function StrategyTab({ theme }: any) {
  // حالة اختيار الأسبوع في الدورات الصغرى
  const [selectedWeek, setSelectedWeek] = useState(1);

  // 1. الخطة السنوية (Macrocycle) الملونة
  const macrocycle = [
    {
      month: 'يناير',
      phase: 'Off-Season',
      focus: 'تأسيس وضخامة',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    {
      month: 'فبراير',
      phase: 'Off-Season',
      focus: 'قوة قصوى',
      color: 'bg-red-100 text-red-800 border-red-300',
    },
    {
      month: 'مارس',
      phase: 'Pre-Season',
      focus: 'قوة انفجارية',
      color: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      month: 'أبريل',
      phase: 'Pre-Season',
      focus: 'رشاقة وتحمل',
      color: 'bg-orange-100 text-orange-800 border-orange-300',
    },
    {
      month: 'مايو',
      phase: 'In-Season',
      focus: 'صيانة وبطولات',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      month: 'يونيو',
      phase: 'In-Season',
      focus: 'صيانة وبطولات',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      month: 'يوليو',
      phase: 'Post-Season',
      focus: 'استشفاء إيجابي',
      color: 'bg-purple-100 text-purple-800 border-purple-300',
    },
    {
      month: 'أغسطس',
      phase: 'Off-Season',
      focus: 'تأهيل وتأسيس',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
    },
  ];

  // 2. بيانات مصفوفة العناصر والشدة (Intensity Matrix) المستوحاة من صورتك
  const intensityData = [
    {
      element: 'مواعيد القياسات',
      icon: <CalendarDays className="w-4 h-4 text-purple-500" />,
      weeks: [
        'قياس مبدئي',
        '-',
        '-',
        '-',
        'قياس تطور (Deload)',
        '-',
        '-',
        '-',
        'قياس متابعة (Deload)',
        '-',
        '-',
        '-',
        'قياس نهائي (Deload)',
      ],
      isLabel: true,
    },
    {
      element: 'البطولات والمباريات',
      icon: <TrophyIcon className="w-4 h-4 text-amber-500" />,
      weeks: [
        '-',
        '-',
        '-',
        '-',
        '-',
        'مباراة ودية',
        '-',
        '-',
        '-',
        'مباراة تحضيرية',
        '-',
        '-',
        'البطولة الرسمية',
      ],
      isLabel: true,
    },
    {
      element: 'القوة (تأسيس -> قصوى)',
      icon: <DumbbellIcon className="w-4 h-4 text-blue-500" />,
      weeks: [
        '60%',
        '65%',
        '70%',
        '75%',
        '60%',
        '80%',
        '85%',
        '90%',
        '70%',
        '92%',
        '95%',
        '95%',
        '60%',
      ],
    },
    {
      element: 'تحمل خاص بالرياضة',
      icon: <HeartPulseIcon className="w-4 h-4 text-emerald-500" />,
      weeks: [
        '60%',
        '65%',
        '65%',
        '75%',
        '80%',
        '65%',
        '85%',
        '90%',
        '70%',
        '90%',
        '95%',
        '100%',
        '50%',
      ],
    },
    {
      element: 'أجيليتي وتغيير اتجاه',
      icon: <ZapIcon className="w-4 h-4 text-orange-500" />,
      weeks: [
        '70%',
        '75%',
        '80%',
        '85%',
        '70%',
        '85%',
        '90%',
        '95%',
        '80%',
        '95%',
        '100%',
        '100%',
        '80%',
      ],
    },
    {
      element: 'طاقة وانفجارية للقفز',
      icon: <TrendingUp className="w-4 h-4 text-red-500" />,
      weeks: [
        '-',
        '40%',
        '50%',
        '60%',
        '50%',
        '70%',
        '85%',
        '70%',
        '90%',
        '95%',
        '100%',
        '100%',
        '60%',
      ],
    },
    {
      element: 'موبيلتي وثباتات (وقاية)',
      icon: <ShieldCheck className="w-4 h-4 text-pink-500" />,
      weeks: [
        '100%',
        '100%',
        '100%',
        '100%',
        '100%',
        '100%',
        '100%',
        '100%',
        '100%',
        '100%',
        '100%',
        '100%',
        '100%',
      ],
    },
  ];

  // دالة لتلوين النسب المئوية في المصفوفة
  const getIntensityColor = (val: string) => {
    if (
      val === '-' ||
      val.includes('قياس') ||
      val.includes('مباراة') ||
      val.includes('البطولة')
    )
      return 'text-slate-600 font-bold text-[10px] md:text-xs';
    const num = parseInt(val);
    if (isNaN(num)) return 'text-slate-600 font-bold';
    if (num <= 65) return 'text-emerald-500 font-black'; // خفيف
    if (num <= 85) return 'text-amber-500 font-black'; // متوسط
    return 'text-red-600 font-black'; // أقصى/ذروة
  };

  const getIntensityBg = (val: string) => {
    if (val.includes('قياس'))
      return 'bg-purple-100 border border-purple-300 rounded-md py-1';
    if (val.includes('مباراة') || val.includes('البطولة'))
      return 'bg-amber-100 border border-amber-300 rounded-md py-1';
    return '';
  };

  // 3. بيانات تفاصيل الدورات الصغرى (Microcycles) للأسبوع المختار
  const microcyclesData: Record<number, any> = {
    1: {
      title: 'الأسبوع 1 | شهر 4 (أبريل)',
      phase: 'إعداد عام',
      desc: 'تطبيق التوزيعة (2 جيم / 2 ملعب وسيركيت)',
      intensity: '58%',
      days: [
        {
          day: 'السبت',
          title: 'جيم وفيتنس (Day 1)',
          desc: 'أوزان، قوة، وتأسيس بدني (جزء سفلي/علوي مدمج)',
          icon: <DumbbellIcon className="w-5 h-5 text-emerald-500" />,
        },
        {
          day: 'الأحد',
          title: 'سيركيت، كورة، أجيليتي',
          desc: 'تدريب دائري (محطات)، شغل ملعب بالكرة، وتغيير اتجاه',
          icon: <Activity className="w-5 h-5 text-emerald-500" />,
        },
        {
          day: 'الإثنين',
          title: 'راحة نشطة / موبيلتي',
          desc: 'استشفاء لتقليل الحمل العصبي',
          icon: <TrendingUp className="w-5 h-5 text-slate-400" />,
        },
        {
          day: 'الثلاثاء',
          title: 'جيم وفيتنس (Day 2)',
          desc: 'تكملة برنامج المقاومة والأوزان (توازن عضلي)',
          icon: <DumbbellIcon className="w-5 h-5 text-emerald-500" />,
        },
        {
          day: 'الأربعاء',
          title: 'سيركيت، كورة، تقويات',
          desc: 'محطات تحمل أداء خاص بالاسكواش، وتقويات عامة',
          icon: <Activity className="w-5 h-5 text-emerald-500" />,
        },
        {
          day: 'الخميس',
          title: 'لعب حر / مباريات مصغرة',
          desc: 'تطبيق التكتيك والمهارة في الملعب',
          icon: <TrophyIcon className="w-5 h-5 text-emerald-500" />,
        },
        {
          day: 'الجمعة',
          title: 'راحة تامة',
          desc: 'استشفاء تام',
          icon: <TrendingUp className="w-5 h-5 text-slate-400" />,
        },
      ],
    },
    // داتا افتراضية لباقي الأسابيع لتجنب الخطأ وتكون قابلة للتطوير
    ...[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].reduce((acc, weekNum) => {
      acc[weekNum] = {
        title: `الأسبوع ${weekNum} | خطة مقترحة`,
        phase: weekNum > 8 ? 'إعداد خاص' : 'إعداد عام',
        desc:
          weekNum % 4 === 1
            ? 'أسبوع تخفيف أحمال (Deload)'
            : 'تدرج في الأحمال وتطبيق مهارات',
        intensity: weekNum % 4 === 1 ? '50%' : weekNum > 8 ? '85%' : '75%',
        days: [
          {
            day: 'السبت',
            title: 'تمارين مقاومة',
            desc: 'تطوير القوة القصوى',
            icon: <DumbbellIcon className="w-5 h-5 text-blue-500" />,
          },
          {
            day: 'الأحد',
            title: 'تدريب ملعب',
            desc: 'تحمل أداء وتكتيك',
            icon: <Activity className="w-5 h-5 text-blue-500" />,
          },
          {
            day: 'الإثنين',
            title: 'استشفاء وموبيلتي',
            desc: 'مرونة وإطالات',
            icon: <ShieldCheck className="w-5 h-5 text-slate-400" />,
          },
          {
            day: 'الثلاثاء',
            title: 'قوة انفجارية',
            desc: 'بليومتريكس ووثب',
            icon: <ZapIcon className="w-5 h-5 text-red-500" />,
          },
          {
            day: 'الأربعاء',
            title: 'تحمل سرعة',
            desc: 'سبرنتات وتغيير اتجاه',
            icon: <HeartPulseIcon className="w-5 h-5 text-orange-500" />,
          },
          {
            day: 'الخميس',
            title: 'مباراة / تطبيق',
            desc: 'لعب تنافسي',
            icon: <TrophyIcon className="w-5 h-5 text-amber-500" />,
          },
          {
            day: 'الجمعة',
            title: 'راحة تامة',
            desc: 'إعادة بناء العضلات',
            icon: <TrendingUp className="w-5 h-5 text-slate-400" />,
          },
        ],
      };
      return acc;
    }, {} as Record<number, any>),
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-right relative">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-strategy, #print-strategy * { visibility: visible; }
          #print-strategy {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 10px !important;
            background: white !important;
          }
          .no-print { display: none !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .overflow-x-auto { overflow: visible !important; }
          .min-w-\\[800px\\] { min-width: 100% !important; }
        }
        .custom-scrollbar {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .custom-scrollbar::-webkit-scrollbar {
          height: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      {/* الهيدر */}
      <div
        className={`p-4 md:p-6 rounded-2xl border ${theme.card} ${theme.border} shadow-sm`}
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Calendar className={`w-8 h-8 ${theme.headerIcon}`} />
              التخطيط الاستراتيجي للموسم (Periodization)
            </h2>
            <p className={`text-sm mt-1 ${theme.textDesc}`}>
              الخطة السنوية، توزيع الأحمال، وتفاصيل الدورات الصغرى.
            </p>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md w-full md:w-auto no-print"
          >
            <Printer className="w-5 h-5" /> طباعة الخطة
          </button>
        </div>
      </div>

      <div id="print-strategy" className="space-y-8">
        {/* 🌟 1. النتيجة اللونية الشاملة (Macrocycle) */}
        <div
          className={`rounded-2xl border overflow-hidden shadow-md ${theme.card} ${theme.border}`}
        >
          <div
            className={`p-4 border-b flex items-center justify-between ${theme.header} ${theme.headerText} border-slate-200 dark:border-slate-700`}
          >
            <div className="flex items-center gap-2">
              <Layers className="w-6 h-6 text-blue-500" />
              <h3 className="font-bold text-lg md:text-xl">
                الخطة السنوية (Macrocycle)
              </h3>
            </div>
            <div className="hidden md:flex gap-4 text-xs font-bold">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-blue-400"></span> تأسيس
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-amber-400"></span> قبل
                المنافسة
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>{' '}
                المنافسات
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-purple-400"></span>{' '}
                راحة
              </span>
            </div>
          </div>
          <div className="p-4 custom-scrollbar">
            <div className="flex min-w-[800px] gap-2">
              {macrocycle.map((month, idx) => (
                <div key={idx} className="flex-1 flex flex-col gap-1.5">
                  <div className="bg-slate-800 dark:bg-slate-900 text-white font-bold text-center py-1.5 rounded-t-lg text-sm">
                    {month.month}
                  </div>
                  <div
                    className={`flex-1 flex flex-col items-center justify-center p-3 border-2 rounded-b-lg text-center ${month.color}`}
                  >
                    <span className="font-black text-sm mb-1">
                      {month.phase}
                    </span>
                    <span className="text-xs font-bold opacity-80">
                      {month.focus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 🌟 2. مصفوفة العناصر والشدة (Intensity Matrix) - زي الصورة بالضبط */}
        <div
          className={`rounded-2xl border overflow-hidden shadow-md ${theme.card} ${theme.border}`}
        >
          <div
            className={`p-4 border-b flex items-center justify-between gap-2 ${theme.header} ${theme.headerText} border-slate-200 dark:border-slate-700`}
          >
            <div className="flex items-center gap-2">
              <Activity className="w-6 h-6 text-emerald-500" />
              <h3 className="font-bold text-lg md:text-xl">
                مصفوفة العناصر والشدة (Intensity Matrix)
              </h3>
            </div>
            {/* مفتاح الألوان */}
            <div className="flex gap-4 text-xs font-bold">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>{' '}
                خفيف/تأسيس
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>{' '}
                متوسط
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>{' '}
                أقصى/ذروة
              </span>
            </div>
          </div>

          <div className="custom-scrollbar bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
            <table className="w-full text-center min-w-[1000px] border-collapse">
              <thead>
                {/* صف المراحل */}
                <tr>
                  <th className="p-3 border border-slate-200 dark:border-slate-700 font-bold bg-slate-50 dark:bg-slate-800 text-right w-1/5">
                    المراحل
                  </th>
                  <th
                    colSpan={5}
                    className="p-3 border border-slate-200 dark:border-slate-700 font-black text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20"
                  >
                    إعداد عام (5 أسابيع)
                  </th>
                  <th
                    colSpan={8}
                    className="p-3 border border-slate-200 dark:border-slate-700 font-black text-orange-700 bg-orange-50 dark:bg-orange-900/20"
                  >
                    إعداد خاص (8 أسابيع)
                  </th>
                </tr>
                {/* صف الأسابيع */}
                <tr className="bg-slate-100 dark:bg-slate-800 text-xs md:text-sm">
                  <th className="p-3 border border-slate-200 dark:border-slate-700 font-bold text-right">
                    الدورات الصغرى
                  </th>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((w) => (
                    <th
                      key={w}
                      className="p-2 border border-slate-200 dark:border-slate-700 font-bold w-16"
                    >
                      W{w}
                      {w === 5 || w === 9 || w === 13 ? (
                        <div className="text-[9px] text-blue-600 dark:text-blue-400 mt-1 font-black">
                          Deload
                        </div>
                      ) : null}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {intensityData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="p-3 border border-slate-200 dark:border-slate-700 text-right font-bold text-sm flex items-center gap-2">
                      {row.icon}
                      {row.element}
                    </td>
                    {row.weeks.map((val, wIdx) => (
                      <td
                        key={wIdx}
                        className="p-2 border border-slate-200 dark:border-slate-700"
                      >
                        <div
                          className={`mx-auto w-full flex justify-center items-center ${getIntensityColor(
                            val
                          )} ${getIntensityBg(val)}`}
                        >
                          {val}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 🌟 3. تفاصيل الدورات الصغرى (Microcycles) - زي الصورة */}
        <div
          className={`rounded-2xl border shadow-md ${theme.card} ${theme.border}`}
        >
          <div
            className={`p-4 border-b flex flex-col gap-2 ${theme.header} ${theme.headerText} border-slate-200 dark:border-slate-700`}
          >
            <div className="flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-blue-500" />
              <h3 className="font-bold text-lg md:text-xl">
                تفاصيل الدورات الصغرى (Microcycles)
              </h3>
            </div>
            <p className="text-sm opacity-70">
              اختر الأسبوع لعرض تفاصيل الـ 7 أيام بوضوح.
            </p>
          </div>

          <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-900/50">
            {/* أزرار اختيار الأسبوع */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((w) => (
                <button
                  key={w}
                  onClick={() => setSelectedWeek(w)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all border shadow-sm ${
                    selectedWeek === w
                      ? 'bg-emerald-600 text-white border-emerald-700 scale-105'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700'
                  }`}
                >
                  أسبوع {w}
                </button>
              ))}
            </div>

            {/* عرض الأسبوع المحدد */}
            {microcyclesData[selectedWeek] && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-emerald-500 overflow-hidden shadow-lg animate-in zoom-in-95 duration-300">
                {/* هيدر الأسبوع */}
                <div className="bg-emerald-600 text-white p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center font-black text-2xl">
                      {selectedWeek}
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold">
                        {microcyclesData[selectedWeek].title}
                      </h4>
                      <p className="text-emerald-100 font-bold mt-1">
                        <span className="bg-white/20 px-2 py-0.5 rounded text-sm ml-2">
                          {microcyclesData[selectedWeek].phase}
                        </span>
                        {microcyclesData[selectedWeek].desc}
                      </p>
                    </div>
                  </div>
                  <div className="bg-emerald-800/50 border border-emerald-400/50 p-3 rounded-xl text-center">
                    <p className="text-xs font-bold text-emerald-200">
                      متوسط الشدة
                    </p>
                    <p className="text-3xl font-black">
                      {microcyclesData[selectedWeek].intensity}
                    </p>
                  </div>
                </div>

                {/* شبكة الأيام */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {microcyclesData[selectedWeek].days.map(
                    (day: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-slate-50 dark:bg-slate-900 border border-emerald-100 dark:border-slate-700 p-4 rounded-xl hover:border-emerald-400 transition-colors group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="font-black text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded">
                            {day.day}
                          </span>
                          {day.icon}
                        </div>
                        <h5 className="font-bold text-slate-800 dark:text-slate-100 mb-1 group-hover:text-emerald-600 transition-colors">
                          {day.title}
                        </h5>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
                          {day.desc}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------- مكونات الأيقونات المساعدة -----------------
function DumbbellIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m14.5 14.5-5-5" />
      <path d="m6.5 6.5.1-.1a2.828 2.828 0 1 0-4-4l-.1.1" />
      <path d="m17.5 17.5.1-.1a2.828 2.828 0 1 0-4-4l-.1.1" />
      <path d="m22 17.5-2 2" />
      <path d="m6.5 2-2 2" />
    </svg>
  );
}
function TrophyIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
function HeartPulseIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
    </svg>
  );
}
function ZapIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  );
}
