// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Stepper from '../Stepper';

describe('Stepper', () => {
  const steps = ['One', 'Two', 'Three'];

  it('renders every step label', () => {
    render(<Stepper steps={steps} currentStep={1} />);
    for (const s of steps) {
      expect(screen.getByText(s)).toBeInTheDocument();
    }
  });

  it('marks completed steps with a check and numbers the rest', () => {
    render(<Stepper steps={steps} currentStep={2} />);
    // Steps 0 and 1 are complete -> two check marks.
    expect(screen.getAllByText('✓')).toHaveLength(2);
    // The current step (index 2) shows its 1-based number.
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
