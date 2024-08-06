"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/profile/combo-box";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { instance } from "@/lib/axios-config";
import { FormSchema } from "@/form-schemas/profile-schema";
import { Gender } from "@/models/gender";
import { Experience } from "@/models/experience";
import { Profile } from "@/models/profile";

type FormValues = z.infer<typeof FormSchema>;

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [genders, setGenders] = useState<Gender[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, experiencesData, gendersData] = await Promise.all([
          instance.get("/profile").catch(() => ({ data: { profile: null } })),
          instance.get("/experience"),
          instance.get("/gender"),
        ]);

        setProfile(profileData.data.profile);
        setExperiences(experiencesData.data.experiences);
        setGenders(gendersData.data.genders);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error fetching data",
          description: "Please try again later.",
          className: "bg-red-500 text-white",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (profile) {
      Object.entries(profile).forEach(([key, value]) => {
        if (key === "experience" || key === "gender") {
          form.setValue(key, value.name);
        } else {
          form.setValue(key as keyof FormValues, value);
        }
      });
    }
  }, [profile, form]);

  const onSubmit = async (formData: FormValues) => {
    try {
      await instance.post("/profile", formData);
      toast({
        title: "Profile updated",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        className: "bg-red-500 text-white",
      });
    }
  };

  if (loading) {
    return (
      <Loader2
        className="mx-auto flex h-[80vh] animate-spin flex-col items-center justify-center"
        size={60}
      />
    );
  }

  return (
    <Form {...form}>
      <form
        className="rounded-md border p-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h1 className="mb-5 text-2xl font-bold">Profile</h1>
        <div className="grid grid-cols-2 gap-5">
          {renderFormField("age", "Age", "Ex: 29")}
          {renderFormField("weight", "Weight (lbs)", "Ex: 175")}
          {renderFormField("trainingDays", "Training Days", "Ex: 6")}
          {renderCombobox("experience", "Experience", experiences)}
          {renderCombobox("gender", "Gender", genders)}
        </div>

        <div className="my-10 border-t" />

        <h1 className="mb-5 text-2xl font-bold">Goals</h1>
        <div className="grid grid-cols-2 gap-5">
          {renderFormField("currSquat", "Current Squat (lbs)", "Ex: 405")}
          {renderFormField("prSquat", "PR Squat (lbs)", "Ex: 455")}
          {renderFormField("currBench", "Current Bench (lbs)", "Ex: 315")}
          {renderFormField("prBench", "PR Bench (lbs)", "Ex: 335")}
          {renderFormField("currDeadlift", "Current Deadlift (lbs)", "Ex: 455")}
          {renderFormField("prDeadlift", "PR Deadlift (lbs)", "Ex: 495")}
        </div>

        <Button type="submit" className="mt-10">
          Save
        </Button>
      </form>
    </Form>
  );

  function renderFormField(
    name: keyof FormValues,
    label: string,
    placeholder: string,
  ) {
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="mt-5">
                <h2>{label}</h2>
                <Input
                  {...field}
                  type="number"
                  placeholder={placeholder}
                  className="mt-1 w-[300px]"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  function renderCombobox(
    name: keyof FormValues,
    label: string,
    options: Experience[] | Gender[],
  ) {
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Combobox
                label={label}
                options={options}
                className="mt-5"
                value={field.value}
                setValue={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
};

export default ProfilePage;
