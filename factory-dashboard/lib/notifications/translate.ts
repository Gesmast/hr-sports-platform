import { NotificationItem } from './notification-context';
import { Locale } from '@/lib/i18n/translations';

const STATION_TRANSLATIONS: Record<string, string> = {
  cutting: 'کٹنگ',
  printing: 'پرنٹنگ (سبلیمیشن)',
  sublimation: 'سبلیمیشن',
  heattransfer: 'ہیٹ ٹرانسفر',
  'heat transfer': 'ہیٹ ٹرانسفر',
  heat_transfer: 'ہیٹ ٹرانسفر',
  stitching: 'سلائی (سٹچنگ)',
  quality: 'کوالٹی معائنہ',
  qc: 'کوالٹی معائنہ',
  clipping: 'تراش و صفائی',
  press: 'پریس و استری',
  pressing: 'پریس و استری',
  packing: 'پیکنگ و فنشنگ',
  finishing: 'پیکنگ و فنشنگ',
  dispatch: 'ترسیل و روانگی',
};

const STATUS_TRANSLATIONS: Record<string, string> = {
  underway: 'جاری ہے',
  'in process': 'جاری ہے',
  'in progress': 'جاری ہے',
  inprocess: 'جاری ہے',
  inprogress: 'جاری ہے',
  started: 'شروع ہو گیا',
  complete: 'مکمل ہو گیا',
  completed: 'مکمل ہو گیا',
  done: 'مکمل ہو گیا',
  'on hold': 'روک دیا گیا',
  pending: 'زیر التواء',
};

export function translateNotification(
  item: NotificationItem,
  lang: Locale | boolean = 'en'
): { title: string; message: string } {
  const isUrdu = lang === 'ur' || lang === true;
  const isRoman = lang === 'roman';

  if (!isUrdu && !isRoman) {
    return { title: item.title, message: item.message };
  }

  let title = item.title || '';
  let message = item.message || '';

  // ───────────────────────────────────────────────────────────
  // A) CASUAL GEN Z ROMAN URDU TRANSLATIONS
  // ───────────────────────────────────────────────────────────
  if (isRoman) {
    // 1. Client message pattern
    const clientMsgTitleMatch = title.match(/^(\d+)?\s*new message(?:s)? from (.+)$/i);
    if (clientMsgTitleMatch) {
      const count = clientMsgTitleMatch[1] || '1';
      const sender = clientMsgTitleMatch[2];
      title = `${sender} ka ${count > '1' ? count + ' naye' : '1 naya'} message aaya hai`;
    } else if (/^new message/i.test(title)) {
      title = title.replace(/^new message(?:s)? from /i, '').trim();
      title = `${title} ka naya message aaya hai`;
    }

    const clientMsgBodyMatch = message.match(
      /^(\d+)?\s*new message(?:s)? from ([^,]+),\s*([^,]+),\s*(?:Inquiry\s*)?(#?[A-Z0-9-]+):\s*([\s\S]+)$/i
    );
    if (clientMsgBodyMatch) {
      const count = clientMsgBodyMatch[1] || '1';
      const sender = clientMsgBodyMatch[2].trim();
      const company = clientMsgBodyMatch[3].trim();
      const inq = clientMsgBodyMatch[4].trim();
      const quoted = clientMsgBodyMatch[5].trim();
      message = `${sender} (${company}), Inquiry ${inq} se ${count > '1' ? count + ' naye messages' : 'naya message'}: ${quoted}`;
    }

    // 2. Job Stage Update pattern
    const jobTitleMatch = title.match(
      /^Job\s*#?(\d+):\s*([A-Za-z\s_-]+)\s+(Underway|In Process|In Progress|Complete|Completed|On Hold|Started)$/i
    );
    if (jobTitleMatch) {
      const jobNo = jobTitleMatch[1];
      const rawStation = jobTitleMatch[2].trim().toUpperCase();
      const rawStatus = jobTitleMatch[3].trim();
      title = `Job #${jobNo}: ${rawStation} ka kaam shuru ho gaya (${rawStatus})`;
    }

    const jobBodyMatch = message.match(
      /^Station\s*\[?([A-Za-z\s_-]+)\]?\s*changed to\s*\[?([A-Za-z\s_-]+)\]?\s*for Job\s*#?(\d+)(?:\s*\((.*?)\))?/i
    );
    if (jobBodyMatch) {
      const rawStation = jobBodyMatch[1].trim().toUpperCase();
      const rawStatus = jobBodyMatch[2].trim();
      const jobNo = jobBodyMatch[3];
      const details = jobBodyMatch[4] || '';
      message = details
        ? `Job #${jobNo} (${details}) ke liye station [${rawStation}] ka status [${rawStatus}] update ho gaya.`
        : `Job #${jobNo} ke liye station [${rawStation}] ka status [${rawStatus}] update ho gaya.`;
    }

    // 3. New Production Order
    const orderTitleMatch = title.match(/^New Production Order\s*#?(\d+)/i);
    if (orderTitleMatch) {
      title = `Naya Production Order #${orderTitleMatch[1]} release ho gaya`;
    }
    const orderBodyMatch = message.match(
      /^Inquiry\s*(#?[A-Z0-9-]+)\s*converted to Order\s*#?(\d+)(?:\s*\((.*?)\))?/i
    );
    if (orderBodyMatch) {
      const inq = orderBodyMatch[1];
      const ord = orderBodyMatch[2];
      const rest = orderBodyMatch[3] || '';
      message = rest
        ? `Inquiry ${inq} Order #${ord} mein convert ho chuki hai (${rest}). Production chalu karo!`
        : `Inquiry ${inq} Order #${ord} mein convert ho chuki hai.`;
    }

    // 4. Design Approved
    const designApprTitleMatch = title.match(/^Design Approved for Inquiry\s*(#?[A-Z0-9-]+)/i);
    if (designApprTitleMatch) {
      title = `Design Approved! Inquiry ${designApprTitleMatch[1]} ka 3D design pass ho gaya`;
    }
    if (/Client approved 3D CAD mockup for inquiry/i.test(message)) {
      message = message.replace(
        /Client approved 3D CAD mockup for inquiry\s*(#?[A-Z0-9-]+)\.?\s*Commercial quote can now be finalized\.?/i,
        'Client ne Inquiry $1 ka 3D CAD mockup approve kar diya hai. Ab accounts se quote finalize karwa lo.'
      );
    }

    // 5. Designer Assigned
    const designerAssignedTitleMatch = title.match(/^Designer Assigned to Inquiry\s*(#?[A-Z0-9-]+)/i);
    if (designerAssignedTitleMatch) {
      title = `Inquiry ${designerAssignedTitleMatch[1]} ke liye Designer assign ho gaya`;
    }
    if (/has been assigned to inquiry/i.test(message)) {
      message = message.replace(
        /(.+?)\s+has been assigned to inquiry\s*(#?[A-Z0-9-]+)(?:\s*\((.*?)\))?/i,
        (_, designer, inq, comp) => {
          return comp
            ? `${designer} ko Inquiry ${inq} (${comp}) ka kaam assign kar diya gaya hai.`
            : `${designer} ko Inquiry ${inq} ka kaam assign kar diya gaya hai.`;
        }
      );
    }

    // 6. Specification Changed
    if (/Specification Change Requested/i.test(title) || /Client Spec Changed/i.test(title)) {
      title = 'Client ne Specification change karne ki request ki hai';
    }
    if (/Client requested quote revision for/i.test(message)) {
      message = message.replace(
        /Client requested quote revision for\s*(#?[A-Z0-9-]+):\s*(.*?)\.\s*Commercial quote pending from Account\.?/i,
        'Client ne Inquiry $1 mein revision manga hai: $2. Accounts se nayi quote pending hai.'
      );
    }

    // 7. Overdue SLA
    if (/Overdue SLA/i.test(title)) {
      title = title
        .replace(/🚨\s*Overdue SLA:\s*(?:Inquiry\s*)?(#?[A-Z0-9-]+)/i, '🚨 ALERT: Inquiry $1 ka SLA late ho gaya!')
        .replace(/Overdue SLA:\s*(?:Inquiry\s*)?(#?[A-Z0-9-]+)/i, 'ALERT: Inquiry $1 ka SLA late ho gaya!');
    }
    if (/has exceeded.*SLA/i.test(message)) {
      message = message.replace(
        /Inquiry\s*(#?[A-Z0-9-]+)\s*has exceeded\s*(.*?)\s*SLA\.?/i,
        'Inquiry $1 ka $2 SLA time khatam ho chuka hai. Fauran reply karo!'
      );
    }

    // 8. New Inquiry Received
    const newInqMatch = title.match(/^New Inquiry from (.+)$/i);
    if (newInqMatch) {
      title = `${newInqMatch[1]} se Nayi Inquiry aayi hai`;
    }
    if (/New inquiry\s*(#?[A-Z0-9-]+)\s*received/i.test(message)) {
      message = message.replace(
        /New inquiry\s*(#?[A-Z0-9-]+)\s*received for\s*(\d+)\s*(?:pcs|units)\s*(.*?)\s*from\s*(.*?)\.?$/i,
        (_, inq, qty, garment, club) => {
          return `${club} se ${garment} (${qty} pieces) ke liye nayi Inquiry ${inq} aayi hai.`;
        }
      );
    }

    // 9. QC Rejections & Quality Alerts
    if (/Quality Inspection Rejection|QC Rejection|Defects reported/i.test(title)) {
      title = title
        .replace(/Quality Inspection Rejection/i, 'QC Inspection Mein Reject')
        .replace(/QC Rejection/i, 'QC Inspection Mein Reject')
        .replace(/Defects reported/i, 'Pieces mein nuqs nikla');
    }
    if (/pieces failed inspection|Collar Alignment/i.test(message)) {
      message = message
        .replace(/(\d+)\s*pieces failed inspection/i, '$1 pieces QC inspection mein fail hue')
        .replace(/Defect:\s*(.*?)\s*at\s*(.*?)$/i, 'Nuqs: $1 ($2 par)');
    }

    // 10. Emergency & Delivery Alerts
    if (/Priority Emergency|Emergency Priority/i.test(title)) {
      title = title.replace(/Priority Emergency|Emergency Priority/i, 'Emergency Priority Order');
    }
    if (/Flight dispatch|UAE League Match|Delivery date passed/i.test(message)) {
      message = message
        .replace(/Flight dispatch for UAE League Match/i, 'UAE League match ke liye flight dispatch hai - Fauran tayar karo')
        .replace(/Delivery date passed/i, 'Delivery ki tareekh guzar chuki hai - Fauran dispatch chahiye');
    }

    // 11. Staff Pings & Notices
    if (/Need extra\s*(\d+m?)\s*(.*?)\s*fabric/i.test(title)) {
      title = title.replace(/Need extra\s*(\d+m?)\s*(.*?)\s*fabric/i, '$1 mazeed $2 fabric chahiye');
    }
    if (/Cutting found a.*defect run/i.test(message)) {
      message = 'Cutting mein fabric roll mein kharabi nikli hai. Store se naya roll lene ki foran approval chahiye taake printing late na ho.';
    }
    if (/Sizing chest measurement confirmed/i.test(title)) {
      title = 'Chest measurement sizing confirm ho gayi';
    }
    if (/Client sent updated size table via WhatsApp/i.test(message)) {
      message = 'Client ne WhatsApp par updated size chart bheja hai. Saari pattern adjustments complete hain aur laser cutter par load hain.';
    }
    if (/Neck ribbing shade mismatch/i.test(title)) {
      title = 'Jerseys par neck ribbing ka shade alag hai';
    }
    if (/Batch ribbing color is slightly darker/i.test(message)) {
      message = 'Ribbing ka color body sublimation se thora dark hai. Aap ke faislay ka intezar hai ke aage chalayein ya dobara print karein.';
    }
    if (/Delivery rescheduled with customer approval/i.test(title)) {
      title = 'Customer ki ijazat se delivery reschedule ho gayi';
    }
    if (/70% advance payment received/i.test(title)) {
      title = 'IBFT se 70% advance payment receive ho gayi';
    }

    return { title, message };
  }

  // ───────────────────────────────────────────────────────────
  // B) URDU SCRIPT TRANSLATIONS
  // ───────────────────────────────────────────────────────────
  // 1. Client message pattern
  const clientMsgTitleMatch = title.match(/^(\d+)?\s*new message(?:s)? from (.+)$/i);
  if (clientMsgTitleMatch) {
    const count = clientMsgTitleMatch[1];
    const sender = clientMsgTitleMatch[2];
    title = count ? `${sender} کی جانب سے ${count} نیا پیغام` : `${sender} کی جانب سے نیا پیغام`;
  } else if (/^new message/i.test(title)) {
    title = title.replace(/^new message(?:s)? from /i, '').trim();
    title = `${title} کی جانب سے نیا پیغام`;
  }

  const clientMsgBodyMatch = message.match(
    /^(\d+)?\s*new message(?:s)? from ([^,]+),\s*([^,]+),\s*(?:Inquiry\s*)?(#?[A-Z0-9-]+):\s*([\s\S]+)$/i
  );
  if (clientMsgBodyMatch) {
    const count = clientMsgBodyMatch[1] || '1';
    const sender = clientMsgBodyMatch[2].trim();
    const company = clientMsgBodyMatch[3].trim();
    const inq = clientMsgBodyMatch[4].trim();
    const quoted = clientMsgBodyMatch[5].trim();
    message = `${sender} (${company})، انکوائری ${inq} کی جانب سے ${count} نیا پیغام: ${quoted}`;
  }

  // 2. Job Stage Update pattern
  const jobTitleMatch = title.match(
    /^Job\s*#?(\d+):\s*([A-Za-z\s_-]+)\s+(Underway|In Process|In Progress|Complete|Completed|On Hold|Started)$/i
  );
  if (jobTitleMatch) {
    const jobNo = jobTitleMatch[1];
    const rawStation = jobTitleMatch[2].trim().toLowerCase();
    const rawStatus = jobTitleMatch[3].trim().toLowerCase();
    const stationUr = STATION_TRANSLATIONS[rawStation] || rawStation;
    const statusUr = STATUS_TRANSLATIONS[rawStatus] || 'جاری ہے';
    title = `جاب #${jobNo}: ${stationUr} ${statusUr}`;
  }

  const jobBodyMatch = message.match(
    /^Station\s*\[?([A-Za-z\s_-]+)\]?\s*changed to\s*\[?([A-Za-z\s_-]+)\]?\s*for Job\s*#?(\d+)(?:\s*\((.*?)\))?/i
  );
  if (jobBodyMatch) {
    const rawStation = jobBodyMatch[1].trim().toLowerCase();
    const rawStatus = jobBodyMatch[2].trim().toLowerCase();
    const jobNo = jobBodyMatch[3];
    const details = jobBodyMatch[4] || '';
    const stationUr = STATION_TRANSLATIONS[rawStation] || rawStation;
    const statusUr = STATUS_TRANSLATIONS[rawStatus] || 'جاری ہے';
    let detailsUr = details;
    if (detailsUr) {
      detailsUr = detailsUr.replace(/\bpcs\b/gi, 'عدد').replace(/\bunits\b/gi, 'عدد');
      message = `جاب #${jobNo} (${detailsUr}) کے لیے اسٹیشن [${stationUr}] کا اسٹیٹس [${statusUr}] میں تبدیل کر دیا گیا۔`;
    } else {
      message = `جاب #${jobNo} کے لیے اسٹیشن [${stationUr}] کا اسٹیٹس [${statusUr}] میں تبدیل کر دیا گیا۔`;
    }
  }

  // 3. New Production Order
  const orderTitleMatch = title.match(/^New Production Order\s*#?(\d+)/i);
  if (orderTitleMatch) {
    title = `نیا پروڈکشن آرڈر #${orderTitleMatch[1]}`;
  }
  const orderBodyMatch = message.match(
    /^Inquiry\s*(#?[A-Z0-9-]+)\s*converted to Order\s*#?(\d+)(?:\s*\((.*?)\))?/i
  );
  if (orderBodyMatch) {
    const inq = orderBodyMatch[1];
    const ord = orderBodyMatch[2];
    const rest = (orderBodyMatch[3] || '')
      .replace(/\bpcs\b/gi, 'عدد')
      .replace(/\bunits\b/gi, 'عدد')
      .replace(/\bTotal:\b/gi, 'کل رقم:');
    message = rest
      ? `انکوائری ${inq} فیکٹری پروڈکشن آرڈر #${ord} میں تبدیل ہو گئی (${rest})۔`
      : `انکوائری ${inq} فیکٹری پروڈکشن آرڈر #${ord} میں تبدیل ہو گئی ہے۔`;
  }

  // 4. Design Approved
  const designApprTitleMatch = title.match(/^Design Approved for Inquiry\s*(#?[A-Z0-9-]+)/i);
  if (designApprTitleMatch) {
    title = `انکوائری ${designApprTitleMatch[1]} کے لیے تھری ڈی ڈیزائن منظور`;
  }
  if (/Client approved 3D CAD mockup for inquiry/i.test(message)) {
    message = message.replace(
      /Client approved 3D CAD mockup for inquiry\s*(#?[A-Z0-9-]+)\.?\s*Commercial quote can now be finalized\.?/i,
      'کلائنٹ نے انکوائری $1 کے لیے تھری ڈی کیڈ ماک اپ منظور کر لیا ہے۔ کمرشل کوٹیشن اب جاری کی جا سکتی ہے۔'
    );
  }

  // 5. Designer Assigned
  const designerAssignedTitleMatch = title.match(/^Designer Assigned to Inquiry\s*(#?[A-Z0-9-]+)/i);
  if (designerAssignedTitleMatch) {
    title = `انکوائری ${designerAssignedTitleMatch[1]} کے لیے ڈیزائنر تفویض`;
  }
  if (/has been assigned to inquiry/i.test(message)) {
    message = message.replace(
      /(.+?)\s+has been assigned to inquiry\s*(#?[A-Z0-9-]+)(?:\s*\((.*?)\))?/i,
      (_, designer, inq, comp) => {
        return comp
          ? `${designer} کو انکوائری ${inq} (${comp}) کے لیے ڈیزائنر تفویض کر دیا گیا ہے۔`
          : `${designer} کو انکوائری ${inq} کے لیے ڈیزائنر تفویض کر دیا گیا ہے۔`;
      }
    );
  }

  // 6. Specification Changed
  if (/Specification Change Requested/i.test(title) || /Client Spec Changed/i.test(title)) {
    title = 'وضاحتی تفصیلات میں تبدیلی کی درخواست';
  }
  if (/Client requested quote revision for/i.test(message)) {
    message = message.replace(
      /Client requested quote revision for\s*(#?[A-Z0-9-]+):\s*(.*?)\.\s*Commercial quote pending from Account\.?/i,
      (_, inq, rest) => {
        const restUr = rest.replace(/\bunits\b/gi, 'عدد').replace(/\bpcs\b/gi, 'عدد');
        return `کلائنٹ نے انکوائری ${inq} کے لیے کوٹیشن نظرثانی کی درخواست کی ہے: ${restUr}۔ اکاؤنٹس ڈیپارٹمنٹ کی طرف سے کمرشل کوٹیشن زیر التواء ہے۔`;
      }
    );
  }

  // 7. Overdue SLA
  if (/Overdue SLA/i.test(title)) {
    title = title
      .replace(/🚨\s*Overdue SLA:\s*(?:Inquiry\s*)?(#?[A-Z0-9-]+)/i, '🚨 زائد المیعاد ایس ایل اے: انکوائری $1')
      .replace(/Overdue SLA:\s*(?:Inquiry\s*)?(#?[A-Z0-9-]+)/i, 'زائد المیعاد ایس ایل اے: انکوائری $1');
  }
  if (/has exceeded.*SLA/i.test(message)) {
    message = message.replace(
      /Inquiry\s*(#?[A-Z0-9-]+)\s*has exceeded\s*(.*?)\s*SLA\.?/i,
      'انکوائری $1 نے $2 کی ایس ایل اے مقررہ مدت عبور کر لی ہے۔'
    );
  }

  // 8. New Inquiry Received
  const newInqMatch = title.match(/^New Inquiry from (.+)$/i);
  if (newInqMatch) {
    title = `${newInqMatch[1]} کی جانب سے نئی انکوائری`;
  }
  if (/New inquiry\s*(#?[A-Z0-9-]+)\s*received/i.test(message)) {
    message = message.replace(
      /New inquiry\s*(#?[A-Z0-9-]+)\s*received for\s*(\d+)\s*(?:pcs|units)\s*(.*?)\s*from\s*(.*?)\.?$/i,
      (_, inq, qty, garment, club) => {
        return `${club} کی جانب سے ${garment} (${qty} عدد) کے لیے نئی انکوائری ${inq} موصول ہوئی۔`;
      }
    );
  }

  return { title, message };
}
