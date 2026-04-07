import React, { useState } from 'react';
import {
  Users,
  Crown,
  Zap,
  Move,
  Gauge,
  Dumbbell,
  Activity,
  TrendingUp,
  Filter,
} from 'lucide-react';

export default function TeamTab({ theme, athletesDB }) {
  // حالات الفلترة (Filters State)
  const [filterGender, setFilterGender] = useState('all');
  const [filterSport, setFilterSport] = useState('all');
  const [filterAge, setFilterAge] = useState('all');

  // الدالة الذكية لفلترة الأرشيف بناءً على اختياراتك
  const filteredDB = athletesDB.filter((athlete) => {
    const matchGender =
      filterGender === 'all' || athlete.playerData.gender === filterGender;
    const matchSport =
      filterSport === 'all' || athlete.playerData.sport === filterSport;

    let matchAge = true;
    const age = parseInt(athlete.playerData.age) || 0;
    if (filterAge === 'u18') matchAge = age < 18;
    if (filterAge === 'adults') matchAge = age >= 18;

    return matchGender && matchSport && matchAge;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-right">
      <div
        className={`rounded-2xl shadow-sm border p-6 md:p-8 ${theme.card} ${theme.border}`}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 border-b border-slate-200/50 pb-6 gap-4">
          <div className="flex items-center gap-3">
            <Users className={`w-8 h-8 ${theme.headerIcon}`} />
            <div>
              <h2 className="text-2xl font-bold text-inherit">
                Dashboard تحليلات الفريق
              </h2>
              <p className="text-sm opacity-70 mt-1">
                لوحة القيادة المجمعة، تقارن بين اللاعبين وتستخرج الأبطال.
              </p>
            </div>
          </div>
          <div
            className={`${theme.pill} px-4 py-2 rounded-lg text-sm font-bold border`}
          >
            إجمالي المطابق للفلتر: {filteredDB.length} لاعبين
          </div>
        </div>

        {/* شريط الفلاتر الذكي (Smart Filters) 🎯 */}
        <div className="bg-black/5 p-4 rounded-xl border border-black/10 flex flex-col md:flex-row gap-4 mb-8 items-center">
          <div className="flex items-center gap-2 font-bold opacity-80 shrink-0">
            <Filter className="w-5 h-5" /> فلترة المقارنة:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            {/* فلتر الرياضة */}
            <select
              value={filterSport}
              onChange={(e) => setFilterSport(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-black/20 bg-transparent outline-none font-bold text-sm focus:ring-2 focus:ring-blue-500 transition-shadow"
            >
              <option value="all" className="text-slate-800">
                كل الرياضات
              </option>
              <option value="squash" className="text-slate-800">
                اسكواش فقط
              </option>
              <option value="volleyball" className="text-slate-800">
                كرة طائرة فقط
              </option>
              <option value="general" className="text-slate-800">
                إعداد عام فقط
              </option>
            </select>

            {/* فلتر الجنس */}
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-black/20 bg-transparent outline-none font-bold text-sm focus:ring-2 focus:ring-blue-500 transition-shadow"
            >
              <option value="all" className="text-slate-800">
                الجميع (ذكور وإناث)
              </option>
              <option value="male" className="text-slate-800">
                ذكور فقط (Male)
              </option>
              <option value="female" className="text-slate-800">
                إناث فقط (Female)
              </option>
            </select>

            {/* فلتر الفئة العمرية */}
            <select
              value={filterAge}
              onChange={(e) => setFilterAge(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-black/20 bg-transparent outline-none font-bold text-sm focus:ring-2 focus:ring-blue-500 transition-shadow"
            >
              <option value="all" className="text-slate-800">
                كل الأعمار
              </option>
              <option value="u18" className="text-slate-800">
                ناشئين (تحت 18 سنة)
              </option>
              <option value="adults" className="text-slate-800">
                فريق أول (18 سنة فأكثر)
              </option>
            </select>
          </div>
        </div>

        {/* عرض النتائج بناءً على الفلتر الجديد (filteredDB) */}
        {filteredDB.length < 2 ? (
          <div className="text-center py-16 opacity-50">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">
              لا توجد بيانات كافية للمقارنة
            </h3>
            <p className="text-sm">
              يرجى تقييم لاعبين (2) على الأقل في هذه الفئة لتفعيل المقارنة
              وإظهار الأبطال.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Top V-Jump */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden transition-transform hover:scale-[1.02]">
              <Zap className="absolute top-4 left-4 w-20 h-20 opacity-10" />
              <h3 className="text-blue-100 text-sm font-bold mb-1">
                أعلى قوة انفجارية عمودية
              </h3>
              <h4 className="text-xl font-black mb-4">
                الوثب العمودي (V-Jump)
              </h4>
              {(() => {
                const valid = filteredDB.filter(
                  (a) => parseFloat(a.testScores.verticalJump) > 0
                );
                if (valid.length === 0)
                  return (
                    <span className="text-sm opacity-50">لا توجد بيانات</span>
                  );
                const top = valid.reduce((max, obj) =>
                  parseFloat(obj.testScores.verticalJump) >
                  parseFloat(max.testScores.verticalJump)
                    ? obj
                    : max
                );
                return (
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-black">
                      {top.testScores.verticalJump}
                    </span>
                    <span className="text-sm font-bold opacity-80 mb-1">
                      cm
                    </span>
                    <div className="flex-1 text-left">
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
                        <Crown className="w-4 h-4 inline ml-1" />{' '}
                        {top.playerData.name}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Best Broad Jump */}
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden transition-transform hover:scale-[1.02]">
              <Move className="absolute top-4 left-4 w-20 h-20 opacity-10" />
              <h3 className="text-indigo-100 text-sm font-bold mb-1">
                أعلى قوة دفع أفقية
              </h3>
              <h4 className="text-xl font-black mb-4">
                الوثب العريض (Broad Jump)
              </h4>
              {(() => {
                const valid = filteredDB.filter(
                  (a) => parseFloat(a.testScores.broadJump) > 0
                );
                if (valid.length === 0)
                  return (
                    <span className="text-sm opacity-50">لا توجد بيانات</span>
                  );
                const top = valid.reduce((max, obj) =>
                  parseFloat(obj.testScores.broadJump) >
                  parseFloat(max.testScores.broadJump)
                    ? obj
                    : max
                );
                return (
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-black">
                      {top.testScores.broadJump}
                    </span>
                    <span className="text-sm font-bold opacity-80 mb-1">
                      Meters
                    </span>
                    <div className="flex-1 text-left">
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
                        <Crown className="w-4 h-4 inline ml-1" />{' '}
                        {top.playerData.name}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Fastest 10m Sprint */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden transition-transform hover:scale-[1.02]">
              <Gauge className="absolute top-4 left-4 w-20 h-20 opacity-10" />
              <h3 className="text-emerald-100 text-sm font-bold mb-1">
                أسرع انطلاق وتسارع
              </h3>
              <h4 className="text-xl font-black mb-4">
                تسارع 10 متر (10m Sprint)
              </h4>
              {(() => {
                const valid = filteredDB.filter(
                  (a) => parseFloat(a.testScores.sprint10m) > 0
                );
                if (valid.length === 0)
                  return (
                    <span className="text-sm opacity-50">لا توجد بيانات</span>
                  );
                const top = valid.reduce((min, obj) =>
                  parseFloat(obj.testScores.sprint10m) <
                  parseFloat(min.testScores.sprint10m)
                    ? obj
                    : min
                );
                return (
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-black">
                      {top.testScores.sprint10m}
                    </span>
                    <span className="text-sm font-bold opacity-80 mb-1">
                      sec
                    </span>
                    <div className="flex-1 text-left">
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
                        <Crown className="w-4 h-4 inline ml-1" />{' '}
                        {top.playerData.name}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Best Pro Agility */}
            <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden transition-transform hover:scale-[1.02]">
              <Move className="absolute top-4 left-4 w-20 h-20 opacity-10" />
              <h3 className="text-amber-100 text-sm font-bold mb-1">
                أفضل رشاقة وتغيير اتجاه
              </h3>
              <h4 className="text-xl font-black mb-4">
                الرشاقة (5-10-5 Agility)
              </h4>
              {(() => {
                const valid = filteredDB.filter(
                  (a) => parseFloat(a.testScores.proAgility) > 0
                );
                if (valid.length === 0)
                  return (
                    <span className="text-sm opacity-50">لا توجد بيانات</span>
                  );
                const top = valid.reduce((min, obj) =>
                  parseFloat(obj.testScores.proAgility) <
                  parseFloat(min.testScores.proAgility)
                    ? obj
                    : min
                );
                return (
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-black">
                      {top.testScores.proAgility}
                    </span>
                    <span className="text-sm font-bold opacity-80 mb-1">
                      sec
                    </span>
                    <div className="flex-1 text-left">
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
                        <Crown className="w-4 h-4 inline ml-1" />{' '}
                        {top.playerData.name}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Strongest Relative Squat */}
            <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden transition-transform hover:scale-[1.02]">
              <Dumbbell className="absolute top-4 left-4 w-20 h-20 opacity-10" />
              <h3 className="text-red-100 text-sm font-bold mb-1">
                أقوى أرجل (قوة نسبية للوزن)
              </h3>
              <h4 className="text-xl font-black mb-4">السكوات (Squat Ratio)</h4>
              {(() => {
                const valid = filteredDB.filter(
                  (a) =>
                    parseFloat(a.testScores.squat1RM) > 0 &&
                    parseFloat(a.playerData.bodyweight) > 0
                );
                if (valid.length === 0)
                  return (
                    <span className="text-sm opacity-50">لا توجد بيانات</span>
                  );
                const top = valid.reduce((max, obj) => {
                  const r1 =
                    parseFloat(obj.testScores.squat1RM) /
                    parseFloat(obj.playerData.bodyweight);
                  const r2 =
                    parseFloat(max.testScores.squat1RM) /
                    parseFloat(max.playerData.bodyweight);
                  return r1 > r2 ? obj : max;
                });
                const topRatio = (
                  parseFloat(top.testScores.squat1RM) /
                  parseFloat(top.playerData.bodyweight)
                ).toFixed(2);
                return (
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-black">{topRatio}</span>
                    <span className="text-sm font-bold opacity-80 mb-1">
                      x BW
                    </span>
                    <div className="flex-1 text-left">
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
                        <Crown className="w-4 h-4 inline ml-1" />{' '}
                        {top.playerData.name}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Strongest FMS */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden transition-transform hover:scale-[1.02]">
              <Activity className="absolute top-4 left-4 w-20 h-20 opacity-10" />
              <h3 className="text-purple-200 text-sm font-bold mb-1">
                أفضل حركة وظيفية ومرونة
              </h3>
              <h4 className="text-xl font-black mb-4">تقييم الـ (FMS Score)</h4>
              {(() => {
                const valid = filteredDB.filter(
                  (a) => a.testScores.fmsTotal > 0
                );
                if (valid.length === 0)
                  return (
                    <span className="text-sm opacity-50">لا توجد بيانات</span>
                  );
                const top = valid.reduce((max, obj) =>
                  obj.testScores.fmsTotal > max.testScores.fmsTotal ? obj : max
                );
                return (
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-black">
                      {top.testScores.fmsTotal}
                    </span>
                    <span className="text-sm font-bold opacity-80 mb-1">
                      / 21
                    </span>
                    <div className="flex-1 text-left">
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
                        <Crown className="w-4 h-4 inline ml-1" />{' '}
                        {top.playerData.name}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
