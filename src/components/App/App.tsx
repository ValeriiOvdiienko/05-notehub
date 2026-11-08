import css from "./App.module.css";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
// імпорти складових для запитів
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
// імпорти хуків
import { useState } from "react";
// імпорт дебаунсу
import { useDebouncedCallback } from "use-debounce";

function App() {
  // useState для запита по пошуку
  const [searchQuery, setSearchQuery] = useState<string>("");

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
  // запити на бекенд
  const { data, isError } = useQuery({
    queryKey: ["notes", currentPage, searchQuery],
    queryFn: async () => {
      const response = await fetchNotes(searchQuery, currentPage);
      if (!response) throw new Error("some error");
      return response;
    },
    placeholderData: keepPreviousData,
    retry: false,
  });
  // обробка data в необхідних змінних
  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 0;
  // створення дебаунсу
  const handleSearchChange = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 1000);

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox onChange={handleSearchChange} />
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
              children={<NoteForm onCancel={closeModal} />}
            />
          )}
        </header>
        {notes.length > 0 && <NoteList notes={notes} />}
      </div>
    </>
  );
}

export default App;
