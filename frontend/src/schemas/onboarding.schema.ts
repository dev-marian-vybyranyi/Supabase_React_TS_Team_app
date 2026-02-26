import * as Yup from "yup";

export const onboardingSchema = Yup.object().shape({
  displayName: Yup.string().trim().required("Name is required"),
  inputValue: Yup.string().trim().required("This field is required"),
});
