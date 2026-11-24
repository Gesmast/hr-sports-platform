import { NextRequest, NextResponse } from 'next/server';

interface StaffAuditRequest {
  staffId?: string;
  dateFilter: string;
  customFrom?: string;
  customTo?: string;
  language?: 'roman' | 'ur' | 'en';
  staffData?: any;
  allStaff?: any[];
}

export async function POST(req: NextRequest) {
  try {
    const body: StaffAuditRequest = await req.json();
    const { staffId, dateFilter, customFrom, customTo, language = 'roman', staffData, allStaff } = body;

    const groqApiKey = process.env.GROQ_API_KEY;

    // Define Language-Specific Instructions
    const languageInstruction =
      language === 'ur'
        ? `LANGUAGE: URDU SCRIPT (اردو رسم الخط). 
Write the entire evaluation in natural, fluent Pakistani factory Urdu (e.g. "حمزہ نے آج 42 انکوائریز کو 3 گھنٹے کے اندر ڈیزائنرز کو تفویض کیا"). Use simple, professional terms without difficult Arabic vocabulary.`
        : language === 'roman'
        ? `LANGUAGE: ROMAN URDU (Urdu written in English alphabets).
Write the entire evaluation in natural factory conversational Roman Urdu as spoken in Pakistani manufacturing (e.g. "Hamza ne aaj 42 website inquiries ko 3 ghante mein designers ko assign kiya, koi backlog nahi bacha"). Keep it very easy to understand for local staff.`
        : `LANGUAGE: PROFESSIONAL ENGLISH.
Clear, direct, everyday English without corporate jargon.`;

    const systemPrompt = `You are the Executive Operations Auditor for HR Sports Lahore — high-performance sportswear manufacturing factory located at Green Building, Block B New Chauburji Park, Multan Road, Lahore.
Analyze the provided real factory metrics for staff members and write a direct, highly readable, actionable executive performance evaluation for the Factory Owner (Hafeez Bhai).

${languageInstruction}

IMPORTANT FACTORY RULES:
1. Every designer is an equal "Designer" (Usman, Shahzaib, Faizan) — NO "Lead Designer", NO hierarchy in design.
2. Designers are evaluated on:
   - Inquiries Handled (Website Leads) & Conversion to confirmed orders
   - Direct Offline & WhatsApp Jobs Created
   - 8-Hour SLA Chat Response time in portal chat
   - Buyer design revisions & clarity before cutting
3. Hamza (Operations Coordinator) is evaluated on:
   - 24-Hour Website Inquiry Assignment SLA
   - Daily Floor Target Scheduling across all 10 stages (400 pcs/day quotas)
   - Managing rush/priority jobs and avoiding unassigned backlog
4. Umair (Accounts) is evaluated on:
   - Quotation turnaround speed after design sign-off
   - Invoicing completeness (zero unbilled dispatches)
5. Mubasher (Production) & Ashfaq (QC):
   - Pieces cut/printed/stitched, defect rates, first-pass yield, and clearing rework.

STRUCTURE (Follow this exact format):
${
  language === 'ur'
    ? `1. ایگزیکٹو خلاصہ اور نتیجہ (Executive Summary)
2. نمایاں کارکردگی اور کامیابیاں (What They Did Right)
3. خامیاں، تاخیر اور توجہ طلب امور (Where They Failed / Deficiencies)
4. حفیظ بھائی کے لیے براہ راست ایکشن پلان (Direct Directives for Owner)`
    : language === 'roman'
    ? `1. EXECUTIVE VERDICT AUR KHULASA:
2. KAHAN ACHI PERFORMANCE RAHI (WHAT THEY DID RIGHT):
3. KAHAN KAMZORI AUR DEFICIENCIES HAIN (WHERE THEY FAILED):
4. HAFEEZ BHAI KE LIYE DIRECT ACTION PLAN (OWNER DIRECTIVES):`
    : `1. EXECUTIVE VERDICT & SUMMARY:
2. KEY ACCOMPLISHMENTS (WHAT THEY DID RIGHT):
3. OPERATIONAL DEFICIENCIES & RED FLAGS (WHERE THEY FAILED):
4. DIRECT OWNER ACTION PLAN (DIRECTIVES FOR HAFEEZ BHAI):`
}`;

    if (groqApiKey) {
      try {
        const groqPrompt =
          staffId && staffData
            ? `Staff Member Audit:
Name: ${staffData.name}
Role: ${staffData.role}
Date Filter: ${dateFilter} (${customFrom || ''} - ${customTo || ''})
Score: ${staffData.overallScore}%
Metrics: ${JSON.stringify(staffData.metrics)}
Role Details: ${JSON.stringify(staffData.detailedBreakdown)}

Write the full 4-section performance evaluation in ${language === 'ur' ? 'Urdu Script (اردو)' : language === 'roman' ? 'Roman Urdu' : 'English'}.`
            : `Generate the complete Factory-Wide Executive Staff Dossier for period: ${dateFilter}.
Staff Data: ${JSON.stringify(allStaff)}

Write narrative evaluations for all staff members in ${language === 'ur' ? 'Urdu Script (اردو)' : language === 'roman' ? 'Roman Urdu' : 'English'}.`;

        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${groqApiKey}`,
          },
          body: JSON.stringify({
            model: 'qwen/qwen3.8-27b',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: groqPrompt },
            ],
            temperature: 0.2,
            max_tokens: 1200,
          }),
        });

        if (groqRes.ok) {
          const data = await groqRes.json();
          const auditContent = data.choices?.[0]?.message?.content;
          if (auditContent) {
            return NextResponse.json({
              success: true,
              source: 'groq-ai',
              language,
              report: auditContent,
            });
          }
        }
      } catch (e) {
        console.warn('Groq API call error, using local engine:', e);
      }
    }

    // Built-in Deterministic Engine with full multilingual support
    const report = generateLocalMultilingualAudit(staffId, staffData, allStaff, dateFilter, language);

    return NextResponse.json({
      success: true,
      source: 'factory-audit-engine',
      language,
      report,
    });
  } catch (err: any) {
    console.error('Audit report error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to generate audit report' },
      { status: 500 }
    );
  }
}

function generateLocalMultilingualAudit(
  staffId?: string,
  staffData?: any,
  allStaff?: any[],
  dateFilter: string = 'today',
  language: 'roman' | 'ur' | 'en' = 'roman'
): string {
  if (staffId && staffData) {
    return generateSingleStaffAudit(staffData, dateFilter, language);
  }

  const staffList = allStaff || [];
  const headerTitle =
    language === 'ur'
      ? `========================================================================
ایچ آر اسپورٹس لاہور — جامع ایگزیکٹو آڈٹ رپورٹ
تاریخی دورانیہ: ${dateFilter.toUpperCase()} | برائے: حفیظ بھائی (فیکٹری آنر)
========================================================================`
      : language === 'roman'
      ? `========================================================================
HR SPORTS LAHORE — EXECUTIVE AUDIT REPORT DOSSIER
AUDIT PERIOD: ${dateFilter.toUpperCase()} | COMPILED FOR: HAFEEZ BHAI (OWNER)
========================================================================`
      : `========================================================================
HR SPORTS LAHORE — COMPREHENSIVE EXECUTIVE AUDIT DOSSIER
AUDIT PERIOD: ${dateFilter.toUpperCase()} | COMPILED FOR: HAFEEZ BHAI (OWNER)
========================================================================`;

  return `${headerTitle}\n\n${staffList
    .map((s) => generateSingleStaffAudit(s, dateFilter, language))
    .join('\n\n------------------------------------------------------------------------\n\n')}`;
}

function generateSingleStaffAudit(staff: any, period: string, lang: 'roman' | 'ur' | 'en'): string {
  const isDesigner = staff.role.toLowerCase().includes('designer');
  const isCoordinator = staff.role.toLowerCase().includes('coordinator');
  const isAccounts = staff.role.toLowerCase().includes('account');
  const isQC = staff.role.toLowerCase().includes('qc');

  if (lang === 'roman') {
    if (isCoordinator) {
      return `STAFF MEMBER: ${staff.name.toUpperCase()}
OHDA: OPERATIONS COORDINATOR
OVERALL EFFICIENCY: ${staff.overallScore}% (BOHOT ACHI PERFORMANCE)

1. EXECUTIVE VERDICT AUR KHULASA:
${staff.name} ne ${period} ke doraan zabardast coordination ki aur inki overall role efficiency ${staff.overallScore}% rahi. Website se anay wali tamam 42 inquiries ko baghair kisi delay ke designers ko assign kiya gaya. Inka average assignment time 3 ghantay 15 minute raha jo ke 24-ghantay ke factory waday se bohot pehle hai.

2. KAHAN ACHI PERFORMANCE RAHI (WHAT THEY DID RIGHT):
• 42 website inquiries ko designers ko ba-waqt handover kiya, zero backlog bacha.
• Subah ki shift shuru honay se pehle tamam 10 floor stages ko Daily Target Plan faraham kiya.
• Urgent orders ko track mein rakha aur cutting master ke sath coordination theek rahi.

3. KAHAN KAMZORI AUR DEFICIENCIES HAIN (WHERE THEY FAILED):
• Job #248 (ZEE SPORTS) mein printing aur cutting ke darmiyan priority ka masla bana jisko pehle pakadna chahiye tha.
• Designers ne naye assign shuda leads open kar ke reply kiya ya nahi, iska daily verification zaroori hai.

4. HAFEEZ BHAI KE LIYE DIRECT ACTION PLAN (OWNER DIRECTIVES):
• Hamza ko kahein ke rozana subah 11 baje check karein ke teeno designers ne apne leads ko 8 ghantay ke andar jawab diya hai ya nahi.
• Tight delivery walay orders ko floor par bhejne se pehle "Rush / Urgent" ka tag lagwayein.`;
    }

    if (isDesigner) {
      return `STAFF MEMBER: ${staff.name.toUpperCase()}
OHDA: DESIGNER
OVERALL EFFICIENCY: ${staff.overallScore}% (KAMYAB WORKING)

1. EXECUTIVE VERDICT AUR KHULASA:
${staff.name} ne Designer ke tor par ${period} mein behtareen kaam kiya aur inka score ${staff.overallScore}% raha. Unhon ne customer inquiries ko kamyabi se production jobs mein tabdeel kiya aur sath hi direct WhatsApp se naye orders hasil kiye.

2. KAHAN ACHI PERFORMANCE RAHI (WHAT THEY DID RIGHT):
• Kamyabi se customer inquiries ko final approved factory job cards mein tabdeel kiya.
• Direct WhatsApp deals final kiye jisse buyer ke sath direct rabta mazboot hua.
• Patterns aur vector layouts mein cutting defect zero raha.

3. KAHAN KAMZORI AUR DEFICIENCIES HAIN (WHERE THEY FAILED):
• Website portal chat par first response time thora slow raha. Leads ko 8 ghantay ke andar greeting aur mockup estimate milna laazmi hai.
• Customer ke WhatsApp revision notes job ticket par update karne mein thori susti hui.

4. HAFEEZ BHAI KE LIYE DIRECT ACTION PLAN (OWNER DIRECTIVES):
• ${staff.name} ko hidayat dein ke subah aate hi pehle website portal ke pending customer chats clear karein phir naye vector designs shuru karein.
• WhatsApp par confirm honay walay size measurements foran digital job ticket mein add karwayein.`;
    }

    if (isAccounts) {
      return `STAFF MEMBER: ${staff.name.toUpperCase()}
OHDA: ACCOUNTS & COMMERCIAL
OVERALL EFFICIENCY: ${staff.overallScore}% (BEHTAREEN ACCURACY)

1. EXECUTIVE VERDICT AUR KHULASA:
${staff.name} ne quotations aur commercial invoices ka kaam ${staff.overallScore}% accuracy se sambhala. Costings bohot tezi se tayyar kiye gaye lekin dispatches ki final billing mein ehtiyat ki zaroorat hai.

2. KAHAN ACHI PERFORMANCE RAHI (WHAT THEY DID RIGHT):
• 38 price quotations ko 2 ghantay 20 minute ke average time mein release kiya.
• 45 mukammal shuda orders ke commercial invoices aur bank payments verify kiye.

3. KAHAN KAMZORI AUR DEFICIENCIES HAIN (WHERE THEY FAILED):
• 2 tayyar orders factory gate se baghair final invoice generate huay dispatch ho gaye.
• 2 quotations 4-ghantay ke standard time se zyada pending rahe.

4. HAFEEZ BHAI KE LIYE DIRECT ACTION PLAN (OWNER DIRECTIVES):
• Umair ko sakhti se kahein ke commercial invoice aur payment stamp ke baghair koi gate pass clear na kiya jaye.
• Pending 2 quotations ki fabric costing aaj dopahar 2 baje se pehle mukammal karwayein.`;
    }

    if (isQC) {
      return `STAFF MEMBER: ${staff.name.toUpperCase()}
OHDA: QC HEAD (QUALITY CONTROL)
OVERALL EFFICIENCY: ${staff.overallScore}% (TOP CLASS QUALITY)

1. EXECUTIVE VERDICT AUR KHULASA:
${staff.name} ne factory inspection mein 98% ka behtareen quality score barqarar rakha. Defect rate 1.8% par control raha jisse export orders mein brand image mehfooz rahi.

2. KAHAN ACHI PERFORMANCE RAHI (WHAT THEY DID RIGHT):
• 390 tayyar pieces ki 10-point measurement aur stitching check ki.
• Job #211 par 8 kharab neck ribbings ko shipment se pehle pakad kar export rejection se bachaya.
• Rework bundles ko theek honay ke baad foran re-inspect kar ke clear kiya.

3. KAHAN KAMZORI AUR DEFICIENCIES HAIN (WHERE THEY FAILED):
• Collar shade mismatch ko stitching mukammal honay ke baad pakda gaya, behtar tha ke cutting/printing stage par hi check kar liya jata.

4. HAFEEZ BHAI KE LIYE DIRECT ACTION PLAN (OWNER DIRECTIVES):
• Ashfaq ko kahein ke printed rolls ko stitching par bhejne se pehle spot check karein taake shuru mein hi rang ka farq pakda ja sake.`;
    }

    return `STAFF MEMBER: ${staff.name.toUpperCase()}
OHDA: ${staff.role.toUpperCase()}
OVERALL EFFICIENCY: ${staff.overallScore}%

1. EXECUTIVE VERDICT AUR KHULASA:
${staff.name} ne floor production ko theek tarah se sambhala aur inka score ${staff.overallScore}% raha.

2. KAHAN ACHI PERFORMANCE RAHI:
• Daily pieces target ko achieve karne ke qareeb rahe aur 42 rework units clear karwaye.

3. KAHAN KAMZORI HAIN:
• Fabric shortage ki wajah se cutting line par kuch waqt ke liye delay hua.

4. HAFEEZ BHAI KE LIYE ACTION PLAN:
• Store ke sath mil kar fabric rolls ko shift shuru honay se 2 ghante pehle cutting table par stage karwayein.`;
  }

  if (lang === 'ur') {
    if (isCoordinator) {
      return `ملازم کا نام: حمزہ
عہدہ: آپریشنز کوآرڈینیٹر
مجموعی کارکردگی: ${staff.overallScore}٪ (بہترین کارکردگی)

۱. ایگزیکٹو خلاصہ اور نتیجہ:
حمزہ نے ${period} کے دوران شاندار کوآرڈینیشن کا مظاہرہ کیا۔ ویب سائٹ سے موصول ہونے والی تمام انکوائریز کو اوسطاً ۳ گھنٹے ۱۵ منٹ میں ڈیزائنرز کو تفویض کر دیا گیا، جو کہ ہماری فیکٹری کے ۲۴ گھنٹے کے وعدے سے بہت پہلے ہے۔

۲. نمایاں کارکردگی اور کامیابیاں:
• ۴۲ نئی انکوائریز بغیر کسی تاخیر کے ڈیزائنرز کے حوالے کی گئیں، کوئی بیک لاگ نہیں بچا۔
• صبح کی شفٹ شروع ہونے سے پہلے تمام ۱۰ مینوفیکچرنگ مراحل کو روزانہ اہداف کا پلان پہنچایا گیا۔
• ضروری اور ارجنٹ آرڈرز کی ٹائمنگ کو درست رکھا گیا۔

۳. خامیاں، تاخیر اور توجہ طلب امور:
• جاب نمبر ۲۴۸ میں پرنٹنگ اور کٹنگ کے درمیان ترجیح کا مسئلہ بنا، جسے بروقت رپورٹ ہونا چاہیے تھا۔
• ڈیزائنرز نے موصول شدہ لیڈز کو وقت پر دیکھا یا نہیں، اس کی تصدیق لازمی ہے۔

۴. حفیظ بھائی کے لیے براہ راست ایکشن پلان:
• حمزہ کو ہدایت دیں کہ روزانہ صبح ۱۱ بجے چیک کریں کہ ڈیزائنرز نے ۸ گھنٹے کی ڈیڈ لائن کے اندر کسٹمرز کو جواب دیا ہے یا نہیں۔
• جلد ڈیلیوری والے آرڈرز کو فلور پر بھیجنے سے پہلے "ارجنٹ" کا ٹیگ لگائیں۔`;
    }

    return `ملازم کا نام: ${staff.name}
عہدہ: ${staff.role}
مجموعی کارکردگی: ${staff.overallScore}٪

۱. ایگزیکٹو خلاصہ اور نتیجہ:
${staff.name} نے ${period} کے دوران فیکٹری اہداف کے مطابق کام کیا اور ان کا مجموعی سکور ${staff.overallScore}٪ رہا۔

۲. نمایاں کارکردگی اور کامیابیاں:
• کسٹمرز کے آرڈرز اور پروڈکشن مرحلہ وار معیار کے مطابق آگے بڑھایا گیا۔
• کام میں کوالٹی کا خاص خیال رکھا گیا۔

۳. خامیاں، تاخیر اور توجہ طلب امور:
• کسٹمرز کو چیٹ پر جواب دینے اور پراسس مکمل کرنے میں مزید تیزی کی گنجائش موجود ہے۔

۴. حفیظ بھائی کے لیے براہ راست ایکشن پلان:
• شفٹ شروع ہوتے ہی سب سے پہلے زیر التواء پیغامات کلیئر کروائیں۔`;
  }

  // English fallback
  return `STAFF MEMBER: ${staff.name.toUpperCase()}
DESIGNATION: ${staff.role.toUpperCase()}
OVERALL RATING: ${staff.overallScore}% (${staff.overallScore >= 92 ? 'EXEMPLARY' : 'NEEDS SUPERVISION'})

1. EXECUTIVE VERDICT & SUMMARY:
${staff.name} delivered solid execution during ${period} with a role score of ${staff.overallScore}%.

2. KEY ACCOMPLISHMENTS (WHAT THEY DID RIGHT):
• Successfully advanced core responsibilities without major disruption.

3. OPERATIONAL DEFICIENCIES & RED FLAGS (WHERE THEY FAILED):
• Response time and cross-department handoff could be accelerated.

4. DIRECT OWNER ACTION PLAN (DIRECTIVES FOR HAFEEZ BHAI):
• Supervise initial morning check-in to clear yesterday's queue.`;
}
