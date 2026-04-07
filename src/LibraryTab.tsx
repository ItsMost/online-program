import React, { useState, useEffect } from 'react';
import {
  Library,
  CheckCircle,
  Clock,
  Search,
  PlusCircle,
  Filter,
  X,
  Save,
  RefreshCw,
} from 'lucide-react';
import { exerciseLibrary as initialLibrary, categories } from './exercises';

export default function LibraryTab({ theme }: any) {
  // 💾 التحديث الذكي: قراءة التمارين مع إجبار السيستم على تحديث تمارين محمد من الكود
  const [library, setLibrary] = useState(() => {
    const savedLibrary = localStorage.getItem('coach_system_library');
    if (savedLibrary) {
      const parsed = JSON.parse(savedLibrary);
      // 🚀 السطر ده بيجبر المتصفح يسحب تمارين محمد من ملف الـ data.tsx وتتحدث فوراً
      parsed.mohamed = initialLibrary.mohamed;
      return parsed;
    }
    return initialLibrary;
  });

  // 💾 الحفظ التلقائي
  useEffect(() => {
    localStorage.setItem('coach_system_library', JSON.stringify(library));
  }, [library]);

  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const [isAdding, setIsAdding] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '',
    target: '',
    sets: '3',
    reps: '10',
    rest: '60 ثانية',
    notes: '',
  });

  const currentExercises = library[activeCategory] || [];
  const filteredExercises = currentExercises.filter(
    (ex: any) =>
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ex.notes && ex.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddExercise = (e: any) => {
    e.preventDefault();
    if (!newExercise.name || !newExercise.target) {
      alert('يرجى إدخال اسم التمرين والعضلة المستهدفة على الأقل.');
      return;
    }

    const newId =
      currentExercises.length > 0
        ? Math.max(...currentExercises.map((e: any) => e.id || 0)) + 1
        : 1;
    const exerciseToAdd = { id: newId, ...newExercise };

    setLibrary({
      ...library,
      [activeCategory]: [...currentExercises, exerciseToAdd],
    });

    setNewExercise({
      name: '',
      target: '',
      sets: '3',
      reps: '10',
      rest: '60 ثانية',
      notes: '',
    });
    setIsAdding(false);
  };

  // دالة لمسح الذاكرة بالكامل لو حبيت ترجع لضبط المصنع
  const handleResetLibrary = () => {
    if (
      window.confirm(
        'هل أنت متأكد من استعادة مكتبة التمارين الأصلية؟ (سيتم مسح أي تمارين قمت بإضافتها يدوياً)'
      )
    ) {
      localStorage.removeItem('coach_system_library');
      setLibrary(initialLibrary);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-right">
      <div
        className={`rounded-2xl shadow-sm border p-6 md:p-8 ${theme.card} ${theme.border}`}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-xl ${theme.header} ${theme.headerText}`}
            >
              <Library className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                مكتبة التمارين المرجعية
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                تصفح، ابحث، وأضف تمارينك الخاصة لقاعدة البيانات.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleResetLibrary}
              className="p-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              title="استعادة المكتبة الأصلية"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <div className="relative w-full sm:w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث في هذا القسم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
              />
            </div>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm ${theme.btnPrimary}`}
            >
              {isAdding ? (
                <X className="w-5 h-5" />
              ) : (
                <PlusCircle className="w-5 h-5" />
              )}
              {isAdding ? 'إلغاء الإضافة' : 'تمرين جديد'}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 bg-slate-50/80 dark:bg-slate-900/50 p-2 rounded-2xl border border-slate-100 dark:border-slate-800">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const count = library[cat.id]?.length || 0;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSearchQuery('');
                  setIsAdding(false);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex-grow justify-center ${
                  isActive
                    ? `${theme.btnPrimary} shadow-md transform scale-105`
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {cat.icon} {cat.name}
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ml-1 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {isAdding && (
          <div className="mb-8 animate-in slide-in-from-top-4">
            <form
              onSubmit={handleAddExercise}
              className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner"
            >
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                <PlusCircle className="w-5 h-5 text-blue-500" /> إضافة تمرين
                لقسم ({categories.find((c) => c.id === activeCategory)?.name})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="lg:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    اسم التمرين *
                  </label>
                  <input
                    required
                    type="text"
                    value={newExercise.name}
                    onChange={(e) =>
                      setNewExercise({ ...newExercise, name: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white outline-none focus:border-blue-500"
                    placeholder="مثال: Barbell Back Squat"
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    العضلة المستهدفة *
                  </label>
                  <input
                    required
                    type="text"
                    value={newExercise.target}
                    onChange={(e) =>
                      setNewExercise({ ...newExercise, target: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white outline-none focus:border-blue-500"
                    placeholder="مثال: الأرجل (Quads)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    المجموعات
                  </label>
                  <input
                    type="text"
                    value={newExercise.sets}
                    onChange={(e) =>
                      setNewExercise({ ...newExercise, sets: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white outline-none focus:border-blue-500"
                    placeholder="3-4"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    العدادات / الزمن
                  </label>
                  <input
                    type="text"
                    value={newExercise.reps}
                    onChange={(e) =>
                      setNewExercise({ ...newExercise, reps: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white outline-none focus:border-blue-500"
                    placeholder="8-12"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    الراحة
                  </label>
                  <input
                    type="text"
                    value={newExercise.rest}
                    onChange={(e) =>
                      setNewExercise({ ...newExercise, rest: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white outline-none focus:border-blue-500"
                    placeholder="90 ثانية"
                  />
                </div>
                <div className="lg:col-span-4">
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    ملاحظات فنية
                  </label>
                  <input
                    type="text"
                    value={newExercise.notes}
                    onChange={(e) =>
                      setNewExercise({ ...newExercise, notes: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white outline-none focus:border-blue-500"
                    placeholder="نصائح حول الأداء الحركي..."
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 ${theme.btnPrimary}`}
                >
                  <Save className="w-4 h-4" /> حفظ التمرين
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900">
          <table className="w-full text-right text-sm">
            <thead
              className={`text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 ${theme.bg}`}
            >
              <tr>
                <th className="p-4 font-black w-12 text-center border-l border-slate-200 dark:border-slate-700">
                  #
                </th>
                <th className="p-4 font-black border-l border-slate-200 dark:border-slate-700 w-1/4">
                  اسم التمرين
                </th>
                <th className="p-4 font-black border-l border-slate-200 dark:border-slate-700">
                  الهدف / العضلة
                </th>
                <th className="p-4 font-black text-center border-l border-slate-200 dark:border-slate-700 w-24">
                  المجموعات
                </th>
                <th className="p-4 font-black text-center border-l border-slate-200 dark:border-slate-700 w-24">
                  العدادات
                </th>
                <th className="p-4 font-black text-center border-l border-slate-200 dark:border-slate-700 w-32">
                  الراحة
                </th>
                <th className="p-4 font-black">الملاحظات الفنية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-400">
              {filteredExercises.length > 0 ? (
                filteredExercises.map((exercise: any, index: number) => (
                  <tr
                    key={index}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    <td className="p-4 font-bold text-slate-400 text-center border-l border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-transparent group-hover:bg-transparent">
                      {index + 1}
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white border-l border-slate-100 dark:border-slate-800">
                      {exercise.name}
                    </td>
                    <td className="p-4 font-medium border-l border-slate-100 dark:border-slate-800">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md text-xs border border-slate-200 dark:border-slate-700">
                        {exercise.target}
                      </span>
                    </td>
                    <td className="p-4 text-center font-bold border-l border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-transparent group-hover:bg-transparent">
                      {exercise.sets}
                    </td>
                    <td className="p-4 text-center font-bold border-l border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-transparent group-hover:bg-transparent">
                      {exercise.reps}
                    </td>
                    <td className="p-4 text-center text-slate-600 dark:text-slate-400 font-medium border-l border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-transparent group-hover:bg-transparent">
                      <div className="flex items-center justify-center gap-1.5">
                        <Clock className="w-3 h-3 text-slate-400" />{' '}
                        {exercise.rest}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                      {exercise.notes || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    لا توجد تمارين تطابق بحثك.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
