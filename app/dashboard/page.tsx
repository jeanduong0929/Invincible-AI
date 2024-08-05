"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { MDXRemote } from "next-mdx-remote";
import { instance } from "@/lib/axios-config";
import { serialize } from "next-mdx-remote/serialize";

const DashboardPage = () => {
  const [output, setOutput] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await instance.get("/chat");
      const mdxSource = await serialize(data.result);
      setOutput(mdxSource);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex h-[80vh] w-full flex-col items-center justify-center"
    >
      <div className="w-full flex-grow overflow-auto p-4">
        {loading ? (
          <div className="flex h-full flex-col items-center justify-center gap-5">
            <h3 className="animate-bounce text-2xl font-bold">Generating...</h3>
          </div>
        ) : output ? (
          <div className="whitespace-pre-wrap">
            <MDXRemote {...output} />
          </div>
        ) : null}
      </div>
      <Button type="submit">Generate Program</Button>
    </form>
  );
};

export default DashboardPage;
