import React, { useState, useEffect } from 'react';
import {
  Target,
  BarChart2,
  Calendar,
  Library,
  ListTodo,
  HeartPulse,
  TrendingUp,
  Monitor,
  Zap,
  Flame,
  Sun,
  Moon,
  Settings,
  Apple,
  Menu,
  X
} from 'lucide-react';

import AssessmentTab from './AssessmentTab';
import StrategyTab from './StrategyTab';
import LibraryTab from './LibraryTab';
import ProgramBuilderTab from './ProgramBuilderTab';
import RehabTab from './RehabTab';
import AnalyticsTab from './AnalyticsTab';
import SettingsTab from './SettingsTab';
import NutritionTab from './NutritionTab';

import { supabase } from './supabaseClient'; 

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setIsSidebarOpen(true);
    }
  }, []);

  const THEMES = {
    pro: {
      id: 'pro',
      name: 'الاحترافي',
      icon: <Monitor className="w-4 h-4" />,
      light: {
        bg: 'bg-slate-50',
        pattern: 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]',
        card: 'bg-white border-slate-200 shadow-xl',
        header: 'bg-white border-b border-slate-200',
        headerText: 'text-slate-900',
        headerIcon: 'text-blue-600',
        tabActive: 'bg-blue-50 text-blue-700 border-r-4 border-blue-600 font-bold shadow-sm',
        tabInactive: 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
        btnPrimary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md',
        textMain: 'text-slate-800',
        textDesc: 'text-slate-500',
        border: 'border-slate-200',
        pill: 'bg-blue-100 text-blue-800 border-blue-200',
        sidebarBg: 'bg-white border-l border-slate-200 shadow-2xl',
      },
      dark: {
        bg: 'bg-slate-950',
        pattern: 'bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]',
        card: 'bg-slate-900 border-slate-800 shadow-2xl',
        header: 'bg-slate-900 border-b border-slate-800',
        headerText: 'text-white',
        headerIcon: 'text-blue-400',
        tabActive: 'bg-slate-800 text-blue-400 border-r-4 border-blue-500 font-bold shadow-md',
        tabInactive: 'text-slate-400 hover:bg-slate-800 hover:text-white',
        btnPrimary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-md',
        textMain: 'text-slate-200',
        textDesc: 'text-slate-400',
        border: 'border-slate-800',
        pill: 'bg-blue-900/50 text-blue-300 border-blue-800',
        sidebarBg: 'bg-slate-900 border-l border-slate-800 shadow-2xl',
      },
    },
    haikyuu: {
      id: 'haikyuu',
      name: 'هايكيو',
      icon: <Zap className="w-4 h-4" />,
      light: {
        bg: 'bg-slate-50',
        pattern: 'bg-[radial-gradient(#fed7aa_1px,transparent_1px)] [background-size:20px_20px]',
        card: 'bg-white border-orange-200 shadow-xl',
        header: 'bg-white border-b border-orange-200',
        headerText: 'text-orange-900',
        headerIcon: 'text-orange-600',
        tabActive: 'bg-orange-50 text-orange-700 border-r-4 border-orange-600 font-bold shadow-sm',
        tabInactive: 'text-orange-700/70 hover:bg-orange-100 hover:text-orange-900',
        btnPrimary: 'bg-orange-600 hover:bg-orange-700 text-white shadow-md',
        textMain: 'text-stone-900',
        textDesc: 'text-stone-600',
        border: 'border-orange-200',
        pill: 'bg-orange-100 text-orange-800 border-orange-200',
        sidebarBg: 'bg-white border-l border-orange-200 shadow-2xl',
      },
      dark: {
        bg: 'bg-[#1a110a]',
        pattern: 'bg-[radial-gradient(#432c1a_1px,transparent_1px)] [background-size:20px_20px]',
        card: 'bg-[#2a1c12] border-[#432c1a] shadow-2xl',
        header: 'bg-[#2a1c12] border-b border-[#432c1a]',
        headerText: 'text-orange-400',
        headerIcon: 'text-orange-500',
        tabActive: 'bg-[#432c1a] text-orange-400 border-r-4 border-orange-500 font-bold shadow-md',
        tabInactive: 'text-orange-500/60 hover:bg-[#432c1a] hover:text-orange-200',
        btnPrimary: 'bg-orange-600 hover:bg-orange-500 text-white shadow-md',
        textMain: 'text-orange-50',
        textDesc: 'text-orange-200/60',
        border: 'border-[#432c1a]',
        pill: 'bg-orange-900/40 text-orange-400 border-orange-800',
        sidebarBg: 'bg-[#2a1c12] border-l border-[#432c1a] shadow-2xl',
      },
    },
    demon: {
      id: 'demon',
      name: 'ديمون سلاير',
      icon: <Flame className="w-4 h-4" />,
      light: {
        bg: 'bg-slate-50',
        pattern: 'bg-[radial-gradient(#a7f3d0_1px,transparent_1px)] [background-size:16px_16px]',
        card: 'bg-white border-emerald-200 shadow-xl',
        header: 'bg-white border-b border-emerald-200',
        headerText: 'text-emerald-900',
        headerIcon: 'text-red-600',
        tabActive: 'bg-emerald-50 text-emerald-800 border-r-4 border-emerald-600 font-bold shadow-sm',
        tabInactive: 'text-emerald-700/70 hover:bg-emerald-100 hover:text-emerald-900',
        btnPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md',
        textMain: 'text-slate-800',
        textDesc: 'text-slate-600',
        border: 'border-emerald-200',
        pill: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        sidebarBg: 'bg-white border-l border-emerald-200 shadow-2xl',
      },
      dark: {
        bg: 'bg-[#061f14]',
        pattern: 'bg-[radial-gradient(#104a31_1px,transparent_1px)] [background-size:16px_16px]',
        card: 'bg-[#0a2e1e] border-[#104a31] shadow-2xl',
        header: 'bg-[#0a2e1e] border-b border-[#104a31]',
        headerText: 'text-emerald-400',
        headerIcon: 'text-red-500',
        tabActive: 'bg-[#104a31] text-emerald-300 border-r-4 border-emerald-400 font-bold shadow-md',
        tabInactive: 'text-emerald-500/60 hover:bg-[#104a31] hover:text-emerald-200',
        btnPrimary: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md',
        textMain: 'text-emerald-50',
        textDesc: 'text-emerald-200/60',
        border: 'border-[#104a31]',
        pill: 'bg-emerald-900/40 text-emerald-400 border-emerald-800',
        sidebarBg: 'bg-[#0a2e1e] border-l border-[#104a31] shadow-2xl',
      },
    }
  };

  const [currentThemeKey, setCurrentThemeKey] = useState<keyof typeof THEMES>('pro');
  const themeConfig = THEMES[currentThemeKey];
  const theme = isDarkMode ? themeConfig.dark : themeConfig.light;

  const [activeMainTab, setActiveMainTab] = useState('program');

  const [isLoading, setIsLoading] = useState(true);
  const [athletesDB, setAthletesDB] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
    const channel = supabase
      .channel('realtime_shared_data')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'shared_data', filter: 'id=eq.1' },
        (payload) => {
          if (payload.new && payload.new.data) {
            setAthletesDB((prev) => {
              const isDifferent = JSON.stringify(prev) !== JSON.stringify(payload.new.data);
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

  useEffect(() => {
    if (!isLoading) {
      saveDataToCloud();
    }
  }, [athletesDB, isLoading]);

  const saveDataToCloud = async () => {
    await supabase
      .from('shared_data')
      .upsert({ id: 1, data: athletesDB });
  };

  // ⚠️ ركز هنا: شيلت القوالب والداشبورد، والمكتبة اسمها "المكتبة الشاملة"
  const NAV_ITEMS = [
    { id: 'program', icon: <ListTodo className="w-5 h-5" />, label: 'البرامج التدريبية' },
    { id: 'library', icon: <Library className="w-5 h-5" />, label: 'المكتبة الشاملة' },
    { id: 'assessment', icon: <BarChart2 className="w-5 h-5" />, label: 'القياسات والـ FMS' },
    { id: 'analytics', icon: <TrendingUp className="w-5 h-5" />, label: 'تطور الأداء' },
    { id: 'strategy', icon: <Calendar className="w-5 h-5" />, label: 'تخطيط الموسم' },
    { id: 'rehab', icon: <HeartPulse className="w-5 h-5" />, label: 'التأهيل والإصابات' },
    { id: 'nutrition', icon: <Apple className="w-5 h-5" />, label: 'حاسبة الماكروز' },
  ];

  return (
    <div dir="rtl" className={`min-h-screen flex font-sans overflow-hidden transition-colors duration-700 ${theme.bg} ${theme.textMain}`}>
      <div className={`fixed inset-0 pointer-events-none z-0 opacity-50 transition-all duration-700 ${theme.pattern}`}></div>

      {/* خلفية معتمة للموبايل لما القائمة تفتح */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 🌟 القائمة الجانبية (Sidebar) 🌟 */}
      <aside 
        className={`
          fixed top-0 bottom-0 right-0 z-50 h-screen flex flex-col transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
          ${isSidebarOpen ? 'translate-x-0 w-64' : 'translate-x-full md:translate-x-0 md:w-20'}
          md:relative md:z-30
          ${theme.sidebarBg}
        `}
      >
        <div className={`h-20 shrink-0 flex items-center justify-between px-4 border-b ${theme.border}`}>
          {isSidebarOpen && (
            <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap animate-in fade-in">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme.btnPrimary}`}>
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className={`font-black text-lg ${theme.headerText} leading-tight`}>S&C PRO</span>
                <span className={`text-[10px] font-bold ${theme.headerIcon}`}>Egoist Management</span>
              </div>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className={`p-2 rounded-xl transition-colors ${isSidebarOpen ? 'bg-slate-100 dark:bg-slate-800' : 'mx-auto w-full flex justify-center hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            {isSidebarOpen ? <X className={`w-5 h-5 ${theme.textDesc}`} /> : <Menu className={`w-6 h-6 ${theme.headerIcon}`} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2 force-scrollbar">
          {NAV_ITEMS.map((item) => {
            const isActive = activeMainTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMainTab(item.id);
                  if (window.innerWidth < 768) setIsSidebarOpen(false); 
                }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${isActive ? theme.tabActive : theme.tabInactive} ${!isSidebarOpen && 'justify-center px-0'}`}
                title={!isSidebarOpen ? item.label : ''}
              >
                <div className={`${isActive ? 'scale-110' : ''} transition-transform`}>{item.icon}</div>
                {isSidebarOpen && <span className="font-bold text-sm whitespace-nowrap animate-in fade-in">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className={`p-4 border-t shrink-0 ${theme.border} space-y-4`}>
          <button
            onClick={() => {
              setActiveMainTab('settings');
              if (window.innerWidth < 768) setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${activeMainTab === 'settings' ? theme.tabActive : theme.tabInactive} ${!isSidebarOpen && 'justify-center px-0'}`}
            title={!isSidebarOpen ? 'الإعدادات' : ''}
          >
            <Settings className="w-5 h-5" />
            {isSidebarOpen && <span className="font-bold text-sm whitespace-nowrap animate-in fade-in">إعدادات النظام</span>}
          </button>

          {isSidebarOpen && (
            <div className={`flex flex-col gap-3 p-3 rounded-xl border ${theme.border} bg-slate-50 dark:bg-slate-900/50`}>
              <div className="flex items-center justify-between">
                 <span className={`text-xs font-bold ${theme.textDesc}`}>المظهر والألوان</span>
                 <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-1.5 rounded-lg transition-all shadow-sm ${isDarkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-white text-slate-800 hover:bg-slate-100'}`}>
                   {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                 </button>
              </div>
              <div className="flex gap-1.5">
                {(Object.keys(THEMES) as Array<keyof typeof THEMES>).map(key => (
                   <button 
                     key={key} 
                     onClick={() => setCurrentThemeKey(key)} 
                     title={THEMES[key].name}
                     className={`flex-1 flex justify-center items-center py-1.5 rounded-lg transition-all ${currentThemeKey === key ? theme.btnPrimary : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'}`}
                   >
                     {THEMES[key].icon}
                   </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* 🌟 الشاشة الرئيسية والمحتوى 🌟 */}
      <main className="flex-1 h-screen overflow-y-auto relative z-10 flex flex-col">
        <header className={`h-20 shrink-0 sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 border-b backdrop-blur-md ${theme.header} bg-opacity-80`}>
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setIsSidebarOpen(true)} 
                className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 transition-colors"
              >
                <Menu className={`w-6 h-6 ${theme.headerIcon}`} />
              </button>
             <h1 className={`text-xl sm:text-2xl font-black ${theme.headerText} capitalize`}>
               {NAV_ITEMS.find(i => i.id === activeMainTab)?.label || (activeMainTab === 'settings' ? 'إعدادات النظام' : '')}
             </h1>
          </div>
          <div className="flex items-center gap-2">
             <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 shadow-inner hidden sm:flex">
                <span className={`text-[10px] font-bold px-2 ${theme.textDesc}`}>النسخة 3.0</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="متصل بالسحابة"></span>
             </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-[1400px] w-full mx-auto pb-24">
          {isLoading ? (
            <div className="flex justify-center items-center h-[60vh]">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>
          ) : (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              {activeMainTab === 'assessment' && <AssessmentTab theme={theme} athletesDB={athletesDB} setAthletesDB={setAthletesDB} />}
              {activeMainTab === 'analytics' && <AnalyticsTab theme={theme} athletesDB={athletesDB} />}
              {activeMainTab === 'strategy' && <StrategyTab theme={theme} />}
              {activeMainTab === 'library' && <LibraryTab theme={theme} />}
              {activeMainTab === 'program' && <ProgramBuilderTab theme={theme} athletesDB={athletesDB} />}
              {activeMainTab === 'rehab' && <RehabTab theme={theme} athletesDB={athletesDB} setAthletesDB={setAthletesDB} />}
              {activeMainTab === 'nutrition' && <NutritionTab theme={theme} athletesDB={athletesDB} setAthletesDB={setAthletesDB} />}
              {activeMainTab === 'settings' && <SettingsTab theme={theme} athletesDB={athletesDB} setAthletesDB={setAthletesDB} />}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}