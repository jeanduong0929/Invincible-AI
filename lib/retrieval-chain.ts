import { OpenAI } from "@langchain/openai";
import { VectorStore } from "./pinecone";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";

export class RetrieverChain {
  private static instance: RetrieverChain | null = null;
  private static retrieverChain: any;

  static getInstance() {
    if (!this.instance) {
      this.instance = new RetrieverChain();
    }
    return this.instance;
  }

  public async getRetrieverChain() {
    if (!RetrieverChain.retrieverChain) {
      // OpenAI model
      const llm = new OpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY!,
        modelName: "gpt-3.5-turbo",
        temperature: 0.1,
      });

      // Pinecone retriever
      const vectorStore = VectorStore.getInstance();
      const retriever = await vectorStore.getVectorStore();

      // Prompt
      const systemTemplate = `You are an expert powerlifting coach specializing in the International Powerlifting Federation (IPF) style of competition. Your task is to create a personalized workout plan based on the following context and user information:
                              User Information:
                              - Experience Level: {experience_level}
                              - Age: {age}
                              - Weight: {weight}
                              - Gender: {gender}
                              - Current 1RM for Squat: {squat_1rm}
                              - Current 1RM for Bench Press: {bench_1rm}
                              - Current 1RM for Deadlift: {deadlift_1rm}
                              - Available training days per week: {training_days}
                              - Primary goal: {primary_goal}

                              Using the provided context and user information, create a detailed 12-week periodize that focuses on improving the user's performance in the squat, bench press, and deadlift. Include the following in your response:

                              1. A brief explanation of the programming philosophy and how it aligns with IPF-style powerlifting.
                              2. A weekly overview of the training structure.
                              3. Detailed daily workouts for each training day, including:
                                - Main lifts with sets, reps, and percentage of 1RM
                                - Accessory exercises with sets and reps
                                - Rest periods between sets
                              4. Guidelines for warm-up and cool-down routines.
                              5. Recommendations for nutrition and recovery strategies.
                              6. Any specific technical cues or form tips for the main lifts.

                              Ensure that the program is tailored to the user's experience level, goals, and available training time. Provide clear explanations for your choices and any necessary modifications based on the user's information.
                              
                              ---
                              context: {context}
                              ---
                              `;

      const humanTemplate = "{input}";
      const chatPrompt = ChatPromptTemplate.fromMessages([
        ["system", systemTemplate],
        ["human", humanTemplate],
      ]);

      const stuffDocumentChain = await createStuffDocumentsChain({
        llm: llm,
        prompt: chatPrompt,
      });

      RetrieverChain.retrieverChain = await createRetrievalChain({
        retriever: retriever,
        combineDocsChain: stuffDocumentChain,
      });
    }
    return RetrieverChain.retrieverChain;
  }
}
