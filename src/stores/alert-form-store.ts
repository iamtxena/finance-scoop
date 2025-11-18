import { create } from 'zustand';

interface AlertFormState {
  keywords: string[];
  subreddits: string[];
  active: boolean;
  triggerMode: 'single' | 'recurring';

  setKeywords: (keywords: string[]) => void;
  addKeyword: (keyword: string) => void;
  removeKeyword: (index: number) => void;

  setSubreddits: (subreddits: string[]) => void;
  addSubreddit: (subreddit: string) => void;
  removeSubreddit: (index: number) => void;

  setActive: (active: boolean) => void;
  setTriggerMode: (mode: 'single' | 'recurring') => void;

  reset: () => void;
}

const initialState = {
  keywords: [],
  subreddits: [],
  active: true,
  triggerMode: 'recurring' as const,
};

export const useAlertFormStore = create<AlertFormState>((set) => ({
  ...initialState,

  setKeywords: (keywords) => set({ keywords }),
  addKeyword: (keyword) => set((state) => ({ keywords: [...state.keywords, keyword] })),
  removeKeyword: (index) => set((state) => ({
    keywords: state.keywords.filter((_, i) => i !== index),
  })),

  setSubreddits: (subreddits) => set({ subreddits }),
  addSubreddit: (subreddit) => set((state) => ({
    subreddits: [...state.subreddits, subreddit],
  })),
  removeSubreddit: (index) => set((state) => ({
    subreddits: state.subreddits.filter((_, i) => i !== index),
  })),

  setActive: (active) => set({ active }),
  setTriggerMode: (triggerMode) => set({ triggerMode }),

  reset: () => set(initialState),
}));
