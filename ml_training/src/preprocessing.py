import pandas as pd
import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin
from ml_training.src.config import FEATURE_COLUMNS, OUTLIER_BOUNDS

class CVDDataPreprocessor(BaseEstimator, TransformerMixin):
    """
    Identical preprocessor used both during training and by Django prediction API.
    Legitimately transforms raw features and cleans physiological outliers.
    """
    def __init__(self, filter_outliers=True):
        self.filter_outliers = filter_outliers
        self.feature_names_out_ = FEATURE_COLUMNS

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        """
        Transforms input DataFrame or dict into standard 12-feature DataFrame.
        """
        if isinstance(X, dict):
            df = pd.DataFrame([X])
        elif isinstance(X, pd.DataFrame):
            df = X.copy()
        else:
            raise TypeError("Input must be a pandas DataFrame or dictionary.")

        # 1. Derive age_years if only 'age' in days is present
        if 'age_years' not in df.columns and 'age' in df.columns:
            df['age_years'] = df['age'] / 365.25
        elif 'age_years' in df.columns:
            # If age_years is provided directly
            df['age_years'] = df['age_years'].astype(float)
        else:
            raise KeyError("Neither 'age' nor 'age_years' found in input data.")

        # 2. Derive BMI if not present
        if 'bmi' not in df.columns and 'height' in df.columns and 'weight' in df.columns:
            height_m = df['height'] / 100.0
            df['bmi'] = df['weight'] / (height_m ** 2)
        elif 'bmi' in df.columns:
            df['bmi'] = df['bmi'].astype(float)

        # 3. Handle outliers if configured
        if self.filter_outliers:
            for col, (min_val, max_val) in OUTLIER_BOUNDS.items():
                if col in df.columns:
                    df[col] = df[col].clip(lower=min_val, upper=max_val)

        # 4. Select strictly the 12 model features in exact order
        missing_feats = [col for col in FEATURE_COLUMNS if col not in df.columns]
        if missing_feats:
            raise KeyError(f"Input data is missing required feature columns: {missing_feats}")

        X_transformed = df[FEATURE_COLUMNS].astype(float)
        return X_transformed

def clean_and_preprocess_training_data(df, drop_outlier_rows=True):
    """
    Preprocessing function for training set preparation.
    Optionally drops extreme outlier rows (e.g. ap_hi < 70 or > 240) to prevent corrupting training data.
    """
    data = df.copy()
    
    if drop_outlier_rows:
        for col, (min_val, max_val) in OUTLIER_BOUNDS.items():
            if col in data.columns:
                data = data[(data[col] >= min_val) & (data[col] <= max_val)]
                
    preprocessor = CVDDataPreprocessor(filter_outliers=False)
    X = preprocessor.transform(data)
    y = data['cardio'].astype(int)
    
    return X, y, preprocessor
