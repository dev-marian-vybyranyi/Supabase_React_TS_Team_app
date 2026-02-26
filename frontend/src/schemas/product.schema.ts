import * as Yup from "yup";

export const createProductSchema = Yup.object().shape({
  title: Yup.string().trim().required("Title is required"),
  description: Yup.string().trim(),
});
