import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Mock IntersectionObserver for Framer Motion in JSDOM
if (typeof window !== 'undefined') {
  window.IntersectionObserver = class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
}
if (typeof global !== 'undefined') {
  (global as any).IntersectionObserver = class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
}

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

    expect(screen.getByText(/Your Details/i)).toBeDefined();
    expect(screen.getByLabelText(/Your Name/i)).toBeDefined();
    expect(screen.getByLabelText(/Email Address/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Continue/i })).toBeDefined();
  });

  it('validates Step 1 inputs before allowing progression to Step 2', async () => {
    render(<InquiryForm />);

    const nextButton = screen.getByRole('button', { name: /Continue/i });
    fireEvent.click(nextButton);

    // Errors should appear and stay on Step 1
    await waitFor(() => {
      expect(screen.getByText(/Your name is required/i)).toBeDefined();
    });
  });

  it('progresses to Step 2 when valid Step 1 inputs are provided', async () => {
    render(<InquiryForm />);

    const nameInput = screen.getByLabelText(/Your Name/i);
    const emailInput = screen.getByLabelText(/Email Address/i);
    const lookingForSelect = screen.getByDisplayValue(/Select an option.../i);
    const nextButton = screen.getByRole('button', { name: /Continue/i });

    fireEvent.change(nameInput, { target: { value: 'Apex Sports Group' } });
    fireEvent.change(emailInput, { target: { value: 'procurement@apex.com' } });
    fireEvent.change(lookingForSelect, { target: { value: 'Merch' } });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/Order & Garment Specifications/i)).toBeDefined();
    });
  });

  it('displays the Size Breakdown and opens the Size Specification Guide modal in Step 2 when prerequisites are filled', async () => {
    render(<InquiryForm />);

    const nameInput = screen.getByLabelText(/Your Name/i);
    const emailInput = screen.getByLabelText(/Email Address/i);
    const lookingForSelect = screen.getByDisplayValue(/Select an option.../i);
    const nextButton = screen.getByRole('button', { name: /Continue/i });

    fireEvent.change(nameInput, { target: { value: 'Apex Sports Group' } });
    fireEvent.change(emailInput, { target: { value: 'procurement@apex.com' } });
    fireEvent.change(lookingForSelect, { target: { value: 'Merch' } });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/Kindly select the options above/i)).toBeDefined();
    });

    // Fill the 3 prerequisite fields: Items, Customization (already default for Merch), Total Quantity
    const itemsSelect = screen.getByDisplayValue(/Select items.../i);
    fireEvent.change(itemsSelect, { target: { value: 'full_kit' } });

    const totalQtyInput = screen.getByPlaceholderText('15');
    fireEvent.change(totalQtyInput, { target: { value: '30' } });

    await waitFor(() => {
      expect(screen.getByText(/Size Breakdown/i)).toBeDefined();
    });

    const viewChartBtn = screen.getByRole('button', { name: /View.*Chart/i });
    fireEvent.click(viewChartBtn);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Size Specification Guide/i })).toBeDefined();
      expect(screen.getAllByText(/US Standard/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/UK Standard/i).length).toBeGreaterThan(0);
    });
  });
});
