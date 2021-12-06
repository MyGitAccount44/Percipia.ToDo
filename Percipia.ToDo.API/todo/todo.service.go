package todo

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/MyGitAccount44/Percipia.ToDo/cors"
)

const todoBasePath = "todo"

func SetupRoutes(apiBasePath string) {
	handleTodos := http.HandlerFunc(todosHandler)
	handleTodo := http.HandlerFunc(todoHandler)
	http.Handle(fmt.Sprintf("%s/%s", apiBasePath, todoBasePath), cors.Middleware(handleTodos))
	http.Handle(fmt.Sprintf("%s/%s/", apiBasePath, todoBasePath), cors.Middleware(handleTodo))
}

func todosHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		todoList, err := getTodoList()
		if err != nil {
			log.Fatal(err.Error())
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		todoListJson, err := json.Marshal(todoList)
		if err != nil {
			log.Fatal(err.Error())
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(todoListJson)
		return
	case http.MethodPost:
		var newTodo Todo
		bodyBytes, err := ioutil.ReadAll(r.Body)
		if err != nil {
			log.Fatal(err.Error())
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		err = json.Unmarshal(bodyBytes, &newTodo)
		if err != nil {
			log.Fatal(err.Error())
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		_, err = insertTodo(newTodo)
		if err != nil {
			log.Fatal(err.Error())
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		return
	case http.MethodOptions:
		return
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
}

func todoHandler(w http.ResponseWriter, r *http.Request) {
	urlPathSegments := strings.Split(r.URL.Path, fmt.Sprintf("%s/", todoBasePath))
	todoID, err := strconv.Atoi(urlPathSegments[len(urlPathSegments)-1])
	if err != nil {
		log.Fatal(err.Error())
		w.WriteHeader(http.StatusNotFound)
		return
	}

	todo, err := getTodo(todoID)
	if err != nil {
		log.Fatal(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if todo == nil {
		http.Error(w, fmt.Sprintf("no todo with id %d found", todoID), http.StatusNotFound)
		return
	}

	switch r.Method {
	case http.MethodGet:
		todoJson, err := json.Marshal(todo)
		if err != nil {
			log.Fatal(err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(todoJson)
	case http.MethodPut:
		var upTodo Todo
		bodyBytes, err := ioutil.ReadAll(r.Body)
		if err != nil {
			log.Fatal(err.Error())
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		err = json.Unmarshal(bodyBytes, &upTodo)
		if err != nil {
			log.Fatal(err.Error())
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		if upTodo.ID != todoID {
			log.Fatal(err.Error())
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		err = updateTodo(upTodo)
		if err != nil {
			log.Fatal(err.Error())
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		return
	case http.MethodDelete:
		removeTodo(todoID)
		w.WriteHeader(http.StatusOK)
		return
	case http.MethodOptions:
		return
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
}
