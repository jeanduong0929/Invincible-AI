import { NextRequest, NextResponse } from "next/server";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PineconeStoreSingleton } from "@/lib/pinecone";

export const POST = async (req: NextRequest) => {
  try {
    const file = await getFileFromRequest(req);
    if (!file) {
      return NextResponse.json({ error: "No file selected" }, { status: 400 });
    }

    const docs = await loadDocumentFromFile(file);
    const result = await processDocument(file.name, docs);

    if (result.exists) {
      return NextResponse.json(
        { message: "Document already exists" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { message: "File processed successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
};

/*
 * ############################## HELPER FUNCTIONS ##############################
 */

async function getFileFromRequest(req: NextRequest): Promise<File | null> {
  const data = await req.formData();
  return data.get("file") as File | null;
}

async function loadDocumentFromFile(file: File) {
  const loader = new TextLoader(file);
  const docs = await loader.load();
  docs[0].metadata = { ...docs[0].metadata, source: file.name };
  return docs;
}

async function processDocument(
  fileName: string,
  docs: any[],
): Promise<{ exists: boolean }> {
  const vectorStore =
    await PineconeStoreSingleton.getInstance().getVectorStore();
  const existingDocs = await vectorStore.similaritySearch("", 1, {
    source: fileName,
  });

  if (existingDocs.length === 0) {
    console.log("Adding documents to pinecone store...");
    await vectorStore.addDocuments(docs);
    return { exists: false };
  } else {
    console.log("Document already exists in pinecone store...");
    return { exists: true };
  }
}
