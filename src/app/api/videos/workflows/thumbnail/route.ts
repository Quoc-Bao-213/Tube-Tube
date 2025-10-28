import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs";
import { gemini } from "@/lib/gemini";
import { UTApi } from "uploadthing/server";

interface InputType {
  userId: string;
  videoId: string;
  prompt: string;
}

export const { POST } = serve(async (context) => {
  const utapi = new UTApi();
  const input = context.requestPayload as InputType;
  const { userId, videoId, prompt } = input;

  const video = await context.run("get-video", async () => {
    const [existingVideo] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));

    if (!existingVideo) {
      throw new Error("Video not found");
    }

    return existingVideo;
  });

  //  const tempThumbnailUrl = await context.run("generate-thumbnail", async () => {
  //    const generatedThumbnail = await gemini.models.generateContent({
  //      model: "gemini-2.0-flash-preview-image-generation",
  //      config: {
  //        responseModalities: ["IMAGE", "TEXT"],
  //      },
  //      contents: [
  //        {
  //          role: "user",
  //          parts: [{ text: prompt }],
  //        },
  //      ],
  //    });

  //    const candidate = generatedThumbnail.candidates?.[0];

  //    if (candidate?.finishReason === "SAFETY") {
  //      throw new Error("Image generation was blocked due to safety policies.");
  //    }
  //    if (!candidate) {
  //      throw new Error("No candidates returned from Gemini.");
  //    }

  //    const imagePart = candidate.content?.parts?.find((part) => part.inlineData);

  //    if (!imagePart || !imagePart.inlineData) {
  //      console.error(
  //        "DEBUG: Full response parts:",
  //        JSON.stringify(candidate.content?.parts, null, 2)
  //      );
  //      throw new Error(
  //        "Image data (inlineData) was not found in the Gemini response."
  //      );
  //    }

  //    const mimeType = imagePart.inlineData.mimeType;
  //    const base64Data = imagePart.inlineData.data;

  //    if (!mimeType || !base64Data) {
  //      throw new Error(
  //        "MimeType or Base64 data is missing from the inlineData object."
  //      );
  //    }

  //    const dataUrl = `data:${mimeType};base64,${base64Data}`;

  //    return dataUrl;
  //  });

  //   if (!tempThumbnailUrl) {
  //     throw new Error("Thumbnail not generated");
  //   }

  await context.run("cleanup-thumbnail", async () => {
    if (video.thumbnailKey) {
      await utapi.deleteFiles(video.thumbnailKey);
      await db
        .update(videos)
        .set({ thumbnailUrl: null, thumbnailKey: null })
        .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
    }
  });

  // const uploadedThumbnail = await context.run("upload-thumbnail", async () => {
  //   const { data } = await utapi.uploadFilesFromUrl(tempThumbnailUrl);

  //   if (!data) {
  //     throw new Error("Thumbnail not uploaded");
  //   }

  //   return data;
  // });

  const uploadedThumbnail = await context.run(
    "generate-and-upload-thumbnail",
    async () => {
      const generatedThumbnail = await gemini.models.generateContent({
        model: "gemini-2.0-flash-preview-image-generation",
        config: { responseModalities: ["IMAGE", "TEXT"] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const candidate = generatedThumbnail.candidates?.[0];

      if (candidate?.finishReason === "SAFETY" || !candidate) {
        throw new Error("Image generation failed or was blocked.");
      }

      const imagePart = candidate.content?.parts?.find(
        (part) => part.inlineData
      );

      if (!imagePart || !imagePart.inlineData) {
        throw new Error("Image data (inlineData) was not found.");
      }

      const { mimeType, data: base64Data } = imagePart.inlineData;

      if (!mimeType || !base64Data) {
        throw new Error("MimeType or Base64 data is missing.");
      }

      const imageBuffer = Buffer.from(base64Data, "base64");
      const imageFile = new File([imageBuffer], `thumbnail-${videoId}.png`, {
        type: mimeType,
      });

      try {
        const uploadResults = await utapi.uploadFiles([imageFile]);

        if (!uploadResults || uploadResults.length === 0) {
          throw new Error("UploadThing returned an empty result.");
        }

        const uploadedFile = uploadResults[0];

        if (uploadedFile.error) {
          console.error("UploadThing file-specific error:", uploadedFile.error);
          throw new Error(uploadedFile.error.message);
        }

        return uploadedFile.data;
      } catch (error) {
        console.error("An error occurred during upload:", error);
        throw new Error("Thumbnail upload failed.");
      }
    }
  );

  await context.run("update-video", async () => {
    await db
      .update(videos)
      .set({
        thumbnailKey: uploadedThumbnail.key,
        thumbnailUrl: uploadedThumbnail.ufsUrl,
      })
      .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
  });
});
