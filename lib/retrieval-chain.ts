import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { PineconeStoreSingleton } from "./pinecone";
import { Runnable } from "@langchain/core/runnables";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";

export class RetrieverChainSingleton {
  private static instance: RetrieverChainSingleton;
  private retrieverChain: Runnable | null = null;

  private constructor() {}

  public static getInstance(): RetrieverChainSingleton {
    if (!this.instance) {
      this.instance = new RetrieverChainSingleton();
    }
    return this.instance;
  }

  public async getRetrieverChain(): Promise<Runnable> {
    if (!this.retrieverChain) {
      console.log("Creating retrieval chain...");

      const llm = new ChatOpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY!,
        modelName: "gpt-4o-mini",
        temperature: 0.1,
      });

      const pineconeStore =
        await PineconeStoreSingleton.getInstance().getVectorStore();
      const retriever = pineconeStore.asRetriever({ k: 5 });

      const chatPrompt = ChatPromptTemplate.fromMessages([
        ["system", this.getSystemTemplate()],
        ["human", "{input}"],
      ]);

      const stuffDocumentChain = await createStuffDocumentsChain({
        llm,
        prompt: chatPrompt,
      });

      this.retrieverChain = await createRetrievalChain({
        retriever,
        combineDocsChain: stuffDocumentChain,
      });
    } else {
      console.log("Using existing retrieval chain...");
    }

    return this.retrieverChain;
  }

  /*
   * ############################## HELPER FUNCTIONS ##############################
   */

  private getSystemTemplate(): string {
    return `You are an expert powerlifting coach specializing in the International Powerlifting Federation (IPF) style of competition. Your task is to create a personalized workout plan to achieve my SBD goals based on the following context and user information:
            User Information:
            - Experience Level: {experience_level}
            - Age: {age}
            - Weight: {weight}
            - Gender: {gender}
            - Current 1RM for Squat: {squat_1rm}
            - Current 1RM for Bench Press: {bench_1rm}
            - Current 1RM for Deadlift: {deadlift_1rm}
            - Available training days per week: {training_days}
            - Goal 1RM for Squat: {goal_squat_1rm}
            - Goal 1RM for Bench Press: {goal_bench_1rm}
            - Goal 1RM for Deadlift: {goal_deadlift_1rm}

            Using the provided context and user information, create a detailed 12-week periodize that focuses on improving the user's performance in the squat, bench press, and deadlift. Include the following in your response:

            2. A weekly overview of the training structure.
            3. Detailed daily workouts for each training day, including:
              - Main lifts with sets, reps, and percentage of 1RM
              - Accessory exercises with sets and reps
              - Rest periods between sets
            4. Guidelines for warm-up and cool-down routines.

            Ensure that the program is tailored to the user's experience level, goals, and available training time. Provide clear explanations for your choices and any necessary modifications based on the user's information.
            
            ---
            context: {context}
            ---`;
  }
}
