import { Grid } from "semantic-ui-react";
import TodoList from "./TodoList";
import TodoForm from "../form/TodoForm";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../app/layout/LoadingComponent";

export default observer(function TodoDashboard() {
  const { todoStore } = useStore();
  const { editMode, loading } = todoStore;

  return (
    <Grid>
      <Grid.Column width={10}>
        <TodoList />
      </Grid.Column>
      <Grid.Column width={6}>{editMode && <TodoForm />}</Grid.Column>
    </Grid>
  );
});
