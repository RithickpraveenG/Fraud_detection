import React from 'react';
import { Activity, AlertTriangle, CheckCircle, DollarSign } from 'lucide-react';

const Card = ({ title, value, icon: Icon, color }) => (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</p>
                <h3 className="text-2xl font-bold mt-2 text-white">{value}</h3>
            </div>
            <div className={`p-3 rounded-full bg-opacity-10 ${color}`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
        </div>
    </div>
);

export default function StatsCards({ stats }) {
    const fraudRate = stats.total > 0 ? ((stats.fraud / stats.total) * 100).toFixed(2) : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card
                title="Total Transactions"
                value={stats.total}
                icon={Activity}
                color="bg-blue-500 text-blue-500"
            />
            <Card
                title="Fraud Detected"
                value={stats.fraud}
                icon={AlertTriangle}
                color="bg-red-500 text-red-500"
            />
            <Card
                title="Legit Transactions"
                value={stats.total - stats.fraud}
                icon={CheckCircle}
                color="bg-green-500 text-green-500"
            />
            <Card
                title="Fraud Rate"
                value={`${fraudRate}%`}
                icon={DollarSign}
                color="bg-yellow-500 text-yellow-500"
            />
        </div>
    );
}
