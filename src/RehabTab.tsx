import React, { useState, useEffect } from 'react';
import {
  HeartPulse,
  User,
  AlertTriangle,
  Plus,
  Trash2,
  Activity,
  CheckCircle2,
  XCircle,
  Save,
  Target, // 🌟 تم إضافة الاستيراد الناقص هنا لحل مشكلة الشاشة البيضاء 🌟
} from 'lucide-react';

export default function RehabTab({ theme, athletesDB, setAthletesDB }: any) {
  const [selectedAthleteId, setSelectedAthleteId] = useState('');

  // حالة المودال (نافذة إضافة الإصابة)
  const [showModal, setShowModal] = useState(false);
  const [selectedBodyPart, setSelectedBodyPart] = useState<{
    id: string;
    name: string;
    side: string;
  } | null>(null);
  const [injuryForm, setInjuryForm] = useState({
    title: '',
    painLevel: '5',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const currentAthlete = athletesDB.find(
    (a: any) => String(a.id || a._id) === String(selectedAthleteId)
  );

  const injuries = currentAthlete?.injuries || [];

  const updateAthleteInjuries = (newInjuries: any[]) => {
    if (!selectedAthleteId) return;

    const updatedAthletes = athletesDB.map((athlete: any) =>
      String(athlete.id || athlete._id) === String(selectedAthleteId)
        ? { ...athlete, injuries: newInjuries }
        : athlete
    );
    setAthletesDB(updatedAthletes);
  };

  const handleBodyPartClick = (
    partId: string,
    partName: string,
    side: string
  ) => {
    if (!selectedAthleteId) {
      alert('يرجى اختيار لاعب أولاً لتسجيل إصابته.');
      return;
    }
    setSelectedBodyPart({ id: partId, name: partName, side });
    setShowModal(true);
  };

  const handleSaveInjury = () => {
    if (!injuryForm.title) {
      alert('يرجى كتابة وصف أو اسم الإصابة.');
      return;
    }

    const newInjury = {
      uniqueId: Date.now(),
      partId: selectedBodyPart?.id,
      partName: selectedBodyPart?.name,
      side: selectedBodyPart?.side,
      title: injuryForm.title,
      painLevel: parseInt(injuryForm.painLevel),
      date: injuryForm.date,
      notes: injuryForm.notes,
      status: 'نشط',
    };

    updateAthleteInjuries([...injuries, newInjury]);

    setInjuryForm({
      title: '',
      painLevel: '5',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setShowModal(false);
    setSelectedBodyPart(null);
  };

  const handleDeleteInjury = (uniqueId: number) => {
    if (window.confirm('هل تريد حذف سجل هذه الإصابة نهائياً؟')) {
      const newInjuries = injuries.filter(
        (inj: any) => inj.uniqueId !== uniqueId
      );
      updateAthleteInjuries(newInjuries);
    }
  };

  const handleToggleStatus = (uniqueId: number) => {
    const newInjuries = injuries.map((inj: any) => {
      if (inj.uniqueId === uniqueId) {
        return { ...inj, status: inj.status === 'نشط' ? 'تم الشفاء' : 'نشط' };
      }
      return inj;
    });
    updateAthleteInjuries(newInjuries);
  };

  const checkInjuryOnPart = (partId: string) => {
    return injuries.some(
      (inj: any) => inj.partId === partId && inj.status === 'نشط'
    );
  };

  // 🌟 تم تحديث إحداثيات النقاط لتتناسب مع التصميم الجديد (الـ CSS Body) 🌟
  const bodyPartsFront = [
    { id: 'f-head', name: 'الرأس/الرقبة', top: '8%', left: '50%' },
    { id: 'f-r-shoulder', name: 'الكتف الأيمن', top: '22%', left: '30%' },
    { id: 'f-l-shoulder', name: 'الكتف الأيسر', top: '22%', left: '70%' },
    { id: 'f-chest', name: 'الصدر', top: '25%', left: '50%' },
    { id: 'f-r-elbow', name: 'الكوع الأيمن', top: '38%', left: '20%' },
    { id: 'f-l-elbow', name: 'الكوع الأيسر', top: '38%', left: '80%' },
    { id: 'f-core', name: 'عضلات البطن (الكور)', top: '40%', left: '50%' },
    { id: 'f-r-wrist', name: 'المعصم الأيمن', top: '55%', left: '12%' },
    { id: 'f-l-wrist', name: 'المعصم الأيسر', top: '55%', left: '88%' },
    { id: 'f-hip', name: 'الحوض', top: '52%', left: '50%' },
    { id: 'f-r-quad', name: 'الفخذ الأيمن (أمامي)', top: '65%', left: '40%' },
    { id: 'f-l-quad', name: 'الفخذ الأيسر (أمامي)', top: '65%', left: '60%' },
    { id: 'f-r-knee', name: 'الركبة اليمنى', top: '78%', left: '40%' },
    { id: 'f-l-knee', name: 'الركبة اليسرى', top: '78%', left: '60%' },
    { id: 'f-r-ankle', name: 'الكاحل الأيمن', top: '92%', left: '40%' },
    { id: 'f-l-ankle', name: 'الكاحل الأيسر', top: '92%', left: '60%' },
  ];

  const bodyPartsBack = [
    { id: 'b-neck', name: 'الرقبة خلفي', top: '15%', left: '50%' },
    { id: 'b-upper-back', name: 'أعلى الظهر', top: '25%', left: '50%' },
    { id: 'b-r-shoulder', name: 'الكتف الأيمن خلفي', top: '22%', left: '70%' },
    { id: 'b-l-shoulder', name: 'الكتف الأيسر خلفي', top: '22%', left: '30%' },
    { id: 'b-lower-back', name: 'أسفل الظهر', top: '45%', left: '50%' },
    { id: 'b-r-glute', name: 'عضلة الأرداف اليمنى', top: '55%', left: '65%' },
    { id: 'b-l-glute', name: 'عضلة الأرداف اليسرى', top: '55%', left: '35%' },
    { id: 'b-r-ham', name: 'الخلفيات اليمنى', top: '68%', left: '60%' },
    { id: 'b-l-ham', name: 'الخلفيات اليسرى', top: '68%', left: '40%' },
    { id: 'b-r-calf', name: 'السمانة اليمنى', top: '85%', left: '60%' },
    { id: 'b-l-calf', name: 'السمانة اليسرى', top: '85%', left: '40%' },
    { id: 'b-r-achilles', name: 'وتر أكيلس الأيمن', top: '94%', left: '60%' },
    { id: 'b-l-achilles', name: 'وتر أكيلس الأيسر', top: '94%', left: '40%' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-right relative">
      {/* 🛑 نافذة إضافة الإصابة (Modal) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div
            className={`${theme.bg} ${theme.textMain} p-6 rounded-2xl shadow-2xl border ${theme.border} w-full max-w-md animate-in zoom-in-95 duration-200`}
          >
            <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
              <h3 className="font-black text-xl flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                تسجيل إصابة جديدة
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-red-500"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800/30 flex items-center gap-2">
                <Target className="w-5 h-5 text-red-600" />
                <span className="font-bold text-red-800 dark:text-red-300">
                  المكان: {selectedBodyPart?.name} ({selectedBodyPart?.side})
                </span>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 opacity-80">
                  التشخيص / وصف الإصابة
                </label>
                <input
                  type="text"
                  value={injuryForm.title}
                  onChange={(e) =>
                    setInjuryForm({ ...injuryForm, title: e.target.value })
                  }
                  placeholder="مثال: تمزق في الغضروف، ألم مزمن، كدمة..."
                  className="w-full p-2.5 rounded-lg border focus:ring-2 focus:ring-red-500 outline-none font-bold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1 opacity-80">
                    درجة الألم (1-10)
                  </label>
                  <select
                    value={injuryForm.painLevel}
                    onChange={(e) =>
                      setInjuryForm({
                        ...injuryForm,
                        painLevel: e.target.value,
                      })
                    }
                    className="w-full p-2.5 rounded-lg border focus:ring-2 focus:ring-red-500 outline-none font-bold text-slate-800"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option key={n} value={n}>
                        {n} - {n > 7 ? 'شديد جداً' : n > 4 ? 'متوسط' : 'محتمل'}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1 opacity-80">
                    تاريخ الإصابة
                  </label>
                  <input
                    type="date"
                    value={injuryForm.date}
                    onChange={(e) =>
                      setInjuryForm({ ...injuryForm, date: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg border focus:ring-2 focus:ring-red-500 outline-none font-bold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 opacity-80">
                  ملاحظات خطة التأهيل (اختياري)
                </label>
                <textarea
                  value={injuryForm.notes}
                  onChange={(e) =>
                    setInjuryForm({ ...injuryForm, notes: e.target.value })
                  }
                  placeholder="التمارين الممنوعة، تعليمات الدكتور، بروتوكول العلاج..."
                  className="w-full p-2.5 rounded-lg border focus:ring-2 focus:ring-red-500 outline-none font-bold text-slate-800 min-h-[100px] resize-none"
                />
              </div>

              <button
                onClick={handleSaveInjury}
                className="w-full mt-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" /> حفظ في ملف اللاعب
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 👑 الهيدر واختيار اللاعب */}
      <div
        className={`p-4 md:p-6 rounded-2xl border ${theme.card} ${theme.border}`}
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <HeartPulse className="w-8 h-8 text-red-500" />
              خريطة الإصابات والتأهيل (Body Map)
            </h2>
            <p className={`text-sm mt-1 ${theme.textDesc}`}>
              حدد أماكن الإصابات السابقة والحالية للاعب لضمان سلامته أثناء
              التخطيط.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div
              className={`flex items-center gap-2 p-2 rounded-xl border focus-within:ring-2 focus-within:ring-red-500 ${theme.bg} ${theme.border}`}
            >
              <User className={`w-5 h-5 ${theme.textDesc}`} />
              <select
                value={selectedAthleteId}
                onChange={(e) => setSelectedAthleteId(e.target.value)}
                className={`bg-transparent outline-none font-bold w-full sm:w-48 ${theme.textMain}`}
              >
                <option value="">-- اختر اللاعب --</option>
                {athletesDB.map((athlete: any, index: number) => {
                  const displayName =
                    athlete.playerData?.name || `لاعب ${index + 1}`;
                  return (
                    <option key={athlete.id} value={String(athlete.id)}>
                      {displayName}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
      </div>

      {!selectedAthleteId ? (
        <div
          className={`p-12 rounded-2xl border flex flex-col items-center justify-center opacity-50 ${theme.card} ${theme.border}`}
        >
          <User className="w-20 h-20 mb-4 text-slate-400" />
          <p className="text-xl font-bold text-slate-500">
            يرجى اختيار لاعب لعرض خريطة إصاباته وتسجيل بياناته الطبية
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* 🧍‍♂️ خريطة الجسم التفاعلية (CSS المودرن) */}
          <div
            className={`lg:col-span-3 p-6 rounded-2xl border ${theme.card} ${theme.border} flex flex-col items-center shadow-inner overflow-hidden`}
          >
            <h3 className="font-black text-xl mb-6 text-slate-700 dark:text-slate-200 border-b-2 border-red-500 pb-2 px-6 text-center">
              اضغط على موضع الألم لتسجيل الإصابة
            </h3>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-16 w-full max-w-2xl py-8">
              {/* 🧍‍♂️ أمامي (Front) - باستخدام CSS */}
              <div className="relative w-[200px] h-[400px]">
                <p className="absolute -top-10 left-1/2 -translate-x-1/2 font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full shadow-sm text-sm whitespace-nowrap">
                  أمامي (Front)
                </p>
                {/* بناء الجسم بالـ CSS */}
                <div className="absolute top-[0px] left-1/2 -translate-x-1/2 w-14 h-16 bg-slate-300 dark:bg-slate-700 rounded-[2rem] shadow-sm"></div>{' '}
                {/* Head */}
                <div className="absolute top-[70px] left-1/2 -translate-x-1/2 w-24 h-36 bg-slate-300 dark:bg-slate-700 rounded-[2rem] shadow-sm"></div>{' '}
                {/* Torso */}
                <div className="absolute top-[75px] left-[10px] w-8 h-32 bg-slate-300 dark:bg-slate-700 rounded-full origin-top transform rotate-[15deg] shadow-sm"></div>{' '}
                {/* Left Arm */}
                <div className="absolute top-[75px] right-[10px] w-8 h-32 bg-slate-300 dark:bg-slate-700 rounded-full origin-top transform -rotate-[15deg] shadow-sm"></div>{' '}
                {/* Right Arm */}
                <div className="absolute top-[210px] left-[55px] w-10 h-36 bg-slate-300 dark:bg-slate-700 rounded-full shadow-sm"></div>{' '}
                {/* Left Leg */}
                <div className="absolute top-[210px] right-[55px] w-10 h-36 bg-slate-300 dark:bg-slate-700 rounded-full shadow-sm"></div>{' '}
                {/* Right Leg */}
                {/* أزرار الإصابات (النقاط) */}
                {bodyPartsFront.map((part) => {
                  const hasInjury = checkInjuryOnPart(part.id);
                  return (
                    <button
                      key={part.id}
                      onClick={() =>
                        handleBodyPartClick(part.id, part.name, 'أمامي')
                      }
                      className={`absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-2 transition-all group ${
                        hasInjury
                          ? 'bg-red-500 border-white shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse z-20'
                          : 'bg-blue-400/60 border-blue-600 hover:bg-blue-500 hover:scale-150 z-10'
                      }`}
                      style={{ top: part.top, left: part.left }}
                    >
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                        {part.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* 🧍‍♂️ خلفي (Back) - باستخدام CSS */}
              <div className="relative w-[200px] h-[400px]">
                <p className="absolute -top-10 left-1/2 -translate-x-1/2 font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full shadow-sm text-sm whitespace-nowrap">
                  خلفي (Back)
                </p>
                {/* بناء الجسم بالـ CSS */}
                <div className="absolute top-[0px] left-1/2 -translate-x-1/2 w-14 h-16 bg-slate-400 dark:bg-slate-600 rounded-[2rem] shadow-sm"></div>{' '}
                {/* Head */}
                <div className="absolute top-[70px] left-1/2 -translate-x-1/2 w-24 h-36 bg-slate-400 dark:bg-slate-600 rounded-[2rem] shadow-sm"></div>{' '}
                {/* Torso */}
                <div className="absolute top-[75px] left-[10px] w-8 h-32 bg-slate-400 dark:bg-slate-600 rounded-full origin-top transform rotate-[15deg] shadow-sm"></div>{' '}
                {/* Left Arm */}
                <div className="absolute top-[75px] right-[10px] w-8 h-32 bg-slate-400 dark:bg-slate-600 rounded-full origin-top transform -rotate-[15deg] shadow-sm"></div>{' '}
                {/* Right Arm */}
                <div className="absolute top-[210px] left-[55px] w-10 h-36 bg-slate-400 dark:bg-slate-600 rounded-full shadow-sm"></div>{' '}
                {/* Left Leg */}
                <div className="absolute top-[210px] right-[55px] w-10 h-36 bg-slate-400 dark:bg-slate-600 rounded-full shadow-sm"></div>{' '}
                {/* Right Leg */}
                {/* أزرار الإصابات (النقاط) */}
                {bodyPartsBack.map((part) => {
                  const hasInjury = checkInjuryOnPart(part.id);
                  return (
                    <button
                      key={part.id}
                      onClick={() =>
                        handleBodyPartClick(part.id, part.name, 'خلفي')
                      }
                      className={`absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-2 transition-all group ${
                        hasInjury
                          ? 'bg-red-500 border-white shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse z-20'
                          : 'bg-blue-400/60 border-blue-600 hover:bg-blue-500 hover:scale-150 z-10'
                      }`}
                      style={{ top: part.top, left: part.left }}
                    >
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                        {part.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 📋 السجل الطبي وقائمة الإصابات */}
          <div
            className={`lg:col-span-2 p-4 md:p-6 rounded-2xl border ${theme.card} ${theme.border} h-[680px] flex flex-col`}
          >
            <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
              <h3 className="font-bold text-xl flex items-center gap-2">
                <Activity className="w-5 h-5 text-red-500" /> السجل الطبي للاعب
              </h3>
              <span className="bg-red-100 text-red-800 text-xs font-black px-3 py-1 rounded-full border border-red-200">
                {injuries.filter((i: any) => i.status === 'نشط').length} إصابة
                نشطة
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {injuries.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-40">
                  <CheckCircle2 className="w-16 h-16 mb-4 text-emerald-500" />
                  <p className="font-bold text-center">
                    اللاعب سليم 100%
                    <br />
                    لا توجد إصابات مسجلة في سجله الطبي.
                  </p>
                </div>
              ) : (
                injuries.map((inj: any) => (
                  <div
                    key={inj.uniqueId}
                    className={`p-4 rounded-xl border-l-4 transition-all relative group shadow-sm ${
                      inj.status === 'نشط'
                        ? 'bg-red-50 dark:bg-red-900/10 border-l-red-500 border-y-red-100 border-r-red-100 dark:border-y-red-900/30 dark:border-r-red-900/30'
                        : 'bg-slate-50 dark:bg-slate-800 border-l-emerald-500 border-y-slate-200 border-r-slate-200 dark:border-y-slate-700 dark:border-r-slate-700 opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4
                          className={`font-black text-lg ${
                            inj.status === 'نشط'
                              ? 'text-red-800 dark:text-red-400'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {inj.title}
                        </h4>
                        <p className="text-xs font-bold text-slate-500 mt-1 flex items-center gap-1">
                          <Target className="w-3 h-3" /> {inj.partName} (
                          {inj.side})
                        </p>
                      </div>
                      <div className="text-center bg-white dark:bg-slate-900 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                        <span
                          className={`block text-xl font-black ${
                            inj.status === 'نشط'
                              ? 'text-red-600'
                              : 'text-slate-400'
                          }`}
                        >
                          {inj.painLevel}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400">
                          / 10 ألم
                        </span>
                      </div>
                    </div>

                    {inj.notes && (
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 mb-3 leading-relaxed">
                        {inj.notes}
                      </p>
                    )}

                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/50">
                      <span className="text-[10px] font-bold text-slate-400 bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-100 dark:border-slate-800">
                        {inj.date}
                      </span>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleStatus(inj.uniqueId)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border shadow-sm ${
                            inj.status === 'نشط'
                              ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border-emerald-200'
                              : 'bg-red-100 hover:bg-red-200 text-red-700 border-red-200'
                          }`}
                        >
                          {inj.status === 'نشط'
                            ? 'تحديد كـ "تم الشفاء"'
                            : 'إعادة التفعيل'}
                        </button>
                        <button
                          onClick={() => handleDeleteInjury(inj.uniqueId)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-100 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors shadow-sm"
                          title="مسح السجل"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
