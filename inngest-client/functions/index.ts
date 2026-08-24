// src/inngest/functions.ts
import { inngest } from "@/inngest-client/client";
import prisma from "@/lib/db";
import { indexCodebase } from "@/module/ai/lib/rag";
import { getRepoFileContents } from "@/module/github/lib/github";

export const indexRepo = inngest.createFunction(
  {
    id: "index-repo",
    triggers: {
      event: "repository.connected",
    },
  },
  async ({ event, step }) => {
    const { owner, repo, userId } = event.data;

    // Step 1: Fetch repo files
    const files = await step.run("fetch-files", async () => {
      const account = await prisma.account.findFirst({
        where: {
          userId,
          providerId: "github",
        },
        select: {
          accessToken: true, // Only fetch accessToken to avoid JSON serialization errors
        },
      });

      if (!account?.accessToken) {
        throw new Error("No GitHub access token found");
      }

      return await getRepoFileContents(account.accessToken, owner, repo);
    });

    // Step 2: Index codebase
    await step.run("index-codebase", async () => {
      // Return the output so Inngest can record and return it
      await indexCodebase(`${owner}/${repo}`, files);
    });
    return { success: true, indexedFiles: files.length };
  },
);
