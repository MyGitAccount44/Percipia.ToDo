package todo

import (
	"context"
	"database/sql"
	"time"

	"github.com/MyGitAccount44/Percipia.ToDo/db"
)

func getTimeout() (context.Context, context.CancelFunc) {
	return context.WithTimeout(context.Background(), 15*time.Second)
}

func getTodo(ID int) (*Todo, error) {
	ctx, cancel := getTimeout()
	defer cancel()
	result := db.SqliteDatabase.QueryRowContext(ctx, `SELECT *
 		FROM Todo
		WHERE id = ?`, ID)

	var todo Todo
	err := result.Scan(&todo.ID,
		&todo.Title,
		&todo.Description,
		&todo.Date,
		&todo.Priority,
		&todo.Completed)

	if err == sql.ErrNoRows {
		return nil, nil
	} else if err != nil {
		return nil, err
	}
	return &todo, nil
}

func removeTodo(ID int) error {
	ctx, cancel := getTimeout()
	defer cancel()
	_, err := db.SqliteDatabase.ExecContext(ctx, "DELETE FROM Todo where id = ?", ID)
	return err
}

func getTodoList() ([]Todo, error) {
	ctx, cancel := getTimeout()
	defer cancel()
	result, err := db.SqliteDatabase.QueryContext(ctx, "SELECT * FROM Todo")

	if err != nil {
		return nil, err
	}
	defer result.Close()

	todoList := make([]Todo, 0)
	for result.Next() {
		var todo Todo
		result.Scan(&todo.ID,
			&todo.Title,
			&todo.Description,
			&todo.Date,
			&todo.Priority,
			&todo.Completed)
		todoList = append(todoList, todo)
	}
	return todoList, nil
}

func updateTodo(todo Todo) error {
	ctx, cancel := getTimeout()
	defer cancel()
	_, err := db.SqliteDatabase.ExecContext(ctx, `UPDATE Todo SET
		title=?,
		description=?,
		date=?,
		priority=?,
		completed=?
		WHERE id=?`,
		todo.Title,
		todo.Description,
		todo.Date,
		todo.Priority,
		todo.Completed,
		todo.ID)

	return err
}

func insertTodo(todo Todo) (int, error) {
	ctx, cancel := getTimeout()
	defer cancel()
	result, err := db.SqliteDatabase.ExecContext(ctx, `INSERT INTO Todo
		(title,description,date,priority,completed)
		VALUES (?, ?, ?, ?, ?)`,
		todo.Title,
		todo.Description,
		todo.Date,
		todo.Priority,
		todo.Completed)

	if err != nil {
		return -1, err
	}
	ID, err := result.LastInsertId()

	if err != nil {
		return -1, err
	}

	return int(ID), nil
}
