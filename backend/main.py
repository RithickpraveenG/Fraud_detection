from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from generator import TransactionGenerator
from model import FraudModel
import pandas as pd
import asyncio
import collections

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# State
gen = TransactionGenerator()
model = FraudModel()
recent_transactions = collections.deque(maxlen=100)
stats = {"total": 0, "fraud": 0}

# Initial Training with some dummy data
print("Pre-training model...")
initial_data = gen.generate_batch(size=500, fraud_ratio=0.05)
model.train(initial_data)

@app.get("/transactions")
async def get_transactions():
    return list(recent_transactions)

@app.get("/metrics")
async def get_metrics():
    return stats

@app.post("/simulate")
async def simulate_transaction(count: int = 1, anomaly: bool = False):
    txs = []
    for _ in range(count):
        tx = gen.generate_transaction(anomaly=anomaly)
        
        # Predict
        result = model.predict(tx)
        tx.update(result)
        
        # Update stats
        stats["total"] += 1
        if result["is_fraud"]:
            stats["fraud"] += 1
            
        recent_transactions.appendleft(tx)
        txs.append(tx)
        
    return {"message": f"Generated {count} transactions", "transactions": txs}

# Background simulation runner (optional, for auto-pilot demo)
running = False

async def generator_loop():
    global running
    while running:
        await simulate_transaction(count=1, anomaly=False)
        await asyncio.sleep(2)  # 1 tx every 2 seconds

@app.post("/control/start")
async def start_sim(background_tasks: BackgroundTasks):
    global running
    if not running:
        running = True
        background_tasks.add_task(generator_loop)
    return {"status": "started"}

@app.post("/control/stop")
async def stop_sim():
    global running
    running = False
    return {"status": "stopped"}

@app.get("/")
def read_root():
    return {"status": "Fraud Detection API Running"}
