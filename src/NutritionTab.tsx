import React, { useState, useEffect } from 'react';
import {
  Apple,
  Search,
  Plus,
  Trash2,
  Flame,
  Beef,
  Wheat,
  Droplet,
  User,
  Printer,
  BrainCircuit,
  Loader2,
  Save,
  Coffee,
  Edit,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

// 🍎 قاعدة بيانات الأطعمة الأساسية
const INITIAL_FOOD_DATABASE = [
  {
    id: 1,
    name: 'صدر دجاج مشوي (100 جرام)',
    cal: 165,
    prot: 31,
    carb: 0,
    fat: 3.6,
  },
  {
    id: 2,
    name: 'لحم مفروم قليل الدسم (100 جرام)',
    cal: 250,
    prot: 26,
    carb: 0,
    fat: 15,
  },
  {
    id: 3,
    name: 'تونة معلبة في ماء (100 جرام)',
    cal: 116,
    prot: 26,
    carb: 0,
    fat: 1,
  },
  {
    id: 4,
    name: 'سمك سلمون مشوي (100 جرام)',
    cal: 206,
    prot: 22,
    carb: 0,
    fat: 13,
  },
  {
    id: 5,
    name: 'بيض مسلوق (واحدة كبيرة)',
    cal: 77,
    prot: 6.3,
    carb: 0.6,
    fat: 5.3,
  },
  { id: 6, name: 'بياض بيض (واحدة)', cal: 17, prot: 3.6, carb: 0.2, fat: 0.1 },
  {
    id: 7,
    name: 'واي بروتين (سكوب 30 جرام)',
    cal: 120,
    prot: 24,
    carb: 3,
    fat: 1,
  },
  {
    id: 8,
    name: 'زبادي يوناني سادة (100 جرام)',
    cal: 59,
    prot: 10,
    carb: 3.6,
    fat: 0.4,
  },
  {
    id: 9,
    name: 'جبنة قريش (100 جرام)',
    cal: 98,
    prot: 11,
    carb: 3.4,
    fat: 4.3,
  },
  {
    id: 10,
    name: 'أرز أبيض مطبوخ (100 جرام)',
    cal: 130,
    prot: 2.7,
    carb: 28,
    fat: 0.3,
  },
  {
    id: 11,
    name: 'أرز بسمتي مطبوخ (100 جرام)',
    cal: 121,
    prot: 3.5,
    carb: 25,
    fat: 0.4,
  },
  { id: 12, name: 'شوفان (50 جرام)', cal: 194, prot: 7, carb: 34, fat: 3.5 },
  {
    id: 13,
    name: 'بطاطس مشوية (100 جرام)',
    cal: 93,
    prot: 2.5,
    carb: 21,
    fat: 0.1,
  },
  {
    id: 14,
    name: 'بطاطا حلوة (100 جرام)',
    cal: 86,
    prot: 1.6,
    carb: 20,
    fat: 0.1,
  },
  {
    id: 15,
    name: 'مكرونة مسلوقة (100 جرام)',
    cal: 131,
    prot: 5,
    carb: 25,
    fat: 1,
  },
  { id: 16, name: 'خبز أسمر (شريحة)', cal: 69, prot: 3.6, carb: 12, fat: 0.9 },
  {
    id: 17,
    name: 'فول مدمس (100 جرام)',
    cal: 110,
    prot: 8,
    carb: 20,
    fat: 0.5,
  },
  {
    id: 18,
    name: 'عدس مطبوخ (100 جرام)',
    cal: 116,
    prot: 9,
    carb: 20,
    fat: 0.4,
  },
  { id: 19, name: 'لوز (30 جرام)', cal: 173, prot: 6, carb: 6, fat: 15 },
  {
    id: 20,
    name: 'عين جمل / جوز (30 جرام)',
    cal: 185,
    prot: 4.3,
    carb: 4,
    fat: 18,
  },
  {
    id: 21,
    name: 'زبدة فول سوداني (ملعقة 15 جرام)',
    cal: 94,
    prot: 4,
    carb: 3,
    fat: 8,
  },
  {
    id: 22,
    name: 'زيت زيتون (ملعقة كبيرة)',
    cal: 119,
    prot: 0,
    carb: 0,
    fat: 13.5,
  },
  { id: 23, name: 'أفوكادو (نصف ثمرة)', cal: 160, prot: 2, carb: 9, fat: 15 },
  {
    id: 24,
    name: 'موز (ثمرة متوسطة)',
    cal: 105,
    prot: 1.3,
    carb: 27,
    fat: 0.3,
  },
  {
    id: 25,
    name: 'تفاح (ثمرة متوسطة)',
    cal: 95,
    prot: 0.5,
    carb: 25,
    fat: 0.3,
  },
  { id: 26, name: 'تمر (3 حبات)', cal: 60, prot: 0.5, carb: 16, fat: 0 },
  { id: 27, name: 'عسل نحل (ملعقة كبيرة)', cal: 64, prot: 0, carb: 17, fat: 0 },
  {
    id: 28,
    name: 'حليب كامل الدسم (كوب 250 مل)',
    cal: 150,
    prot: 8,
    carb: 12,
    fat: 8,
  },
];

const GEMINI_API_KEY = 'AIzaSyAkxgcAgAsoVCsZBchtReciKxtcy0ug2oI';

export default function NutritionTab({
  theme,
  athletesDB,
  setAthletesDB,
}: any) {
  const [selectedAthleteId, setSelectedAthleteId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('breakfast');

  // 🧠 حالة الذكاء الاصطناعي
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // ✏️ حالات التعديل للوجبات المضافة في الجدول
  const [editingFood, setEditingFood] = useState<{
    mealType: string;
    uniqueId: number;
  } | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    cal: '',
    prot: '',
    carb: '',
    fat: '',
  });

  const [foodLibrary, setFoodLibrary] = useState(() => {
    const saved = localStorage.getItem('coach_food_library');
    return saved ? JSON.parse(saved) : INITIAL_FOOD_DATABASE;
  });

  const [newFood, setNewFood] = useState({
    name: '',
    cal: '',
    prot: '',
    carb: '',
    fat: '',
  });

  useEffect(() => {
    localStorage.setItem('coach_food_library', JSON.stringify(foodLibrary));
  }, [foodLibrary]);

  const filteredFoods = foodLibrary.filter((food: any) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentAthlete = athletesDB.find(
    (a: any) => String(a.id || a._id) === String(selectedAthleteId)
  );

  const dietPlan = currentAthlete?.dietPlan || {
    breakfast: [],
    lunch: [], // وجبة الغداء بعد التمرين
    dinner: [],
    snacks: [], // سناك قبل التمرين
  };

  const aiMacros = currentAthlete?.aiMacros || null;

  const calculateTotals = () => {
    let totals = { cal: 0, prot: 0, carb: 0, fat: 0 };
    Object.values(dietPlan).forEach((meal: any) => {
      meal.forEach((food: any) => {
        totals.cal += Number(food.cal) || 0;
        totals.prot += Number(food.prot) || 0;
        totals.carb += Number(food.carb) || 0;
        totals.fat += Number(food.fat) || 0;
      });
    });
    return totals;
  };

  const totals = calculateTotals();

  // ➕ إضافة طعام للوجبة يدوياً
  const addFoodToMeal = (food: any) => {
    if (!selectedAthleteId) {
      alert('يرجى اختيار اللاعب أولاً من القائمة العلوية!');
      return;
    }

    const updatedDietPlan = { ...dietPlan };
    updatedDietPlan[selectedMealType as keyof typeof updatedDietPlan].push({
      ...food,
      uniqueId: Date.now() + Math.random(),
    });

    const updatedAthletes = athletesDB.map((athlete: any) =>
      String(athlete.id || athlete._id) === String(selectedAthleteId)
        ? { ...athlete, dietPlan: updatedDietPlan }
        : athlete
    );
    setAthletesDB(updatedAthletes);
  };

  // 🗑️ حذف طعام من الوجبة
  const removeFoodFromMeal = (mealType: string, uniqueId: number) => {
    const updatedDietPlan = { ...dietPlan };
    updatedDietPlan[mealType as keyof typeof updatedDietPlan] = updatedDietPlan[
      mealType as keyof typeof updatedDietPlan
    ].filter((food: any) => food.uniqueId !== uniqueId);

    const updatedAthletes = athletesDB.map((athlete: any) =>
      String(athlete.id || athlete._id) === String(selectedAthleteId)
        ? { ...athlete, dietPlan: updatedDietPlan }
        : athlete
    );
    setAthletesDB(updatedAthletes);
  };

  // ✏️ بدء تعديل وجبة موجودة
  const startEditingFood = (mealType: string, food: any) => {
    setEditingFood({ mealType, uniqueId: food.uniqueId });
    setEditFormData({
      name: food.name,
      cal: food.cal,
      prot: food.prot,
      carb: food.carb,
      fat: food.fat,
    });
  };

  // 💾 حفظ تعديلات الوجبة
  const saveEditedFood = () => {
    if (!editingFood) return;

    const updatedDietPlan = { ...dietPlan };
    const mealKey = editingFood.mealType as keyof typeof updatedDietPlan;

    updatedDietPlan[mealKey] = updatedDietPlan[mealKey].map((food: any) => {
      if (food.uniqueId === editingFood.uniqueId) {
        return {
          ...food,
          name: editFormData.name,
          cal: parseFloat(editFormData.cal) || 0,
          prot: parseFloat(editFormData.prot) || 0,
          carb: parseFloat(editFormData.carb) || 0,
          fat: parseFloat(editFormData.fat) || 0,
        };
      }
      return food;
    });

    const updatedAthletes = athletesDB.map((athlete: any) =>
      String(athlete.id || athlete._id) === String(selectedAthleteId)
        ? { ...athlete, dietPlan: updatedDietPlan }
        : athlete
    );
    setAthletesDB(updatedAthletes);
    setEditingFood(null);
  };

  // 🍎 إضافة طعام جديد للمكتبة
  const handleAddNewFood = () => {
    if (!newFood.name || !newFood.cal) {
      alert('يرجى إدخال اسم الطعام والسعرات على الأقل.');
      return;
    }
    const foodItem = {
      id: Date.now(),
      name: newFood.name,
      cal: parseFloat(newFood.cal) || 0,
      prot: parseFloat(newFood.prot) || 0,
      carb: parseFloat(newFood.carb) || 0,
      fat: parseFloat(newFood.fat) || 0,
    };
    setFoodLibrary([foodItem, ...foodLibrary]);
    setNewFood({ name: '', cal: '', prot: '', carb: '', fat: '' });
    alert('تم إضافة الطعام للمكتبة بنجاح!');
  };

  // 🖨️ الطباعة
  const handlePrint = () => {
    if (!currentAthlete) {
      alert('يرجى اختيار لاعب أولاً!');
      return;
    }
    window.print();
  };

  // 💡 الخطة البديلة (Offline Fallback) بالمسميات والترتيب الجديد
  const generateFallbackPlan = (weight: number, goal: string) => {
    const wMultiplier = goal === 'lose' ? 22 : goal === 'gain' ? 32 : 26;
    const workCal = Math.round(weight * wMultiplier);
    const restCal = Math.round(weight * (wMultiplier - 3));

    const prot = Math.round(weight * 2.2);
    const wCarb = Math.round((workCal - prot * 4 - weight * 0.8 * 9) / 4);
    const rCarb = Math.round((restCal - prot * 4 - weight * 1 * 9) / 4);
    const wFat = Math.round(weight * 0.8);
    const rFat = Math.round(weight * 1);

    const fallbackData = {
      macros: {
        workoutDay: { cal: workCal, prot: prot, carb: wCarb, fat: wFat },
        restDay: { cal: restCal, prot: prot, carb: rCarb, fat: rFat },
      },
      plan: {
        breakfast: [
          {
            name: '50 جرام شوفان + كوب حليب خالي الدسم (200 مل) + ثمرة موز + 10 جرام عسل نحل',
            cal: 450,
            prot: 20,
            carb: 65,
            fat: 8,
          },
        ],
        snacks: [
          {
            name: 'سناك قبل التمرين: سكوب واي بروتين (30 جرام) + 15 جرام لوز + فنجان قهوة',
            cal: 250,
            prot: 25,
            carb: 5,
            fat: 15,
          },
        ],
        lunch: [
          {
            name: 'غداء بعد التمرين: 150 جرام صدر دجاج مشوي + 150 جرام أرز أبيض مطبوخ + طبق سلطة خضراء (100 جرام)',
            cal: 550,
            prot: 45,
            carb: 60,
            fat: 10,
          },
        ],
        dinner: [
          {
            name: 'علبة تونة بالماء (مصفاة) + طبق سلطة خضراء + شريحة توست أسمر (30 جرام)',
            cal: 350,
            prot: 30,
            carb: 35,
            fat: 8,
          },
        ],
      },
    };

    return fallbackData;
  };

  // 🧠 توليد النظام (وإدراجه مباشرة في الجدول)
  const generateAIPLan = async () => {
    if (!currentAthlete) return;

    const weight = parseFloat(currentAthlete.playerData?.bodyweight) || 70;
    const bodyFat = currentAthlete.playerData?.bodyFat || 'غير محدد';
    const goalRaw = currentAthlete.playerData?.goal || 'maintain';
    const goal =
      goalRaw === 'lose'
        ? 'خسارة دهون وتنشيف'
        : goalRaw === 'gain'
        ? 'بناء عضلات وضخامة'
        : 'ثبات وزن وأداء رياضي عالي';
    const trainingDays = currentAthlete.playerData?.trainingDays || 4;
    const intensity =
      currentAthlete.playerData?.intensity === 'high'
        ? 'عالية جداً'
        : currentAthlete.playerData?.intensity === 'low'
        ? 'خفيفة'
        : 'متوسطة';
    const age = currentAthlete.playerData?.birthYear
      ? new Date().getFullYear() - parseInt(currentAthlete.playerData.birthYear)
      : 25;
    const gender =
      currentAthlete.playerData?.gender === 'female' ? 'أنثى' : 'ذكر';

    setIsGeneratingAI(true);

    const prompt = `
      أنت خبير تغذية رياضية عالمي.
      بيانات اللاعب:
      - الجنس: ${gender}
      - العمر: ${age} سنة
      - الوزن: ${weight} كجم
      - نسبة الدهون: ${bodyFat}%
      - الهدف: ${goal}
      - أيام التمرين: ${trainingDays} أيام
      - الشدة: ${intensity}

      المطلوب:
      1. حساب الماكروز بدقة ليوم التمرين ويوم الراحة.
      2. تصميم خطة وجبات ليوم التدريب تتكون من (فطور، سناك قبل التمرين، غداء بعد التمرين، عشاء).
      
      ⚠️ قواعد التوزيع:
      - "snacks" تمثل سناك قبل التمرين (Pre-workout).
      - "lunch" يمثل وجبة الغداء بعد التمرين (Post-workout) ويجب أن تحتوي على بروتين وكارب أعلى للاستشفاء.

      ⚠️ هام جداً:
      يجب كتابة الكميات والمقادير بدقة بالجرامات أو الأكواب أو المعالق لكل صنف طعام في اسم الوجبة.
      مثال صحيح: "50 جرام شوفان مع 200 مل حليب و 10 جرام عسل".

      أرجع البيانات بصيغة JSON فقط، بدون أي نص إضافي.
      الهيكل المطلوب للـ JSON:
      {
        "macros": {
          "workoutDay": { "cal": 2500, "prot": 160, "carb": 300, "fat": 60 },
          "restDay": { "cal": 2200, "prot": 160, "carb": 200, "fat": 75 }
        },
        "plan": {
          "breakfast": [ { "name": "3 بيضات كاملة + 2 شريحة توست أسمر (60 جرام)", "cal": 400, "prot": 28, "carb": 30, "fat": 20 } ],
          "snacks": [ { "name": "سناك قبل التمرين: سكوب واي بروتين 30 جرام + ثمرة موز 100 جرام", "cal": 220, "prot": 25, "carb": 27, "fat": 2 } ],
          "lunch": [ { "name": "غداء بعد التمرين: 200 جرام صدر دجاج + 150 جرام أرز مطبوخ", "cal": 500, "prot": 50, "carb": 45, "fat": 5 } ],
          "dinner": [ { "name": "علبة تونة 100 جرام + 10 مل زيت زيتون + سلطة", "cal": 300, "prot": 30, "carb": 5, "fat": 15 } ]
        }
      }
    `;

    try {
      const apiKey = GEMINI_API_KEY.trim();
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error?.message || `HTTP Error ${response.status}`);
      }

      let textResponse = data.candidates[0].content.parts[0].text;

      textResponse = textResponse
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      const parsedData = JSON.parse(textResponse);

      // ✨ الإدراج التلقائي والمباشر للجدول ✨
      const newDietPlan = {
        breakfast: (parsedData.plan?.breakfast || []).map((f: any) => ({
          ...f,
          uniqueId: Date.now() + Math.random(),
        })),
        snacks: (parsedData.plan?.snacks || []).map((f: any) => ({
          ...f,
          uniqueId: Date.now() + Math.random(),
        })),
        lunch: (parsedData.plan?.lunch || []).map((f: any) => ({
          ...f,
          uniqueId: Date.now() + Math.random(),
        })),
        dinner: (parsedData.plan?.dinner || []).map((f: any) => ({
          ...f,
          uniqueId: Date.now() + Math.random(),
        })),
      };

      const updatedAthletes = athletesDB.map((athlete: any) =>
        String(athlete.id || athlete._id) === String(selectedAthleteId)
          ? { ...athlete, dietPlan: newDietPlan, aiMacros: parsedData.macros }
          : athlete
      );

      setAthletesDB(updatedAthletes);

      setTimeout(() => {
        document
          .getElementById('diet-plan-export-area')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } catch (error: any) {
      console.error('AI Generation Error:', error);

      const fallbackData = generateFallbackPlan(weight, goalRaw);

      const newDietPlan = {
        breakfast: fallbackData.plan.breakfast.map((f: any) => ({
          ...f,
          uniqueId: Date.now() + Math.random(),
        })),
        snacks: fallbackData.plan.snacks.map((f: any) => ({
          ...f,
          uniqueId: Date.now() + Math.random(),
        })),
        lunch: fallbackData.plan.lunch.map((f: any) => ({
          ...f,
          uniqueId: Date.now() + Math.random(),
        })),
        dinner: fallbackData.plan.dinner.map((f: any) => ({
          ...f,
          uniqueId: Date.now() + Math.random(),
        })),
      };

      const updatedAthletes = athletesDB.map((athlete: any) =>
        String(athlete.id || athlete._id) === String(selectedAthleteId)
          ? { ...athlete, dietPlan: newDietPlan, aiMacros: fallbackData.macros }
          : athlete
      );

      setAthletesDB(updatedAthletes);

      setTimeout(() => {
        document
          .getElementById('diet-plan-export-area')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-right">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #diet-plan-export-area, #diet-plan-export-area * { visibility: visible; }
          #diet-plan-export-area {
            position: absolute; left: 0; top: 0; width: 100%;
            padding: 20px !important; margin: 0 !important;
            background-color: #ffffff !important; min-height: 100vh;
          }
          .export-hide { display: none !important; }
          .page-break-inside-avoid { page-break-inside: avoid; break-inside: avoid; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>

      {/* 👑 الهيدر واختيار اللاعب */}
      <div
        className={`p-4 md:p-6 rounded-2xl border ${theme.card} ${theme.border}`}
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BrainCircuit className="w-8 h-8 text-emerald-500" />
              أخصائي التغذية الذكي (AI Nutritionist)
            </h2>
            <p className={`text-sm mt-1 ${theme.textDesc}`}>
              يقوم بحساب الماكروز وتوليد وجبات دقيقة بناءً على قياسات اللاعب.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div
              className={`flex items-center gap-2 p-2 rounded-xl border focus-within:ring-2 focus-within:ring-emerald-500 ${theme.bg} ${theme.border}`}
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
                onClick={generateAIPLan}
                disabled={isGeneratingAI}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg transition-all disabled:opacity-70 w-full sm:w-auto"
              >
                {isGeneratingAI ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> جاري التوليد...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="w-5 h-5" /> توليد نظام بالذكاء
                    الاصطناعي
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 📊 عرض الماكروز الذكية (يوم تمرين / يوم راحة) */}
      {selectedAthleteId && aiMacros && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-in slide-in-from-top-4">
          <div
            className={`p-5 rounded-2xl border shadow-sm ${theme.card} ${theme.border}`}
          >
            <h3 className="font-black text-blue-600 flex items-center gap-2 border-b border-slate-100 pb-2 mb-3">
              <Flame className="w-5 h-5" /> ماكروز يوم التمرين (Workout Day)
            </h3>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <p className="text-[10px] font-bold text-slate-500 mb-1">
                  سعرات
                </p>
                <p className="font-black text-slate-800">
                  {aiMacros.workoutDay.cal}
                </p>
              </div>
              <div className="bg-red-50 p-2 rounded-lg border border-red-100">
                <p className="text-[10px] font-bold text-red-500 mb-1">
                  بروتين
                </p>
                <p className="font-black text-red-700">
                  {aiMacros.workoutDay.prot}g
                </p>
              </div>
              <div className="bg-amber-50 p-2 rounded-lg border border-amber-100">
                <p className="text-[10px] font-bold text-amber-500 mb-1">
                  كارب
                </p>
                <p className="font-black text-amber-700">
                  {aiMacros.workoutDay.carb}g
                </p>
              </div>
              <div className="bg-yellow-50 p-2 rounded-lg border border-yellow-100">
                <p className="text-[10px] font-bold text-yellow-600 mb-1">
                  دهون
                </p>
                <p className="font-black text-yellow-800">
                  {aiMacros.workoutDay.fat}g
                </p>
              </div>
            </div>
          </div>
          <div
            className={`p-5 rounded-2xl border shadow-sm ${theme.card} ${theme.border}`}
          >
            <h3 className="font-black text-emerald-600 flex items-center gap-2 border-b border-slate-100 pb-2 mb-3">
              <Coffee className="w-5 h-5" /> ماكروز يوم الراحة (Rest Day)
            </h3>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <p className="text-[10px] font-bold text-slate-500 mb-1">
                  سعرات
                </p>
                <p className="font-black text-slate-800">
                  {aiMacros.restDay.cal}
                </p>
              </div>
              <div className="bg-red-50 p-2 rounded-lg border border-red-100">
                <p className="text-[10px] font-bold text-red-500 mb-1">
                  بروتين
                </p>
                <p className="font-black text-red-700">
                  {aiMacros.restDay.prot}g
                </p>
              </div>
              <div className="bg-amber-50 p-2 rounded-lg border border-amber-100">
                <p className="text-[10px] font-bold text-amber-500 mb-1">
                  كارب
                </p>
                <p className="font-black text-amber-700">
                  {aiMacros.restDay.carb}g
                </p>
              </div>
              <div className="bg-yellow-50 p-2 rounded-lg border border-yellow-100">
                <p className="text-[10px] font-bold text-yellow-600 mb-1">
                  دهون
                </p>
                <p className="font-black text-yellow-800">
                  {aiMacros.restDay.fat}g
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* العداد الحالي للوجبات */}
      {selectedAthleteId && (
        <div
          className={`p-4 rounded-2xl border flex flex-wrap justify-center gap-6 shadow-inner bg-slate-800 text-white`}
        >
          <div className="text-center">
            <p className="text-xs font-bold text-slate-400">
              الإجمالي المُضاف بالجدول
            </p>
            <p className="text-2xl font-black text-white">
              {Math.round(totals.cal)} kcal
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-red-400">بروتين</p>
            <p className="text-xl font-black text-white">
              {Math.round(totals.prot)}g
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-amber-400">كارب</p>
            <p className="text-xl font-black text-white">
              {Math.round(totals.carb)}g
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-yellow-400">دهون</p>
            <p className="text-xl font-black text-white">
              {Math.round(totals.fat)}g
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 📚 العمود الأيمن: مكتبة الأطعمة وإضافة طعام جديد */}
        <div
          className={`p-4 md:p-6 rounded-2xl border flex flex-col h-[750px] ${theme.card} ${theme.border} lg:col-span-1`}
        >
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Apple className="w-5 h-5 text-red-500" />
            مكتبة الأطعمة
          </h3>

          {/* نموذج إضافة طعام مخصص */}
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 mb-4">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
              إضافة طعام مخصص للمكتبة:
            </p>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="اسم الطعام (مثال: شريحة لحم 100ج)"
                value={newFood.name}
                onChange={(e) =>
                  setNewFood({ ...newFood, name: e.target.value })
                }
                className="w-full p-2 text-xs font-bold rounded border outline-none focus:border-blue-500"
              />
              <div className="grid grid-cols-4 gap-1">
                <input
                  type="number"
                  placeholder="سعرات"
                  value={newFood.cal}
                  onChange={(e) =>
                    setNewFood({ ...newFood, cal: e.target.value })
                  }
                  className="w-full p-1.5 text-center text-xs font-bold rounded border outline-none focus:border-blue-500"
                />
                <input
                  type="number"
                  placeholder="بروتين"
                  value={newFood.prot}
                  onChange={(e) =>
                    setNewFood({ ...newFood, prot: e.target.value })
                  }
                  className="w-full p-1.5 text-center text-xs font-bold rounded border outline-none focus:border-red-500"
                />
                <input
                  type="number"
                  placeholder="كارب"
                  value={newFood.carb}
                  onChange={(e) =>
                    setNewFood({ ...newFood, carb: e.target.value })
                  }
                  className="w-full p-1.5 text-center text-xs font-bold rounded border outline-none focus:border-amber-500"
                />
                <input
                  type="number"
                  placeholder="دهون"
                  value={newFood.fat}
                  onChange={(e) =>
                    setNewFood({ ...newFood, fat: e.target.value })
                  }
                  className="w-full p-1.5 text-center text-xs font-bold rounded border outline-none focus:border-yellow-500"
                />
              </div>
              <button
                onClick={handleAddNewFood}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 rounded transition-colors flex items-center justify-center gap-1"
              >
                <Save className="w-3 h-3" /> حفظ في المكتبة
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="ابحث عن طعام..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full p-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.bg} ${theme.border} ${theme.textMain} text-sm font-bold`}
            />
          </div>

          <div className="mb-4">
            <select
              value={selectedMealType}
              onChange={(e) => setSelectedMealType(e.target.value)}
              className={`w-full p-2.5 rounded-xl border focus:outline-none text-sm font-bold ${theme.bg} ${theme.border} ${theme.textMain}`}
            >
              <option value="breakfast">إضافة إلى: الفطور</option>
              <option value="snacks">إضافة إلى: سناك قبل التمرين</option>
              <option value="lunch">إضافة إلى: غداء بعد التمرين</option>
              <option value="dinner">إضافة إلى: العشاء</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {filteredFoods.map((food: any) => (
              <div
                key={food.id}
                className={`p-3 rounded-xl border flex justify-between items-center transition-all hover:border-emerald-500 ${theme.bg} ${theme.border}`}
              >
                <div>
                  <p className="font-bold text-sm">{food.name}</p>
                  <p className={`text-xs mt-1 ${theme.textDesc} font-bold`}>
                    <span className="text-slate-500">{food.cal} kcal</span> |
                    <span className="text-red-500"> {food.prot}g P</span> |
                    <span className="text-amber-500"> {food.carb}g C</span> |
                    <span className="text-yellow-600"> {food.fat}g F</span>
                  </p>
                </div>
                <button
                  onClick={() => addFoodToMeal(food)}
                  className="p-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 🍽️ العمود الأيسر: الجدول الغذائي للاعب القابل للتعديل والطباعة */}
        <div
          className={`p-4 md:p-6 rounded-2xl border flex flex-col h-[750px] ${theme.card} ${theme.border} lg:col-span-2`}
        >
          {!selectedAthleteId ? (
            <div className="h-full flex flex-col items-center justify-center opacity-50">
              <Apple className="w-16 h-16 mb-4 text-slate-400" />
              <p className="text-lg font-bold">
                يرجى اختيار لاعب لتصميم وتوليد نظامه الغذائي
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6 export-hide">
                <h3 className="font-bold text-lg">
                  محتوى النظام الغذائي (قابل للتعديل والطباعة)
                </h3>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all"
                >
                  <Printer className="w-5 h-5" />
                  طباعة النظام (PDF)
                </button>
              </div>

              {/* 🎯 المنطقة القابلة للطباعة */}
              <div
                id="diet-plan-export-area"
                className="flex-1 overflow-y-auto space-y-6 custom-scrollbar p-2 md:p-4 bg-white text-black rounded-xl border border-slate-200 relative"
              >
                <div className="text-center mb-6 pb-6 border-b-2 border-slate-200">
                  <h2 className="text-3xl font-black text-slate-800">
                    النظام الغذائي المخصص
                  </h2>
                  <p className="text-slate-600 font-bold mt-2 text-lg">
                    اللاعب:{' '}
                    <span className="text-slate-900">
                      {currentAthlete?.playerData?.name || 'غير محدد'}
                    </span>
                  </p>

                  {/* 🌟 عرض الماكروز المستهدفة بدقة 🌟 */}
                  <div className="flex flex-col items-center mt-5">
                    <p className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-1 rounded-full mb-3">
                      الماكروز المستهدفة (من الذكاء الاصطناعي - يوم التمرين)
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <div className="bg-slate-50 text-slate-700 px-4 py-2 rounded-xl border border-slate-200 font-bold text-sm flex items-center gap-2">
                        <Flame className="w-4 h-4" /> السعرات:{' '}
                        {aiMacros ? aiMacros.workoutDay.cal : 0}
                      </div>
                      <div className="bg-red-50 text-red-700 px-4 py-2 rounded-xl border border-red-100 font-bold text-sm flex items-center gap-2">
                        <Beef className="w-4 h-4" /> بروتين:{' '}
                        {aiMacros ? aiMacros.workoutDay.prot : 0}g
                      </div>
                      <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl border border-amber-100 font-bold text-sm flex items-center gap-2">
                        <Wheat className="w-4 h-4" /> كارب:{' '}
                        {aiMacros ? aiMacros.workoutDay.carb : 0}g
                      </div>
                      <div className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-xl border border-yellow-100 font-bold text-sm flex items-center gap-2">
                        <Droplet className="w-4 h-4" /> دهون:{' '}
                        {aiMacros ? aiMacros.workoutDay.fat : 0}g
                      </div>
                    </div>
                  </div>
                </div>

                {/* 🌟 تعديل ترتيب وعناوين الوجبات كما طلبت 🌟 */}
                {[
                  {
                    id: 'breakfast',
                    title: 'وجبة الفطور',
                    color: 'text-orange-600',
                    border: 'border-orange-200',
                    bg: 'bg-orange-50/30',
                  },
                  {
                    id: 'snacks',
                    title: 'سناك قبل التمرين (Pre-Workout)',
                    color: 'text-pink-600',
                    border: 'border-pink-200',
                    bg: 'bg-pink-50/30',
                  },
                  {
                    id: 'lunch',
                    title: 'وجبة الغداء (بعد التمرين مباشرة)',
                    color: 'text-blue-600',
                    border: 'border-blue-200',
                    bg: 'bg-blue-50/30',
                  },
                  {
                    id: 'dinner',
                    title: 'وجبة العشاء',
                    color: 'text-indigo-600',
                    border: 'border-indigo-200',
                    bg: 'bg-indigo-50/30',
                  },
                ].map((mealConfig) => (
                  <div
                    key={mealConfig.id}
                    className={`p-4 rounded-xl border-2 ${mealConfig.border} ${mealConfig.bg} page-break-inside-avoid`}
                  >
                    <h3
                      className={`font-black text-xl mb-4 flex items-center gap-2 ${mealConfig.color}`}
                    >
                      <span className="w-2 h-6 rounded-full bg-current"></span>
                      {mealConfig.title}
                    </h3>

                    {dietPlan[mealConfig.id as keyof typeof dietPlan].length ===
                    0 ? (
                      <p className="text-sm font-bold text-center py-4 text-slate-400 bg-white/50 rounded-lg">
                        لم يتم إضافة أطعمة لهذه الوجبة بعد. أضف من المكتبة أو
                        استخدم الذكاء الاصطناعي.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {dietPlan[mealConfig.id as keyof typeof dietPlan].map(
                          (food: any) => (
                            <div
                              key={food.uniqueId}
                              className="p-3 rounded-lg border border-slate-200 bg-white shadow-sm hover:border-slate-300 transition-colors"
                            >
                              {/* ✏️ وضع التعديل للأكلة */}
                              {editingFood?.uniqueId === food.uniqueId ? (
                                <div className="flex flex-col gap-3 export-hide bg-blue-50 p-3 rounded-lg border-2 border-blue-400">
                                  <input
                                    type="text"
                                    value={editFormData.name}
                                    onChange={(e) =>
                                      setEditFormData({
                                        ...editFormData,
                                        name: e.target.value,
                                      })
                                    }
                                    className="w-full p-2 border border-blue-200 rounded font-bold text-sm outline-none"
                                    placeholder="اسم الوجبة والمقادير"
                                  />
                                  <div className="grid grid-cols-4 gap-2">
                                    <div className="flex flex-col text-center">
                                      <span className="text-[10px] font-bold text-slate-500 mb-1">
                                        سعرات
                                      </span>
                                      <input
                                        type="number"
                                        value={editFormData.cal}
                                        onChange={(e) =>
                                          setEditFormData({
                                            ...editFormData,
                                            cal: e.target.value,
                                          })
                                        }
                                        className="w-full p-1.5 text-center border rounded font-bold text-sm outline-none"
                                      />
                                    </div>
                                    <div className="flex flex-col text-center">
                                      <span className="text-[10px] font-bold text-red-500 mb-1">
                                        بروتين
                                      </span>
                                      <input
                                        type="number"
                                        value={editFormData.prot}
                                        onChange={(e) =>
                                          setEditFormData({
                                            ...editFormData,
                                            prot: e.target.value,
                                          })
                                        }
                                        className="w-full p-1.5 text-center border rounded font-bold text-sm outline-none"
                                      />
                                    </div>
                                    <div className="flex flex-col text-center">
                                      <span className="text-[10px] font-bold text-amber-500 mb-1">
                                        كارب
                                      </span>
                                      <input
                                        type="number"
                                        value={editFormData.carb}
                                        onChange={(e) =>
                                          setEditFormData({
                                            ...editFormData,
                                            carb: e.target.value,
                                          })
                                        }
                                        className="w-full p-1.5 text-center border rounded font-bold text-sm outline-none"
                                      />
                                    </div>
                                    <div className="flex flex-col text-center">
                                      <span className="text-[10px] font-bold text-yellow-600 mb-1">
                                        دهون
                                      </span>
                                      <input
                                        type="number"
                                        value={editFormData.fat}
                                        onChange={(e) =>
                                          setEditFormData({
                                            ...editFormData,
                                            fat: e.target.value,
                                          })
                                        }
                                        className="w-full p-1.5 text-center border rounded font-bold text-sm outline-none"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex justify-end gap-2 mt-1">
                                    <button
                                      onClick={() => setEditingFood(null)}
                                      className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 text-slate-600 font-bold rounded-lg text-xs hover:bg-slate-100"
                                    >
                                      <XCircle className="w-4 h-4" /> إلغاء
                                    </button>
                                    <button
                                      onClick={saveEditedFood}
                                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white font-bold rounded-lg text-xs hover:bg-blue-700"
                                    >
                                      <CheckCircle2 className="w-4 h-4" /> حفظ
                                      التعديل
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                // الوضع العادي للعرض
                                <div className="flex justify-between items-center">
                                  <div className="flex-1 pr-4">
                                    <p className="font-bold text-sm md:text-base text-slate-800 leading-relaxed">
                                      {food.name}
                                    </p>
                                  </div>
                                  <div className="flex items-center">
                                    <div className="flex gap-2 text-xs font-black px-2">
                                      <span className="text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                        {food.cal}{' '}
                                        <span className="hidden lg:inline">
                                          kcal
                                        </span>
                                      </span>
                                      <span className="text-red-500 bg-red-50 px-2 py-1 rounded border border-red-100">
                                        {food.prot}g{' '}
                                        <span className="hidden lg:inline">
                                          P
                                        </span>
                                      </span>
                                      <span className="text-amber-500 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                                        {food.carb}g{' '}
                                        <span className="hidden lg:inline">
                                          C
                                        </span>
                                      </span>
                                      <span className="text-yellow-600 bg-yellow-50 px-2 py-1 rounded border border-yellow-100">
                                        {food.fat}g{' '}
                                        <span className="hidden lg:inline">
                                          F
                                        </span>
                                      </span>
                                    </div>
                                    <div className="flex items-center export-hide mr-2 border-r border-slate-200 pr-2">
                                      {/* ✏️ زرار التعديل الجديد */}
                                      <button
                                        onClick={() =>
                                          startEditingFood(mealConfig.id, food)
                                        }
                                        className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                        title="تعديل المكونات"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() =>
                                          removeFoodFromMeal(
                                            mealConfig.id,
                                            food.uniqueId
                                          )
                                        }
                                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                        title="مسح من الوجبة"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ))}

                <div className="hidden print:block text-center pt-8 mt-12 border-t-2 border-slate-100 text-slate-400 font-bold text-sm">
                  <p>
                    تم تصميم وتطوير هذا النظام خصيصاً لك بواسطة الكابتن ©{' '}
                    {new Date().getFullYear()}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
