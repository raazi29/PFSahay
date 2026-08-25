import type { ClaimPathKey, ClaimReasonKey } from "@/lib/types";

export interface ReasonMeta {
  key: ClaimReasonKey;
  label: string; // English
  labelHi: string;
  path: ClaimPathKey;
  explanation: string; // English plain-language
  explanationHi: string;
}

// The six supported reasons plus "something else".
export const REASONS: ReasonMeta[] = [
  {
    key: "job_change",
    label: "I changed jobs",
    labelHi: "मैंने नौकरी बदली है",
    path: "full_settlement",
    explanation: "You want to settle your PF after leaving your previous job.",
    explanationHi: "आप अपनी पिछली नौकरी छोड़ने के बाद अपना PF सेटल करना चाहते हैं।",
  },
  {
    key: "unemployed",
    label: "I'm unemployed",
    labelHi: "मैं बेरोज़गार हूँ",
    path: "full_settlement",
    explanation: "You have been out of work and want to withdraw your full balance.",
    explanationHi: "आप बिना काम के हैं और अपना पूरा बैलेंस निकालना चाहते हैं।",
  },
  {
    key: "medical",
    label: "Medical treatment",
    labelHi: "चिकित्सा उपचार",
    path: "partial_withdrawal",
    explanation: "You can withdraw a part of your PF for medical treatment.",
    explanationHi: "आप चिकित्सा उपचार के लिए PF का कुछ हिस्सा निकाल सकते हैं।",
  },
  {
    key: "education",
    label: "Education",
    labelHi: "शिक्षा",
    path: "partial_withdrawal",
    explanation: "You can make a partial withdrawal from your PF for education.",
    explanationHi: "आप शिक्षा के लिए PF से आंशिक निकासी कर सकते हैं।",
  },
  {
    key: "house",
    label: "Buying or building a house",
    labelHi: "घर खरीदना या बनाना",
    path: "partial_withdrawal",
    explanation: "You can make a partial withdrawal from your PF for a home.",
    explanationHi: "आप घर के लिए PF से आंशिक निकासी कर सकते हैं।",
  },
  {
    key: "retirement",
    label: "Retirement",
    labelHi: "सेवानिवृत्ति",
    path: "pension_claim",
    explanation: "You are retiring and can claim your pension and balance.",
    explanationHi: "आप सेवानिवृत्त हो रहे हैं और अपनी पेंशन व बैलेंस का दावा कर सकते हैं।",
  },
  {
    key: "other",
    label: "Something else",
    labelHi: "कोई और कारण",
    path: "needs_clarification",
    explanation: "",
    explanationHi: "",
  },
];

export interface PathMeta {
  key: ClaimPathKey;
  label: string;
  labelHi: string;
  summary: string;
  summaryHi: string;
}

export const CLAIM_PATHS: Record<ClaimPathKey, PathMeta> = {
  full_settlement: {
    key: "full_settlement",
    label: "Full PF settlement",
    labelHi: "पूर्ण PF सेटलमेंट",
    summary:
      "This settles your entire PF balance and moves it to your bank account. Best when you have changed jobs or are unemployed.",
    summaryHi:
      "यह आपका पूरा PF बैलेंस सेटल करके बैंक खाते में भेजता है। नौकरी बदलने या बेरोज़गार होने पर सबसे अच्छा है।",
  },
  partial_withdrawal: {
    key: "partial_withdrawal",
    label: "Partial withdrawal",
    labelHi: "आंशिक निकासी",
    summary:
      "This withdraws only a portion of your PF for your stated need, keeping the account active.",
    summaryHi:
      "यह आपकी ज़रूरत के लिए PF का केवल कुछ हिस्सा निकालता है और खाता सक्रिय रखता है।",
  },
  pension_claim: {
    key: "pension_claim",
    label: "Pension claim",
    labelHi: "पेंशन दावा",
    summary:
      "This claims your pension benefit along with your PF balance at retirement.",
    summaryHi: "यह सेवानिवृत्ति पर आपके PF बैलेंस के साथ पेंशन लाभ का दावा करता है।",
  },
  needs_clarification: {
    key: "needs_clarification",
    label: "Let's understand this better",
    labelHi: "इसे बेहतर समझते हैं",
    summary: "We need a little more detail to pick the right claim for you.",
    summaryHi: "सही दावा चुनने के लिए हमें थोड़ी और जानकारी चाहिए।",
  },
};
