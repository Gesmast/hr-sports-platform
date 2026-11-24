import React from 'react';

export const metadata = {
  title: 'Manufacturing Dashboard — HR Sports Garment Production Control',
};

export default function ManufacturingDashboardPage() {
  return (
    <div className="w-screen h-screen m-0 p-0 overflow-hidden bg-[#111317]">
      <iframe
        src="http://localhost:3001"
        className="w-full h-full border-none"
        title="HR Sports Garment Manufacturing Dashboard"
      />
    </div>
  );
}
