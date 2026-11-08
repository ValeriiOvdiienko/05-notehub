import css from "./App.module.css";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearcBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
// імпорти складових для запитів
import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchNotes, createNote, deleteNote } from "../../services/noteService";
// імпорти хуків
import { useState } from "react";

function App() {
  // useState для реалізації пагінації
  const [currentPage, setCurrentPage] = useState<number>(1);
  const handlePageChange = (nextPage: number) => {
    setCurrentPage(nextPage);
  };
  // useState-прапорець для модалки
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const closeModal = () => {
    setIsModalOpen(false);
  };
  //
  const queryClient = useQueryClient();
  // запити на бекенд
  const { data, isError } = useQuery({
    queryKey: ["notes", currentPage],
    queryFn: async () => {
      const response = await fetchNotes("", currentPage);
      if (!response) throw new Error("some error");
      return response;
    },
    placeholderData: keepPreviousData,
    retry: false,
  });
  // Мутація для створення нотатки
  const { mutateAsync: createNoteMutation } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      closeModal();
    },
    onError: (error) => {
      console.log(error.message);
    },
  });
  // Мутація для видалення нотатки (тепер вона йде окремо)
  const { mutate: deleteNoteMutation } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      console.log(error.message);
    },
  });
  // обробка data в необхідних змінних
  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 0;

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox />
          {totalPages > 1 && !isError && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
          <button
            className={css.button}
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Create note +
          </button>
          {isModalOpen && (
            <Modal
              onClose={closeModal}
              children={<NoteForm onSubmit={createNoteMutation} />}
            />
          )}
        </header>
        {notes.length > 0 && (
          <NoteList notes={notes} onDelete={deleteNoteMutation} />
        )}
      </div>
    </>
  );
}

export default App;
