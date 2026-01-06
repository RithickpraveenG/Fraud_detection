import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import LabelEncoder
import joblib
import os

class FraudModel:
    def __init__(self):
        self.model = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
        self.encoders = {}
        self.categorical_features = ['currency', 'location']
        self.is_trained = False

    def preprocess(self, df, training=True):
        """Encodes categorical features."""
        df_processed = df.copy()
        
        for col in self.categorical_features:
            if training:
                le = LabelEncoder()
                df_processed[col] = le.fit_transform(df[col])
                self.encoders[col] = le
            else:
                if col in self.encoders:
                    # Handle unseen labels by assigning a default or mode
                    le = self.encoders[col]
                    df_processed[col] = df_processed[col].apply(lambda x: x if x in le.classes_ else le.classes_[0])
                    df_processed[col] = le.transform(df_processed[col])
        
        # Select features for model
        features = ['amount', 'currency', 'location'] 
        return df_processed[features]

    def train(self, data):
        """Trains the Isolation Forest model."""
        df = pd.DataFrame(data)
        X = self.preprocess(df, training=True)
        self.model.fit(X)
        self.is_trained = True
        print("Model trained successfully.")

    def predict(self, transaction):
        """Predicts anomaly score. -1 is anomaly, 1 is normal."""
        if not self.is_trained:
            raise Exception("Model not trained yet.")
        
        df = pd.DataFrame([transaction])
        X = self.preprocess(df, training=False)
        prediction = self.model.predict(X)[0]
        score = self.model.decision_function(X)[0]
        
        return {
            "is_fraud": bool(prediction == -1),
            "anomaly_score": float(score)
        }

    def save(self, path="model.pkl"):
        joblib.dump(self, path)

    @classmethod
    def load(cls, path="model.pkl"):
        return joblib.load(path)
