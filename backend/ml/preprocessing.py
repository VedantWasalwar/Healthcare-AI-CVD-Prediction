import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler

class CVDDataPreprocessor:
    """
    Centralized Preprocessing Pipeline for Cardiovascular Disease Data.
    Used consistently during both Model Training and Real-Time Prediction API Inference.
    """
    FEATURE_COLUMNS = [
        'age_years', 'gender', 'height', 'weight', 'bmi',
        'ap_hi', 'ap_lo', 'cholesterol', 'gluc',
        'smoke', 'alco', 'active'
    ]

    RAW_COLUMNS = [
        'id', 'age', 'gender', 'height', 'weight',
        'ap_hi', 'ap_lo', 'cholesterol', 'gluc',
        'smoke', 'alco', 'active', 'cardio'
    ]

    def __init__(self):
        self.scaler = StandardScaler()
        self.is_fitted = False

    def validate_raw_columns(self, df: pd.DataFrame) -> bool:
        """Validates that all required columns exist in the DataFrame."""
        missing = [col for col in self.RAW_COLUMNS if col not in df.columns]
        if missing:
            raise ValueError(f"Missing required columns in dataset: {missing}")
        return True

    def fit_transform(self, df: pd.DataFrame) -> pd.DataFrame:
        """Preprocesses raw dataframe and fits StandardScaler on numeric features."""
        data = df.copy()

        # Convert age in days to age in years
        if 'age' in data.columns and 'age_years' not in data.columns:
            data['age_years'] = data['age'] / 365.25

        # Calculate BMI if not present
        if 'bmi' not in data.columns:
            height_m = data['height'] / 100.0
            data['bmi'] = data['weight'] / (height_m ** 2)

        # Select model features
        X = data[self.FEATURE_COLUMNS].copy()

        # Fit scaler on numerical columns
        num_cols = ['age_years', 'height', 'weight', 'bmi', 'ap_hi', 'ap_lo']
        self.scaler.fit(X[num_cols])
        self.is_fitted = True

        return X

    def transform(self, data) -> pd.DataFrame:
        """Transforms input (DataFrame or dict) using fitted preprocessor rules."""
        if isinstance(data, dict):
            return self.preprocess_dict(data)

        data_df = data.copy()

        if 'age' in data_df.columns and 'age_years' not in data_df.columns:
            data_df['age_years'] = data_df['age'] / 365.25

        if 'bmi' not in data_df.columns:
            height_m = data_df['height'] / 100.0
            data_df['bmi'] = data_df['weight'] / (height_m ** 2)

        X = data_df[self.FEATURE_COLUMNS].copy()
        return X

    def preprocess_dict(self, input_dict: dict) -> pd.DataFrame:
        """Preprocesses a single patient input dictionary into a model-ready DataFrame."""
        data = input_dict.copy()

        # Handle age vs age_years
        if 'age' in data and 'age_years' not in data:
            data['age_years'] = float(data['age'])
        elif 'age_years' in data:
            data['age_years'] = float(data['age_years'])

        # Calculate BMI if missing
        if 'bmi' not in data or data['bmi'] is None:
            height_m = float(data['height']) / 100.0
            data['bmi'] = float(data['weight']) / (height_m ** 2)
        else:
            data['bmi'] = float(data['bmi'])

        row = {
            'age_years': float(data['age_years']),
            'gender': int(data.get('gender', 1)),
            'height': float(data.get('height', 165)),
            'weight': float(data.get('weight', 70)),
            'bmi': float(data['bmi']),
            'ap_hi': float(data.get('ap_hi', 120)),
            'ap_lo': float(data.get('ap_lo', 80)),
            'cholesterol': int(data.get('cholesterol', 1)),
            'gluc': int(data.get('gluc', 1)),
            'smoke': int(data.get('smoke', 0)),
            'alco': int(data.get('alco', 0)),
            'active': int(data.get('active', 1)),
        }

        df_single = pd.DataFrame([row])[self.FEATURE_COLUMNS]
        return df_single
