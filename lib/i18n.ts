import type { Lang } from "@/lib/types";

type Dict = Record<string, string>;

const en: Dict = {
  appName: "PFSahay",
  tagline: "AI-Powered EPF Claim Assistant",
  demoMode: "Demo environment — all data is simulated.",
  demoDisclaimer: "Demo environment — simulated data. Not affiliated with EPFO.",

  loginHeadline: "Claim your PF without the confusion.",
  loginSupport:
    "Tell PFSahay what you need. We'll help you choose the right claim, catch common mistakes, and guide you through submission.",
  loginCta: "Login with UAN",
  uanLabel: "Universal Account Number (UAN)",
  uanPlaceholder: "e.g. 100000000001",
  continue: "Continue",
  invalidUan: "Please enter a valid 12-digit UAN.",
  loginError: "We couldn't sign you in. Please try again.",

  otpHeading: "Enter the 6-digit code",
  otpSupport: "We sent a code to your registered mobile number.",
  otpCta: "Verify",
  otpInvalid: "Please enter all 6 digits.",
  otpResend: "Resend code",
  otpExpired: "That code has expired. Please request a new one.",

  dashboardGreeting: "Hi {name},",
  balanceLabel: "Your PF balance",
  employerLabel: "Current employer",
  kycLabel: "KYC status",
  kycVerified: "Verified",
  historyLabel: "Employment history",
  claimCta: "Claim / Withdraw PF",
  claimAssistant: "Claim Assistant",

  claimIntroTitle: "Let's figure out your claim.",
  claimIntroBody:
    "You don't need to know which form you need. I'll work that out for you.",
  claimIntroStart: "Start",

  reasonTitle: "Why do you need your PF money?",
  reasonSubtitle: "Pick what fits best, or type in your own words.",
  reasonPlaceholder: "Type your reason…",
  reasonSend: "Send",
  clarifyTitle: "One quick question",
  clarifyBody: "Can you tell me a bit more about your situation?",
  clarifyPlaceholder: "Type your answer…",

  verifying: "Understanding your reason…",
  foundTitle: "Here's what I found",
  pathLabel: "Recommended claim",
  pathContinue: "Continue",

  verifyTitle: "Let's make sure nothing gets rejected.",
  verifySubtitle: "We're checking your records against what EPFO expects.",
  verifyOk: "All checks passed. You're ready to continue.",
  verifyAttention: "We found something worth fixing before you submit.",
  checkAadhaar: "Aadhaar is linked",
  checkPan: "PAN is linked",
  checkBank: "Bank account is linked",
  checkName: "Name matches across records",

  issueTitle: "Your name is slightly different.",
  issueBody: "This mismatch may cause your claim to be rejected.",
  issueFix: "Fix name",
  issueFixed: "Name updated",
  issueFixBody: "We'll use your Aadhaar name for this claim.",
  issueResolvedBadge: "Fixed",

  docsTitle: "Upload your documents",
  docsSubtitle: "The right documents help avoid rejection.",
  docsUpload: "Upload",
  docsUploaded: "Uploaded",
  docsContinue: "Continue",
  docsRequired: "Required",
  docsOptional: "Optional",
  docsInvalid: "Please upload a PDF or image under 5 MB.",
  docsChooseFile: "Choose File",
  docsTakePhoto: "or Take Photo",

  reviewTitle: "Review your claim",
  reviewSubtitle: "Check everything looks right before submitting.",
  reviewPurpose: "Claim purpose",
  reviewReason: "Reason",
  reviewClaimant: "Claimant",
  reviewUan: "UAN",
  reviewBank: "Bank account",
  reviewDocuments: "Documents",
  reviewSubmit: "Submit claim",
  reviewConfirmTitle: "Submit your claim?",
  reviewConfirmBody: "You can't undo this. We'll send it for verification.",
  reviewConfirm: "Yes, submit",
  notNow: "Not now",
  submitFailed: "We couldn't submit your claim. Your progress is saved — please try again.",

  submitSuccess: "You're done.",
  submitBody: "Your claim is now under verification.",
  submitRef: "Reference number",
  submitTrack: "Track claim",

  trackerTitle: "Your claim status",
  trackerSubtitle: "We explain every step in plain language.",
  trackerStage: "Current stage",
  trackerAction: "What you need to do",

  back: "Back",
  cancel: "Cancel",
  confirm: "Confirm",
  retry: "Retry",
  loading: "Loading…",
  errorTitle: "Something went wrong",
  networkError: "Network issue. Your progress is saved — please try again.",
  close: "Close",
  skip: "Skip for now",

  stepReason: "Reason",
  stepVerify: "Verify",
  stepDocs: "Documents",
  stepReview: "Review",
};

const hi: Dict = {
  appName: "PFSahay",
  tagline: "AI-संचालित EPF दावा सहायक",
  demoMode: "डेमो वातावरण — सारा डेटा अनुकरण है।",
  demoDisclaimer: "डेमो वातावरण — अनुकरण डेटा। EPFO से संबद्ध नहीं।",

  loginHeadline: "बिना भ्रम के अपना PF क्लेम करें।",
  loginSupport:
    "PFSahay को बताएं कि आपको क्या चाहिए। हम सही दावा चुनने, गलतियों को रोकने और जमा कराने में मदद करेंगे।",
  loginCta: "UAN से लॉगिन करें",
  uanLabel: "यूनिवर्सल अकाउंट नंबर (UAN)",
  uanPlaceholder: "जैसे 100000000001",
  continue: "जारी रखें",
  invalidUan: "कृपया वैध 12 अंकों का UAN डालें।",
  loginError: "साइन इन नहीं हो सका। कृपया फिर कोशिश करें।",

  otpHeading: "6 अंकों का कोड डालें",
  otpSupport: "हमने आपके रजिस्टर्ड मोबाइल पर कोड भेजा है।",
  otpCta: "सत्यापित करें",
  otpInvalid: "कृपया सभी 6 अंक डालें।",
  otpResend: "कोड फिर भेजें",
  otpExpired: "यह कोड समाप्त हो गया है। नया कोड मांगें।",

  dashboardGreeting: "नमस्ते {name},",
  balanceLabel: "आपका PF बैलेंस",
  employerLabel: "वर्तमान नियोक्ता",
  kycLabel: "KYC स्थिति",
  kycVerified: "सत्यापित",
  historyLabel: "रोज़गार इतिहास",
  claimCta: "PF क्लेम / निकासी",
  claimAssistant: "क्लेम सहायक",

  claimIntroTitle: "चलो आपका दावा समझते हैं।",
  claimIntroBody: "आपको फॉर्म का नंबर जानने की ज़रूरत नहीं। मैं वही तय कर लूँगा।",
  claimIntroStart: "शुरू करें",

  reasonTitle: "आपको अपना PF पैसा क्यों निकालना है?",
  reasonSubtitle: "जो सही लगे चुनें, या अपने शब्दों में लिखें।",
  reasonPlaceholder: "अपना कारण लिखें…",
  reasonSend: "भेजें",
  clarifyTitle: "एक जल्दी सा सवाल",
  clarifyBody: "अपनी स्थिति के बारे में थोड़ा और बता सकते हैं?",
  clarifyPlaceholder: "अपना उत्तर लिखें…",

  verifying: "आपका कारण समझ रहे हैं…",
  foundTitle: "हमने यह पाया",
  pathLabel: "अनुशंसित दावा",
  pathContinue: "जारी रखें",

  verifyTitle: "सुनिश्चित करते हैं कि कुछ रिजेक्ट न हो।",
  verifySubtitle: "हम आपके रिकॉर्ड EPFO की अपेक्षा से मिला रहे हैं।",
  verifyOk: "सभी जाँच पास। आप आगे बढ़ सकते हैं।",
  verifyAttention: "जमा कराने से पहले एक चीज ठीक करने लायक है।",
  checkAadhaar: "आधार जुड़ा है",
  checkPan: "PAN जुड़ा है",
  checkBank: "बैंक खाता जुड़ा है",
  checkName: "रिकॉर्ड में नाम मेल खाता है",

  issueTitle: "आपका नाम थोड़ा अलग है।",
  issueBody: "यह मेल न होने से आपका दावा रिजेक्ट हो सकता है।",
  issueFix: "नाम ठीक करें",
  issueFixed: "नाम अपडेट",
  issueFixBody: "हम इस दावे के लिए आपका आधार नामใช้ करेंगे।",
  issueResolvedBadge: "ठीक किया",

  docsTitle: "अपने दस्तावेज़ अपलोड करें",
  docsSubtitle: "सही दस्तावेज़ रिजेक्शन से बचाते हैं।",
  docsUpload: "अपलोड",
  docsUploaded: "अपलोड हुआ",
  docsContinue: "जारी रखें",
  docsRequired: "आवश्यक",
  docsOptional: "वैकल्पिक",
  docsInvalid: "कृपया 5 MB से कम का PDF या छवि अपलोड करें।",
  docsChooseFile: "फ़ाइल चुनें",
  docsTakePhoto: "या फ़ोटो लें",

  reviewTitle: "अपना दावा देखें",
  reviewSubtitle: "जमा कराने से पहले सब कुछ सही देखें।",
  reviewPurpose: "दावे का उद्देश्य",
  reviewReason: "कारण",
  reviewClaimant: "दावेदार",
  reviewUan: "UAN",
  reviewBank: "बैंक खाता",
  reviewDocuments: "दस्तावेज़",
  reviewSubmit: "दावा जमा करें",
  reviewConfirmTitle: "दावा जमा करें?",
  reviewConfirmBody: "इसे वापस नहीं लिया जा सकता। हम इसे सत्यापन के लिए भेजेंगे।",
  reviewConfirm: "हाँ, जमा करें",
  notNow: "अभी नहीं",
  submitFailed: "हम आपका दावा जमा नहीं कर सके। आपकी प्रगति सहेजी गई है — फिर कोशिश करें।",

  submitSuccess: "आप हो गए।",
  submitBody: "आपका दावा अब सत्यापन के अधीन है।",
  submitRef: "संदर्भ संख्या",
  submitTrack: "दावा ट्रैक करें",

  trackerTitle: "आपके दावे की स्थिति",
  trackerSubtitle: "हम हर कदम को सरल भाषा में समझाते हैं।",
  trackerStage: "वर्तमान चरण",
  trackerAction: "आपको क्या करना है",

  back: "वापस",
  cancel: "रद्द करें",
  confirm: "पुष्टि करें",
  retry: "फिर कोशिश",
  loading: "लोड हो रहा है…",
  errorTitle: "कुछ गलत हुआ",
  networkError: "नेटवर्क समस्या। आपकी प्रगति सहेजी गई है — फिर कोशिश करें।",
  close: "बंद करें",
  skip: "अभी छोड़ें",

  stepReason: "कारण",
  stepVerify: "सत्यापन",
  stepDocs: "दस्तावेज़",
  stepReview: "समीक्षा",
};

const DICTS: Record<Lang, Dict> = { en, hi };

export function translate(lang: Lang, key: string, vars?: Record<string, string | number>): string {
  const dict = DICTS[lang] ?? en;
  let value = dict[key] ?? en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      value = value.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return value;
}
