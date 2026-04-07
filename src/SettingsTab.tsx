import React, { useRef } from 'react';
import {
  Settings,
  DownloadCloud,
  UploadCloud,
  Trash2,
  HardDrive,
  AlertTriangle,
} from 'lucide-react';

export default function SettingsTab({ theme, athletesDB, setAthletesDB }: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // دالة تصدير البيانات (Backup)
  const exportData = () => {
    if (athletesDB.length === 0) {
      alert('الأرشيف فارغ، لا يوجد بيانات لتصديرها.');
      return;
    }
    const dataStr = JSON.stringify(athletesDB, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Coach_Backup_${new Date()
      .toLocaleDateString('en-GB')
      .replace(/\//g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // دالة استيراد البيانات (Restore)
  const importData = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        // 🚀 هنا تم حل المشكلة بوضع as string
        const importedData = JSON.parse(event.target?.result as string);
        if (Array.isArray(importedData)) {
          setAthletesDB(importedData);
          alert('تم استعادة البيانات بنجاح! 🚀');
        } else {
          alert('صيغة الملف غير صحيحة.');
        }
      } catch (err) {
        alert(
          'حدث خطأ أثناء قراءة الملف. تأكد أنه ملف النسخة الاحتياطية الصحيح.'
        );
      }
    };
    reader.readAsText(file);
    // تصفير الـ input عشان يقدر يرفع نفس الملف تاني لو حابب
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // دالة مسح كل البيانات (Factory Reset)
  const clearAllData = () => {
    const confirmDelete = window.confirm(
      '⚠️ تحذير خطير: هل أنت متأكد من مسح جميع اللاعبين من الأرشيف نهائياً؟ (لا يمكن التراجع عن هذه الخطوة!)'
    );
    if (confirmDelete) {
      setAthletesDB([]);
      alert('تم مسح جميع البيانات بنجاح.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-right relative z-10">
      <div
        className={`rounded-2xl shadow-sm border p-6 md:p-8 ${theme.card} ${theme.border}`}
      >
        <div className="flex items-center gap-3 mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
          <Settings className={`w-8 h-8 ${theme.headerIcon}`} />
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
              إعدادات النظام والبيانات
            </h2>
            <p className="text-slate-500 text-sm">
              إدارة النسخ الاحتياطية، وحفظ أمان بيانات لاعبيك.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* كارت التصدير */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-2">
              <DownloadCloud className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                أخذ نسخة احتياطية (Backup)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                قم بتنزيل جميع بيانات وتقييمات اللاعبين كملف مشفر على جهازك
                لحمايتها من الضياع.
              </p>
            </div>
            <button
              onClick={exportData}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${theme.btnPrimary}`}
            >
              <HardDrive className="w-5 h-5" /> تحميل ملف البيانات (.json)
            </button>
          </div>

          {/* كارت الاستيراد */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-2">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                استعادة البيانات (Restore)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                قم برفع ملف النسخة الاحتياطية الذي قمت بتحميله سابقاً لاستعادة
                جميع بياناتك.
              </p>
            </div>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={importData}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-colors"
            >
              <UploadCloud className="w-5 h-5" /> رفع ملف البيانات
            </button>
          </div>

          {/* كارت مسح البيانات */}
          <div className="md:col-span-2 bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-200 dark:border-red-900/30 flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
            <div className="flex items-center gap-4 text-right">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-red-800 dark:text-red-400">
                  إعادة ضبط المصنع (Factory Reset)
                </h3>
                <p className="text-xs text-red-600 dark:text-red-500/70 mt-1">
                  سيتم مسح جميع بيانات اللاعبين المحفوظة في الأرشيف بالكامل من
                  هذا المتصفح.
                </p>
              </div>
            </div>
            <button
              onClick={clearAllData}
              className="w-full md:w-auto px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white shadow-md transition-colors shrink-0"
            >
              <Trash2 className="w-5 h-5" /> مسح جميع البيانات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
