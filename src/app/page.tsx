'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/input';
import { WorkflowStep, WorkflowStepType, WorkflowRunResult } from '@/lib/types';
import { Trash2, Play, Plus, Loader2, FileText, Sparkles, Scissors, List, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STEP_TYPES: { type: WorkflowStepType; label: string; icon: any; description: string; color: string }[] = [
  { type: 'clean_text', label: 'Clean Text', icon: Scissors, description: 'Remove extra whitespace', color: 'text-cyan-400' },
  { type: 'summarize', label: 'Summarize', icon: FileText, description: 'Generate a concise summary', color: 'text-purple-400' },
  { type: 'extract_key_points', label: 'Key Points', icon: List, description: 'Extract main bullet points', color: 'text-amber-400' },
  { type: 'analyze_sentiment', label: 'Sentiment', icon: Sparkles, description: 'Analyze tone and sentiment', color: 'text-pink-400' },
];

export default function WorkflowBuilder() {
  const [inputText, setInputText] = useState('Google Deepmind is a team of scientists, engineers, and ethicists committed to solving intelligence to advance science and benefit humanity.\n\n    We combine the best techniques from machine learning and systems neuroscience to build powerful general-purpose learning algorithms.');
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<WorkflowRunResult | null>(null);

  const addStep = (type: WorkflowStepType) => {
    const newStep: WorkflowStep = {
      id: crypto.randomUUID(),
      type,
    };
    setSteps([...steps, newStep]);
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputText,
          steps,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to run workflow');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Builder */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-5 space-y-8"
      >

        {/* Input Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <span className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 w-8 h-8 rounded-full flex items-center justify-center text-sm ring-2 ring-indigo-900/50">1</span>
            Input Text
          </h2>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your text here..."
              className="relative min-h-[160px] bg-slate-900/80 border-white/10 text-slate-200 placeholder:text-slate-600 focus:ring-indigo-500/50 focus:border-indigo-500/50 resize-y rounded-xl text-base leading-relaxed"
            />
          </div>
        </section>

        {/* Steps Section */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <span className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 w-8 h-8 rounded-full flex items-center justify-center text-sm ring-2 ring-indigo-900/50">2</span>
            Define Workflow
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {STEP_TYPES.map((stepType) => (
              <motion.button
                key={stepType.type}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => addStep(stepType.type)}
                className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:border-indigo-500/50 transition-colors group text-left"
              >
                <div className={`p-2 rounded-lg bg-slate-900 ${stepType.color}`}>
                  <stepType.icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{stepType.label}</span>
                  <span className="block text-[10px] text-slate-500">Add step</span>
                </div>
                <Plus className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" />
              </motion.button>
            ))}
          </div>

          <div className="space-y-3 mt-4 min-h-[100px]">
            {steps.length === 0 ? (
              <div className="border-2 border-dashed border-white/5 bg-white/[0.02] rounded-2xl p-8 text-center flex flex-col items-center justify-center">
                <Sparkles className="w-8 h-8 text-slate-700 mb-3" />
                <p className="text-sm text-slate-500">No steps added yet.</p>
                <p className="text-xs text-slate-600 mt-1">Select from the tools above.</p>
              </div>
            ) : (
              <div className="relative pl-6 border-l border-white/10 ml-4 space-y-4">
                <AnimatePresence mode='popLayout'>
                  {steps.map((step, index) => {
                    const stepDef = STEP_TYPES.find(t => t.type === step.type);
                    const StepIcon = stepDef?.icon || Sparkles;
                    return (
                      <motion.div
                        key={step.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative group"
                      >
                        <div className="absolute -left-[31px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-900 border-2 border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] z-10"></div>
                        <Card className="bg-slate-900/50 border-white/10 backdrop-blur-md overflow-hidden group-hover:border-indigo-500/30 transition-colors">
                          <div className="p-3 pl-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <StepIcon className={`w-5 h-5 ${stepDef?.color}`} />
                              <span className="font-medium text-slate-200">{stepDef?.label}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeStep(step.id)}
                              className="h-8 w-8 p-0 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-full"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </section>

        {/* Run Button */}
        <Button
          size="lg"
          className="w-full relative overflow-hidden bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-wide py-6 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all group"
          onClick={runWorkflow}
          disabled={steps.length === 0 || isRunning || !inputText}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <div className="relative flex items-center justify-center gap-2">
            {isRunning ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 fill-current" />
                <span>Run Workflow</span>
              </>
            )}
          </div>
        </Button>
      </motion.div>

      {/* Right Column: Results */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="lg:col-span-7"
      >
        <section className="h-full flex flex-col space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <span className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 w-8 h-8 rounded-full flex items-center justify-center text-sm ring-2 ring-indigo-900/50">3</span>
            Results
          </h2>

          <div className="flex-1 bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-3xl p-6 min-h-[500px] relative overflow-hidden">
            {!result && !isRunning ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <Play className="w-10 h-10 text-white/20 ml-1" />
                </div>
                <h3 className="text-white font-medium text-lg mb-2">Ready to Launch</h3>
                <p className="max-w-xs text-center text-sm">Design your workflow on the left and ignite the engine.</p>
              </div>
            ) : isRunning ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-4 border-t-4 border-purple-500 rounded-full animate-spin reverse-spin"></div>
                  <div className="absolute inset-8 border-t-4 border-cyan-500 rounded-full animate-spin"></div>
                </div>
                <p className="mt-8 text-indigo-300 font-medium tracking-widest animate-pulse uppercase text-xs">Processing Intelligence</p>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in duration-700">
                {result?.steps.map((stepResult, index) => {
                  const stepDef = STEP_TYPES.find(t => t.type === stepResult.stepType);
                  const StepIcon = stepDef?.icon || Sparkles;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative group"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 p-2 rounded-lg bg-slate-800 border border-white/10 ${stepDef?.color} shadow-lg shrink-0`}>
                          <StepIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">{stepDef?.label}</h3>
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono text-slate-500">{stepResult.durationMs}ms</span>
                              <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${stepResult.status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {stepResult.status}
                              </span>
                            </div>
                          </div>

                          <div className="bg-black/40 rounded-xl border border-white/5 p-4 text-slate-300 text-sm leading-relaxed font-sans shadow-inner selection:bg-indigo-500/30 selection:text-white">
                            <pre className="whitespace-pre-wrap font-sans">{stepResult.output}</pre>
                          </div>
                        </div>
                      </div>

                      {index < (result.steps.length - 1) && (
                        <div className="absolute left-[19px] top-12 bottom-[-20px] w-0.5 bg-gradient-to-b from-indigo-500/50 to-transparent"></div>
                      )}
                    </motion.div>
                  );
                })}

                <div className="pt-6 border-t border-white/5 flex justify-between items-center text-xs text-slate-500">
                  <span>Run ID: <span className="font-mono text-slate-400">{result?.id.split('-')[0]}...</span></span>
                  <span>{new Date(result!.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            )}
          </div>
        </section>
      </motion.div>
    </div>
  );
}
