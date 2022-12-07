import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import { Todo } from "../types/type";
import styles from "../styles/Home.module.css";
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
  isEdit: true,
};

const Form = (): JSX.Element => {
  const [task, setTask] = useState<Todo>(inititalState);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (typeof router.query.id === "string") {
        await updateTask(router.query.id, task);
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
      }
      setTask(inititalState);
      router.push("/");
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleChange = ({
    target: { name, value, type, checked },
  }: ChangeInputHandler) => {
    setTask({
      ...task,
      [name]: type === "checkbox" ? checked : value,
    });
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
    const response = await fetch(ENDPOINT + "/todo/updateTodo?id=" + id, {
      method: "PUT",
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
    socketEmit("updateTodo", response);
    return response;
  }

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
      socketConnection();
      onLoad(router.query.id);
    }
  }, [router.query]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {router.query.id ? (
          <div>
            <br />
            <input
              type="text"
              name="todo"
              id="todo"
              value={task.todo}
              onChange={handleChange}
              placeholder="add a task item"
              required
            />
            <>
              <input
                type="checkbox"
                id="isCompleted"
                name="isCompleted"
                onChange={handleChange}
                checked={task.isCompleted}
              />
              <label htmlFor="isCompleted">isCompleted</label>
            </>
          </div>
        ) : (
          <span>
            <input
              type="text"
              name="todo"
              id="todo"
              value={task.todo}
              onChange={handleChange}
              placeholder="add a task item"
            />
          </span>
        )}
        {router.query.id ? <button>update</button> : <button>save</button>}

        {router.query.id && (
          <button onClick={() => router.push("/")}>return</button>
        )}
      </form>
      {error ? <div className={styles.error}>{message}</div> : null}
    </div>
  );
};

export default Form;
