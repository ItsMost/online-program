import React, { useState } from 'react';
import {
  TrendingUp,
  User,
  Printer,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Target,
  Activity,
  Dumbbell,
  Zap,
  FileText,
  LineChart,
} from 'lucide-react';

export default function AnalyticsTab({ theme, athletesDB }: any) {
  const [selectedAthleteId, setSelectedAthleteId] = useState('');

  const currentAthlete = athletesDB.find(
    (a: any) => String(a.id || a._id) === String(selectedAthleteId)
  );

  // دالة لاستخراج القياس المبدئي (أول تسجيل للاعب)
  const getBaseline = (athlete: any) => {
    if (athlete.history && athlete.history.length > 0) {
      return athlete.history[0];
    }
    return {
      date: athlete.date,
      bodyweight: athlete.playerData.bodyweight,
      testScores: athlete.testScores,
      fmsTotal: athlete.testScores.fmsTotal || 0,
    };
  };

  const baseline = currentAthlete ? getBaseline(currentAthlete) : null;
  const current = currentAthlete
    ? {
        date: currentAthlete.date,
        bodyweight: currentAthlete.playerData.bodyweight,
        testScores: currentAthlete.testScores,
        fmsTotal: currentAthlete.testScores.fmsTotal || 0,
      }
    : null;

  // 🌟 استخراج كل نقط التاريخ لرسم المنحنى 🌟
  const historyPoints = currentAthlete
    ? [
        ...(currentAthlete.history || []),
        { date: currentAthlete.date, testScores: currentAthlete.testScores },
      ]
    : [];

  // دالة ذكية لحساب التطور وإرجاع أيقونة ولون
  const renderProgress = (
    baseVal: any,
    currVal: any,
    inverse: boolean = false
  ) => {
    const base = parseFloat(baseVal) || 0;
    const curr = parseFloat(currVal) || 0;
    const diff = curr - base;

    if (diff === 0) {
      return (
        <span className="flex items-center gap-1 text-slate-400 font-bold text-xs">
          <Minus className="w-3 h-3" /> بدون تغيير
        </span>
      );
    }

    const isImprovement = inverse ? diff < 0 : diff > 0;

    if (isImprovement) {
      return (
        <span className="flex items-center gap-1 text-emerald-600 font-black text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
          <ArrowUpRight className={`w-3 h-3 ${inverse ? 'rotate-90' : ''}`} />{' '}
          {Math.abs(diff).toFixed(diff % 1 !== 0 ? 1 : 0)}{' '}
          {inverse ? 'أسرع' : 'زيادة'}
        </span>
      );
    } else {
      return (
        <span className="flex items-center gap-1 text-red-600 font-black text-xs bg-red-50 px-2 py-0.5 rounded border border-red-100">
          <ArrowDownRight
            className={`w-3 h-3 ${inverse ? '-rotate-90' : ''}`}
          />{' '}
          {Math.abs(diff).toFixed(diff % 1 !== 0 ? 1 : 0)}{' '}
          {inverse ? 'أبطأ' : 'نقص'}
        </span>
      );
    }
  };

  // 📈 محرك الرسم البياني المخصص (SVG Line Chart)
  const renderProgressChart = () => {
    if (historyPoints.length < 2) {
      return (
        <div className="text-center p-8 text-slate-400 font-bold bg-slate-50 rounded-xl border border-slate-200">
          <LineChart className="w-12 h-12 mx-auto mb-3 opacity-30" />
          تحتاج إلى تسجيل تحديث أرقام (قياسين على الأقل في تواريخ مختلفة) لرسم
          منحنى التطور!
        </div>
      );
    }

    const squat = historyPoints.map(
      (h) => parseFloat(h.testScores?.squat1RM) || 0
    );
    const bench = historyPoints.map(
      (h) => parseFloat(h.testScores?.bench1RM) || 0
    );
    const clean = historyPoints.map(
      (h) => parseFloat(h.testScores?.clean1RM) || 0
    );
    const labels = historyPoints.map((h) => h.date);

    const allValues = [...squat, ...bench, ...clean].filter((v) => v > 0);
    const maxVal = allValues.length ? Math.max(...allValues) + 20 : 100;
    const minVal = allValues.length
      ? Math.max(0, Math.min(...allValues) - 20)
      : 0;

    const w = 800;
    const h = 280;
    const pX = 60; // Padding X
    const pY = 40; // Padding Y

    const getX = (i: number) => pX + (i * (w - 2 * pX)) / (labels.length - 1);
    const getY = (val: number) =>
      h - pY - ((val - minVal) / (maxVal - minVal)) * (h - 2 * pY);

    return (
      <div className="overflow-x-auto w-full bg-white p-4 rounded-xl border border-slate-200 shadow-inner">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full min-w-[600px]">
          {/* خطوط الشبكة الخلفية */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = pY + ratio * (h - 2 * pY);
            const val = maxVal - ratio * (maxVal - minVal);
            return (
              <g key={ratio}>
                <line
                  x1={pX}
                  y1={y}
                  x2={w - pX}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                />
                <text
                  x={pX - 10}
                  y={y + 4}
                  fontSize="10"
                  fill="#94a3b8"
                  textAnchor="end"
                  fontWeight="bold"
                >
                  {Math.round(val)}
                </text>
              </g>
            );
          })}

          {/* مسارات الخطوط (المنحنيات) */}
          <path
            d={squat
              .map((v, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(v)}`)
              .join(' ')}
            fill="none"
            stroke="#2563eb"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-sm"
          />
          <path
            d={bench
              .map((v, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(v)}`)
              .join(' ')}
            fill="none"
            stroke="#f97316"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-sm"
          />
          <path
            d={clean
              .map((v, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(v)}`)
              .join(' ')}
            fill="none"
            stroke="#9333ea"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-sm"
          />

          {/* النقاط والتواريخ والأرقام المكتوبة */}
          {labels.map((date, i) => (
            <g key={i}>
              {/* التاريخ في الأسفل */}
              <text
                x={getX(i)}
                y={h - 10}
                fontSize="11"
                fill="#64748b"
                textAnchor="middle"
                fontWeight="bold"
              >
                {date}
              </text>

              {/* نقطة وأرقام السكوات */}
              <circle
                cx={getX(i)}
                cy={getY(squat[i])}
                r="5"
                fill="#2563eb"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <text
                x={getX(i)}
                y={getY(squat[i]) - 12}
                fontSize="11"
                fill="#1e3a8a"
                textAnchor="middle"
                fontWeight="black"
              >
                {squat[i] > 0 ? squat[i] : ''}
              </text>

              {/* نقطة وأرقام البنش */}
              <circle
                cx={getX(i)}
                cy={getY(bench[i])}
                r="5"
                fill="#f97316"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <text
                x={getX(i)}
                y={getY(bench[i]) - 12}
                fontSize="11"
                fill="#9a3412"
                textAnchor="middle"
                fontWeight="black"
              >
                {bench[i] > 0 ? bench[i] : ''}
              </text>

              {/* نقطة وأرقام الكلين */}
              <circle
                cx={getX(i)}
                cy={getY(clean[i])}
                r="5"
                fill="#9333ea"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <text
                x={getX(i)}
                y={getY(clean[i]) - 12}
                fontSize="11"
                fill="#581c87"
                textAnchor="middle"
                fontWeight="black"
              >
                {clean[i] > 0 ? clean[i] : ''}
              </text>
            </g>
          ))}
        </svg>

        {/* مفتاح الرسم البياني */}
        <div className="flex justify-center gap-6 mt-6 text-sm font-bold bg-slate-50 py-2 rounded-lg border border-slate-100">
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-blue-600 shadow-inner"></span>{' '}
            Squat 1RM
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-orange-500 shadow-inner"></span>{' '}
            Bench 1RM
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-purple-600 shadow-inner"></span>{' '}
            Clean 1RM
          </span>
        </div>
      </div>
    );
  };

  const handlePrintReport = () => {
    if (!currentAthlete) {
      alert('يرجى اختيار لاعب أولاً لتوليد التقرير.');
      return;
    }
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-right">
      {/* 🖨️ CSS مخصص لطباعة تقرير الموسم بشكل احترافي جداً */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #season-report-area, #season-report-area * { visibility: visible; }
          #season-report-area {
            position: absolute; left: 0; top: 0; width: 100%;
            padding: 30px !important; margin: 0 !important;
            background-color: #ffffff !important; min-height: 100vh;
            color: #0f172a !important;
          }
          .no-print { display: none !important; }
          .page-break-inside-avoid { page-break-inside: avoid; break-inside: avoid; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      {/* 👑 الهيدر واختيار اللاعب */}
      <div
        className={`p-4 md:p-6 rounded-2xl border ${theme.card} ${theme.border} shadow-sm no-print`}
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-blue-500" />
              تتبع التطور وتقرير الموسم
            </h2>
            <p className={`text-sm mt-1 ${theme.textDesc}`}>
              يقارن بين أول قياس للاعب وأحدث قياس ويرسم منحنى التطور بدقة.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div
              className={`flex items-center gap-2 p-2 rounded-xl border focus-within:ring-2 focus-within:ring-blue-500 ${theme.bg} ${theme.border}`}
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

            {selectedAthleteId && (
              <button
                onClick={handlePrintReport}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg transition-all w-full sm:w-auto"
              >
                <Printer className="w-5 h-5" /> تصدير تقرير الموسم (PDF)
              </button>
            )}
          </div>
        </div>
      </div>

      {!selectedAthleteId ? (
        <div
          className={`p-12 rounded-2xl border flex flex-col items-center justify-center opacity-50 ${theme.card} ${theme.border}`}
        >
          <FileText className="w-20 h-20 mb-4 text-slate-400" />
          <p className="text-xl font-bold text-slate-500">
            يرجى اختيار لاعب لعرض منحنى تطوره وإصدار التقرير
          </p>
        </div>
      ) : (
        <div
          id="season-report-area"
          className="bg-white rounded-2xl border border-slate-200 p-6 md:p-10 shadow-xl relative text-slate-800"
        >
          {/* 🌟 هيدر التقرير المطبوع 🌟 */}
          <div className="text-center border-b-4 border-slate-800 pb-8 mb-8">
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-wider mb-2">
              END OF SEASON REPORT
            </h1>
            <h2 className="text-2xl font-bold text-slate-600 mb-6">
              التقرير الشامل لتطور الأداء الرياضي
            </h2>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="bg-slate-100 px-4 py-2 rounded-lg font-bold border border-slate-200">
                <span className="text-slate-500 block text-xs">اللاعب</span>
                <span className="text-lg text-blue-700">
                  {currentAthlete?.playerData?.name}
                </span>
              </div>
              <div className="bg-slate-100 px-4 py-2 rounded-lg font-bold border border-slate-200">
                <span className="text-slate-500 block text-xs">الرياضة</span>
                <span className="text-lg text-slate-800">
                  {currentAthlete?.playerData?.sport}
                </span>
              </div>
              <div className="bg-slate-100 px-4 py-2 rounded-lg font-bold border border-slate-200">
                <span className="text-slate-500 block text-xs">
                  الفترة الزمنية
                </span>
                <span className="text-base text-slate-800">
                  {baseline?.date} ➔ {current?.date}
                </span>
              </div>
            </div>
          </div>

          {/* 🌟 ملخص التغير الجسماني والوظيفي 🌟 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 page-break-inside-avoid">
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm">
              <h3 className="font-black text-lg mb-4 flex items-center gap-2 text-slate-800 border-b pb-2">
                <Target className="w-5 h-5 text-blue-600" /> التغير الجسماني
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-600">
                    الوزن (Bodyweight)
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-slate-400 line-through">
                      {baseline?.bodyweight} kg
                    </span>
                    <span className="text-lg font-black text-slate-800">
                      {current?.bodyweight} kg
                    </span>
                    {renderProgress(baseline?.bodyweight, current?.bodyweight)}
                  </div>
                </div>
                {/* نسبة الدهون */}
                {currentAthlete?.playerData?.bodyFat && (
                  <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-600">
                      نسبة الدهون (Body Fat)
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-black text-slate-800">
                        {currentAthlete.playerData.bodyFat} %
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm">
              <h3 className="font-black text-lg mb-4 flex items-center gap-2 text-slate-800 border-b pb-2">
                <Activity className="w-5 h-5 text-purple-600" /> كفاءة الحركة
                (FMS)
              </h3>
              <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-100">
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-500 mb-1">
                    القياس المبدئي
                  </p>
                  <p className="text-2xl font-black text-slate-400">
                    {baseline?.fmsTotal} <span className="text-sm">/ 21</span>
                  </p>
                </div>
                <div className="flex-1 flex justify-center">
                  {renderProgress(baseline?.fmsTotal, current?.fmsTotal)}
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-blue-600 mb-1">
                    القياس النهائي
                  </p>
                  <p className="text-3xl font-black text-purple-700">
                    {current?.fmsTotal} <span className="text-sm">/ 21</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 🌟 التطور في القوة القصوى (Max Lifts) 🌟 */}
          <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100 mb-8 page-break-inside-avoid">
            <h3 className="font-black text-xl mb-6 flex items-center gap-2 text-blue-900 border-b border-blue-200 pb-2">
              <Dumbbell className="w-6 h-6 text-blue-600" /> التطور في القوة
              القصوى (1RM Progression)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Squat */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
                <h4 className="font-bold text-center text-slate-700 mb-4 bg-slate-100 py-1 rounded">
                  Squat (سكوات)
                </h4>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-500">
                    المبدئي:{' '}
                    <span className="text-slate-800 text-sm">
                      {baseline?.testScores?.squat1RM || 0} kg
                    </span>
                  </span>
                  <span className="text-xs font-bold text-blue-600">
                    النهائي:{' '}
                    <span className="text-blue-800 text-lg">
                      {current?.testScores?.squat1RM || 0} kg
                    </span>
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex justify-center">
                  {renderProgress(
                    baseline?.testScores?.squat1RM,
                    current?.testScores?.squat1RM
                  )}
                </div>
              </div>

              {/* Bench Press */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
                <h4 className="font-bold text-center text-slate-700 mb-4 bg-slate-100 py-1 rounded">
                  Bench Press (بنش برس)
                </h4>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-500">
                    المبدئي:{' '}
                    <span className="text-slate-800 text-sm">
                      {baseline?.testScores?.bench1RM || 0} kg
                    </span>
                  </span>
                  <span className="text-xs font-bold text-blue-600">
                    النهائي:{' '}
                    <span className="text-blue-800 text-lg">
                      {current?.testScores?.bench1RM || 0} kg
                    </span>
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex justify-center">
                  {renderProgress(
                    baseline?.testScores?.bench1RM,
                    current?.testScores?.bench1RM
                  )}
                </div>
              </div>

              {/* Power Clean */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
                <h4 className="font-bold text-center text-slate-700 mb-4 bg-slate-100 py-1 rounded">
                  Power Clean (كلين)
                </h4>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-500">
                    المبدئي:{' '}
                    <span className="text-slate-800 text-sm">
                      {baseline?.testScores?.clean1RM || 0} kg
                    </span>
                  </span>
                  <span className="text-xs font-bold text-blue-600">
                    النهائي:{' '}
                    <span className="text-blue-800 text-lg">
                      {current?.testScores?.clean1RM || 0} kg
                    </span>
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex justify-center">
                  {renderProgress(
                    baseline?.testScores?.clean1RM,
                    current?.testScores?.clean1RM
                  )}
                </div>
              </div>
            </div>

            {/* 📈 منحنى التطور البياني للـ 1RM 📈 */}
            <div className="mt-4 border-t border-blue-200 pt-6">
              <h4 className="font-bold text-lg mb-4 text-blue-900 flex items-center gap-2">
                <LineChart className="w-5 h-5 text-blue-600" /> منحنى التطور
                البياني (Progress Curve)
              </h4>
              {renderProgressChart()}
            </div>
          </div>

          {/* 🌟 التطور في السرعة والقوة الانفجارية (Speed & Power) 🌟 */}
          <div className="bg-orange-50/50 rounded-xl p-6 border border-orange-100 mb-8 page-break-inside-avoid">
            <h3 className="font-black text-xl mb-6 flex items-center gap-2 text-orange-900 border-b border-orange-200 pb-2">
              <Zap className="w-6 h-6 text-orange-500" /> التطور في السرعة
              والقوة الانفجارية (Speed & Power)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Vertical Jump */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-100 text-center">
                <h4 className="font-bold text-slate-600 text-sm mb-2">
                  الوثب العمودي (cm)
                </h4>
                <div className="flex justify-center items-center gap-3 mb-2">
                  <span className="text-sm font-bold text-slate-400 line-through">
                    {baseline?.testScores?.verticalJump || 0}
                  </span>
                  <span className="text-xl font-black text-orange-600">
                    {current?.testScores?.verticalJump || 0}
                  </span>
                </div>
                {renderProgress(
                  baseline?.testScores?.verticalJump,
                  current?.testScores?.verticalJump
                )}
              </div>

              {/* Broad Jump */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-100 text-center">
                <h4 className="font-bold text-slate-600 text-sm mb-2">
                  الوثب العريض (m)
                </h4>
                <div className="flex justify-center items-center gap-3 mb-2">
                  <span className="text-sm font-bold text-slate-400 line-through">
                    {baseline?.testScores?.broadJump || 0}
                  </span>
                  <span className="text-xl font-black text-orange-600">
                    {current?.testScores?.broadJump || 0}
                  </span>
                </div>
                {renderProgress(
                  baseline?.testScores?.broadJump,
                  current?.testScores?.broadJump
                )}
              </div>

              {/* Sprint 10m (Inverse logic) */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-100 text-center">
                <h4 className="font-bold text-slate-600 text-sm mb-2">
                  تسارع 10 متر (sec)
                </h4>
                <div className="flex justify-center items-center gap-3 mb-2">
                  <span className="text-sm font-bold text-slate-400 line-through">
                    {baseline?.testScores?.sprint10m || 0}
                  </span>
                  <span className="text-xl font-black text-emerald-600">
                    {current?.testScores?.sprint10m || 0}
                  </span>
                </div>
                {renderProgress(
                  baseline?.testScores?.sprint10m,
                  current?.testScores?.sprint10m,
                  true
                )}
              </div>

              {/* Agility (Inverse logic) */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-100 text-center">
                <h4 className="font-bold text-slate-600 text-sm mb-2">
                  رشاقة 5-10-5 (sec)
                </h4>
                <div className="flex justify-center items-center gap-3 mb-2">
                  <span className="text-sm font-bold text-slate-400 line-through">
                    {baseline?.testScores?.proAgility || 0}
                  </span>
                  <span className="text-xl font-black text-emerald-600">
                    {current?.testScores?.proAgility || 0}
                  </span>
                </div>
                {renderProgress(
                  baseline?.testScores?.proAgility,
                  current?.testScores?.proAgility,
                  true
                )}
              </div>
            </div>
          </div>

          {/* 🌟 تقييم المدرب / الخاتمة 🌟 */}
          <div className="bg-slate-800 text-white rounded-xl p-6 border border-slate-700 page-break-inside-avoid">
            <h3 className="font-black text-lg mb-2 flex items-center gap-2 text-amber-400">
              <Award className="w-5 h-5" /> تقييم الموسم
            </h3>
            <p className="text-sm leading-relaxed opacity-90">
              بناءً على الأرقام والمنحنيات الموضحة أعلاه، يعكس هذا التقرير مدى
              التزام اللاعب بالبرنامج التدريبي والغذائي.
              {parseFloat(current?.testScores?.squat1RM) >
              parseFloat(baseline?.testScores?.squat1RM)
                ? ' المنحنى التصاعدي يدل على تطور ملحوظ في القوة القصوى مما سيؤثر إيجابياً على الأداء داخل الملعب وتقليل فرص الإصابة.'
                : ' يجب التركيز في الموسم القادم على معالجة نقاط الضعف لضمان استمرار التطور.'}
            </p>
            <div className="mt-6 pt-6 border-t border-slate-600 flex justify-between items-center text-sm font-bold opacity-70">
              <span>توقيع المدرب: كابتن محمود</span>
              <span>
                تاريخ الإصدار: {new Date().toLocaleDateString('ar-EG')}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
