import { PrismaClient } from "@prisma/client";

export class PrismaClientSingleton {
  private static instance: PrismaClientSingleton | null = null;
  private prisma: any;

  private constructor() {}

  public static getInstance(): PrismaClientSingleton {
    if (!PrismaClientSingleton.instance) {
      PrismaClientSingleton.instance = new PrismaClientSingleton();
    }
    return PrismaClientSingleton.instance;
  }

  public getPrisma() {
    if (!this.prisma) {
      console.log("Creating PrismaClient...");
      this.prisma = new PrismaClient();
    } else {
      console.log("Using existing PrismaClient...");
    }
    return this.prisma;
  }
}
