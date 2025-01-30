interface RoadmapStep {
  title: string;
  description: string;
  path: string;
  status: 'required' | 'recommended' | 'optional';
  prerequisites: string[];
  category: string;
  icon: JSX.Element;
  skills: string[];
  children?: RoadmapStep[];
}

export const roadmapSteps: RoadmapStep[] = [
  {
    title: "Introdução",
    description: "Fundamentos e motivação para estudar sistemas distribuídos",
    path: "/intro",
    status: "required",
    prerequisites: [],
    category: "Fundamentos",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    skills: ["Conceitos básicos", "Motivação", "Visão geral"]
  },
  // ... rest of the roadmap steps
]; 