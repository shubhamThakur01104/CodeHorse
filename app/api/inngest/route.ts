import { serve } from "inngest/next";
import { processTask } from "@/inngest-client/functions";
import { inngest } from "@/inngest-client/client";


export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processTask],
});
