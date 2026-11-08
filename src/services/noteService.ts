import axios from "axios";
import type { Note, NoteFormValues } from "../types/note";

// функція get-запиту
// інтерфейс відповіді get-запиту, який включає описаний інтерфейс Note
interface FetchNotehubResponse {
  notes: Note[];
  totalPages: number;
}
//
export async function fetchNotes(
  query: string,
  page: number,
): Promise<FetchNotehubResponse> {
  const myKey = import.meta.env.VITE_NOTEHUB_TOKEN;

  const options = {
    method: "GET",
    url: `https://notehub-public.goit.study/api/notes?search=${query}&page=${page}&perPage=12`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${myKey}`,
    },
  };
  const { data } = await axios.request<FetchNotehubResponse>(options);
  console.log(data);
  return data;
}
// функція post-запиту
export async function createNote(
  value: NoteFormValues,
): Promise<FetchNotehubResponse> {
  const myKey = import.meta.env.VITE_NOTEHUB_TOKEN;
  const options = {
    method: "POST",
    url: `https://notehub-public.goit.study/api/notes`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${myKey}`,
    },
    data: value,
  };
  const { data } = await axios.request<FetchNotehubResponse>(options);
  console.log(data);
  return data;
}
// функція видалення
export async function deleteNote(id: string) {
  const myKey = import.meta.env.VITE_NOTEHUB_TOKEN;
  const options = {
    method: "DELETE",
    url: `https://notehub-public.goit.study/api/notes/${id}`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${myKey}`,
    },
  };
  await axios.request(options);
}
