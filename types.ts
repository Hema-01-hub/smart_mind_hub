
export interface Lesson {
  title: string;
  duration: string;
  description: string;
  keyConcepts: string[];
}

export interface Module {
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Resource {
  title: string;
  url: string;
  type: 'article' | 'video' | 'course' | 'tool';
}

export interface Curriculum {
  id: string;
  title: string;
  description: string;
  targetAudience: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTotalHours: number;
  modules: Module[];
  learningOutcomes: string[];
  resources?: Resource[];
}

export interface GenerateParams {
  topic: string;
  audience: string;
  depth: 'Overview' | 'Comprehensive' | 'Mastery';
  weeks: number;
}
