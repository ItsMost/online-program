import { Dumbbell, HeartPulse, Move, Zap, RotateCcw } from 'lucide-react';

export const elementsProgression = [
  {
    name: 'القوة (تأسيس -> قصوى)',
    icon: <Dumbbell className="w-4 h-4 text-blue-500" />,
    intensities: [60, 65, 70, 75, 60, 80, 85, 90, 70, 92, 95, 95, 60],
  },
  {
    name: 'تحمل خاص بالرياضة',
    icon: <HeartPulse className="w-4 h-4 text-emerald-500" />,
    intensities: [60, 65, 75, 80, 65, 85, 85, 90, 70, 90, 95, 100, 50],
  },
  {
    name: 'أجيليتي وتغيير اتجاه',
    icon: <Move className="w-4 h-4 text-amber-500" />,
    intensities: [70, 75, 80, 85, 70, 85, 90, 95, 80, 95, 100, 100, 80],
  },
  {
    name: 'طاقة وانفجارية للقفز',
    icon: <Zap className="w-4 h-4 text-red-500" />,
    intensities: [0, 40, 50, 60, 50, 70, 80, 85, 70, 90, 95, 100, 60],
  },
  {
    name: 'موبيلتي وثباتات (وقاية)',
    icon: <RotateCcw className="w-4 h-4 text-purple-500" />,
    intensities: [
      100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
    ],
  },
];

export const measurementsWeek = {
  1: 'قياس مبدئي',
  5: 'قياس تطور',
  9: 'قياس متابعة',
  13: 'قياس نهائي',
};
export const matchesWeek = {
  7: 'مباراة ودية',
  10: 'مباراة تحضيرية',
  13: 'البطولة الرسمية',
};

export const planData = Array.from({ length: 13 }, (_, i) => {
  const weekNum = i + 1;
  const isGeneral = weekNum <= 5;
  let month =
    weekNum <= 4
      ? 'شهر 4 (أبريل)'
      : weekNum <= 9
      ? 'شهر 5 (مايو)'
      : 'شهر 6 (يونيو)';
  const avgIntensity = Math.round(
    elementsProgression.reduce((sum, el) => sum + el.intensities[i], 0) / 5
  );

  const squashDays = [
    {
      day: 'السبت',
      workout: 'جيم وفيتنس (Day 1)',
      details: 'أوزان، قوة، وتأسيس بدني',
    },
    {
      day: 'الأحد',
      workout: 'سيركيت، كورة، أجيليتي',
      details: 'تدريب دائري (محطات)',
    },
    {
      day: 'الإثنين',
      workout: 'راحة نشطة / موبيلتي',
      details: 'استشفاء لتقليل الحمل العصبي',
    },
    {
      day: 'الثلاثاء',
      workout: 'جيم وفيتنس (Day 2)',
      details: 'تكملة برنامج المقاومة والأوزان',
    },
    { day: 'الأربعاء', workout: 'سيركيت، كورة، تقويات', details: 'محطات تحمل' },
    { day: 'الخميس', workout: 'لعب حر / مباريات', details: 'تطبيق التكتيك' },
    { day: 'الجمعة', workout: 'راحة تامة', details: 'استشفاء تام' },
  ];

  return {
    id: weekNum,
    month,
    phase: isGeneral ? 'إعداد عام' : 'إعداد خاص',
    type: isGeneral ? 'general' : 'specific',
    goal: 'تطبيق التوزيعة',
    intensity: avgIntensity,
    isDeload: weekNum === 5 || weekNum === 9 || weekNum === 13,
    days: squashDays,
  };
});

export const getIntensityColor = (intensity: number) => {
  if (intensity === 0) return 'text-slate-300';
  if (intensity <= 60) return 'text-emerald-600 font-medium bg-emerald-50';
  if (intensity <= 80) return 'text-amber-600 font-semibold bg-amber-50';
  if (intensity <= 95) return 'text-orange-600 font-bold bg-orange-50';
  return 'text-red-600 font-black bg-red-50';
};

export const getDynamicBenchmarks = (
  sport: string,
  ageStr: string,
  gender: string,
  testKey: string
) => {
  const age = parseInt(ageStr) || 20;
  const baselines: any = {
    verticalJump: { elite: 70, vGood: 60, good: 50, poor: 40, type: 'higher' },
    broadJump: { elite: 2.8, vGood: 2.5, good: 2.2, poor: 1.9, type: 'higher' },
    sprint10m: {
      elite: 1.6,
      vGood: 1.7,
      good: 1.85,
      poor: 2.05,
      type: 'lower',
    },
    proAgility: {
      elite: 4.1,
      vGood: 4.35,
      good: 4.6,
      poor: 4.9,
      type: 'lower',
    },
    squatRatio: {
      elite: 2.0,
      vGood: 1.7,
      good: 1.4,
      poor: 1.1,
      type: 'higher',
    },
    benchRatio: {
      elite: 1.5,
      vGood: 1.2,
      good: 1.0,
      poor: 0.8,
      type: 'higher',
    },
    cleanRatio: {
      elite: 1.3,
      vGood: 1.1,
      good: 0.9,
      poor: 0.7,
      type: 'higher',
    },
    plank: { elite: 180, vGood: 120, good: 90, poor: 60, type: 'higher' },
    pushups: { elite: 50, vGood: 40, good: 30, poor: 15, type: 'higher' },
    sitAndReach: { elite: 15, vGood: 5, good: 0, poor: -5, type: 'higher' },
  };

  const sportMods: any = {
    squash: {
      verticalJump: 0.85,
      broadJump: 0.95,
      sprint10m: 1.05,
      proAgility: 0.93,
      squatRatio: 0.85,
      benchRatio: 0.8,
      cleanRatio: 0.85,
      plank: 1.1,
      pushups: 0.9,
      sitAndReach: 1.2,
    },
    volleyball: {
      verticalJump: 1.15,
      broadJump: 1.1,
      sprint10m: 1.0,
      proAgility: 1.0,
      squatRatio: 1.0,
      benchRatio: 0.9,
      cleanRatio: 1.1,
      plank: 1.0,
      pushups: 0.9,
      sitAndReach: 1.0,
    },
    general: {
      verticalJump: 1,
      broadJump: 1,
      sprint10m: 1,
      proAgility: 1,
      squatRatio: 1,
      benchRatio: 1,
      cleanRatio: 1,
      plank: 1,
      pushups: 1,
      sitAndReach: 1,
    },
  };

  let ageMod = 1.0;
  if (age < 12) ageMod = 0.6;
  else if (age >= 12 && age < 15) ageMod = 0.75;
  else if (age >= 15 && age < 18) ageMod = 0.9;
  else if (age > 35) ageMod = 0.85;

  let genderMod = gender === 'female' ? 0.75 : 1.0;
  if (gender === 'female' && testKey === 'sitAndReach') genderMod = 1.2;
  if (gender === 'female' && testKey === 'plank') genderMod = 1.0;
  if (
    gender === 'female' &&
    (testKey === 'sprint10m' || testKey === 'proAgility')
  )
    genderMod = 1.12;

  const base = baselines[testKey];
  const sMod = sportMods[sport]
    ? sportMods[sport][testKey]
    : sportMods.general[testKey];

  if (!base || !sMod)
    return { elite: 0, vGood: 0, good: 0, poor: 0, type: 'higher' };

  if (base.type === 'higher') {
    return {
      elite: Number((base.elite * sMod * ageMod * genderMod).toFixed(2)),
      vGood: Number((base.vGood * sMod * ageMod * genderMod).toFixed(2)),
      good: Number((base.good * sMod * ageMod * genderMod).toFixed(2)),
      poor: Number((base.poor * sMod * ageMod * genderMod).toFixed(2)),
      type: 'higher',
    };
  } else {
    return {
      elite: Number(
        (
          (base.elite * sMod * (gender === 'female' ? 1.12 : 1)) /
          ageMod
        ).toFixed(2)
      ),
      vGood: Number(
        (
          (base.vGood * sMod * (gender === 'female' ? 1.12 : 1)) /
          ageMod
        ).toFixed(2)
      ),
      good: Number(
        (
          (base.good * sMod * (gender === 'female' ? 1.12 : 1)) /
          ageMod
        ).toFixed(2)
      ),
      poor: Number(
        (
          (base.poor * sMod * (gender === 'female' ? 1.12 : 1)) /
          ageMod
        ).toFixed(2)
      ),
      type: 'lower',
    };
  }
};

export const calculate5LevelDynamic = (
  testKey: string,
  scoreVal: number | string,
  sport: string,
  age: string,
  gender: string
) => {
  if (!scoreVal || scoreVal.toString().trim() === '' || isNaN(Number(scoreVal)))
    return null;
  const score = parseFloat(String(scoreVal));
  const norms = getDynamicBenchmarks(sport, age, gender, testKey);

  if (!norms || norms.elite === 0)
    return { level: 'تم القياس', status: 'good', target: score };

  if (norms.type === 'lower') {
    if (score <= norms.elite)
      return { level: 'ممتاز', status: 'elite', target: norms.elite };
    if (score <= norms.vGood)
      return { level: 'جيد جداً', status: 'vGood', target: norms.elite };
    if (score <= norms.good)
      return { level: 'جيد', status: 'good', target: norms.elite };
    if (score <= norms.poor)
      return { level: 'ضعيف', status: 'poor', target: norms.elite };
    return { level: 'ضعيف جداً', status: 'vPoor', target: norms.elite };
  } else {
    if (score >= norms.elite)
      return { level: 'ممتاز', status: 'elite', target: norms.elite };
    if (score >= norms.vGood)
      return { level: 'جيد جداً', status: 'vGood', target: norms.elite };
    if (score >= norms.good)
      return { level: 'جيد', status: 'good', target: norms.elite };
    if (score >= norms.poor)
      return { level: 'ضعيف', status: 'poor', target: norms.elite };
    return { level: 'ضعيف جداً', status: 'vPoor', target: norms.elite };
  }
};
