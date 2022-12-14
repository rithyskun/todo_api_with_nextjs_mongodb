import { Todo } from "../types/type";
import Router from "next/router";

const ENDPOINT: string = (process.env.NEXT_PUBLIC_HOSTNAME) as string

export async function createTask(task: Todo) {
  if (!task.todo) {
    return alert("The task require!");
  }
  const response = await fetch(ENDPOINT + '/todo/addTodo', {
    method: "POST",
    body: JSON.stringify(task),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.status === 409) {
    return alert("The task exist!");
  }
  return response;
};

export async function updateTask(id: string, task: Todo) {
  await fetch(ENDPOINT + "/todo/updateTodo?id=" + id, {
    method: "PUT",
    body: JSON.stringify(task),
    headers: {
      "Content-Type": "application/json",
    },
  });
  Router.push('/').then(()=>{}).catch(()=>{})
};

export async function handleDelete(id: string) {
  await fetch(ENDPOINT + '/todo/deleteTodo?id=' + id, {
    method: "DELETE",
  });
  Router.push('/').then(()=>{}).catch(()=>{})
};

//Local date/time
export const formatDateLocal = (v: any) => {
  return v.replace(/T|Z/g, ' ')
}