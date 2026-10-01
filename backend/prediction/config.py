"""
HeartCare AI - Prediction Risk Level Configuration

DOCUMENTATION NOTICE:
The risk level thresholds defined here represent application-level categorical mappings
of the ML model's estimated probability score (0.0 to 1.0).
They are designed for educational visualization and decision support.
These thresholds are NOT clinically validated medical diagnostic cutoff values.
"""

# Configurable probability thresholds for risk categorization
RISK_LEVEL_THRESHOLDS = {
    'LOW': 0.35,        # Probability < 0.35 -> LOW RISK
    'MODERATE': 0.65,   # 0.35 <= Probability < 0.65 -> MODERATE RISK
    'HIGH': 0.85,       # 0.65 <= Probability < 0.85 -> HIGH RISK
                        # Probability >= 0.85 -> VERY HIGH RISK
}

RISK_LEVEL_DESCRIPTIONS = {
    'LOW': 'AI model estimates a low probability of cardiovascular disease based on input parameters.',
    'MODERATE': 'AI model estimates moderate risk factors present. Lifestyle monitoring recommended.',
    'HIGH': 'AI model estimates elevated risk factors. Consultation with a medical professional recommended.',
    'VERY HIGH': 'AI model estimates significant risk factors present. Professional clinical evaluation strongly advised.'
}

DISCLAIMER_MESSAGE = "AI-assisted cardiovascular risk assessment. This is not a medical diagnosis."
