import random
import time
import uuid
from datetime import datetime
import json

COUNTRIES = ["US", "UK", "DE", "FR", "IN", "JP", "CN", "BR", "AU", "CA"]
CURRENCIES = ["USD", "GBP", "EUR", "INR", "JPY", "CNY", "BRL", "AUD", "CAD"]

class TransactionGenerator:
    def __init__(self):
        self.merchants = [f"MERCHANT_{i}" for i in range(1000)]
        self.customers = [f"CUST_{i}" for i in range(5000)]

    def generate_transaction(self, anomaly=False):
        """Generates a single transaction. If anomaly=True, injects outlier values."""
        
        transaction_id = str(uuid.uuid4())
        timestamp = datetime.now().isoformat()
        customer_id = random.choice(self.customers)
        merchant_id = random.choice(self.merchants)
        
        if anomaly:
            # Fraud patterns: High amount, random country, rapid succession (simulated by logic elsewhere)
            amount = round(random.uniform(5000, 50000), 2)
            country = random.choice(COUNTRIES)
            currency = random.choice(CURRENCIES)
            # Mismatched location/currency is a common indicator, simplified here
        else:
            # Normal patterns
            amount = round(random.uniform(10, 1000), 2)
            country = "US" if random.random() > 0.3 else random.choice(COUNTRIES)
            currency = "USD" if country == "US" else random.choice(CURRENCIES)

        return {
            "transaction_id": transaction_id,
            "timestamp": timestamp,
            "amount": amount,
            "currency": currency,
            "merchant_id": merchant_id,
            "customer_id": customer_id,
            "location": country,
            "is_anomaly_ground_truth": anomaly  # For testing/demo purposes
        }

    def generate_batch(self, size=100, fraud_ratio=0.05):
        data = []
        for _ in range(size):
            is_fraud = random.random() < fraud_ratio
            data.append(self.generate_transaction(anomaly=is_fraud))
        return data

if __name__ == "__main__":
    # Test
    gen = TransactionGenerator()
    print(json.dumps(gen.generate_batch(5), indent=2))
