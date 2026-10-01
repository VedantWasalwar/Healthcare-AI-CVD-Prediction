# Rule-based educational recommendation definitions for CVD prevention & risk mitigation

RECOMMENDATION_DISCLAIMER = (
    "Recommendations are educational and decision-support guidance only. "
    "They are not a medical diagnosis, prescription, or treatment order. "
    "Always consult a qualified healthcare professional for personalized medical advice."
)

class RecommendationRules:
    """
    Evaluates patient physiological features and risk factors to produce
    non-pharmacological, evidence-aligned lifestyle, dietary, monitoring, and referral guidance.
    """

    @staticmethod
    def evaluate_rules(features: dict, risk_level: str, top_shap_factors: list) -> list:
        recommendations = []
        
        # Extract top SHAP feature names for prioritization
        top_shap_names = [f.get('feature') for f in top_shap_factors[:3] if f.get('direction') == 'increases_risk']

        # 1. Blood Pressure Monitoring & Management
        ap_hi = features.get('ap_hi', 120)
        ap_lo = features.get('ap_lo', 80)
        if ap_hi >= 130 or ap_lo >= 85:
            is_top_shap = 'ap_hi' in top_shap_names or 'ap_lo' in top_shap_names
            priority = 'High' if (is_top_shap or risk_level in ['HIGH', 'VERY HIGH']) else 'Moderate'
            recommendations.append({
                'category': 'Blood Pressure Monitoring',
                'priority': priority,
                'title': 'Regular Blood Pressure Monitoring & Care',
                'message': (
                    f"Your recorded blood pressure ({int(ap_hi)}/{int(ap_lo)} mmHg) is elevated. "
                    "We recommend tracking your morning and evening blood pressure at home and sharing persistent elevated readings with your physician. "
                    "Reducing dietary sodium intake to under 2,000 mg/day can also support healthy blood pressure levels."
                ),
                'reason': 'Systolic/Diastolic blood pressure was elevated and strongly influenced your model assessment.'
            })

        # 2. Smoking Cessation
        smoke = features.get('smoke', 0)
        if smoke == 1:
            is_top_shap = 'smoke' in top_shap_names
            priority = 'High' if is_top_shap else 'Moderate'
            recommendations.append({
                'category': 'Smoking',
                'priority': priority,
                'title': 'Tobacco & Smoking Cessation Support',
                'message': (
                    "Tobacco smoke contains compounds that impair vascular function and elevate heart disease risk. "
                    "Complete smoking cessation is one of the most effective steps to improve cardiovascular health. "
                    "Consider speaking with a doctor about evidence-based behavioral support and quitting programs."
                ),
                'reason': 'Current smoking status was identified as an active risk factor in your health evaluation.'
            })

        # 3. Weight Management & BMI
        bmi = features.get('bmi')
        height = features.get('height')
        weight = features.get('weight')
        if bmi is None and height and weight:
            bmi = weight / ((height / 100) ** 2)

        if bmi and bmi >= 25.0:
            is_top_shap = 'bmi' in top_shap_names or 'weight' in top_shap_names
            priority = 'High' if (is_top_shap or bmi >= 30) else 'Moderate'
            recommendations.append({
                'category': 'Weight Management',
                'priority': priority,
                'title': 'Healthy Weight & Body Composition Guidance',
                'message': (
                    f"Your calculated Body Mass Index (BMI: {bmi:.1f} kg/m²) indicates weight above the normal range. "
                    "A gradual, sustainable weight reduction of 5–10% through balanced nutrition and routine activity "
                    "significantly improves blood pressure and metabolic health."
                ),
                'reason': 'Body mass index (BMI) is above the recommended optimal range (18.5–24.9 kg/m²).'
            })

        # 4. Physical Activity
        active = features.get('active', 1)
        if active == 0:
            is_top_shap = 'active' in top_shap_names
            priority = 'High' if is_top_shap else 'Moderate'
            recommendations.append({
                'category': 'Physical Activity',
                'priority': priority,
                'title': 'Gradual Physical Activity Integration',
                'message': (
                    "A sedentary lifestyle increases cardiovascular vulnerability. "
                    "Aim for at least 150 minutes of moderate-intensity aerobic exercise (such as brisk walking, swimming, or cycling) per week, "
                    "if medically cleared by your physician."
                ),
                'reason': 'Physical inactivity was reported in your current health assessment.'
            })

        # 5. Cholesterol & Lipid Profile
        cholesterol = features.get('cholesterol', 1)
        if cholesterol in [2, 3]:
            is_top_shap = 'cholesterol' in top_shap_names
            priority = 'High' if (is_top_shap or cholesterol == 3) else 'Moderate'
            recommendations.append({
                'category': 'Cholesterol',
                'priority': priority,
                'title': 'Heart-Healthy Nutrition & Lipid Management',
                'message': (
                    "Your cholesterol level is above the optimal reference range. "
                    "Adopt a diet low in saturated fats and trans-fats while increasing soluble fiber intake (oats, legumes, fruits, vegetables). "
                    "A complete fasting lipid panel (HDL, LDL, Triglycerides) is recommended for clinical evaluation."
                ),
                'reason': 'Cholesterol level was recorded above normal range in your assessment.'
            })

        # 6. Glucose & Glycemic Control
        gluc = features.get('gluc', 1)
        if gluc in [2, 3]:
            is_top_shap = 'gluc' in top_shap_names
            priority = 'High' if (is_top_shap or gluc == 3) else 'Moderate'
            recommendations.append({
                'category': 'Glucose',
                'priority': priority,
                'title': 'Glycemic Control & Dietary Balance',
                'message': (
                    "Elevated blood glucose levels impact vascular endothelium. "
                    "Focus on low-glycemic index foods, minimize refined sugars and sweetened beverages, "
                    "and consult a physician for a formal HbA1c screening test."
                ),
                'reason': 'Blood glucose was above normal levels in your assessment.'
            })

        # 7. Alcohol Moderation
        alco = features.get('alco', 0)
        if alco == 1:
            recommendations.append({
                'category': 'Alcohol',
                'priority': 'Moderate',
                'title': 'Alcohol Consumption Moderation',
                'message': (
                    "Excessive or regular alcohol intake can elevate blood pressure and triglycerides. "
                    "Limit alcohol consumption in accordance with dietary guidelines and discuss appropriate personal limits with your doctor."
                ),
                'reason': 'Regular alcohol consumption was recorded in your health profile.'
            })

        # 8. Diet & Nutrition (General for all)
        recommendations.append({
            'category': 'Diet',
            'priority': 'General',
            'title': 'Cardioprotective Dietary Pattern',
            'message': (
                "Emphasize a Mediterranean or DASH-style diet rich in whole grains, vegetables, lean proteins, nuts, and healthy fats (such as olive oil). "
                "Minimize processed foods and sodium."
            ),
            'reason': 'Nutrition is a foundational determinant of cardiovascular wellness.'
        })

        # 9. General Lifestyle & Stress
        recommendations.append({
            'category': 'General Lifestyle',
            'priority': 'General',
            'title': 'Stress Management & Quality Sleep',
            'message': (
                "Ensure 7–9 hours of restorative sleep per night and practice stress reduction techniques "
                "such as mindfulness, deep breathing, or structured relaxation."
            ),
            'reason': 'Restorative sleep and stress resilience support overall autonomic health.'
        })

        # 10. Professional Medical Follow-Up
        prof_priority = 'High' if risk_level in ['HIGH', 'VERY HIGH'] else 'Moderate'
        recommendations.append({
            'category': 'Professional Medical Follow-up',
            'priority': prof_priority,
            'title': 'Physician Consultation & Medical Evaluation',
            'message': (
                f"Based on your calculated cardiovascular risk level ({risk_level}), "
                "we strongly advise scheduling a comprehensive cardiovascular consultation with a physician or cardiologist. "
                "Bring your health summary report and SHAP risk driver breakdown to your appointment."
            ),
            'reason': f"Your overall calculated risk level is {risk_level}."
        })

        return recommendations
