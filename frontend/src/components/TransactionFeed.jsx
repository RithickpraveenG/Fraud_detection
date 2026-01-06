import React from 'react';
import { AlertOctagon, Check } from 'lucide-react';

export default function TransactionFeed({ transactions }) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                <h2 className="text-lg font-semibold text-white">Live Transaction Stream</h2>
            </div>
            <div className="overflow-y-auto flex-1 p-0">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-950 sticky top-0 z-10 text-xs uppercase text-slate-400 font-semibold">
                        <tr>
                            <th className="p-4">Status</th>
                            <th className="p-4">ID</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Location</th>
                            <th className="p-4">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {transactions.map((tx) => (
                            <tr
                                key={tx.transaction_id}
                                className={`transition-colors hover:bg-slate-800/30 ${tx.is_fraud ? 'bg-red-900/10' : ''}`}
                            >
                                <td className="p-4">
                                    {tx.is_fraud ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                            <AlertOctagon className="w-3 h-3 mr-1" /> FRAUD
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                            <Check className="w-3 h-3 mr-1" /> LEGIT
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 font-mono text-xs text-slate-500 truncate max-w-[100px]">{tx.transaction_id.split('-')[0]}...</td>
                                <td className={`p-4 font-bold ${tx.is_fraud ? 'text-red-400' : 'text-slate-200'}`}>
                                    {tx.currency} {tx.amount.toLocaleString()}
                                </td>
                                <td className="p-4 text-slate-300 flex items-center gap-2">
                                    <span className="text-lg">{getFlagEmoji(tx.location)}</span> {tx.location}
                                </td>
                                <td className="p-4 text-slate-400 text-sm">
                                    {new Date(tx.timestamp).toLocaleTimeString()}
                                </td>
                            </tr>
                        ))}
                        {transactions.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-slate-500">
                                    Waiting for transactions...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Simple country code to flag helper
function getFlagEmoji(countryCode) {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}
