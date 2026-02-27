import { useState } from "react";
import toast from "react-hot-toast";
import { ArrowRightLeft } from "lucide-react";

import { useAuthStore } from "../store/authStore";
import { useProductStore } from "../store/productStore";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { OnboardingForm } from "./products/OnboardingForm";
import type {
  OnboardingFormValues,
  OnboardingMode,
} from "../types/onboarding.types";

export function SwitchTeamDialog() {
  const [isSwitchTeamOpen, setIsSwitchTeamOpen] = useState(false);
  const [switchMode, setSwitchMode] = useState<OnboardingMode>("create");

  const handleSwitchTeamSubmit = async (
    values: OnboardingFormValues,
    {
      setSubmitting,
      setStatus,
    }: import("formik").FormikHelpers<OnboardingFormValues>,
  ) => {
    setStatus(null);
    try {
      const payload =
        switchMode === "create"
          ? { name: values.inputValue, display_name: values.displayName }
          : {
              invite_code: values.inputValue,
              display_name: values.displayName,
            };

      await useAuthStore.getState().switchTeam(switchMode, payload);

      toast.success(
        switchMode === "create"
          ? "Team created successfully!"
          : "Joined team successfully!",
      );

      setIsSwitchTeamOpen(false);
      useProductStore.getState().setPage(1);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        setStatus(error.message);
      } else {
        toast.error("An error occurred. Please check the data.");
        setStatus("An error occurred. Please check the data.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isSwitchTeamOpen} onOpenChange={setIsSwitchTeamOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          <ArrowRightLeft className="w-4 h-4 mr-2" />
          Change Team
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Team</DialogTitle>
          <DialogDescription>
            Join an existing team or create a new one. This will change your
            active team.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center gap-4 mb-4">
          <button
            type="button"
            onClick={() => setSwitchMode("create")}
            className={`px-4 py-2 border-b-2 transition-colors ${
              switchMode === "create"
                ? "border-green-600 text-green-700 font-semibold"
                : "border-transparent text-gray-500"
            }`}
          >
            Create new
          </button>
          <button
            type="button"
            onClick={() => setSwitchMode("join")}
            className={`px-4 py-2 border-b-2 transition-colors ${
              switchMode === "join"
                ? "border-green-600 text-green-700 font-semibold"
                : "border-transparent text-gray-500"
            }`}
          >
            Join
          </button>
        </div>

        <OnboardingForm
          mode={switchMode}
          initialValues={{ displayName: "", inputValue: "" }}
          onSubmit={handleSwitchTeamSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
