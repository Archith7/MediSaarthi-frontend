import React, { useState, useEffect } from 'react';
import { 
  FileText, Brain, BarChart3, Shield, Zap, Users, 
  CheckCircle2, ArrowRight, Star, Sparkles, Activity,
  Upload, MessageSquare, Database, Globe, Lock, Clock,
  Scan, FileSearch, PieChart, TrendingUp, Loader2
} from 'lucide-react';

export default function LandingPage({ onLogin, onRegister }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                MediSaarthi
              </span>
              <p className="text-xs text-slate-400 -mt-1">Bridging Medical Gaps</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-slate-300 hover:text-white transition-colors">How It Works</a>
            <a href="#demo" className="text-slate-300 hover:text-white transition-colors">Live Demo</a>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={onLogin}
              className="px-5 py-2.5 text-slate-300 hover:text-white transition-colors font-medium"
            >
              Sign In
            </button>
            <button 
              onClick={onRegister}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Lab Report Analysis
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Transform Lab Reports Into{' '}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-purple-400 bg-clip-text text-transparent">
                  Actionable Insights
                </span>
              </h1>
              
              <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0">
                Upload lab report images, extract data instantly with OCR, and query patient results using natural language. 
                Built for healthcare professionals who demand accuracy and speed.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={onRegister}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <a href="#demo" className="px-8 py-4 bg-white/5 border border-slate-600 text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-all text-center">
                  See Live Demo
                </a>
              </div>
              
              <div className="mt-10 flex items-center gap-8 justify-center lg:justify-start">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-400">No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-400">HIPAA Compliant</span>
                </div>
              </div>
            </div>
            
            {/* Hero Visual */}
            <div className="flex-1 relative">
              <div className="relative z-10">
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6 shadow-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                      <MessageSquare className="w-4 h-4" />
                      Natural Language Query
                    </div>
                    <p className="text-white">"Show me all patients with high cholesterol levels"</p>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-400" />
                      <span className="text-blue-300">Found 12 patients matching criteria</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Total LDL', value: '185 mg/dL', status: 'high' },
                        { label: 'HDL', value: '42 mg/dL', status: 'low' },
                        { label: 'Triglycerides', value: '220 mg/dL', status: 'high' }
                      ].map((item, i) => (
                        <div key={i} className="bg-slate-800 rounded-lg p-3">
                          <div className="text-slate-400 text-xs mb-1">{item.label}</div>
                          <div className={`font-bold ${item.status === 'high' ? 'text-red-400' : item.status === 'low' ? 'text-yellow-400' : 'text-white'}`}>
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Background effects */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 border-y border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '99.5%', label: 'OCR Accuracy' },
              { value: '< 3s', label: 'Processing Time' },
              { value: '500+', label: 'Lab Tests Supported' },
              { value: '10K+', label: 'Reports Processed' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powerful Features for{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Healthcare Professionals
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Everything you need to manage, analyze, and query lab reports efficiently
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: 'Smart OCR Extraction',
                description: 'Upload lab report images and extract all data automatically using advanced OCR powered by PaddleOCR technology.',
                color: 'emerald'
              },
              {
                icon: Brain,
                title: 'AI-Powered Parsing',
                description: 'Our AI understands lab reports contextually, correctly identifying test names, values, units, and reference ranges.',
                color: 'teal'
              },
              {
                icon: MessageSquare,
                title: 'Natural Language Queries',
                description: 'Ask questions in plain English like "Show patients with low hemoglobin" and get instant results.',
                color: 'cyan'
              },
              {
                icon: BarChart3,
                title: 'Visual Analytics',
                description: 'Beautiful charts and visualizations help you understand trends and patterns across patient data.',
                color: 'blue'
              },
              {
                icon: Database,
                title: 'Secure Data Storage',
                description: 'All patient data is securely stored with encryption and access controls. HIPAA compliant infrastructure.',
                color: 'purple'
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Process reports in seconds, not minutes. Optimized for speed without compromising accuracy.',
                color: 'amber'
              }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="group bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 rounded-2xl p-6 transition-all hover:shadow-xl hover:shadow-slate-900/50"
              >
                <div className={`w-14 h-14 bg-${feature.color}-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}-400`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-400">
              From image to insights in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: Upload,
                title: 'Upload Report',
                description: 'Drag and drop or click to upload your lab report image. We support PNG, JPEG, PDF and more.'
              },
              {
                step: '02',
                icon: Brain,
                title: 'AI Processing',
                description: 'Our AI extracts and validates all data - patient info, test results, reference ranges, and abnormal flags.'
              },
              {
                step: '03',
                icon: MessageSquare,
                title: 'Query & Analyze',
                description: 'Ask questions, view trends, compare results, and generate insights using natural language.'
              }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-8xl font-bold text-slate-800 absolute -top-8 -left-4 select-none">{item.step}</div>
                <div className="relative bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 p-8 pt-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="demo" className="py-24 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              See The Magic{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                In Action
              </span>
            </h2>
            <p className="text-xl text-slate-400">
              Watch how MediSaarthi transforms lab reports in real-time
            </p>
          </div>
          
          {/* Animated Process Demo */}
          <ProcessDemo />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Trusted by Healthcare Professionals
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "MediSaarthi has reduced our data entry time by 80%. The OCR accuracy is remarkable.",
                author: "Dr. Priya Sharma",
                role: "Chief Pathologist, Apollo Hospital"
              },
              {
                quote: "The natural language queries are a game-changer. I can find patient trends in seconds.",
                author: "Dr. Rajesh Kumar",
                role: "Family Medicine, Max Healthcare"
              },
              {
                quote: "Finally, a solution that understands the complexity of Indian lab reports. Highly recommended.",
                author: "Dr. Ananya Patel",
                role: "Laboratory Director, Fortis Labs"
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.author}</div>
                  <div className="text-slate-400 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Lab Workflow?
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            Join thousands of healthcare professionals using MediSaarthi to save time and improve patient care.
          </p>
          <button 
            onClick={onRegister}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all"
          >
            Start Your Free Trial Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">MediSaarthi</span>
                <p className="text-xs text-slate-400">Bridging Medical Gaps</p>
              </div>
            </div>
            <div className="flex items-center gap-8 text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <div className="text-slate-500">
              © 2026 MediSaarthi. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Animated Process Demo Component
function ProcessDemo() {
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isAnimating) return;
    const timer = setInterval(() => {
      setStep(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, [isAnimating]);

  const steps = [
    { 
      title: 'Upload Report', 
      subtitle: 'Drag & drop your lab report image',
      icon: Upload 
    },
    { 
      title: 'OCR Extraction', 
      subtitle: 'AI extracts text from image',
      icon: Scan 
    },
    { 
      title: 'Smart Parsing', 
      subtitle: 'Identifying tests, values & ranges',
      icon: Brain 
    },
    { 
      title: 'Ready to Query', 
      subtitle: 'Data normalized and searchable',
      icon: CheckCircle2 
    }
  ];

  const sampleData = {
    patient: 'Mr. Rajesh Kumar',
    age: '45 Years',
    tests: [
      { name: 'Hemoglobin', value: '12.5', unit: 'g/dL', status: 'normal' },
      { name: 'RBC Count', value: '4.2', unit: 'million/µL', status: 'normal' },
      { name: 'WBC Count', value: '11500', unit: '/µL', status: 'high' },
      { name: 'Platelet Count', value: '180000', unit: '/µL', status: 'normal' },
      { name: 'Blood Sugar (F)', value: '142', unit: 'mg/dL', status: 'high' }
    ]
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-center">
      {/* Steps Indicator */}
      <div className="space-y-4">
        {steps.map((s, i) => (
          <div 
            key={i}
            onClick={() => { setStep(i); setIsAnimating(false); }}
            className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
              step === i 
                ? 'bg-blue-500/20 border border-blue-500/50' 
                : 'bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              step === i 
                ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                : 'bg-slate-700'
            }`}>
              <s.icon className={`w-6 h-6 ${step === i ? 'text-white' : 'text-slate-400'}`} />
            </div>
            <div className="flex-1">
              <h4 className={`font-semibold ${step === i ? 'text-blue-400' : 'text-white'}`}>
                {s.title}
              </h4>
              <p className="text-sm text-slate-400">{s.subtitle}</p>
            </div>
            {step === i && (
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            )}
          </div>
        ))}
        
        <button 
          onClick={() => setIsAnimating(!isAnimating)}
          className="mt-4 text-sm text-slate-400 hover:text-white transition-colors"
        >
          {isAnimating ? '⏸ Pause Animation' : '▶ Resume Animation'}
        </button>
      </div>

      {/* Demo Visual */}
      <div className="relative">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6 shadow-2xl overflow-hidden">
          {/* Window Controls */}
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-700">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="ml-4 text-sm text-slate-400">MediSaarthi Processing</span>
          </div>

          {/* Step 0: Upload */}
          {step === 0 && (
            <div className="animate-fadeIn text-center py-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-slate-700/50 rounded-2xl border-2 border-dashed border-blue-500/50 flex items-center justify-center animate-pulse">
                <Upload className="w-10 h-10 text-blue-400" />
              </div>
              <p className="text-white font-semibold mb-2">Drop Lab Report Here</p>
              <p className="text-sm text-slate-400">Supports PNG, JPEG, PDF</p>
              <div className="mt-4 flex justify-center gap-2">
                <div className="w-16 h-16 bg-slate-700 rounded-lg animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-16 h-16 bg-slate-700 rounded-lg animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-16 h-16 bg-slate-700 rounded-lg animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}

          {/* Step 1: OCR Scanning */}
          {step === 1 && (
            <div className="animate-fadeIn">
              <div className="relative bg-slate-900 rounded-xl p-4 h-64 overflow-hidden">
                {/* Scan Line Animation */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scanLine"></div>
                </div>
                {/* Sample Text Being Extracted */}
                <div className="space-y-2 text-xs font-mono">
                  <div className="text-blue-400 animate-typeIn">Patient: Mr. Rajesh Kumar</div>
                  <div className="text-slate-500 animate-typeIn" style={{ animationDelay: '0.3s' }}>Age: 45 Years | Male</div>
                  <div className="text-slate-400 animate-typeIn" style={{ animationDelay: '0.6s' }}>─────────────────────</div>
                  <div className="text-white animate-typeIn" style={{ animationDelay: '0.9s' }}>Hemoglobin: 12.5 g/dL</div>
                  <div className="text-white animate-typeIn" style={{ animationDelay: '1.2s' }}>RBC Count: 4.2 million/µL</div>
                  <div className="text-yellow-400 animate-typeIn" style={{ animationDelay: '1.5s' }}>WBC Count: 11500 /µL ⚠</div>
                  <div className="text-white animate-typeIn" style={{ animationDelay: '1.8s' }}>Platelet: 180000 /µL</div>
                  <div className="text-yellow-400 animate-typeIn" style={{ animationDelay: '2.1s' }}>Blood Sugar: 142 mg/dL ⚠</div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-blue-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Extracting text from image...</span>
              </div>
            </div>
          )}

          {/* Step 2: AI Parsing */}
          {step === 2 && (
            <div className="animate-fadeIn">
              <div className="flex items-center gap-2 mb-4 text-blue-400">
                <Brain className="w-5 h-5 animate-pulse" />
                <span className="text-sm font-semibold">AI Analyzing Report Structure</span>
              </div>
              <div className="space-y-3">
                {sampleData.tests.map((test, i) => (
                  <div 
                    key={i}
                    className="flex items-center justify-between bg-slate-900/50 rounded-lg p-3 animate-slideIn"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        test.status === 'high' ? 'bg-yellow-400' : 'bg-blue-400'
                      }`}></div>
                      <span className="text-white">{test.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${
                        test.status === 'high' ? 'text-yellow-400' : 'text-blue-400'
                      }`}>{test.value}</span>
                      <span className="text-slate-500 text-sm">{test.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Ready */}
          {step === 3 && (
            <div className="animate-fadeIn text-center py-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-blue-400" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Data Ready!</h4>
              <p className="text-slate-400 text-sm mb-4">5 tests extracted • 2 abnormal values flagged</p>
              
              <div className="bg-slate-900/50 rounded-xl p-4 text-left">
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                  <MessageSquare className="w-4 h-4" />
                  Try a query:
                </div>
                <p className="text-white font-medium">"Show all abnormal values for this patient"</p>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-400">5</div>
                  <div className="text-xs text-slate-400">Tests Extracted</div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <div className="text-2xl font-bold text-yellow-400">2</div>
                  <div className="text-xs text-slate-400">Abnormal Values</div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Background glow */}
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-3xl -z-10"></div>
      </div>
    </div>
  );
}

// Import Loader2 for the component
const Loader2Icon = Loader2;
