import { Todo } from "../types/type";
import { useRouter } from "next/router";
import { ChangeEvent } from "react";
import styles from "../styles/Home.module.css";
import { handleDelete } from '../utils/helper'

type Props = {
  items: Todo[];
  onChange(data: Todo, e: ChangeEvent<HTMLInputElement>): void;
};

const List = ({ items, onChange }: Props) => {
  const router = useRouter();
  const handleEdit = (id: string) => {
    router.push(`/todo/edit/${id}`);
  };

  return (
    <div>
      {items?.length ? (
        <div>
          {items?.map((item) => (
            <div key={item._id}>
              <input
                id="isCompleted"
                name="isCompleted"
                type="checkbox"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onChange(item, e)
                }
                defaultChecked={item.isCompleted}
              />

              <span>
                {item.isCompleted ? (
                  <span className={styles.checked}>{item.todo}</span>
                ) : (
                  <span>{item.todo}</span>
                )}
                <button onClick={() => handleEdit(String(item._id))}>
                  edit
                </button>
                <button onClick={() => handleDelete(String(item._id))}>
                  x
                </button>
              </span>
            </div>
          ))}
        </div>
      ) : (
        <>no result. create new one instead!</>
      )}
    </div>
  );
};

export default List;
