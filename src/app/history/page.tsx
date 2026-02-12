'use client';

import { useEffect, useState } from 'react';
import {
    Clock, CheckCircle2, AlertCircle, ChevronDown,
    History, Database, ArrowRight, Scissors, FileText,
    List, Activity, Zap, Sparkles, HardDrive, Cpu, ScanFace, Terminal
} from 'lucide-react';
import { WorkflowRunResult, WorkflowStepType } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

// --- Shared Agent Theme ---
const AGENT_MAP: Record<string, any> = {
    'clean_text': { icon: Scissors, color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
    'summarize': { icon: FileText, color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/10' },
    'extract_key_points': { icon: List, color: 'text-violet-400', border: 'border-violet-500/30', bg: 'bg-violet-500/10' },
    'analyze_sentiment': { icon: ScanFace, color: 'text-pink-400', border: 'border-pink-500/30', bg: 'bg-pink-500/10' },
    'extract_action_items': { icon: Zap, color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' },
    'rewrite_polite': { icon: Sparkles, color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10' },
};

export default function HistoryPage() {
    const [history, setHistory] = useState<WorkflowRunResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedRunId, setExpandedRunId] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/history')
            .then((res) => res.json())
            .then((data) => {
                setHistory(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch history', err);
                setLoading(false);
            });
    }, []);

    const toggleExpand = (id: string) => {
        setExpandedRunId(expandedRunId === id ? null : id);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh] bg-[#02040a]">
                <div className="relative">
                    <div className="w-12 h-12 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#02040a] text-slate-200 p-8 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
            {/* Deep Grid Background */}
            <div className="fixed inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="flex items-center justify-between mb-10 pb-6 border-b border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/10">
                            <HardDrive className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                                MAIN ARCHIVE
                                <span className="text-xs font-mono text-slate-500 px-2 py-0.5 border border-slate-800 rounded bg-slate-900">
                                    DB_CONN_ACTIVE
                                </span>
                            </h1>
                            <p className="text-sm text-slate-500 mt-1 font-mono">/var/logs/workflow_executions.json</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 text-xs font-mono text-slate-500">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            SYNCED
                        </span>
                        <span>TOTAL RECORDS: {history.length}</span>
                    </div>
                </header>

                {history.length === 0 ? (
                    <div className="text-center py-24 bg-[#0a0f18] rounded-2xl border border-slate-800 border-dashed">
                        <div className="w-20 h-20 bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-800">
                            <Database className="w-8 h-8 text-slate-600" />
                        </div>
                        <h3 className="text-slate-200 font-bold text-lg mb-2 tracking-wide">NO DATA FOUND</h3>
                        <p className="text-slate-500 text-sm font-mono">Initialize sequence to generate logs.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map((run, index) => (
                            <motion.div
                                key={run.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <div className={`group overflow-hidden transition-all duration-300 border bg-[#0a0f18] hover:bg-[#0f1522] ${expandedRunId === run.id ? 'border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'border-slate-800 hover:border-slate-700'} rounded-xl`}>
                                    <div
                                        className="p-5 flex items-center justify-between cursor-pointer"
                                        onClick={() => toggleExpand(run.id)}
                                    >
                                        <div className="flex items-center gap-6">
                                            {/* Status Icon */}
                                            <div className={`p-3 rounded-xl border ${run.status === 'success' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50' : 'bg-rose-950/30 text-rose-400 border-rose-900/50'}`}>
                                                {run.status === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                            </div>

                                            {/* Meta Data */}
                                            <div>
                                                <div className="flex items-center gap-3 mb-1.5">
                                                    <span className="text-sm font-bold text-slate-200 font-mono tracking-wide">
                                                        RID-{run.id.split('-')[0].toUpperCase()}
                                                    </span>
                                                    <span className="h-1 w-1 rounded-full bg-slate-700"></span>
                                                    <span className="text-xs text-slate-500 font-mono">
                                                        {new Date(run.timestamp).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 uppercase tracking-wider">
                                                        {run.steps.length} MODULES
                                                    </span>
                                                    <span className="text-[10px] text-slate-600 font-mono">
                                                        {run.steps.reduce((acc, s) => acc + s.durationMs, 0)}ms TOTAL
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-slate-900 border border-slate-800 text-slate-500 group-hover:text-white transition-all ${expandedRunId === run.id ? 'rotate-180 bg-indigo-500 border-indigo-400 text-white' : ''}`}>
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {expandedRunId === run.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-slate-800 bg-[#050810]"
                                            >
                                                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                    {/* Left: Input */}
                                                    <div className="space-y-3">
                                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                                                            <Terminal className="w-3 h-3" /> Source Payload
                                                        </h4>
                                                        <div className="bg-[#0a0f18] p-4 rounded-xl border border-slate-800 text-xs text-slate-400 font-mono whitespace-pre-wrap leading-relaxed shadow-inner h-full custom-scrollbar overflow-y-auto max-h-[300px]">
                                                            {run.originalInput}
                                                        </div>
                                                    </div>

                                                    {/* Right: Steps */}
                                                    <div className="space-y-4">
                                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                                                            <Activity className="w-3 h-3" /> Execution Sequence
                                                        </h4>
                                                        <div className="space-y-4 relative">
                                                            {/* Vertical Guide Line */}
                                                            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-slate-800 z-0"></div>

                                                            {run.steps.map((step, idx) => {
                                                                const meta = AGENT_MAP[step.stepType];
                                                                return (
                                                                    <div key={idx} className="relative z-10 pl-10">

                                                                        {/* Dot Indicator */}
                                                                        <div className={`absolute left-[11px] top-4 w-2 h-2 rounded-full border bg-[#050810] ${meta?.border?.replace('/30', '') || 'border-slate-600'} ${meta?.color?.replace('text-', 'bg-') || 'bg-slate-600'}`}></div>

                                                                        <div className="bg-[#0a0f18] rounded-xl border border-slate-800 p-4 hover:border-slate-700 transition-colors">
                                                                            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                                                                                <div className="flex items-center gap-2">
                                                                                    {meta && <meta.icon className={`w-3.5 h-3.5 ${meta.color}`} />}
                                                                                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">{step.stepType.replace(/_/g, ' ')}</span>
                                                                                </div>
                                                                                <span className="text-[10px] font-mono text-slate-500">{step.durationMs}ms</span>
                                                                            </div>
                                                                            <div className="text-xs text-slate-400 font-mono whitespace-pre-wrap leading-relaxed opacity-90">
                                                                                {step.output}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
