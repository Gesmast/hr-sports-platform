'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const QuoteHeaderAnimated: React.FC = () => {
  return (
    <div className="max-w-3xl mb-10 sm:mb-12">
      {/* 1. First: Title fades in */}
      <motion.h2
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] text-balance text-ink"
      >
        Have a project in mind? Share your requirements with us.
      </motion.h2>

      {/* 2. Second: Description fades in */}
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
        className="mt-4 text-base sm:text-lg leading-relaxed text-pretty text-muted"
      >
        Tell us a little about your apparel requirements and design. Our minimum order quantity is 30 pieces. Pre-production samples are available for review before bulk cutting.
      </motion.p>
    </div>
  );
};
