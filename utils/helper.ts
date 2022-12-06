import { Todo } from "../types/type";

export async function createTask (task: Todo) {
    if (!task.todo) {
      return alert("The task require!");
    }
    const response = await fetch('/api/addTodo', {
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

export async function updateTask (id: string, task: Todo) {
    await fetch('/api/updateTodo?id=' + id, {
      method: "PUT",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };