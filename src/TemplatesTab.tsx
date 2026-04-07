import React, { useState, useEffect } from 'react';
import {
  LayoutTemplate,
  Trash2,
  Copy,
  FileJson,
  Eye,
  ChevronDown,
  ChevronUp,
  Database,
  PlusCircle,
} from 'lucide-react';

export default function TemplatesTab({ theme }: any) {
  // سحب القوالب من المتصفح
  const [templates, setTemplates] = useState<any[]>(() => {
    const saved = localStorage.getItem('coach_workout_templates');
    return saved ? JSON.parse(saved) : [];
  });

  const [expandedTemplateId, setExpandedTemplateId] = useState<number | null>(
    null
  );

  // تحديث المتصفح لو مسحنا حاجة
  useEffect(() => {
    localStorage.setItem('coach_workout_templates', JSON.stringify(templates));
  }, [templates]);

  // دالة مسح قالب
  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`هل أنت متأكد من حذف قالب "${name}" نهائياً؟`)) {
      setTemplates(templates.filter((t) => t.id !== id));
    }
  };

  // دالة نسخ كود القالب
  const handleCopyCode = (template: any) => {
    const jsonStr = JSON.stringify(template);
    navigator.clipboard.writeText(jsonStr).then(() => {
      alert(`تم نسخ كود قالب "${template.name}" بنجاح! 📋`);
    });
  };

  // دالة لفتح وقفل تفاصيل القالب
  const toggleExpand = (id: number) => {
    if (expandedTemplateId === id) {
      setExpandedTemplateId(null);
    } else {
      setExpandedTemplateId(id);
    }
  };

  // دالة لاستيراد كود جديد مباشرة من هنا
  const handleImport = () => {
    const input = prompt('قم بلصق (Paste) كود البرنامج هنا:');
    if (!input) return;
    try {
      const parsed = JSON.parse(input);
      if (parsed.days || parsed.blocks) {
        // دعم التوافقية لو القالب قديم (مفيش أيام)
        const safeDays = parsed.days || [
          { id: 1, title: 'Day 1', blocks: parsed.blocks },
        ];
        const newTemplate = {
          id: Date.now(),
          name: parsed.name || 'برنامج مستورد جديد',
          days: safeDays,
        };
        setTemplates([...templates, newTemplate]);
        alert('تم استيراد القالب بنجاح! 🎉');
      } else {
        alert('صيغة الكود غير صحيحة.');
      }
    } catch (err) {
      alert('حدث خطأ أثناء قراءة الكود. تأكد من صحة النسخ.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-right">
      {/* 👑 الهيدر */}
      <div
        className={`p-6 md:p-8 rounded-3xl border shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${theme.card} ${theme.border}`}
      >
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl bg-blue-500/10 text-blue-500`}>
            <Database className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black flex items-center gap-2">
              إدارة القوالب (Template Manager)
            </h2>
            <p className={`text-sm mt-1 font-bold ${theme.textDesc}`}>
              لديك ({templates.length}) قوالب محفوظة في قاعدة البيانات الخاصة
              بك.
            </p>
          </div>
        </div>

        <button
          onClick={handleImport}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-md transition-all w-full md:w-auto"
        >
          <FileJson className="w-5 h-5" /> استيراد كود قالب
        </button>
      </div>

      {/* 📋 قائمة القوالب */}
      {templates.length === 0 ? (
        <div
          className={`p-12 rounded-3xl border flex flex-col items-center justify-center opacity-60 ${theme.card} ${theme.border}`}
        >
          <LayoutTemplate className="w-20 h-20 mb-4 text-slate-400" />
          <p className="text-xl font-bold text-slate-500">
            لا توجد قوالب محفوظة حالياً.
          </p>
          <p className="text-sm mt-2 text-slate-400">
            قم ببناء برنامج في منشئ البرامج واحفظه، أو قم باستيراد كود جاهز.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {templates.map((template) => {
            const isExpanded = expandedTemplateId === template.id;
            const daysCount = template.days?.length || 1;

            return (
              <div
                key={template.id}
                className={`rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 ${
                  theme.card
                } ${theme.border} ${
                  isExpanded
                    ? 'ring-2 ring-blue-500/50'
                    : 'hover:border-blue-300'
                }`}
              >
                {/* 💳 كارت القالب من الخارج */}
                <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div
                    className="flex items-center gap-4 cursor-pointer flex-1"
                    onClick={() => toggleExpand(template.id)}
                  >
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                      <LayoutTemplate className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                        {template.name}
                      </h3>
                      <p className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-2">
                        <CalendarDays className="w-3 h-3" /> البرنامج مقسم إلى (
                        {daysCount}) أيام تدريبية
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-4 md:pt-0">
                    <button
                      onClick={() => handleCopyCode(template)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg font-bold text-sm transition-colors"
                    >
                      <Copy className="w-4 h-4" /> نسخ الكود
                    </button>
                    <button
                      onClick={() => handleDelete(template.id, template.name)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="حذف القالب"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => toggleExpand(template.id)}
                      className="p-2 text-slate-400 hover:text-blue-500 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 🔍 تفاصيل القالب (تظهر عند الفتح) */}
                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-6 animate-in slide-in-from-top-2">
                    <h4 className="font-black text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-emerald-500" /> نظرة سريعة
                      على محتوى البرنامج:
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {template.days?.map((day: any, dIndex: number) => (
                        <div
                          key={dIndex}
                          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm"
                        >
                          <h5 className="font-bold text-sm text-blue-600 dark:text-blue-400 mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            {day.title}
                          </h5>
                          <ul className="space-y-2">
                            {day.blocks?.map((block: any, bIndex: number) => (
                              <li
                                key={bIndex}
                                className="text-xs font-bold text-slate-600 dark:text-slate-400"
                              >
                                <span className="text-slate-400 dark:text-slate-500 mr-1">
                                  ■
                                </span>
                                {block.exercises[0]?.name || 'تمرين'}
                                {block.exercises.length > 1 && (
                                  <span className="text-emerald-500 text-[10px] mr-1">
                                    (+ سوبر سيت)
                                  </span>
                                )}
                              </li>
                            ))}
                            {(!day.blocks || day.blocks.length === 0) && (
                              <li className="text-xs text-slate-400 italic">
                                لا توجد تمارين مسجلة
                              </li>
                            )}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// إضافة أداة بسيطة للاستدعاء داخل الملف عشان نتأكد إنها مش هتعمل خطأ في الكود
const CalendarDays = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
    <path d="M8 14h.01" />
    <path d="M12 14h.01" />
    <path d="M16 14h.01" />
    <path d="M8 18h.01" />
    <path d="M12 18h.01" />
    <path d="M16 18h.01" />
  </svg>
);
