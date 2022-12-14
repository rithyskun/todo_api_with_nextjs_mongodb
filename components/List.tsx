import { Todo } from "../types/type";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { handleDelete } from "../utils/helper";
import Modal from "./Modal";

type Props = {
  items: Todo[];
  onChange(data: Todo, e: ChangeEvent<HTMLInputElement>): void;
};

const List = ({ items, onChange }: Props) => {
  const router = useRouter();
  const [active, setActive] = useState(false);

  const handleEdit = (id: string) => {
    router.push(`/todo/edit/${id}`);
  };

  const handleModalDeleteConfirm = () => {
    setActive(true)
  }

  return (
    <div className="flex">
      {items?.length ? (
        <ul>
          {items?.map((item) => (
            <li key={item._id} className="flex items-center mb-2">
              <input
                id="isCompleted"
                name="isCompleted"
                type="checkbox"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onChange(item, e)
                }
                defaultChecked={item.isCompleted}
                className="form-input rounded-full px-3 py-3 hover:border-green-500"
              />

              <div className="flex gap-2 items-center">
                {item.isCompleted ? (
                  <span className="flex line-through opacity-40">
                    {item.todo} - {item.createdAt}
                  </span>
                ) : (
                  <span>
                    {item.todo} - {item.createdAt}
                  </span>
                )}
                <button
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-3 py-1.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={() => handleEdit(String(item._id))}
                >
                  edit
                </button>
                <button
                  className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm sm:w-auto px-3 py-1.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                  // onClick={() => handleDelete(String(item._id))}
                  onClick={handleModalDeleteConfirm}
                >
                  x
                </button>
                <Modal show={active}/>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <>no result. create new one instead!</>
      )}
    </div>
    
  );
};

export default List;
