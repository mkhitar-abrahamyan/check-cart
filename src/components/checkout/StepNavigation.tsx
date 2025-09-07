import { useCheckoutStepsStore } from '@/stores';

export const StepNavigation = () => {
  const { currentStep, setCurrentStep } = useCheckoutStepsStore();

  const steps = [
    { id: 'information', label: 'Information' },
    { id: 'delivery', label: 'Delivery' },
    { id: 'summary', label: 'Summary' },
  ] as const;

  return (
    <div className='flex justify-between w-full px-6 bg-[#EAEAEA]'>
      <nav className='w-full flex justify-between'>
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(step.id)}
            className={`w-1/4 text-sm font-medium border-b-2 transition-colors ${
              currentStep === step.id
                ? 'h-[30px] rounded-tl-md rounded-tr-md border-b border-[#303030] pt-1 pr-3 pb-1 pl-3 text-[#303030]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {step.label}
          </button>
        ))}
      </nav>
    </div>
  );
};
