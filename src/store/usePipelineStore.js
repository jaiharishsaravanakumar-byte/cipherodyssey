import { create } from 'zustand';
import { CIPHERS_CONFIG } from '../data/ciphersConfig.js';

const buildDefaultStage = (idx) => {
  const defaults = ['caesar', 'vigenere', 'rail-fence'];
  const cipherId = defaults[idx];
  const config = CIPHERS_CONFIG.find((c) => c.id === cipherId);
  return { cipherId, params: { ...config?.defaultParams } };
};

export const usePipelineStore = create((set, get) => ({
  stages: [buildDefaultStage(0), buildDefaultStage(1), buildDefaultStage(2)],
  pipelineInput: '',
  pipelineResult: null,

  setStage: (index, cipherId) => {
    const config = CIPHERS_CONFIG.find((c) => c.id === cipherId || c.slug === cipherId);
    set((state) => {
      const stages = [...state.stages];
      stages[index] = { cipherId, params: { ...config?.defaultParams } };
      return { stages, pipelineResult: null };
    });
  },

  setStageParam: (index, key, value) => {
    set((state) => {
      const stages = [...state.stages];
      stages[index] = {
        ...stages[index],
        params: { ...stages[index].params, [key]: value },
      };
      return { stages, pipelineResult: null };
    });
  },

  setPipelineInput: (value) => set({ pipelineInput: value, pipelineResult: null }),

  setPipelineResult: (result) => set({ pipelineResult: result }),

  clearPipeline: () =>
    set({
      pipelineInput: '',
      pipelineResult: null,
      stages: [buildDefaultStage(0), buildDefaultStage(1), buildDefaultStage(2)],
    }),
}));
