"use client";

import { useRouter } from 'next/navigation';
import { FiArrowRight, FiCode, FiFileText, FiCpu } from 'react-icons/fi';

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.05] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      
      <div className="z-10 text-center max-w-4xl mx-auto">
        <div className="mb-8">
          <img src="/professor.jpg" alt="Professor" className="w-32 h-32 rounded-full mx-auto border-4 border-primary/20 shadow-lg"/>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-2">
          Capstone Assistant
        </h1>
        <p className="text-muted-foreground mt-6 text-lg max-w-2xl mx-auto">
          Your AI-powered partner for navigating the complexities of your capstone project. Get help with code, documentation, and research, all in one place.
        </p>
        
        <button 
          onClick={() => router.push('/chat')}
          className="mt-10 inline-flex items-center justify-center h-12 px-8 font-medium text-background bg-foreground rounded-md transition-colors shadow-lg hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        >
          <span>Start Chatting</span>
          <FiArrowRight className="ml-2 h-5 w-5" />
        </button>
      </div>

      <div className="z-10 grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-5xl w-full">
        <div className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
          <FiCode className="h-10 w-10 mx-auto text-primary mb-4" />
          <h3 className="text-xl font-semibold text-foreground">Code Generation</h3>
          <p className="text-muted-foreground mt-2">
            Generate boilerplate, fix bugs, or get help with complex algorithms.
          </p>
        </div>
        <div className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
          <FiFileText className="h-10 w-10 mx-auto text-primary mb-4" />
          <h3 className="text-xl font-semibold text-foreground">Documentation Assistance</h3>
          <p className="text-muted-foreground mt-2">
            Draft reports, summarize articles, and format citations with ease.
          </p>
        </div>
        <div className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
          <FiCpu className="h-10 w-10 mx-auto text-primary mb-4" />
          <h3 className="text-xl font-semibold text-foreground">Advanced AI Model</h3>
          <p className="text-muted-foreground mt-2">
            Powered by Google&apos;s Gemini 1.5 Flash for fast and accurate responses.
          </p>
        </div>
      </div>
    </div>
  );
}