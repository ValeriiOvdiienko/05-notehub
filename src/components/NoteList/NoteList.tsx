import css from "./NoteList.module.css";
import type { Note } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../services/noteService";

// пропс, у який буде передаватись масив для рендеру
interface NoteListProps {
  notes: Note[];
}

// компонент, який отримує від батька аргумент через пропс (список для рендеру)
// рендер через метод map
// кожен об'єкт деструктуризований на потрібні властивості
export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const { mutate: deleteNoteMutation } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  return (
    <ul className={css.list}>
      {notes.map(({ id, title, content, tag }) => (
        <li className={css.listItem} key={id}>
          <h2 className={css.title}>{title}</h2>
          <p className={css.content}>{content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{tag}</span>
            <button
              className={css.button}
              onClick={() => deleteNoteMutation(id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
