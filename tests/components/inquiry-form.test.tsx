import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Mock 3D Garment Viewer in JSDOM environment
vi.mock('@/components/contact/GarmentViewer3D', () => ({
  GarmentViewer3D: ({ fileName, fileSize }: { fileName: string; fileSize: string }) => (
    <div data-testid="mock-3d-viewer">
      Mock 3D Viewer: {fileName} ({fileSize})
    </div>
  ),
  default: ({ fileName, fileSize }: { fileName: string; fileSize: string }) => (
    <div data-testid="mock-3d-viewer">
      Mock 3D Viewer: {fileName} ({fileSize})
    </div>
  ),
}));

import { InquiryForm } from '@/components/contact/InquiryForm';

describe('InquiryForm Multi-Step Component', () => {
  it('renders Step 1 fields correctly on initial mount', () => {
    render(<InquiryForm />);

    expect(screen.getByText(/Step 01 of 03/i)).toBeDefined();
    expect(screen.getByLabelText(/Company or Brand Name/i)).toBeDefined();
    expect(screen.getByLabelText(/Corporate Email Address/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Continue to Garment Specs/i })).toBeDefined();
  });

  it('validates Step 1 inputs before allowing progression to Step 2', async () => {
    render(<InquiryForm />);

    const nextButton = screen.getByRole('button', { name: /Continue to Garment Specs/i });
    fireEvent.click(nextButton);

    // Errors should appear and stay on Step 1
    await waitFor(() => {
      expect(screen.getByText(/Company or organization name must be at least 2 characters/i)).toBeDefined();
    });
  });

  it('progresses to Step 2 when valid Step 1 inputs are provided', async () => {
    render(<InquiryForm />);

    const companyInput = screen.getByLabelText(/Company or Brand Name/i);
    const emailInput = screen.getByLabelText(/Corporate Email Address/i);
    const nextButton = screen.getByRole('button', { name: /Continue to Garment Specs/i });

    fireEvent.change(companyInput, { target: { value: 'Apex Sports Group' } });
    fireEvent.change(emailInput, { target: { value: 'procurement@apex.com' } });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/Step 02 of 03/i)).toBeDefined();
      expect(screen.getByText(/Total Order Quantity/i)).toBeDefined();
    });
  });
});
