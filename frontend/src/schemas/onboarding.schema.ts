import * as Yup from "yup";

export const onboardingSchema = Yup.object().shape({
  inputValue: Yup.string().trim().required("This field is required"),
});
