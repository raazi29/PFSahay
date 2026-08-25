import type {
  ClaimReasonKey,
  ClassificationOutput,
  StatusOutput,
  ValidationOutput,
} from "@/lib/types";
import type { MockUser } from "@/lib/mock-data/user";
import { classifyReasonKey, classifyText } from "@/lib/claim-engine/classification";
import { validateUser } from "@/lib/claim-engine/validation";

// PFSahay uses a deterministic "AI" engine for reliable demo execution. Every
// function returns the same JSON-shaped output an OpenAI structured-output call
// would. To plug in a real model later, replace the body of each function with
// an API call and keep the returned shape identical — the UI only depends on it.

const LATENCY_MS = 600;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

export async function classifyReason(
  input: ClaimReasonKey | string
): Promise<ClassificationOutput> {
  if (typeof input === "string") {
    const key = classifyText(input);
    return delay(classifyReasonKey(key));
  }
  return delay(classifyReasonKey(input));
}

export async function validateRecords(
  user: MockUser,
  resolved: string[] = []
): Promise<ValidationOutput> {
  return delay(validateUser(user, resolved));
}

const STATUS_COPY: Record<string, StatusOutput> = {
  submitted: {
    status: "submitted",
    headline: "Your claim has been submitted.",
    explanation: "We have received your claim. It is now in the queue for checking.",
    user_action_required: false,
  },
  under_verification: {
    status: "under_verification",
    headline: "Your claim is being checked.",
    explanation:
      "Your submitted information is currently being verified. You don't need to do anything right now.",
    user_action_required: false,
  },
  query_raised: {
    status: "query_raised",
    headline: "We need one more thing from you.",
    explanation:
      "An officer has raised a query on your claim. Please check the details and respond.",
    user_action_required: true,
    next_action: "Open the query and upload the requested document.",
  },
  approved: {
    status: "approved",
    headline: "Your claim is approved.",
    explanation: "Your claim has been approved and is being prepared for payment.",
    user_action_required: false,
  },
  disbursed: {
    status: "disbursed",
    headline: "Your money is on the way.",
    explanation: "The approved amount has been sent to your linked bank account.",
    user_action_required: false,
  },
};

export async function explainStatus(status: string): Promise<StatusOutput> {
  const out = STATUS_COPY[status] ?? STATUS_COPY.under_verification;
  return delay(out);
}
