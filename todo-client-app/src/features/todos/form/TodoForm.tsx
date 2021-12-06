import React, { ChangeEvent, FormEvent, useEffect } from "react";
import { useState } from "react";
import {
  Button,
  CheckboxProps,
  Form,
  Segment,
  Visibility,
} from "semantic-ui-react";
import { Todo } from "../../../app/models/todo";
import { useStore } from "../../../app/stores/store";

export default function TodoForm() {
  const { todoStore } = useStore();
  const { selectedTodo, updateTodo, createTodo } = todoStore;

  const initialState: Todo = selectedTodo ?? {
    ID: -1,
    Title: "",
    Description: "",
    Date: "",
    Priority: false,
    Completed: false,
  };

  const [todo, setTodo] = useState(initialState);
  const [titleError, SetTitleError] = useState(false);
  const [dateError, SetDateError] = useState(false);

  function handleSubmit() {
    SetDateError(false);
    SetTitleError(false);

    if (todo.Title === "") {
      SetTitleError(true);
      return;
    }

    if (todo.Date === "") {
      SetDateError(true);
      return;
    }

    if (todo.ID < 0) createTodo(todo);
    else updateTodo(todo);
  }

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setTodo({ ...todo, [name]: value });
  }

  function handleCheckmarkChange(
    _: FormEvent<HTMLInputElement>,
    data: CheckboxProps
  ) {
    const { name, checked } = data;
    if (name === undefined || checked === undefined) return;
    setTodo({ ...todo, [name]: checked });
  }

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit} autoComplete="off">
        <Form.Input
          error={
            titleError
              ? { content: "Please enter a Title", pointing: "below" }
              : titleError
          }
          fluid
          name="Title"
          placeholder="Title"
          value={todo.Title}
          onChange={handleInputChange}
        />
        <Form.TextArea
          name="Description"
          rows={2}
          placeholder="Description"
          value={todo.Description}
          onChange={handleInputChange}
        />
        <Form.Input
          error={
            dateError
              ? { content: "Please enter a Date", pointing: "below" }
              : dateError
          }
          type="date"
          name="Date"
          placeholder="Date"
          value={todo.Date}
          onChange={handleInputChange}
        />
        <Form.Checkbox
          name="Priority"
          label="Priority Task"
          defaultChecked={todo.Priority}
          onChange={handleCheckmarkChange}
        />
        <Button floated="right" positive type="submit" content="Submit" />
        <Button
          onClick={todoStore.closeForm}
          floated="right"
          type="button"
          content="Cancel"
        />
      </Form>
    </Segment>
  );
}
