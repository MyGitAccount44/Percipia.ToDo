import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { Todo } from "../../../app/models/todo";
import { useStore } from "../../../app/stores/store";

export default function TodoList() {
  const { todoStore } = useStore();
  const { todosByDate, updateTodo, deleteTodo } = todoStore;

  function handleComplete(todo: Todo) {
    todo.Completed = true;
    updateTodo(todo);
  }

  return (
    <Segment>
      <Item.Group divided>
        {todosByDate.map((todo) => (
          <Item key={todo.ID}>
            <Item.Content>
              <Item.Header as="a">{todo.Title}</Item.Header>
              <Item.Meta>{todo.Date}</Item.Meta>
              <Item.Description>
                <div>{todo.Description}</div>
                <div>{todo.Priority}</div>
                <div>{todo.Completed}</div>
              </Item.Description>
              <Item.Extra>
                <Button
                  onClick={() => deleteTodo(todo.ID)}
                  floated="right"
                  content="Delete"
                  color="red"
                />
                {!todo.Completed && (
                  <>
                    <Button
                      onClick={() => handleComplete(todo)}
                      floated="right"
                      content="Complete"
                      color="green"
                    />
                    <Button
                      onClick={() => todoStore.openForm(todo.ID)}
                      floated="right"
                      content="Update"
                      color="blue"
                    />
                  </>
                )}
                <Label
                  basic
                  content={todo.Completed ? "Completed" : "Incomplete"}
                />
                {todo.Priority && (
                  <Label color="red">
                    <Icon fitted name="exclamation circle" />
                  </Label>
                )}
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
}
