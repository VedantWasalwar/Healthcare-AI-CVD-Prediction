import os
import pandas as pd
import numpy as np
from ml_training.src.config import DATASET_PATH, OUTLIER_BOUNDS
from ml_training.src.feature_mapping import RAW_COLUMNS, TARGET_COLUMN

def load_raw_dataset(csv_path=DATASET_PATH):
    """
    Loads the original CSV dataset and validates column integrity.
    """
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset not found at path: {csv_path}")
    
    # Detect separator (; or ,)
    with open(csv_path, 'r', encoding='utf-8') as f:
        first_line = f.readline()
    sep = ';' if ';' in first_line else ','
    
    df = pd.read_csv(csv_path, sep=sep)
    
    # Validate raw column existence
    missing_cols = [col for col in RAW_COLUMNS if col not in df.columns]
    if missing_cols:
        raise ValueError(f"Dataset is missing required raw columns: {missing_cols}")
        
    return df

def inspect_dataset_summary(df=None):
    """
    Analyzes and reports dataset properties (rows, cols, missing, duplicates, class distribution, invalid values).
    """
    if df is None:
        df = load_raw_dataset()
        
    summary = {
        'num_rows': len(df),
        'num_cols': len(df.columns),
        'column_names': list(df.columns),
        'missing_values': df.isnull().sum().to_dict(),
        'duplicate_records': int(df.duplicated().sum()),
        'target_distribution': df[TARGET_COLUMN].value_counts(normalize=True).to_dict(),
        'target_counts': df[TARGET_COLUMN].value_counts().to_dict(),
        'invalid_outliers': {}
    }
    
    for col, (min_val, max_val) in OUTLIER_BOUNDS.items():
        if col in df.columns:
            invalid_count = len(df[(df[col] < min_val) | (df[col] > max_val)])
            summary['invalid_outliers'][col] = invalid_count

    return summary

if __name__ == '__main__':
    df = load_raw_dataset()
    summary = inspect_dataset_summary(df)
    print("=== DATASET LOADING REPORT ===")
    print(f"Rows: {summary['num_rows']}, Columns: {summary['num_cols']}")
    print(f"Missing values: {sum(summary['missing_values'].values())}")
    print(f"Duplicate records: {summary['duplicate_records']}")
    print(f"Target distribution: {summary['target_distribution']}")
    print(f"Invalid Outlier counts: {summary['invalid_outliers']}")
