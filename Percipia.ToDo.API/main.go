package main

import (
	"net/http"

	"github.com/MyGitAccount44/Percipia.ToDo/db"
	"github.com/MyGitAccount44/Percipia.ToDo/todo"
)

const apiBasePath = "/api"

func main() {
	db.CreateDb()
	defer db.CloseDB()
	todo.SetupRoutes(apiBasePath)
	http.ListenAndServe(":5000", nil)
}
