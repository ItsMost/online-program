import React, { useState } from 'react';
import {
  Search,
  User,
  ClipboardCheck,
  BarChart2,
  Save,
  Trophy,
  AlertTriangle,
  Database,
  Trash2,
  ArrowRight,
  Activity,
  RefreshCw,
  XCircle,
  Flame, 
  Target, 
} from 'lucide-react';
import { calculate5LevelDynamic } from './data';

export default function AssessmentTab({
  theme,
  athletesDB,
  setAthletesDB,
}: any) {
  const [editingId, setEditingId] = useState<number | null>(null);

  const [playerData, setPlayerData] = useState({
    name: '',
    gender: 'male',
    birthYear: '',
    bodyweight: '',
    sport: 'squash',
    bodyFat: '', 
    goal: 'maintain', 
    trainingDays: '4', 
    intensity: 'medium', 
  });

  const [testScores, setTestScores] = useState({
    verticalJump: '',
    broadJump: '',
    sprint10m: '',
    proAgility: '',
    squat1RM: '',
    bench1RM: '',
    clean1RM: '',
    fms1: '3',
    fms2: '3',
    fms3: '3',
    fms4: '3',
    fms5: '3',
    fms6: '3',
    fms7: '3',
  });

  const [analysisReport, setAnalysisReport] = useState<any>(null);
  const [archiveSearch, setArchiveSearch] = useState('');

  const currentYear = new Date().getFullYear();
  const calculatedAge = playerData.birthYear
    ? currentYear - parseInt(playerData.birthYear)
    : 0;

  const getLevelStyle = (levelStr: string) => {
    switch (levelStr) {
      case 'ممتاز':
        return 'bg-emerald-600 text-white border border-emerald-700 shadow';
      case 'جيد جداً':
        return 'bg-blue-500 text-white border border-blue-600 shadow';
      case 'جيد':
        return 'bg-yellow-500 text-white border border-yellow-600 shadow';
      case 'ضعيف':
        return 'bg-orange-500 text-white border border-orange-600 shadow';
      case 'خطر (Red Flag)':
        return 'bg-red-600 text-white border border-red-700 animate-pulse shadow-lg';
      case 'ضعيف جداً':
        return 'bg-red-600 text-white border border-red-700 shadow-lg';
      default:
        return 'bg-slate-300 text-slate-700';
    }
  };

  const handleAnalyze = () => {
    if (!playerData.name || !playerData.bodyweight || !playerData.birthYear) {
      alert(
        'يا كابتن محمود، يرجى إدخال اسم اللاعب، سنة الميلاد، ووزنه لضمان دقة المعايير.'
      );
      return;
    }

    const bw = parseFloat(playerData.bodyweight);
    const sqRatio = testScores.squat1RM
      ? parseFloat(testScores.squat1RM) / bw
      : '';
    const bnRatio = testScores.bench1RM
      ? parseFloat(testScores.bench1RM) / bw
      : '';
    const clRatio = testScores.clean1RM
      ? parseFloat(testScores.clean1RM) / bw
      : '';

    const fmsTotal =
      parseInt(testScores.fms1) +
      parseInt(testScores.fms2) +
      parseInt(testScores.fms3) +
      parseInt(testScores.fms4) +
      parseInt(testScores.fms5) +
      parseInt(testScores.fms6) +
      parseInt(testScores.fms7);

    let fmsLevel = '';
    if (fmsTotal >= 18) fmsLevel = 'ممتاز';
    else if (fmsTotal >= 16) fmsLevel = 'جيد جداً';
    else if (fmsTotal >= 14) fmsLevel = 'جيد';
    else fmsLevel = 'خطر (Red Flag)';

    const ageForAnalysis = calculatedAge.toString();

    const results = {
      verticalJump: calculate5LevelDynamic(
        'verticalJump',
        testScores.verticalJump,
        playerData.sport,
        ageForAnalysis,
        playerData.gender
      ),
      broadJump: calculate5LevelDynamic(
        'broadJump',
        testScores.broadJump,
        playerData.sport,
        ageForAnalysis,
        playerData.gender
      ),
      sprint10m: calculate5LevelDynamic(
        'sprint10m',
        testScores.sprint10m,
        playerData.sport,
        ageForAnalysis,
        playerData.gender
      ),
      proAgility: calculate5LevelDynamic(
        'proAgility',
        testScores.proAgility,
        playerData.sport,
        ageForAnalysis,
        playerData.gender
      ),
      squatRatio: calculate5LevelDynamic(
        'squatRatio',
        sqRatio,
        playerData.sport,
        ageForAnalysis,
        playerData.gender
      ),
      benchRatio: calculate5LevelDynamic(
        'benchRatio',
        bnRatio,
        playerData.sport,
        ageForAnalysis,
        playerData.gender
      ),
      cleanRatio: calculate5LevelDynamic(
        'cleanRatio',
        clRatio,
        playerData.sport,
        ageForAnalysis,
        playerData.gender
      ),
      fmsScore: { level: fmsLevel, target: 21, score: fmsTotal },
    };

    let problems = [];

    if (fmsTotal < 14) {
      problems.push({
        issue: 'خطر إصابة عالي جداً (FMS < 14)',
        solution:
          'يجب إيقاف تدريبات الأوزان الحرة العنيفة والتركيز فوراً على التمارين التصحيحية لضبط الحركة.',
      });
    }
    if (parseInt(testScores.fms1) < 2) {
      problems.push({
        issue: 'انهيار ميكانيكا السكوات العميق',
        solution: 'إدراج تمارين موبيلتي الكاحل وفتح الحوض.',
      });
    }
    if (parseInt(testScores.fms6) < 2) {
      problems.push({
        issue: 'ضعف ثبات الجذع (Trunk Stability)',
        solution: 'تكثيف تمارين الكور الداخلي لمنع آلام أسفل الظهر.',
      });
    }

    if (
      results.verticalJump?.status === 'poor' ||
      results.verticalJump?.status === 'vPoor'
    ) {
      problems.push({
        issue: 'انخفاض في القوة الانفجارية العمودية',
        solution: 'تكثيف تمارين الـ Plyometrics من المكتبة.',
      });
    }
    if (
      results.sprint10m?.status === 'poor' ||
      results.sprint10m?.status === 'vPoor'
    ) {
      problems.push({
        issue: 'بطء في التسارع',
        solution: 'تمارين التسارع: (Wall Drills, Resisted Sprints).',
      });
    }
    if (
      results.squatRatio?.status === 'poor' ||
      results.squatRatio?.status === 'vPoor'
    ) {
      problems.push({
        issue: 'القوة القصوى للأرجل غير كافية لوزنه',
        solution: 'العودة لمرحلة "تأسيس القوة" بأوزان تدريجية.',
      });
    }

    if (problems.length === 0) {
      problems.push({
        issue: 'اللاعب Elite في الأرقام والحركة',
        solution: 'التركيز على الصيانة والتدريبات المهارية التخصصية.',
      });
    }

    setAnalysisReport({
      results,
      problems,
      calculatedRatios: { sqRatio, bnRatio, clRatio },
      fmsTotal,
    });
  };

  const clearForm = () => {
    setPlayerData({
      name: '',
      gender: 'male',
      birthYear: '',
      bodyweight: '',
      sport: 'squash',
      bodyFat: '',
      goal: 'maintain',
      trainingDays: '4',
      intensity: 'medium',
    });
    setTestScores({
      verticalJump: '',
      broadJump: '',
      sprint10m: '',
      proAgility: '',
      squat1RM: '',
      bench1RM: '',
      clean1RM: '',
      fms1: '3',
      fms2: '3',
      fms3: '3',
      fms4: '3',
      fms5: '3',
      fms6: '3',
      fms7: '3',
    });
    setAnalysisReport(null);
    setEditingId(null);
  };

  const saveToDatabase = () => {
    if (!playerData.name || !analysisReport) {
      alert("يرجى إدخال البيانات وعمل 'تحليل' قبل الحفظ.");
      return;
    }
    const newRecord = {
      id: Date.now(),
      date: new Date().toLocaleDateString('ar-EG'),
      playerData: { ...playerData },
      testScores: { ...testScores, fmsTotal: analysisReport.fmsTotal },
      analysisReport: { ...analysisReport },
      history: [],
    };
    setAthletesDB([...athletesDB, newRecord]);
    alert(`تم حفظ اللاعب: ${playerData.name} بنجاح!`);
    clearForm();
  };

  const updateDatabase = () => {
    if (!playerData.name || !analysisReport) {
      alert("يرجى عمل 'تحليل' أولاً للأرقام الجديدة.");
      return;
    }

    const updatedDB = athletesDB.map((record: any) => {
      if (record.id === editingId) {
        const today = new Date().toLocaleDateString('ar-EG');
        let existingHistory = record.history || [];

        if (record.date !== today) {
          const oldSnapshot = {
            date: record.date,
            bodyweight: record.playerData.bodyweight,
            bodyFat: record.playerData.bodyFat, 
            testScores: { ...record.testScores },
            fmsTotal: record.analysisReport.fmsTotal,
          };
          existingHistory = [...existingHistory, oldSnapshot];
        }

        return {
          ...record,
          date: today,
          playerData: { ...playerData },
          testScores: { ...testScores, fmsTotal: analysisReport.fmsTotal },
          analysisReport: { ...analysisReport },
          history: existingHistory,
        };
      }
      return record;
    });

    setAthletesDB(updatedDB);
    alert(`عاش يا كابتن! تم تحديث أرقام ${playerData.name} بنجاح.`);
    clearForm();
  };

  const loadFromDatabase = (record: any) => {
    let loadedBirthYear = record.playerData.birthYear;
    if (!loadedBirthYear && record.playerData.age) {
      loadedBirthYear = (
        new Date().getFullYear() - parseInt(record.playerData.age)
      ).toString();
    }

    setPlayerData({
      ...record.playerData,
      birthYear: loadedBirthYear || '',
      bodyFat: record.playerData.bodyFat || '',
      goal: record.playerData.goal || 'maintain',
      trainingDays: record.playerData.trainingDays || '4',
      intensity: record.playerData.intensity || 'medium',
    });
    setTestScores(record.testScores);
    setAnalysisReport(record.analysisReport);
    setEditingId(record.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteFromDatabase = (id: number) => {
    if (window.confirm('هل أنت متأكد من مسح هذا اللاعب نهائياً؟')) {
      setAthletesDB(athletesDB.filter((r: any) => r.id !== id));
    }
  };

  const filteredArchive = athletesDB.filter((record: any) =>
    record.playerData.name.toLowerCase().includes(archiveSearch.toLowerCase())
  );

  // كلاسات الألوان الثابتة للإدخال عشان تشتغل حلو في الفاتح والغامق
  const inputClass = "w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors font-bold placeholder-slate-400 dark:placeholder-slate-500";
  const selectClass = "w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors font-bold";

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-right relative z-10">
      <div
        className={`rounded-2xl shadow-sm border p-6 md:p-8 ${theme.card} ${theme.border}`}
      >
        <div className="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Activity className={`w-8 h-8 ${theme.headerIcon}`} />
            <div>
              <h2 className={`text-2xl font-bold ${theme.headerText}`}>
                القياسات والحركة الوظيفية (FMS)
              </h2>
              <p className={`text-sm mt-1 ${theme.textDesc}`}>
                تقييم رياضي وحركي متكامل مع معايير عالمية ديناميكية.
              </p>
            </div>
          </div>

          {editingId && (
            <div className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-4 py-2 rounded-xl border border-amber-200 dark:border-amber-700 font-bold flex items-center gap-2 animate-pulse">
              <RefreshCw className="w-5 h-5" />
              أنت الآن تقوم بتحديث أرقام لاعب!
            </div>
          )}
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 mb-8 shadow-inner text-slate-800 dark:text-slate-100">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
            <User className="w-5 h-5 text-blue-500" /> محددات التقييم (Demographics)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold mb-1 text-slate-600 dark:text-slate-400">
                اسم اللاعب/ة
              </label>
              <input
                type="text"
                value={playerData.name}
                onChange={(e) =>
                  setPlayerData({ ...playerData, name: e.target.value })
                }
                className={inputClass}
                placeholder="الاسم"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 text-slate-600 dark:text-slate-400">الرياضة</label>
              <select
                value={playerData.sport}
                onChange={(e) =>
                  setPlayerData({ ...playerData, sport: e.target.value })
                }
                className={`${selectClass} bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700`}
              >
                <option value="squash">اسكواش (Squash)</option>
                <option value="volleyball">كرة طائرة (Volleyball)</option>
                <option value="general">رياضة عامة (General)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 text-slate-600 dark:text-slate-400">الجنس</label>
              <select
                value={playerData.gender}
                onChange={(e) =>
                  setPlayerData({ ...playerData, gender: e.target.value })
                }
                className={selectClass}
              >
                <option value="male">ولد (Male)</option>
                <option value="female">بنت (Female)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 text-slate-600 dark:text-slate-400">
                مواليد سنة{' '}
                {calculatedAge > 0 && (
                  <span className="text-blue-600 dark:text-blue-400">({calculatedAge} سنة)</span>
                )}
              </label>
              <input
                type="number"
                value={playerData.birthYear}
                onChange={(e) =>
                  setPlayerData({ ...playerData, birthYear: e.target.value })
                }
                className={inputClass}
                placeholder="مثال: 1998"
              />
            </div>
            <div className="md:col-span-5">
              <label className="block text-xs font-bold text-red-600 dark:text-red-400 mb-1 mt-2">
                الوزن بالكيلو (للقوة النسبية والتغذية)
              </label>
              <input
                type="number"
                value={playerData.bodyweight}
                onChange={(e) =>
                  setPlayerData({ ...playerData, bodyweight: e.target.value })
                }
                className={`w-full p-2.5 rounded-lg border focus:ring-2 focus:outline-none md:w-1/5 font-bold transition-colors bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-slate-900 dark:text-white placeholder-red-300 dark:placeholder-red-700`}
                placeholder="KG"
              />
            </div>
          </div>

          <h3 className="font-bold mb-4 mt-8 flex items-center gap-2 text-slate-800 dark:text-white">
            <Flame className="w-5 h-5 text-orange-500" /> المحددات الفسيولوجية
            (للتغذية)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800/30 p-4 rounded-xl">
            <div>
              <label className="block text-xs font-bold mb-1 text-orange-800 dark:text-orange-400">
                نسبة الدهون (%) - اختياري
              </label>
              <input
                type="number"
                value={playerData.bodyFat}
                onChange={(e) =>
                  setPlayerData({ ...playerData, bodyFat: e.target.value })
                }
                className="w-full p-2.5 rounded-lg border border-orange-300 dark:border-orange-700/50 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-bold"
                placeholder="مثال: 15"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 text-orange-800 dark:text-orange-400">
                الهدف (Goal)
              </label>
              <select
                value={playerData.goal}
                onChange={(e) =>
                  setPlayerData({ ...playerData, goal: e.target.value })
                }
                className="w-full p-2.5 rounded-lg border border-orange-300 dark:border-orange-700/50 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-bold"
              >
                <option value="lose">خسارة دهون (Deficit)</option>
                <option value="maintain">
                  ثبات وزن / أداء رياضي (Maintenance)
                </option>
                <option value="gain">زيادة عضلية (Surplus)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 text-orange-800 dark:text-orange-400">
                أيام التمرين / أسبوع
              </label>
              <select
                value={playerData.trainingDays}
                onChange={(e) =>
                  setPlayerData({ ...playerData, trainingDays: e.target.value })
                }
                className="w-full p-2.5 rounded-lg border border-orange-300 dark:border-orange-700/50 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-bold"
              >
                {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                  <option key={d} value={d}>
                    {d} أيام
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 text-orange-800 dark:text-orange-400">
                متوسط شدة التمرين
              </label>
              <select
                value={playerData.intensity}
                onChange={(e) =>
                  setPlayerData({ ...playerData, intensity: e.target.value })
                }
                className="w-full p-2.5 rounded-lg border border-orange-300 dark:border-orange-700/50 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-bold"
              >
                <option value="low">خفيفة (تأهيل/صيانة)</option>
                <option value="medium">متوسطة (تدريب معتاد)</option>
                <option value="high">عالية جداً (منافسات/بطولات)</option>
              </select>
            </div>
          </div>

          <h3 className="font-bold mb-4 mt-8 flex items-center gap-2 text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
            <ClipboardCheck className="w-5 h-5 text-emerald-500" /> إدخال نتائج الاختبارات
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div className="space-y-4 bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <h4 className="text-sm font-bold text-blue-800 dark:text-blue-400 border-b border-slate-100 dark:border-slate-700 pb-2">
                السرعة والقوة الانفجارية
              </h4>
              <div className="flex justify-between items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 p-1 rounded transition-colors">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">الوثب العمودي (cm)</label>
                <input
                  type="number"
                  value={testScores.verticalJump}
                  onChange={(e) =>
                    setTestScores({
                      ...testScores,
                      verticalJump: e.target.value,
                    })
                  }
                  className="w-24 p-2 text-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-blue-500"
                  placeholder="0"
                />
              </div>
              <div className="flex justify-between items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 p-1 rounded transition-colors">
                <div className="flex flex-col">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">الوثب العريض</label>
                  <span className="text-[10px] text-red-500 font-bold">
                    بالمتر (مثال: 2.8)
                  </span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={testScores.broadJump}
                  onChange={(e) =>
                    setTestScores({ ...testScores, broadJump: e.target.value })
                  }
                  className="w-24 p-2 text-center rounded-lg border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-red-500"
                  placeholder="0.00"
                />
              </div>
              <div className="flex justify-between items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 p-1 rounded transition-colors">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">تسارع 10 متر (sec)</label>
                <input
                  type="number"
                  step="0.01"
                  value={testScores.sprint10m}
                  onChange={(e) =>
                    setTestScores({ ...testScores, sprint10m: e.target.value })
                  }
                  className="w-24 p-2 text-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
              <div className="flex justify-between items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 p-1 rounded transition-colors">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  الرشاقة 5-10-5 (sec)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={testScores.proAgility}
                  onChange={(e) =>
                    setTestScores({ ...testScores, proAgility: e.target.value })
                  }
                  className="w-24 p-2 text-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-4 bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <h4 className="text-sm font-bold text-red-800 dark:text-red-400 border-b border-slate-100 dark:border-slate-700 pb-2">
                القوة القصوى (1RM)
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-2">
                سيتم قسمتها على وزن اللاعب تلقائياً.
              </p>
              <div className="flex justify-between items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 p-1 rounded transition-colors">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Squat 1RM (KG)</label>
                <input
                  type="number"
                  value={testScores.squat1RM}
                  onChange={(e) =>
                    setTestScores({ ...testScores, squat1RM: e.target.value })
                  }
                  className="w-24 p-2 text-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-red-500"
                  placeholder="0"
                />
              </div>
              <div className="flex justify-between items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 p-1 rounded transition-colors">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Bench Press 1RM (KG)
                </label>
                <input
                  type="number"
                  value={testScores.bench1RM}
                  onChange={(e) =>
                    setTestScores({ ...testScores, bench1RM: e.target.value })
                  }
                  className="w-24 p-2 text-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-red-500"
                  placeholder="0"
                />
              </div>
              <div className="flex justify-between items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 p-1 rounded transition-colors">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Power Clean 1RM (KG)
                </label>
                <input
                  type="number"
                  value={testScores.clean1RM}
                  onChange={(e) =>
                    setTestScores({ ...testScores, clean1RM: e.target.value })
                  }
                  className="w-24 p-2 text-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-red-500"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-4 bg-purple-50/50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-200 dark:border-purple-800/30 lg:col-span-2">
              <h4 className="text-sm font-black text-purple-800 dark:text-purple-300 border-b border-purple-200 dark:border-purple-800/30 pb-2 flex items-center gap-2">
                <Activity className="w-4 h-4" /> تقييم الحركة الوظيفية (FMS
                Score)
              </h4>
              <p className="text-[10px] text-purple-600 dark:text-purple-400 mb-2 font-bold">
                قيّم كل حركة من 0 إلى 3 (المجموع من 21).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { id: 'fms1', label: '1. السكوات العميق' },
                  { id: 'fms2', label: '2. تخطي الحاجز' },
                  { id: 'fms3', label: '3. الطعن المباشر' },
                  { id: 'fms4', label: '4. مرونة الكتف' },
                  { id: 'fms5', label: '5. رفع الساق' },
                  { id: 'fms6', label: '6. ثبات الجذع' },
                  { id: 'fms7', label: '7. الثبات الدوراني' },
                ].map((test) => (
                  <div
                    key={test.id}
                    className="flex flex-col gap-1 bg-white dark:bg-slate-800 p-2 rounded-lg border border-purple-100 dark:border-purple-800/30 shadow-sm"
                  >
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {test.label}
                    </label>
                    <select
                      value={(testScores as any)[test.id]}
                      onChange={(e) =>
                        setTestScores({
                          ...testScores,
                          [test.id]: e.target.value,
                        })
                      }
                      className="w-full p-1.5 text-center font-bold bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded outline-none focus:ring-1 focus:ring-purple-400"
                    >
                      <option value="3">3 - حركة مثالية</option>
                      <option value="2">2 - تعويض حركي</option>
                      <option value="1">1 - فشل في الحركة</option>
                      <option value="0">0 - يوجد ألم</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-4 mt-6">
            <button
              onClick={handleAnalyze}
              className={`flex-1 md:flex-none md:w-1/3 ${theme.btnPrimary} font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95 flex justify-center items-center gap-2 text-lg`}
            >
              <BarChart2 className="w-6 h-6" /> تحليل
            </button>

            {editingId ? (
              <>
                <button
                  onClick={updateDatabase}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white px-6 py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors shadow-lg"
                >
                  <RefreshCw className="w-6 h-6" /> تحديث أرقام اللاعب
                </button>
                <button
                  onClick={clearForm}
                  className="bg-slate-300 hover:bg-slate-400 text-slate-800 px-6 py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors shadow-lg"
                >
                  <XCircle className="w-6 h-6" /> إلغاء التعديل
                </button>
              </>
            ) : (
              <button
                onClick={saveToDatabase}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors shadow-lg"
              >
                <Save className="w-6 h-6" /> حفظ كلاعب جديد
              </button>
            )}
          </div>
        </div>

        {/* 🌟 بطاقة التقييم */}
        <div
          className={`${theme.card} rounded-2xl border ${theme.border} p-6 relative overflow-hidden shadow-xl mb-8`}
        >
          <h3
            className={`font-bold text-xl mb-6 flex items-center gap-2 border-b ${theme.border} pb-4 ${theme.headerText}`}
          >
            <Trophy className="w-6 h-6" /> بطاقة تقييم اللاعب
          </h3>

          {!analysisReport ? (
            <div
              className={`flex flex-col items-center justify-center h-48 opacity-50 ${theme.textMain}`}
            >
              <BarChart2 className="w-16 h-16 mb-4" />
              <p>أدخل بيانات اللاعب واضغط "تحليل"</p>
            </div>
          ) : (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              {/* هيدر كارت التقييم */}
              <div
                className={`mb-6 ${theme.bg} p-4 rounded-xl flex items-center justify-between border ${theme.border}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 ${theme.btnPrimary} text-white rounded-full flex items-center justify-center font-bold text-xl shadow-sm`}
                  >
                    {playerData.name.charAt(0) || 'L'}
                  </div>
                  <div>
                    <h4 className={`font-bold text-lg ${theme.textMain}`}>
                      {playerData.name}
                    </h4>
                    <span className={`text-xs ${theme.textDesc}`}>
                      {playerData.sport} | {playerData.gender} |{' '}
                      {playerData.birthYear
                        ? `مواليد ${playerData.birthYear} (${calculatedAge} سنة)`
                        : 'السن غير محدد'}{' '}
                      | {playerData.bodyweight} KG
                    </span>
                    {/* عرض داتا التغذية */}
                    <div className="mt-2 flex gap-2">
                      {playerData.bodyFat && (
                        <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                          <Flame className="w-3 h-3" /> دهون{' '}
                          {playerData.bodyFat}%
                        </span>
                      )}
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {playerData.goal === 'lose'
                          ? 'خسارة وزن'
                          : playerData.goal === 'gain'
                          ? 'زيادة عضلية'
                          : 'ثبات / أداء'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center bg-purple-100 dark:bg-purple-900/40 border border-purple-200 dark:border-purple-500/30 p-2 px-4 rounded-lg">
                  <span className="text-[10px] font-bold text-purple-600 dark:text-purple-300">
                    مجموع FMS
                  </span>
                  <span
                    className={`text-2xl font-black text-purple-800 dark:text-purple-100`}
                  >
                    {analysisReport.fmsTotal}{' '}
                    <span className="text-sm opacity-50">/ 21</span>
                  </span>
                </div>
              </div>

              {/* صفوف النتائج */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                {Object.entries(analysisReport.results).map(
                  ([key, result]: any) => {
                    if (!result) return null;
                    const labels: any = {
                      verticalJump: 'الوثب العمودي',
                      broadJump: 'الوثب العريض',
                      sprint10m: 'تسارع 10 متر',
                      proAgility: 'الرشاقة (5-10-5)',
                      squatRatio: 'قوة الأرجل نسبية',
                      benchRatio: 'قوة الصدر نسبية',
                      cleanRatio: 'الطاقة نسبية',
                      fmsScore: 'كفاءة الحركة (FMS)',
                    };

                    let displayScore = (testScores as any)[key];
                    let unit =
                      key === 'verticalJump'
                        ? 'cm'
                        : key === 'broadJump'
                        ? 'm'
                        : key === 'sprint10m' || key === 'proAgility'
                        ? 's'
                        : 'x BW';

                    if (key === 'squatRatio')
                      displayScore =
                        analysisReport.calculatedRatios.sqRatio.toFixed(2);
                    if (key === 'benchRatio')
                      displayScore =
                        analysisReport.calculatedRatios.bnRatio.toFixed(2);
                    if (key === 'cleanRatio')
                      displayScore =
                        analysisReport.calculatedRatios.clRatio.toFixed(2);
                    if (key === 'fmsScore') {
                      displayScore = result.score;
                      unit = 'نقطة';
                    }

                    return (
                      <div
                        key={key}
                        className={`flex justify-between items-center ${theme.bg} p-3 rounded-lg border ${theme.border} hover:opacity-80 transition-colors`}
                      >
                        <div className="flex flex-col">
                          <span
                            className={`text-sm font-bold ${theme.textMain} opacity-90`}
                          >
                            {labels[key]}:{' '}
                            <b className="ml-1 font-black">
                              {displayScore} {unit}
                            </b>
                          </span>
                          <span
                            className={`text-[10px] ${theme.textDesc} mt-1`}
                          >
                            الهدف الممتاز: {result.target}
                          </span>
                        </div>
                        <span
                          className={`px-3 py-1.5 rounded-md text-xs font-bold border ${getLevelStyle(
                            result.level
                          )}`}
                        >
                          {result.level}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>

              {/* الروشتة */}
              <h4 className="font-bold text-amber-500 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> روشتة العلاج والتدريب
              </h4>
              <div className="space-y-3">
                {analysisReport.problems.map((prob: any, idx: number) => (
                  <div
                    key={idx}
                    className={`${theme.bg} p-4 rounded-xl border ${theme.border} border-r-4 border-r-amber-500`}
                  >
                    <h5 className={`font-bold text-sm mb-1 ${theme.textMain}`}>
                      {prob.issue}
                    </h5>
                    <p className={`text-xs ${theme.textDesc} leading-relaxed`}>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        التدخل المطلوب:{' '}
                      </span>{' '}
                      {prob.solution}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mt-8 text-slate-800 dark:text-slate-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4 mb-6 gap-4">
            <h3 className="font-bold flex items-center gap-2">
              <Database className={`w-5 h-5 ${theme.headerIcon}`} /> أرشيف
              اللاعبين
              <span
                className={`${theme.pill} text-xs px-2 py-0.5 rounded-full ml-2`}
              >
                {athletesDB.length}
              </span>
            </h3>
            <div className="relative w-full sm:w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث عن لاعب..."
                value={archiveSearch}
                onChange={(e) => setArchiveSearch(e.target.value)}
                className="w-full pl-4 pr-9 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-blue-500 outline-none text-sm font-bold shadow-inner placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>
          </div>

          {filteredArchive.length === 0 ? (
            <div className="text-center text-slate-400 py-8 text-sm font-bold">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
              {athletesDB.length === 0
                ? 'الأرشيف فارغ. قم بتحليل بيانات لاعب ثم اضغط حفظ.'
                : 'لا يوجد لاعب بهذا الاسم.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArchive.map((record: any) => {
                let displayAge = '';
                if (record.playerData.birthYear) {
                  displayAge = `${
                    new Date().getFullYear() -
                    parseInt(record.playerData.birthYear)
                  } سنة`;
                } else if (record.playerData.age) {
                  displayAge = `${record.playerData.age} سنة`;
                }

                return (
                  <div
                    key={record.id}
                    className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 ${theme.btnPrimary} rounded-full flex items-center justify-center font-bold text-lg shadow-inner text-white`}
                        >
                          {record.playerData.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm line-clamp-1 dark:text-white">
                            {record.playerData.name}
                          </h4>
                          <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                            <span className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                              {record.playerData.birthYear
                                ? `مواليد ${record.playerData.birthYear}`
                                : displayAge || 'غير محدد'}
                            </span>
                            <span className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-1.5 py-0.5 rounded">
                              {record.date}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteFromDatabase(record.id)}
                        className="text-slate-300 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => loadFromDatabase(record)}
                      className={`w-full mt-2 text-sm font-bold py-2 rounded-lg border transition-colors flex justify-center items-center gap-2 ${theme.pill}`}
                    >
                      عرض / تعديل الملف <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}