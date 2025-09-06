
export interface GeneratedContent {
  text: string | null;
  imageUrl: string | null;
}

export interface PromptExample {
  title: string;
  template: string;
  prompt: string;
}

export enum AppTab {
  GENERATION = 'generation',
  EDITING = 'editing',
}
