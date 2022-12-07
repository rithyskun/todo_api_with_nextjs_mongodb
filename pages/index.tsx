import Head from "next/head";
import { ChangeEvent, useState, useEffect } from "react";
import { Todo } from "../types/type";
import { useRouter } from "next/router";

import Form from "../components/Form";
import List from "../components/List";

import { updateTask } from "../utils/helper";
import Search from "../components/Search";
import { socketConnection, socketDisconnected, socketOn } from "../utils/socket";

const ENDPOINT: string = process.env.NEXT_PUBLIC_HOSTNAME as string;

type Props = {
  items: Todo[];
};

const Home = ({ items }: Props) => {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [isSearch, setIsSearch] = useState(false);

  useEffect(() => {
    socketConnection();
    socketOn("fetchTodo", (payload: Todo) => {
      fetchTodo();
    });
    
  }, []);
  const handleChange = async (data: Todo, e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    try {
      let id = String(data._id);
      let task = {
        todo: data.todo,
        isCompleted: checked,
      };
      await updateTask(id, task);
      router.push("/");
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  let filtered = items.filter((item) => {
    return item.todo.toLowerCase().includes(keyword);
  });

  const fetchTodo = () => {
    router.replace(router.asPath)
  };

  return (
    <div>
      <Head>
        <title>Todo Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          Todo App with{" "}
          <a href="https://nextjs.org" target="_blank">
            Next.js{" "}
          </a>{" "}
          &{" "}
          <a href="https://www.mongodb.com/home" target="_blank">
            MongoDB!
          </a>
        </h1>
        {isSearch ? (
          <span>
            <Search onChange={handleChangeKeyword} />
            <button onClick={() => setIsSearch(!isSearch)}>reset</button>
          </span>
        ) : (
          <span>
            <Form />
            <button onClick={() => setIsSearch(!isSearch)}>filter</button>
          </span>
        )}

        <List items={filtered} onChange={handleChange} />
      </main>

      <footer></footer>
    </div>
  );
};

export async function getServerSideProps() {
  try {
    const res = await fetch(ENDPOINT + "/todo/getTodos");
    const items = await res.json();
    return {
      props: { items },
    };
  } catch (error) {
    console.log(error);
  }
}

export default Home;
