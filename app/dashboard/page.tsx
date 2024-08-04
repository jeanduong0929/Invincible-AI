"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { instance } from "@/lib/axios-config";

const DashboardPage = () => {
  const [text, setText] = React.useState<string>("");

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data } = await instance.post("/chat", {
        text,
      });

      console.log("Data: ", data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center">
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col items-center gap-10"
      >
        <textarea
          onChange={(e) => setText(e.target.value)}
          value={text}
          cols={100}
          rows={10}
          className="p-2"
        />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default DashboardPage;
