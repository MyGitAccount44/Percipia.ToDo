import { useEffect, useState } from "react";
import { Container } from "semantic-ui-react";
import { Todo } from "../models/todo";
import NavBar from "../../features/nav/NavBar";
import TodoDashboard from "../../features/todos/dashboard/TodoDashboard";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";

function App() {
  const { todoStore } = useStore();

  useEffect(() => {
    todoStore.loadTodos();
  }, [todoStore]);

  if (todoStore.loadingInitial)
    return <LoadingComponent content="Loading app" />;

  return (
    <>
      <NavBar />
      <Container style={{ marginTop: "7em" }}>
        <TodoDashboard />
      </Container>
    </>
  );
}

export default observer(App);
