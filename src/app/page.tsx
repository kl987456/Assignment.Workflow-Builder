'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';
import { WorkflowStep, WorkflowStepType, WorkflowRunResult } from '@/lib/types';
import {
  Trash2, Plus, Loader2, FileText, Activity, Scissors,
  List, Play, Layers, Terminal, Sparkles, CheckCircle2,
  ArrowRight, Command, Cpu, Zap, ScanFace
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- High-End Professional Agent Definitions ---
interface AgentDefinition {
  type: WorkflowStepType;
  label: string;
  role: string;
  icon: any;
  gradient: string;
  shadow: string;
  textColor: string;
}

const AGENTS: AgentDefinition[] = [
  {
    type: 'clean_text',
    label: 'Data Sanitizer',
    role: 'Preprocessing',
    icon: Scissors,
    gradient: 'from-emerald-900/50 to-emerald-900/10',
    shadow: 'shadow-emerald-900/20',
    textColor: 'text-emerald-400'
  },
  {
    type: 'summarize',
    label: 'Executive Briefer',
    role: 'Synthesis',
    icon: FileText,
    gradient: 'from-blue-900/50 to-blue-900/10',
    shadow: 'shadow-blue-900/20',
    textColor: 'text-blue-400'
  },
  {
    type: 'extract_key_points',
    label: 'Strategic Analyst',
    role: 'Intelligence',
    icon: List,
    gradient: 'from-violet-900/50 to-violet-900/10',
    shadow: 'shadow-violet-900/20',
    textColor: 'text-violet-400'
  },
  {
    type: 'analyze_sentiment',
    label: 'Empathy Engine',
    role: 'Psychology',
    icon: ScanFace,
    gradient: 'from-pink-900/50 to-pink-900/10',
    shadow: 'shadow-pink-900/20',
    textColor: 'text-pink-400'
  },
  {
    type: 'extract_action_items',
    label: 'Ops Manager',
    role: 'Task Extraction',
    icon: Zap,
    gradient: 'from-amber-900/50 to-amber-900/10',
    shadow: 'shadow-amber-900/20',
    textColor: 'text-amber-400'
  },
  {
    type: 'rewrite_polite',
    label: 'Comms Director',
    role: 'Polisher',
    icon: Sparkles,
    gradient: 'from-cyan-900/50 to-cyan-900/10',
    shadow: 'shadow-cyan-900/20',
    textColor: 'text-cyan-400'
  },
];

// Fix for icon type issue in AGENTS array - simplified
// Re-mapping icons correctly
const AGENT_MAP: Record<string, any> = {
  'clean_text': { icon: Scissors, color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
  'summarize': { icon: FileText, color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/10' },
  'extract_key_points': { icon: List, color: 'text-violet-400', border: 'border-violet-500/30', bg: 'bg-violet-500/10' },
  'analyze_sentiment': { icon: ScanFace, color: 'text-pink-400', border: 'border-pink-500/30', bg: 'bg-pink-500/10' },
  'extract_action_items': { icon: Zap, color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' },
  'rewrite_polite': { icon: Sparkles, color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10' },
};

export default function WorkflowBuilder() {
  const [inputText, setInputText] = useState('Google Deepmind is a team of scientists, engineers, and ethicists committed to solving intelligence to advance science and benefit humanity.\n\n    We combine the best techniques from machine learning and systems neuroscience to build powerful general-purpose learning algorithms.');
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<WorkflowRunResult | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [result]);

  const addStep = (type: WorkflowStepType) => {
    setSteps([...steps, { id: crypto.randomUUID(), type }]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter((s) => s.id !== id));
  };

  const runWorkflow = async () => {
    if (steps.length === 0) return;
    setIsRunning(true);
    setResult(null);

    try {
      const response = await fetch('/api/workflow/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputText, steps }),
      });

      if (!response.ok) throw new Error('Failed to run workflow');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">

      {/* Deep Space Background Effects */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 py-6 h-screen flex flex-col">

        {/* Header - Compact & Technical */}
        <header className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-md opacity-20 animate-pulse"></div>
              <div className="relative w-10 h-10 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center">
                <Cpu className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                CORTEX <span className="text-indigo-500">PRIME</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">V3.0</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium tracking-wide">AI AGENT ORCHESTRATION TERMINAL</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 text-xs font-mono text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                <span>SYSTEM ONLINE</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-3 h-3 text-slate-600" />
                <span>LATENCY: 12ms</span>
              </div>
            </div>
            <Button variant="outline" className="border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-xs h-9">
              DOCS
            </Button>
          </div>
        </header>

        {/* Main Workspace - 3 Column Layout */}
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">

          {/* COL 1: Input & Context (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="bg-[#0a0f18] border border-slate-800 rounded-2xl flex flex-col h-full shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

              <div className="px-4 py-3 border-b border-slate-800 bg-[#0d121e] flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  INPUT SOURCE
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700/50 font-mono">TEXT_STREAM</span>
              </div>

              <div className="flex-grow p-1">
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="// Enter raw data stream for processing..."
                  className="w-full h-full min-h-[200px] bg-transparent border-none resize-none text-sm font-mono text-slate-300 placeholder:text-slate-700 p-4 focus:ring-0 leading-relaxed custom-scrollbar"
                />
              </div>

              <div className="px-4 py-2 border-t border-slate-800 bg-[#0d121e] flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <span>CHARS: {inputText.length}</span>
                <span>UTF-8</span>
              </div>
            </div>
          </div>

          {/* COL 2: Pipeline Visualization (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="bg-[#0a0f18] border border-slate-800 rounded-2xl flex flex-col h-full shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]"></div>

              {/* Toolbar */}
              <div className="px-5 py-3 border-b border-slate-800 bg-[#0d121e] flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <Layers className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-bold text-slate-200 tracking-wide">NEURAL PIPELINE</span>
                  <span className="bg-slate-800 text-slate-500 text-[10px] font-mono px-2 py-0.5 rounded-full">{steps.length} NODES</span>
                </div>

                <Button
                  size="sm"
                  onClick={runWorkflow}
                  disabled={steps.length === 0 || isRunning || !inputText}
                  className={`
                            h-8 text-xs font-bold tracking-wide transition-all shadow-lg
                            ${isRunning
                      ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/20 border border-indigo-500/50 hover:shadow-indigo-500/20'
                    }
                        `}
                >
                  {isRunning ? (
                    <><Loader2 className="w-3 h-3 animate-spin mr-2" /> PROCESSING</>
                  ) : (
                    <><Play className="w-3 h-3 mr-2 fill-current" /> EXECUTE</>
                  )}
                </Button>
              </div>

              {/* Flow Canvas */}
              <div className="flex-grow p-6 overflow-y-auto relative z-10 custom-scrollbar">
                {steps.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600">
                    <div className="w-20 h-20 border border-slate-800 rounded-2xl flex items-center justify-center mb-4 bg-slate-900/50">
                      <Command className="w-8 h-8 opacity-20" />
                    </div>
                    <p className="text-sm font-medium">Pipeline Empty</p>
                    <p className="text-xs opacity-50 mt-1">Select agents from the right panel to build logic.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Central Line */}
                    <div className="absolute left-[34px] top-6 bottom-6 w-px bg-slate-800 z-0"></div>

                    <AnimatePresence mode="popLayout">
                      {steps.map((step, index) => {
                        const meta = AGENT_MAP[step.type];
                        return (
                          <motion.div
                            key={step.id}
                            layout
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative z-10 flex items-center gap-4 group"
                          >
                            {/* Step Indicator */}
                            <div className="w-7 h-7 rounded-lg bg-[#0a0f18] border border-slate-700 flex items-center justify-center text-[10px] font-mono text-slate-400 font-bold shadow-sm z-10">
                              {index + 1}
                            </div>

                            {/* Node Card */}
                            <div className={`flex-grow bg-[#0f1522] border border-slate-800 hover:border-slate-600 rounded-xl p-3 flex items-center justify-between transition-all group-hover:bg-[#131b2c] ${meta.border} border-l-2`}>
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${meta.bg} ${meta.color}`}>
                                  <meta.icon className="w-4 h-4" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-slate-200">{AGENTS.find(a => a.type === step.type)?.label}</h4>
                                  <p className="text-[10px] text-slate-500 font-mono tracking-wide uppercase">{AGENTS.find(a => a.type === step.type)?.role}</p>
                                </div>
                              </div>

                              <button
                                onClick={() => removeStep(step.id)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-950/20 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Output Terminal - Fixed at Bottom of Column 2 */}
              <AnimatePresence>
                {result && result.steps.length > 0 && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    className="border-t border-slate-800 bg-[#0a0f18] max-h-[40%] flex flex-col"
                  >
                    <div className="px-4 py-2 bg-[#0d121e] border-b border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3" /> SUCCESS
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{result.durationMs}ms</span>
                    </div>
                    <div className="p-4 overflow-y-auto font-mono text-xs text-slate-300 space-y-4 custom-scrollbar bg-black/20" ref={scrollRef}>
                      {result.steps.map((step, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className={`text-[10px] font-bold uppercase ${AGENT_MAP[step.stepType].color}`}>
                            &gt; {AGENTS.find(a => a.type === step.stepType)?.label}
                          </div>
                          <div className="pl-2 border-l border-slate-800 whitespace-pre-wrap leading-relaxed opacity-90">
                            {step.output}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* COL 3: Agent Library (3 cols) */}
          <div className="lg:col-span-3 flex flex-col h-full">
            <div className="bg-[#0a0f18] border border-slate-800 rounded-2xl flex flex-col h-full shadow-2xl p-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5" /> Available Modules
              </h3>

              <div className="grid grid-cols-1 gap-3 overflow-y-auto custom-scrollbar flex-grow">
                {AGENTS.map((agent) => {
                  const meta = AGENT_MAP[agent.type];
                  return (
                    <button
                      key={agent.type}
                      onClick={() => addStep(agent.type)}
                      className="group relative overflow-hidden rounded-xl border border-slate-800 bg-[#0f1522] p-3 text-left transition-all hover:border-slate-600 hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <div className={`absolute top-0 left-0 w-1 h-full ${meta.bg.replace('/10', '/50')}`}></div>
                      <div className="flex items-start gap-3 pl-2">
                        <div className={`p-2 rounded-lg ${meta.bg} ${meta.color} group-hover:scale-110 transition-transform`}>
                          <meta.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-bold text-slate-200 group-hover:text-white">{agent.label}</span>
                            <Plus className="w-3 h-3 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <p className="text-[10px] text-slate-500 leading-tight">{agent.role}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 text-center">
                <p className="text-[10px] text-slate-600 font-mono">
                  Drag & drop support coming in v3.1
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
