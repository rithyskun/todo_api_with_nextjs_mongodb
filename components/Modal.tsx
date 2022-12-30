import { Todo } from "../types/type";

type Props = {
  show: boolean;
  item: Todo;
  handleConfirmedDelete(): void;
  handleCancel(): void;
};
const Modal = ({ show, item, handleConfirmedDelete, handleCancel }: Props) => {
  return (
    <>
      {show ? (
        <div
          id="popup-modal"
          className="fixed inset-0 z-40 flex items-center justify-center bg-gray-300"
        >
          <div className="relative bg-white rounded-lg dark:bg-gray-700">
            <button
              onClick={handleCancel}
              type="button"
              className="absolute top-3 right-2.5 bg-gray-100 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-900 text-sm py-1.5 px-2.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
              data-modal-toggle="popup-modal"
            >
              X<span className="sr-only">Close modal</span>
            </button>
            <div className="p-6 text-center">
              <svg
                width="3em"
                height="3em"
                viewBox="0 0 32 32"
                className="text-center w-full dark:text-white"
              >
                <path
                  fill="currentColor"
                  d="M27.562 26L17.17 8.928l2.366-3.888L17.828 4L16 7.005L14.17 4l-1.708 1.04l2.366 3.888L4.438 26H2v2h28v-2ZM16 10.85L25.22 26H17v-8h-2v8H6.78Z"
                ></path>
              </svg>
              <h3 className="p-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Item {item.todo}, Are you sure you want to delete?
              </h3>
              <button
                onClick={handleConfirmedDelete}
                data-modal-toggle="popup-modal"
                type="button"
                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
              >
                Yes, I'm sure
              </button>
              <button
                onClick={handleCancel}
                data-modal-toggle="popup-modal"
                type="button"
                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Modal;
