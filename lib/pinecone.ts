import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";

export class PineconeStoreSingleton {
  private static instance: PineconeStoreSingleton;
  private pineconeStore: PineconeStore | null = null;

  private constructor() {}

  public static getInstance(): PineconeStoreSingleton {
    if (!PineconeStoreSingleton.instance) {
      PineconeStoreSingleton.instance = new PineconeStoreSingleton();
    }
    return PineconeStoreSingleton.instance;
  }

  public async getVectorStore(): Promise<PineconeStore> {
    if (!this.pineconeStore) {
      console.log("Creating pinecone store...");
      const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!,
      });

      const index = pinecone.Index(process.env.PINECONE_INDEX!);

      this.pineconeStore = new PineconeStore(
        new OpenAIEmbeddings({
          apiKey: process.env.OPENAI_API_KEY!,
        }),
        {
          pineconeIndex: index,
        },
      );
    } else {
      console.log("Using existing pinecone store...");
    }

    return this.pineconeStore;
  }
}
