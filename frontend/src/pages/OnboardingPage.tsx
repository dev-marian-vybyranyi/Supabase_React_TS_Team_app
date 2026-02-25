import { useState } from "react";
import { supabase } from "../supabaseClient";
import type {
  OnboardingFormValues,
  OnboardingMode,
} from "../types/onboarding.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OnboardingForm } from "../components/OnboardingForm";

interface OnboardingPageProps {
  onComplete: () => void;
}

export default function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [mode, setMode] = useState<OnboardingMode>("create");

  const initialValues: OnboardingFormValues = {
    inputValue: "",
  };

  const handleSubmit = async (
    values: OnboardingFormValues,
    {
      setSubmitting,
      setStatus,
    }: import("formik").FormikHelpers<OnboardingFormValues>,
  ) => {
    setStatus(null);
    try {
      const payload =
        mode === "create"
          ? { name: values.inputValue }
          : { invite_code: values.inputValue };

      const { data, error: funcError } = await supabase.functions.invoke(
        "onboarding",
        {
          body: { action: mode, payload },
        },
      );

      if (funcError) throw funcError;
      if (data?.error) throw new Error(data.error);

      onComplete();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setStatus(error.message);
      } else {
        setStatus("An error occurred. Please check the data.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome!</CardTitle>
          <CardDescription>To get started, you need a team.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-4 mb-6">
            <button
              type="button"
              onClick={() => setMode("create")}
              className={`px-4 py-2 border-b-2 transition-colors ${
                mode === "create"
                  ? "border-green-600 text-green-700 font-semibold"
                  : "border-transparent text-gray-500"
              }`}
            >
              Create new
            </button>
            <button
              type="button"
              onClick={() => setMode("join")}
              className={`px-4 py-2 border-b-2 transition-colors ${
                mode === "join"
                  ? "border-green-600 text-green-700 font-semibold"
                  : "border-transparent text-gray-500"
              }`}
            >
              Join
            </button>
          </div>

          <OnboardingForm
            mode={mode}
            initialValues={initialValues}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
}
