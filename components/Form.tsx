import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import { Todo } from "../types/type";
import {
  socketConnection,
  socketDisconnected,
  socketEmit,
} from "../utils/socket";

const ENDPOINT: string = process.env.NEXT_PUBLIC_HOSTNAME as string;

type ChangeInputHandler = ChangeEvent<HTMLInputElement>;

const inititalState = {
  todo: "",
  isCompleted: false,
  createdAt: "",
};

type Props = {
  onInput(e: ChangeEvent<HTMLInputElement>): void;
  onEdit: boolean;
  onReset(): void;
};

const Form = ({ onInput, onEdit, onReset }: Props): JSX.Element => {
  const [task, setTask] = useState<Todo>(inititalState);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (typeof router.query.id === "string") {
        if (!task.todo) {
          setError(true);
          setTimeout(() => {
            setError(false);
            setMessage("The task field is required!");
          }, 1000);
          return;
        }
        await updateTask(router.query.id, task);
        router.push("/").then(()=>{}).catch(()=>{})
      } else {
        if (!task.todo) {
          setError(true);
          setTimeout(() => {
            setError(false);
            setMessage("The task field is required!");
          }, 1000);
          return;
        }
        await createTask(task);
        onEdit = true;
        setTask(inititalState);
        onReset();
      }
      router.push("/").then(()=>{}).catch(()=>{})
    } catch (error: any) {
      console.log(error);
    }
  };

  async function createTask(task: Todo) {
    if (!task.todo) {
      setError(true);
      setMessage("The task require!");
      setTimeout(() => {
        setError(false);
        setMessage("");
      }, 2000);
      return;
    }
    const response = await fetch(ENDPOINT + "/todo/addTodo", {
      method: "POST",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 409) {
      setError(true);
      setMessage("The task exist!");
      setTimeout(() => {
        setError(false);
        setMessage("");
      }, 2000);
      return;
    }

    return response;
  }

  async function updateTask(id: string, task: Todo) {
    if (!task.todo) {
      setError(true);
      setMessage("The task require!");
      setTimeout(() => {
        setError(false);
        setMessage("");
      }, 2000);
      return;
    }
    const response = await fetch(ENDPOINT + "/todo/updateTodo?id=" + id, {
      method: "PUT",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      },
    });
    socketEmit("updateTodo", response);
    return response;
  }

  const handleChange = ({
    target: { name, value, type, checked },
  }: ChangeInputHandler) => {
    setTask({
      ...task,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const onLoad = async (id: string) => {
    const resp = await fetch(ENDPOINT + "/todo/getTodo?id=" + id);
    const task = await resp.json();
    setTask({
      todo: task.todo,
      isCompleted: task.isCompleted,
    });
  };

  useEffect(() => {
    if (typeof router.query.id === "string") {
      // socketConnection();
      onLoad(router.query.id);
    }
  }, [router.query]);

  return (
    <div className="flex items-center justify-center">
      <form onSubmit={handleSubmit}>
        {router.query.id ? (
          <div className="p-5 flex items-center space-x-2">
            <input
              type="text"
              name="todo"
              id="todo"
              value={task.todo}
              onChange={handleChange}
              onReset={onReset}
              placeholder="Update a task item"
              className="bg-gray-50 form-input border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-72 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <input
              type="checkbox"
              id="isCompleted"
              name="isCompleted"
              onChange={handleChange}
              checked={task.isCompleted}
              className="form-input rounded-full px-2"
            />
            <label htmlFor="isCompleted">isCompleted</label>
          </div>
        ) : (
          <div>
            <input
              type="search"
              id="todo"
              name="todo"
              value={task.todo}
              onChange={handleChange}
              onInput={onInput}
              onReset={onReset}
              placeholder="add/search task item"
              className="bg-gray-50 form-input border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-72 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            {error ? (
              <p className="mt-2 flex text-sm text-red-600 dark:text-red-500">
                {message}
              </p>
            ) : null}
          </div>
        )}
      </form>
    </div>
  );
};

export default Form;
