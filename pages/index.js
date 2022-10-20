import Head from 'next/head';
import useSWR from 'swr';
import { useRef, useState } from 'react';
import styles from '../styles/Home.module.css';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Home() {
  const inputRef = useRef(null);
  const textRef = useRef(null);
  const {
    data: todos,
    error,
    mutate,
  } = useSWR('/api/todos', fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const handleAdd = async () => {
    const newToDo = await fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify({ title: inputRef.current.value }),
    }).then((res) => res.json());
    mutate([newToDo, ...todos], false);
    inputRef.current.value = '';
  };

  const handleDelete = async (id) => {
    const updatedToDos = todos.filter((todo) => todo.id !== id) || [];
    mutate(
      async () => await fetch(`/api/todos/${id}`, { method: 'DELETE' }).then((res) => res.json()),
      { optimisticData: updatedToDos, rollbackOnError: true }
    );
  };

  const handleCheck = async (e, id) => {
    const isChecked = e.target.checked;
    const updatedToDos = Array.from(todos, (todo) =>
      todo.id === id ? { ...todo, isDone: isChecked } : todo
    );
    console.log(updatedToDos);
    mutate(
      async () =>
        await fetch(`/api/todos/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({ isDone: isChecked }),
        }).then((res) => res.json()),
      { optimisticData: updatedToDos, rollbackOnError: true }
    );
  };

  console.log(todos);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>ToDos</h1>
      <input placeholder="ToDo" ref={inputRef} />
      <button onClick={handleAdd}>Add</button>
      {todos && (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id} className={styles.listitem}>
              <input
                type="checkbox"
                checked={todo.isDone}
                onChange={(e) => handleCheck(e, todo.id)}
              />
              <span ref={textRef} className={todo.isDone ? styles.done : null}>
                {todo.title}
              </span>
              <button onClick={() => handleDelete(todo.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
