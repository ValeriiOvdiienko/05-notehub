import css from "./NoteForm.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
//
type allowedTags = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
// інтерфейс початковвих значень
interface NoteFormValues {
  title: string;
  content: string;
  tag: allowedTags;
}
// пропс для прийому даних форми
interface NoteFormProps {
  onSubmit: (values: NoteFormValues) => void;
}
//
const initialValues: NoteFormValues = {
  title: "",
  content: "",
  tag: "Todo",
};
export default function NoteForm({ onSubmit }: NoteFormProps) {
  const handleSubmit = (
    values: NoteFormValues,
    actions: FormikHelpers<NoteFormValues>,
  ) => {
    onSubmit(values);
    console.log(values);
    actions.resetForm();
  };
  // валідація
  const NoteFormSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, "Title must be at least 2 characters")
      .max(50, "Title is too long")
      .required("Title is required"),
    content: Yup.string()
      .max(500, "Description of notes is too long")
      .required(),
    tag: Yup.string().required(),
  });
  //
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={NoteFormSchema}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage component="span" name="title" className={css.error} />
        </div>
        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            id="content"
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage component="span" name="content" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" id="tag" name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage component="span" name="tag" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={false}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
