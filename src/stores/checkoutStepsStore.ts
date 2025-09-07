import { create } from 'zustand';

export type CheckoutStep = 'information' | 'delivery' | 'summary';

interface CheckoutStepsState {
  currentStep: CheckoutStep;
  setCurrentStep: (step: CheckoutStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetSteps: () => void;
}

const stepOrder: CheckoutStep[] = ['information', 'delivery', 'summary'];

export const useCheckoutStepsStore = create<CheckoutStepsState>((set, get) => ({
  currentStep: 'information',

  setCurrentStep: step => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep } = get();
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      set({ currentStep: stepOrder[currentIndex + 1] });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      set({ currentStep: stepOrder[currentIndex - 1] });
    }
  },

  resetSteps: () => set({ currentStep: 'information' }),
}));
