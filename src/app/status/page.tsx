'use client';

import { useEffect, useState } from 'react';
import { Activity, Database, Server, Cpu, ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

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
            <div className="flex items-center justify-center min-h-screen bg-[#02040a]">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-900/30 border-t-indigo-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-indigo-500 animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#02040a] flex items-center justify-center p-4 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
            {/* Deep Space Grid */}
            <div className="fixed inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-lg bg-[#0a0f18] border border-slate-800 rounded-2xl relative overflow-hidden z-10 shadow-2xl shadow-black/50"
            >
                {/* Header Glow */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500"></div>

                <div className="px-8 py-8 border-b border-slate-800 bg-[#0d121e]">
                    <div className="flex items-center justify-between mb-2">
                        <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                            System v3.0
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${status?.backend === 'healthy' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                            <span className="text-xs font-mono text-slate-500 font-bold">LIVE</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Activity className="w-6 h-6 text-indigo-500" />
                        DIAGNOSTICS
                    </h1>
                    <p className="text-xs text-slate-500 font-mono mt-2 tracking-wide">
                        ID: {status?.timestamp ? Buffer.from(status.timestamp).toString('base64').substring(0, 12) : '---'}
                    </p>
                </div>

                <div className="p-6 space-y-4 bg-[#0a0f18]">
                    <StatusItem
                        label="NEURAL API GATEWAY"
                        status={status?.backend}
                        icon={Server}
                        description="Core routing & load balancing"
                    />
                    <StatusItem
                        label="PERSISTENT STORAGE"
                        status={status?.database}
                        icon={Database}
                        description="Encrypted local JSON shard"
                    />
                    <StatusItem
                        label="LLM INFERENCE ENGINE"
                        status={status?.llm}
                        icon={Cpu}
                        description="HuggingFace / Gemini Interface"
                    />
                </div>

                <div className="px-6 py-4 bg-[#050810] border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-600">
                    <span>UPTIME: 99.9%</span>
                    <span>LAST SCAN: {new Date().toLocaleTimeString()}</span>
                </div>
            </motion.div>
        </div>
    );
}

function StatusItem({ label, status, icon: Icon, description }: { label: string; status?: string; icon: any; description: string }) {
    let borderColor = 'border-slate-800';
    let bgColor = 'bg-[#0f1522]';
    let iconColor = 'text-slate-600';
    let StatusIcon = AlertOctagon;
    let statusText = status || 'Unknown';
    let indicatorColor = 'text-slate-600';
    let glow = '';

    if (status === 'healthy' || status === 'connected' || status?.startsWith('configured')) {
        borderColor = 'border-emerald-900/50';
        bgColor = 'bg-[#051010]';
        iconColor = 'text-emerald-500';
        StatusIcon = CheckCircle2;
        indicatorColor = 'text-emerald-500';
        glow = 'shadow-[0_0_15px_rgba(16,185,129,0.1)]';
    } else if (status === 'missing_key_mock_mode' || status === 'init_required') {
        borderColor = 'border-amber-900/50';
        bgColor = 'bg-[#120f05]';
        iconColor = 'text-amber-500';
        StatusIcon = AlertTriangle;
        indicatorColor = 'text-amber-500';
        glow = 'shadow-[0_0_15px_rgba(245,158,11,0.1)]';
    } else if (status === 'error') {
        borderColor = 'border-rose-900/50';
        bgColor = 'bg-[#120505]';
        iconColor = 'text-rose-500';
        StatusIcon = AlertOctagon;
        indicatorColor = 'text-rose-500';
        glow = 'shadow-[0_0_15px_rgba(243,72,72,0.1)]';
    }

    return (
        <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${borderColor} ${bgColor} ${glow} group hover:border-opacity-100`}>
            <div className={`p-3 rounded-lg bg-black/40 border border-white/5 ${iconColor} shadow-inner`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-grow">
                <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-200 tracking-wider">{label}</span>
                    <StatusIcon className={`w-4 h-4 ${indicatorColor}`} />
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-[10px] text-slate-500 font-mono uppercase">{description}</p>
                    <p className={`text-[10px] font-bold uppercase ${indicatorColor}`}>
                        {statusText.replace(/_/g, ' ').replace('configured', 'Active')}
                    </p>
                </div>
            </div>
        </div>
    );
}
