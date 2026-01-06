import React from 'react';
import { Play, Square, Zap } from 'lucide-react';

export default function SimulationControls({ isRunning, onStart, onStop, onInjectFraud }) {
    return (
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg flex items-center gap-4 mb-6">
            <div className="flex-1">
                <h3 className="text-white font-semibold">Simulation Control</h3>
                <p className="text-slate-400 text-sm">Manage the synthetic transaction stream.</p>
            </div>

            <div className="flex gap-2">
                {!isRunning ? (
                    <button
                        onClick={onStart}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-all"
                    >
                        <Play className="w-4 h-4" /> Start Stream
                    </button>
                ) : (
                    <button
                        onClick={onStop}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all"
                    >
                        <Square className="w-4 h-4" /> Stop Stream
                    </button>
                )}

                <button
                    onClick={onInjectFraud}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-all"
                >
                    <Zap className="w-4 h-4" /> Inject Fraud Effect
                </button>
            </div>
        </div>
    );
}
