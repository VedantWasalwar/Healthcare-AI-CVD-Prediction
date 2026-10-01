/**
 * Clinical Reference Ranges & Evaluation Logic for Cardiovascular Parameters.
 * Compares actual patient values against medical standards to categorize each parameter
 * into status: "NORMAL", "ELEVATED", "HIGH RISK", or "MODERATE RISK".
 */

export const evaluateClinicalParameter = (key, val) => {
  const value = parseFloat(val);

  switch (key) {
    case 'ap_hi': // Systolic BP
      if (isNaN(value)) return { name: 'Systolic Blood Pressure', value: 'N/A', range: '< 120 mmHg', status: 'UNKNOWN', badge: 'bg-slate-100 text-slate-700' };
      if (value < 120) {
        return { name: 'Systolic Blood Pressure', value: `${value} mmHg`, range: '< 120 mmHg (Normal)', status: 'NORMAL', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300', explanation: 'Systolic BP is within normal healthy range.' };
      } else if (value <= 129) {
        return { name: 'Systolic Blood Pressure', value: `${value} mmHg`, range: '120 - 129 mmHg (Elevated)', status: 'ELEVATED', badge: 'bg-amber-100 text-amber-800 border-amber-300', explanation: 'Slightly elevated blood pressure. Lifestyle monitoring advised.' };
      } else {
        return { name: 'Systolic Blood Pressure', value: `${value} mmHg`, range: '≥ 130 mmHg (Hypertension)', status: 'HIGH RISK', badge: 'bg-rose-100 text-rose-800 border-rose-300', explanation: 'Systolic hypertension detected. Major positive contributor to CVD risk.' };
      }

    case 'ap_lo': // Diastolic BP
      if (isNaN(value)) return { name: 'Diastolic Blood Pressure', value: 'N/A', range: '< 80 mmHg', status: 'UNKNOWN', badge: 'bg-slate-100 text-slate-700' };
      if (value < 80) {
        return { name: 'Diastolic Blood Pressure', value: `${value} mmHg`, range: '< 80 mmHg (Normal)', status: 'NORMAL', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300', explanation: 'Diastolic BP is optimal.' };
      } else if (value <= 89) {
        return { name: 'Diastolic Blood Pressure', value: `${value} mmHg`, range: '80 - 89 mmHg (Stage 1 High)', status: 'ELEVATED', badge: 'bg-amber-100 text-amber-800 border-amber-300', explanation: 'Stage 1 diastolic elevation. Regular tracking recommended.' };
      } else {
        return { name: 'Diastolic Blood Pressure', value: `${value} mmHg`, range: '≥ 90 mmHg (Stage 2 High)', status: 'HIGH RISK', badge: 'bg-rose-100 text-rose-800 border-rose-300', explanation: 'Diastolic hypertension. Requires clinical follow-up.' };
      }

    case 'bmi': // Body Mass Index
      if (isNaN(value)) return { name: 'Body Mass Index (BMI)', value: 'N/A', range: '18.5 - 24.9 kg/m²', status: 'UNKNOWN', badge: 'bg-slate-100 text-slate-700' };
      if (value < 18.5) {
        return { name: 'Body Mass Index (BMI)', value: `${value.toFixed(1)} kg/m²`, range: '18.5 - 24.9 kg/m²', status: 'UNDERWEIGHT', badge: 'bg-blue-100 text-blue-800 border-blue-300', explanation: 'Below normal body weight threshold.' };
      } else if (value <= 24.9) {
        return { name: 'Body Mass Index (BMI)', value: `${value.toFixed(1)} kg/m²`, range: '18.5 - 24.9 kg/m² (Normal)', status: 'NORMAL', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300', explanation: 'Optimal healthy weight for height ratio.' };
      } else if (value <= 29.9) {
        return { name: 'Body Mass Index (BMI)', value: `${value.toFixed(1)} kg/m²`, range: '25.0 - 29.9 kg/m² (Overweight)', status: 'ELEVATED', badge: 'bg-amber-100 text-amber-800 border-amber-300', explanation: 'Overweight classification. Weight management beneficial.' };
      } else {
        return { name: 'Body Mass Index (BMI)', value: `${value.toFixed(1)} kg/m²`, range: '≥ 30.0 kg/m² (Obesity)', status: 'HIGH RISK', badge: 'bg-rose-100 text-rose-800 border-rose-300', explanation: 'Obesity threshold exceeded. Increases cardiac strain.' };
      }

    case 'cholesterol': // Serum Cholesterol
      const chVal = parseInt(value, 10);
      if (chVal === 1) {
        return { name: 'Serum Cholesterol', value: '1 (Normal)', range: 'Category 1: Normal (< 200 mg/dL)', status: 'NORMAL', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300', explanation: 'Cholesterol levels are within normal range.' };
      } else if (chVal === 2) {
        return { name: 'Serum Cholesterol', value: '2 (Above Normal)', range: 'Category 2: Borderline (200-239 mg/dL)', status: 'MODERATE RISK', badge: 'bg-amber-100 text-amber-800 border-amber-300', explanation: 'Borderline elevated cholesterol. Dietary adjustments advised.' };
      } else if (chVal === 3) {
        return { name: 'Serum Cholesterol', value: '3 (Well Above Normal)', range: 'Category 3: High (≥ 240 mg/dL)', status: 'HIGH RISK', badge: 'bg-rose-100 text-rose-800 border-rose-300', explanation: 'High serum cholesterol. Major risk factor for arterial plaque.' };
      }
      return { name: 'Serum Cholesterol', value: `${val}`, range: '1 (Normal) - 3 (High)', status: 'UNKNOWN', badge: 'bg-slate-100 text-slate-700' };

    case 'gluc': // Fasting Glucose
      const glVal = parseInt(value, 10);
      if (glVal === 1) {
        return { name: 'Fasting Glucose', value: '1 (Normal)', range: 'Category 1: Normal (< 100 mg/dL)', status: 'NORMAL', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300', explanation: 'Glucose levels are normal.' };
      } else if (glVal === 2) {
        return { name: 'Fasting Glucose', value: '2 (Above Normal)', range: 'Category 2: Prediabetes (100-125 mg/dL)', status: 'MODERATE RISK', badge: 'bg-amber-100 text-amber-800 border-amber-300', explanation: 'Elevated fasting blood sugar.' };
      } else if (glVal === 3) {
        return { name: 'Fasting Glucose', value: '3 (Well Above Normal)', range: 'Category 3: Diabetes Range (≥ 126 mg/dL)', status: 'HIGH RISK', badge: 'bg-rose-100 text-rose-800 border-rose-300', explanation: 'High fasting glucose level. Increases vascular risk.' };
      }
      return { name: 'Fasting Glucose', value: `${val}`, range: '1 (Normal) - 3 (High)', status: 'UNKNOWN', badge: 'bg-slate-100 text-slate-700' };

    case 'smoke': // Smoking
      const smVal = parseInt(value, 10);
      if (smVal === 0) {
        return { name: 'Smoking Habit', value: 'Non-Smoker', range: 'Non-Smoker (Normal)', status: 'NORMAL', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300', explanation: 'No smoking risk factor present.' };
      } else {
        return { name: 'Smoking Habit', value: 'Active Smoker', range: 'Smoker (High Risk Factor)', status: 'HIGH RISK', badge: 'bg-rose-100 text-rose-800 border-rose-300', explanation: 'Active smoking causes endothelial damage and accelerates CVD risk.' };
      }

    case 'alco': // Alcohol Consumption
      const alVal = parseInt(value, 10);
      if (alVal === 0) {
        return { name: 'Alcohol Intake', value: 'No / Rare', range: 'No / Rare (Normal)', status: 'NORMAL', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300', explanation: 'No significant alcohol risk factor.' };
      } else {
        return { name: 'Alcohol Intake', value: 'Regular Intake', range: 'Regular Intake (Moderate Risk)', status: 'ELEVATED', badge: 'bg-amber-100 text-amber-800 border-amber-300', explanation: 'Regular alcohol consumption can contribute to hypertension.' };
      }

    case 'active': // Physical Activity
      const acVal = parseInt(value, 10);
      if (acVal === 1) {
        return { name: 'Physical Activity', value: 'Active', range: 'Regular Exercise (Protective)', status: 'NORMAL', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300', explanation: 'Active lifestyle provides protective cardiovascular benefits.' };
      } else {
        return { name: 'Physical Activity', value: 'Sedentary', range: 'Sedentary (Risk Factor)', status: 'ELEVATED', badge: 'bg-amber-100 text-amber-800 border-amber-300', explanation: 'Sedentary lifestyle increases cardiovascular susceptibility.' };
      }

    default:
      return { name: key, value: `${val}`, range: 'N/A', status: 'INFO', badge: 'bg-slate-100 text-slate-700', explanation: '' };
  }
};

export const evaluateAllFeatures = (featuresDict) => {
  if (!featuresDict) return [];
  const keysToEvaluate = ['ap_hi', 'ap_lo', 'bmi', 'cholesterol', 'gluc', 'smoke', 'alco', 'active'];
  return keysToEvaluate.map(k => evaluateClinicalParameter(k, featuresDict[k]));
};
