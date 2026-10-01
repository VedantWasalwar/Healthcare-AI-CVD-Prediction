import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from recommendations.engine import RecommendationEngine

def generate_patient_recommendations(prediction_dict: dict) -> dict:
    """
    Wrapper for non-pharmacological lifestyle recommendation engine.
    Receives prediction record dictionary and returns prioritized guidance.
    """
    engine = RecommendationEngine()
    return engine.generate(prediction_dict)
