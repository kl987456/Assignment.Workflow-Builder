'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { WorkflowRunResult } from '@/lib/types';
import { Clock, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

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
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Run History</h1>
                <span className="text-sm text-slate-400">{history.length} runs recorded</span>
            </div>

            {history.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                    <Clock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-white font-medium">No history yet</h3>
                    <p className="text-slate-400 text-sm mt-1">Run a workflow to see it here.</p>
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
                            <Card className="overflow-hidden transition-all hover:bg-white/[0.02] border-white/10 bg-slate-900/40 backdrop-blur-sm">
                                <div
                                    className="p-4 flex items-center justify-between cursor-pointer"
                                    onClick={() => toggleExpand(run.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-full ${run.status === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                            {run.status === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-semibold text-slate-200">
                                                    {new Date(run.timestamp).toLocaleString(undefined, {
                                                        dateStyle: 'medium',
                                                        timeStyle: 'short',
                                                    })}
                                                </span>
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
                                                    {run.steps.length} steps
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500 truncate max-w-md mt-1">
                                                Input: {run.originalInput.substring(0, 50)}...
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-slate-500 hover:text-white hover:bg-white/10">
                                        {expandedRunId === run.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                    </Button>
                                </div>

                                <AnimatePresence>
                                    {expandedRunId === run.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="bg-black/20 border-t border-white/5 p-6 space-y-6">
                                                <div className="space-y-2">
                                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Original Input</h4>
                                                    <div className="bg-slate-950 p-4 rounded-xl border border-white/5 text-sm text-slate-300 whitespace-pre-wrap font-sans">
                                                        {run.originalInput}
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Execution Steps</h4>
                                                    {run.steps.map((step, idx) => (
                                                        <div key={idx} className="bg-slate-900/50 rounded-lg border border-white/5 overflow-hidden">
                                                            <div className="bg-white/[0.03] px-4 py-2 border-b border-white/5 flex justify-between items-center">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                                                    <span className="font-medium text-sm text-slate-200 capitalize">{step.stepType.replace(/_/g, ' ')}</span>
                                                                </div>
                                                                <span className="text-xs text-slate-500 font-mono">{step.durationMs}ms</span>
                                                            </div>
                                                            <div className="p-4 text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                                                                {step.output}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
