import React, { useState, useEffect, useCallback } from 'react';
import StatsCards from './components/StatsCards';
import TransactionFeed from './components/TransactionFeed';
import SimulationControls from './components/SimulationControls';
import { ShieldCheck } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000';

function App() {
    const [stats, setStats] = useState({ total: 0, fraud: 0 });
    const [transactions, setTransactions] = useState([]);
    const [isRunning, setIsRunning] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const [statsRes, txRes] = await Promise.all([
                fetch(`${API_BASE}/metrics`),
                fetch(`${API_BASE}/transactions`)
            ]);

            const statsData = await statsRes.json();
            const txData = await txRes.json();

            setStats(statsData);
            setTransactions(txData);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    }, []);

    // Poll data every second
    useEffect(() => {
        const interval = setInterval(fetchData, 1000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const handleStart = async () => {
        try {
            await fetch(`${API_BASE}/control/start`, { method: 'POST' });
            setIsRunning(true);
        } catch (err) {
            console.error(err);
        }
    };

    const handleStop = async () => {
        try {
            await fetch(`${API_BASE}/control/stop`, { method: 'POST' });
            setIsRunning(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleInjectFraud = async () => {
        try {
            await fetch(`${API_BASE}/simulate?count=1&anomaly=true`, { method: 'POST' });
            fetchData(); // Immediate refresh
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 p-6 md:p-12 font-sans text-slate-50">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/20">
                            <ShieldCheck className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-white">FraudGuard AI</h1>
                            <p className="text-slate-400">Real-time Financial Anomaly Detection</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-medium animate-pulse">
                            ● System Operational
                        </div>
                    </div>
                </header>

                <StatsCards stats={stats} />

                <SimulationControls
                    isRunning={isRunning}
                    onStart={handleStart}
                    onStop={handleStop}
                    onInjectFraud={handleInjectFraud}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <TransactionFeed transactions={transactions} />
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Live Threat Analysis</h3>
                        <div className="h-64 flex items-center justify-center text-slate-500 border border-dashed border-slate-700 rounded-lg bg-slate-950/50">
                            <p className="text-sm">Real-time Visualization Placeholder</p>
                        </div>
                        <div className="mt-6 space-y-4">
                            <div className="bg-slate-800/50 p-4 rounded-lg">
                                <h4 className="text-sm font-medium text-slate-300">Model Status</h4>
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                    <span className="text-xs text-slate-400">Isolation Forest Active</span>
                                </div>
                                <div className="mt-1 flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                    <span className="text-xs text-slate-400">Latency: ~45ms</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
