import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";

export class VectorStore {
  private static instance: VectorStore | null = null;
  private vectorStore: PineconeStore | null = null;

  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new VectorStore();
    }
    return this.instance;
  }

  public async getVectorStore() {
    if (!this.vectorStore) {
      const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!,
      });

      const index = pinecone.Index(process.env.PINECONE_INDEX!);

      this.vectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings(),
        { pineconeIndex: index },
      );
    }
    return this.vectorStore.asRetriever({
      k: 5,
    });
  }
}
