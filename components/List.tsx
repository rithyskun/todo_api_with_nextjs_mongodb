import { Todo } from "../types/type";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { handleDelete, formatDateLocal, updateTask } from "../utils/helper";
import Modal from "./Modal";
import { time } from "console";

type Props = {
  items: Todo[];
  onChange(data: Todo, e: ChangeEvent<HTMLInputElement>): void;
};

const List = ({ items, onChange }: Props) => {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmedDeleteId, setConfirmedDeleteId] = useState("");

  const handleEdit = (id: string) => {
    router.push(`/todo/edit/${id}`);
  };

  const handleModalDeleteConfirm = (item: Todo) => {
    setConfirmedDeleteId(String(item._id));
    setActive(true);
  };

  const handleCancel = () => {
    setActive(false);
  };

  const handleConfirmedDelete = async () => {
    if (confirmedDeleteId) {
      await handleDelete(confirmedDeleteId);
    }
    setConfirmedDeleteId("");
    setActive(false);
  };

  const handleUpdate = async (e: ChangeEvent<HTMLInputElement>, item: Todo) => {
    if (item._id) {
      await updateTask(item._id, {
        todo: e.target.value,
        isCompleted: item.isCompleted,
      });
    }
  };
  return (
    <div className="flex relative items-center justify-center">
      {items?.length ? (
        <ul className="w-72">
          {items?.map((item) => (
            <li key={item._id} className="flex items-center justify-start">
              <input
                id="isCompleted"
                name="isCompleted"
                type="checkbox"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onChange(item, e)
                }
                defaultChecked={item.isCompleted}
                className="form-input rounded-full px-2 py-2 hover:border-green-500"
              />
              <div className="flex items-center justify-start text-center">
                {item.isCompleted ? (
                  <span className="flex line-through opacity-40 items-center justify-start px-2 py-2">
                    {item.todo}
                  </span>
                ) : (
                  <div>
                    {isEdit ? (
                      <input
                        type="text"
                        defaultValue={item.todo}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleUpdate(e, item)
                        }
                        onBlur={() => setIsEdit(false)}
                        className="border-none flex items-center justify-end px-2 py-2"
                      />
                    ) : (
                      <span
                        onDoubleClick={() => setIsEdit(true)}
                        className="border-none flex items-center justify-end px-2 py-2"
                      >
                        {item.todo}
                      </span>
                    )}
                  </div>
                )}

                <div className="border-none flex px-2 py-2">
                  <button
                    className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 rounded-full text-sm sm:w-auto py-1 px-2 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                    onClick={() => handleModalDeleteConfirm(item)}
                  >
                    x
                  </button>
                </div>
                <Modal
                  show={active}
                  item={item}
                  handleConfirmedDelete={handleConfirmedDelete}
                  handleCancel={handleCancel}
                />
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
