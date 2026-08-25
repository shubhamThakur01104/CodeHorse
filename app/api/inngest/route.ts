import { serve } from "inngest/next";
import { indexRepo } from "@/inngest-client/functions";
import { inngest } from "@/inngest-client/client";
import { generateReview } from "@/inngest-client/functions/review";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [indexRepo, generateReview],
});
