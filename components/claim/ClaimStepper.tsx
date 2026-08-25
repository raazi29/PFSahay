"use client";

import { Stepper, type Step } from "@/components/ui/Stepper";
import { useLanguage } from "@/context/LanguageContext";

export function ClaimStepper({ current }: { current: "reason" | "verify" | "docs" | "review" }) {
  const { t } = useLanguage();
  const steps: Step[] = [
    { key: "reason", label: t("stepReason") },
    { key: "verify", label: t("stepVerify") },
    { key: "docs", label: t("stepDocs") },
    { key: "review", label: t("stepReview") },
  ];
  return <Stepper steps={steps} current={current} />;
}
