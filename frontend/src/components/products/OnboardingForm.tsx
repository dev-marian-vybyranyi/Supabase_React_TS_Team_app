import { Field, Form, Formik, type FormikHelpers } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { onboardingSchema } from "../../schemas/onboarding.schema";
import type {
  OnboardingFormValues,
  OnboardingMode,
} from "../../types/onboarding.types";

interface OnboardingFormProps {
  mode: OnboardingMode;
  initialValues: OnboardingFormValues;
  onSubmit: (
    values: OnboardingFormValues,
    helpers: FormikHelpers<OnboardingFormValues>,
  ) => Promise<void>;
}

export function OnboardingForm({
  mode,
  initialValues,
  onSubmit,
}: OnboardingFormProps) {
  return (
    <Formik
      key={mode}
      initialValues={initialValues}
      validationSchema={onboardingSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, status, errors, touched }) => (
        <Form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inputValue">
              {mode === "create" ? "Team name:" : "Invite code:"}
            </Label>
            <Field name="inputValue">
              {({ field }: any) => (
                <Input
                  {...field}
                  id="inputValue"
                  type="text"
                  placeholder={
                    mode === "create"
                      ? "Enter team name..."
                      : "Enter invite code..."
                  }
                  className={
                    errors.inputValue && touched.inputValue
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "focus-visible:ring-green-600"
                  }
                />
              )}
            </Field>
            {errors.inputValue && touched.inputValue && (
              <p className="text-sm font-medium text-red-500">
                {errors.inputValue as string}
              </p>
            )}
          </div>

          {status && (
            <p className="text-sm font-medium text-red-500">{status}</p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {isSubmitting ? "Please wait..." : "Confirm"}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
