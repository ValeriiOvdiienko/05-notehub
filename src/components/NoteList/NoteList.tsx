import css from "./NoteList.module.css";
import type { Note } from "../../types/note";
// пропс, у який буде передаватись масив для рендеру
interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => void;
}
// компонент, який отримує від батька аргумент через пропс (список для рендеру)
// рендер через метод map
// кожен об'єкт деструктуризований на потрібні властивості
export default function NoteList({ notes, onDelete }: NoteListProps) {
  return (
    <ul className={css.list}>
      {notes.map(({ id, title, content, tag }) => (
        <li className={css.listItem} key={id}>
          <h2 className={css.title}>{title}</h2>
          <p className={css.content}>{content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{tag}</span>
            <button className={css.button} onClick={() => onDelete(id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
