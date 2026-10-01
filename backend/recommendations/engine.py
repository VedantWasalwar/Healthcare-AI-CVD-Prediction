from recommendations.rules import RecommendationRules, RECOMMENDATION_DISCLAIMER

class RecommendationEngine:
    """
    AI-Assisted Recommendation Engine.
    Processes patient prediction metrics, physiological inputs, and SHAP explainability outputs
    to produce personalized, prioritized health guidance.
    """

    @staticmethod
    def generate_recommendations(prediction_obj) -> dict:
        input_features = prediction_obj.input_features or {}
        risk_level = prediction_obj.risk_level
        top_shap_factors = prediction_obj.top_risk_factors or []

        raw_recs = RecommendationRules.evaluate_rules(
            features=input_features,
            risk_level=risk_level,
            top_shap_factors=top_shap_factors
        )

        # Priority ordering map
        priority_weights = {'High': 1, 'Moderate': 2, 'General': 3}
        raw_recs.sort(key=lambda r: priority_weights.get(r['priority'], 4))

        return {
            'risk_level': prediction_obj.risk_level,
            'risk_percentage': prediction_obj.risk_percentage,
            'recommendations': raw_recs,
            'disclaimer': RECOMMENDATION_DISCLAIMER
        }
