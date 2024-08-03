"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import {
  BrainIcon,
  ChartColumn,
  Database,
  LockIcon,
  MoonIcon,
  PhoneIcon,
  Recycle,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      description:
        "Workout Generation AI-powered personalized powerlifting routines using RAG technology and LangChain.",
      icon: <BrainIcon size={50} />,
    },
    {
      description:
        "Progress Tracking Monitor and visualize your strength gains, personal records, and workout consistency.",
      icon: <ChartColumn size={50} />,
    },
    {
      description:
        "Secure Authentication User accounts and data protection implemented with Clerk integration.",
      icon: <LockIcon size={50} />,
    },
    {
      description:
        "Vector Database Efficient storage and retrieval of workout data using Pinecone for fast, relevant results.",
      icon: <Database size={50} />,
    },
    {
      description:
        "Dark Mode Eye-friendly interface with toggleable light and dark themes for comfortable viewing.",
      icon: <MoonIcon size={50} />,
    },
    {
      description:
        "Responsive Design Seamless experience across devices, built with Next.js and styled using Tailwind CSS.",
      icon: <Recycle size={50} />,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <h1 className="font-heading pt-24 text-3xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
        Be Invincible
      </h1>
      <h3 className="sm:text-md max-w-[42rem] text-center leading-normal text-muted-foreground sm:leading-8">
        Unleash Your Strength Potential with AI-Powered Powerlifting Plans Our
        advanced RAG system analyzes proven powerlifting techniques to create a
        workout plan tailored just for you. Ready to elevate your training?
      </h3>
      <div>
        <Link href={"/dashboard"}>
          <Button>Get Started</Button>
        </Link>
      </div>

      <h1 className="font-heading pt-24 text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">
        Features
      </h1>

      <div className="grid grid-cols-3 items-center gap-5">
        {features.map((feature, index) => (
          <Card>
            <CardHeader>
              {feature.icon}
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
