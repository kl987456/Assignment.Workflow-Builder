'use client';

import { useEffect, useState } from 'react';

type HealthStatus = {
    backend: string;
    database: string;
    llm: string;
    timestamp: string;
};

export default function StatusPage() {
    const [status, setStatus] = useState<HealthStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/health')
            .then((res) => res.json())
            .then((data) => {
                setStatus(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch status', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-4 w-32 bg-white/10 rounded"></div>
                    <div className="h-4 w-48 bg-white/10 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                {/* Decorative Grid */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none"></div>

                <h1 className="text-2xl font-bold mb-8 text-white text-center">System Health</h1>

                <div className="space-y-4 relative z-10">
                    <StatusItem label="Backend Services" status={status?.backend} />
                    <StatusItem label="Data Storage" status={status?.database} />
                    <StatusItem label="AI Engine" status={status?.llm} />
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 text-xs text-center text-slate-500">
                    Last diagnostic: {status?.timestamp ? new Date(status.timestamp).toLocaleString() : 'Never'}
                </div>

                <div className="mt-6 text-center">
                    <a href="/" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium hover:underline transition-colors">
                        &larr; Return to Builder
                    </a>
                </div>
            </div>
        </div>
    );
}

function StatusItem({ label, status }: { label: string; status?: string }) {
    let colorClass = 'bg-slate-800 text-slate-500 border-slate-700';
    let icon = '•';
    let statusText = status || 'Unknown';

    if (status === 'healthy' || status === 'connected' || status?.startsWith('configured')) {
        colorClass = 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.1)]';
        icon = '✔';
    } else if (status === 'missing_key_mock_mode' || status === 'init_required') {
        colorClass = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        icon = '⚠';
    } else if (status === 'error') {
        colorClass = 'bg-red-500/10 text-red-400 border-red-500/20';
        icon = '✖';
    }

    return (
        <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all bg-white/[0.02] hover:bg-white/[0.05]">
            <span className="font-medium text-slate-300">{label}</span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide border ${colorClass}`}>
                <span>{icon}</span>
                <span className="capitalize">{statusText.replace('_', ' ').replace('configured', 'Active:')}</span>
            </span>
        </div>
    );
}
