import React, { useState, useEffect } from 'react';
import {
  Target,
  Palette,
  BarChart2,
  Users,
  Calendar,
  Library,
  ListTodo,
  HeartPulse,
  TrendingUp,
  Monitor,
  Zap,
  Flame,
  Cpu,
  Radio,
  Sun,
  Moon,
  Settings,
  Apple,
  LayoutTemplate, // 🌟 تم إضافة أيقونة القوالب هنا
} from 'lucide-react';

import AssessmentTab from './AssessmentTab';
import TeamTab from './TeamTab';
import StrategyTab from './StrategyTab';
import LibraryTab from './LibraryTab';
import TemplatesTab from './TemplatesTab'; // 🌟 تم استدعاء شاشة القوالب هنا
import ProgramBuilderTab from './ProgramBuilderTab';
import RehabTab from './RehabTab';
import AnalyticsTab from './AnalyticsTab';
import SettingsTab from './SettingsTab';
import NutritionTab from './NutritionTab';

// استيراد ملف قاعدة البيانات
import { supabase } from './supabaseClient';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const THEMES = {
    pro: {
      id: 'pro',
      name: 'الاحترافي',
      icon: <Monitor className="w-5 h-5" />,
      light: {
        bg: 'bg-slate-50',
        pattern:
          'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]',
        card: 'bg-white border-slate-200 shadow-xl',
        header: 'bg-white border-b border-slate-200',
        headerText: 'text-slate-900',
        headerIcon: 'text-blue-600',
        tabActive:
          'bg-blue-50 text-blue-700 border-b-2 border-blue-600 font-bold shadow-sm',
        tabInactive: 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
        btnPrimary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md',
        textMain: 'text-slate-800',
        textDesc: 'text-slate-500',
        border: 'border-slate-200',
        pill: 'bg-blue-100 text-blue-800 border-blue-200',
      },
      dark: {
        bg: 'bg-slate-950',
        pattern:
          'bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]',
        card: 'bg-slate-900 border-slate-800 shadow-2xl',
        header: 'bg-slate-900 border-b border-slate-800',
        headerText: 'text-white',
        headerIcon: 'text-blue-400',
        tabActive:
          'bg-slate-800 text-blue-400 border-b-2 border-blue-500 font-bold shadow-md',
        tabInactive: 'text-slate-400 hover:bg-slate-800 hover:text-white',
        btnPrimary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-md',
        textMain: 'text-slate-200',
        textDesc: 'text-slate-400',
        border: 'border-slate-800',
        pill: 'bg-blue-900/50 text-blue-300 border-blue-800',
      },
    },
    haikyuu: {
      id: 'haikyuu',
      name: 'هايكيو',
      icon: <Zap className="w-5 h-5" />,
      light: {
        bg: 'bg-slate-50',
        pattern:
          'bg-[radial-gradient(#fed7aa_1px,transparent_1px)] [background-size:20px_20px]',
        card: 'bg-white border-orange-200 shadow-xl',
        header: 'bg-white border-b border-orange-200',
        headerText: 'text-orange-900',
        headerIcon: 'text-orange-600',
        tabActive:
          'bg-orange-50 text-orange-700 border-b-2 border-orange-600 font-bold shadow-sm',
        tabInactive:
          'text-orange-700/70 hover:bg-orange-100 hover:text-orange-900',
        btnPrimary: 'bg-orange-600 hover:bg-orange-700 text-white shadow-md',
        textMain: 'text-stone-900',
        textDesc: 'text-stone-600',
        border: 'border-orange-200',
        pill: 'bg-orange-100 text-orange-800 border-orange-200',
      },
      dark: {
        bg: 'bg-[#1a110a]',
        pattern:
          'bg-[radial-gradient(#432c1a_1px,transparent_1px)] [background-size:20px_20px]',
        card: 'bg-[#2a1c12] border-[#432c1a] shadow-2xl',
        header: 'bg-[#2a1c12] border-b border-[#432c1a]',
        headerText: 'text-orange-400',
        headerIcon: 'text-orange-500',
        tabActive:
          'bg-[#432c1a] text-orange-400 border-b-2 border-orange-500 font-bold shadow-md',
        tabInactive:
          'text-orange-500/60 hover:bg-[#432c1a] hover:text-orange-200',
        btnPrimary: 'bg-orange-600 hover:bg-orange-500 text-white shadow-md',
        textMain: 'text-orange-50',
        textDesc: 'text-orange-200/60',
        border: 'border-[#432c1a]',
        pill: 'bg-orange-900/40 text-orange-400 border-orange-800',
      },
    },
    demon: {
      id: 'demon',
      name: 'ديمون سلاير',
      icon: <Flame className="w-5 h-5" />,
      light: {
        bg: 'bg-slate-50',
        pattern:
          'bg-[radial-gradient(#a7f3d0_1px,transparent_1px)] [background-size:16px_16px]',
        card: 'bg-white border-emerald-200 shadow-xl',
        header: 'bg-white border-b border-emerald-200',
        headerText: 'text-emerald-900',
        headerIcon: 'text-red-600',
        tabActive:
          'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-600 font-bold shadow-sm',
        tabInactive:
          'text-emerald-700/70 hover:bg-emerald-100 hover:text-emerald-900',
        btnPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md',
        textMain: 'text-slate-800',
        textDesc: 'text-slate-600',
        border: 'border-emerald-200',
        pill: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      },
      dark: {
        bg: 'bg-[#061f14]',
        pattern:
          'bg-[radial-gradient(#104a31_1px,transparent_1px)] [background-size:16px_16px]',
        card: 'bg-[#0a2e1e] border-[#104a31] shadow-2xl',
        header: 'bg-[#0a2e1e] border-b border-[#104a31]',
        headerText: 'text-emerald-400',
        headerIcon: 'text-red-500',
        tabActive:
          'bg-[#104a31] text-emerald-300 border-b-2 border-emerald-400 font-bold shadow-md',
        tabInactive:
          'text-emerald-500/60 hover:bg-[#104a31] hover:text-emerald-200',
        btnPrimary: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md',
        textMain: 'text-emerald-50',
        textDesc: 'text-emerald-200/60',
        border: 'border-[#104a31]',
        pill: 'bg-emerald-900/40 text-emerald-400 border-emerald-800',
      },
    },
    cyber: {
      id: 'cyber',
      name: 'سايبر بنك',
      icon: <Cpu className="w-5 h-5" />,
      light: {
        bg: 'bg-slate-50',
        pattern:
          'bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] [background-size:20px_20px]',
        card: 'bg-white border-cyan-200 shadow-xl',
        header: 'bg-white border-b border-cyan-200',
        headerText: 'text-fuchsia-700',
        headerIcon: 'text-cyan-600',
        tabActive:
          'bg-cyan-50 text-fuchsia-700 border-b-2 border-fuchsia-600 font-bold shadow-sm',
        tabInactive:
          'text-cyan-700/70 hover:bg-cyan-100 hover:text-fuchsia-700',
        btnPrimary: 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-md',
        textMain: 'text-slate-800',
        textDesc: 'text-slate-600',
        border: 'border-cyan-200',
        pill: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
      },
      dark: {
        bg: 'bg-[#0a0f1d]',
        pattern:
          'bg-[linear-gradient(rgba(0,186,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(0,186,255,0.15)_1px,transparent_1px)] [background-size:20px_20px]',
        card: 'bg-[#0d152b] border-[#1e2f60] shadow-[0_0_30px_rgba(0,186,255,0.15)]',
        header: 'bg-[#0d152b] border-b border-[#1e2f60]',
        headerText: 'text-[#ff0055]',
        headerIcon: 'text-[#00baff]',
        tabActive:
          'bg-[#1e2f60]/50 text-[#00baff] border-b-2 border-[#ff0055] font-bold shadow-[0_0_15px_rgba(255,0,85,0.2)]',
        tabInactive:
          'text-[#00baff]/50 hover:bg-[#1e2f60]/30 hover:text-[#00baff]',
        btnPrimary:
          'bg-[#00baff] hover:bg-[#00baff]/80 text-black shadow-[0_0_20px_rgba(0,186,255,0.4)]',
        textMain: 'text-[#00baff]',
        textDesc: 'text-[#00baff]/60',
        border: 'border-[#1e2f60]',
        pill: 'bg-[#ff0055]/10 text-[#ff0055] border-[#ff0055]/30',
      },
    },
    retro: {
      id: 'retro',
      name: 'ريترو',
      icon: <Radio className="w-5 h-5" />,
      light: {
        bg: 'bg-slate-50',
        pattern:
          'bg-[radial-gradient(#e0d8c8_2px,transparent_2px)] [background-size:16px_16px]',
        card: 'bg-white border-[#d9d0c2] shadow-[6px_6px_0px_#d9d0c2]',
        header: 'bg-white border-b-2 border-[#1b1e36]',
        headerText: 'text-[#1b1e36]',
        headerIcon: 'text-[#ef4444]',
        tabActive:
          'bg-[#f0eadd] text-[#1b1e36] border-b-4 border-[#ef4444] font-extrabold',
        tabInactive:
          'text-[#1b1e36]/60 hover:bg-[#f0eadd] hover:text-[#1b1e36]',
        btnPrimary:
          'bg-[#ef4444] hover:bg-[#ef4444]/90 text-white shadow-[4px_4px_0px_#1b1e36]',
        textMain: 'text-[#1b1e36]',
        textDesc: 'text-[#1b1e36]/70',
        border: 'border-[#d9d0c2]',
        pill: 'bg-[#fbbf24]/20 text-[#1b1e36] border-[#fbbf24]/40',
      },
      dark: {
        bg: 'bg-[#2c2520]',
        pattern:
          'bg-[radial-gradient(#4a3f36_2px,transparent_2px)] [background-size:16px_16px]',
        card: 'bg-[#362e28] border-[#5e5045] shadow-[6px_6px_0px_#1a1613]',
        header: 'bg-[#362e28] border-b-2 border-[#1a1613]',
        headerText: 'text-[#eaddcf]',
        headerIcon: 'text-[#ef4444]',
        tabActive:
          'bg-[#4a3f36] text-[#eaddcf] border-b-4 border-[#ef4444] font-extrabold',
        tabInactive:
          'text-[#eaddcf]/50 hover:bg-[#4a3f36] hover:text-[#eaddcf]',
        btnPrimary:
          'bg-[#ef4444] hover:bg-[#ef4444]/90 text-white shadow-[4px_4px_0px_#1a1613]',
        textMain: 'text-[#eaddcf]',
        textDesc: 'text-[#eaddcf]/60',
        border: 'border-[#5e5045]',
        pill: 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/40',
      },
    },
  };

  const [currentThemeKey, setCurrentThemeKey] =
    useState<keyof typeof THEMES>('pro');
  const themeConfig = THEMES[currentThemeKey];
  const theme = isDarkMode ? themeConfig.dark : themeConfig.light;

  const [activeMainTab, setActiveMainTab] = useState('assessment');

  // ☁️ التحديث السحابي: إنشاء الحالات الأساسية
  const [isLoading, setIsLoading] = useState(true);
  const [athletesDB, setAthletesDB] = useState<any[]>([]);

  // جلب البيانات من السحابة عند تحميل التطبيق وبدء الاستماع اللحظي
  useEffect(() => {
    fetchData();

    // الاستماع للتغييرات اللي بيعملها المساعد على الموبايل عشان تظهر عندك فوراً
    const channel = supabase
      .channel('realtime_shared_data')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'shared_data',
          filter: 'id=eq.1',
        },
        (payload) => {
          if (payload.new && payload.new.data) {
            setAthletesDB((prev) => {
              const isDifferent =
                JSON.stringify(prev) !== JSON.stringify(payload.new.data);
              return isDifferent ? payload.new.data : prev;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('shared_data')
      .select('data')
      .eq('id', 1)
      .single();

    if (data && data.data) {
      setAthletesDB(data.data);
    }
    setIsLoading(false);
  };

  // حفظ البيانات في السحابة بمجرد ما يتغير أي شيء في النظام
  useEffect(() => {
    if (!isLoading) {
      saveDataToCloud();
    }
  }, [athletesDB, isLoading]);

  const saveDataToCloud = async () => {
    await supabase.from('shared_data').upsert({ id: 1, data: athletesDB });
  };

  return (
    <div
      dir="rtl"
      className={`min-h-screen p-2 md:p-6 font-sans overflow-x-hidden transition-colors duration-700 ${theme.bg} ${theme.textMain}`}
    >
      <div
        className={`fixed inset-0 pointer-events-none z-0 opacity-50 transition-all duration-700 ${theme.pattern}`}
      ></div>

      <div className="max-w-[1400px] mx-auto space-y-6 relative z-10">
        <div
          className={`rounded-3xl shadow-xl overflow-hidden transition-all duration-700 relative ${theme.card} border-4 ${theme.border}`}
        >
          <div
            className={`p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 relative z-20 ${theme.header}`}
          >
            <div>
              <h1
                className={`text-2xl md:text-3xl font-black flex items-center gap-3 mb-2 tracking-tight ${theme.headerText}`}
              >
                <Target className={`w-8 h-8 ${theme.headerIcon}`} />
                النظام التدريبي للمدربين
              </h1>
              <p
                className={`text-sm md:text-base font-bold ${theme.headerText} opacity-70`}
              >
                واجهة التحكم الاحترافية للمدرب (النسخة 3.0) - متصل بالسحابة ☁️
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center border shadow-inner ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700'
                    : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                }`}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              <div
                className={`flex items-center gap-1.5 p-1.5 rounded-2xl border shadow-sm ${
                  isDarkMode
                    ? 'bg-black/30 border-white/10'
                    : 'bg-slate-100 border-slate-200'
                }`}
              >
                {(Object.keys(THEMES) as Array<keyof typeof THEMES>).map(
                  (key) => {
                    const t = THEMES[key];
                    return (
                      <button
                        key={t.id}
                        onClick={() => setCurrentThemeKey(key)}
                        className={`p-2.5 rounded-xl transition-all duration-300 relative ${
                          currentThemeKey === t.id
                            ? theme.btnPrimary
                            : isDarkMode
                            ? 'text-white/50 hover:bg-white/10 hover:text-white'
                            : 'text-slate-400 hover:bg-white hover:text-slate-800 hover:shadow-sm'
                        }`}
                      >
                        {t.icon}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          <div
            className={`relative z-30 flex flex-col md:flex-row border-b overflow-x-auto scrollbar-hide p-1 transition-colors duration-700 ${theme.bg} ${theme.border}`}
          >
            {[
              {
                id: 'assessment',
                icon: <BarChart2 className="w-5 h-5" />,
                label: 'القياسات',
              },
              {
                id: 'team',
                icon: <Users className="w-5 h-5" />,
                label: 'الداشبورد',
              },
              {
                id: 'analytics',
                icon: <TrendingUp className="w-5 h-5" />,
                label: 'التطور',
              },
              {
                id: 'strategy',
                icon: <Calendar className="w-5 h-5" />,
                label: 'التخطيط',
              },
              {
                id: 'library',
                icon: <Library className="w-5 h-5" />,
                label: 'المكتبة',
              },
              // 🌟 تم وضع القوالب قبل البرامج 🌟
              {
                id: 'templates',
                icon: <LayoutTemplate className="w-5 h-5" />,
                label: 'القوالب',
              },
              {
                id: 'program',
                icon: <ListTodo className="w-5 h-5" />,
                label: 'البرامج',
              },
              {
                id: 'rehab',
                icon: <HeartPulse className="w-5 h-5" />,
                label: 'التأهيل',
              },
              {
                id: 'nutrition',
                icon: <Apple className="w-5 h-5" />,
                label: 'التغذية',
              },
              {
                id: 'settings',
                icon: <Settings className="w-5 h-5" />,
                label: 'الإعدادات',
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveMainTab(tab.id)}
                className={`flex-1 py-4 px-5 text-center font-bold text-sm md:text-base flex justify-center items-center gap-2 whitespace-nowrap rounded-xl transition-all duration-300 cursor-pointer ${
                  activeMainTab === tab.id
                    ? `${theme.tabActive} scale-105 z-10`
                    : `${theme.tabInactive} ${theme.textDesc}`
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative z-10 transition-colors duration-700">
          {isLoading ? (
            <div className="flex justify-center items-center p-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>
          ) : (
            <>
              {activeMainTab === 'assessment' && (
                <AssessmentTab
                  theme={theme}
                  athletesDB={athletesDB}
                  setAthletesDB={setAthletesDB}
                />
              )}
              {activeMainTab === 'team' && (
                <TeamTab theme={theme} athletesDB={athletesDB} />
              )}
              {activeMainTab === 'analytics' && (
                <AnalyticsTab theme={theme} athletesDB={athletesDB} />
              )}
              {activeMainTab === 'strategy' && <StrategyTab theme={theme} />}
              {activeMainTab === 'library' && <LibraryTab theme={theme} />}

              {/* 🌟 عرض شاشة القوالب الجديدة 🌟 */}
              {activeMainTab === 'templates' && <TemplatesTab theme={theme} />}

              {activeMainTab === 'program' && (
                <ProgramBuilderTab theme={theme} athletesDB={athletesDB} />
              )}
              {activeMainTab === 'rehab' && (
                <RehabTab
                  theme={theme}
                  athletesDB={athletesDB}
                  setAthletesDB={setAthletesDB}
                />
              )}
              {activeMainTab === 'nutrition' && (
                <NutritionTab
                  theme={theme}
                  athletesDB={athletesDB}
                  setAthletesDB={setAthletesDB}
                />
              )}
              {activeMainTab === 'settings' && (
                <SettingsTab
                  theme={theme}
                  athletesDB={athletesDB}
                  setAthletesDB={setAthletesDB}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
