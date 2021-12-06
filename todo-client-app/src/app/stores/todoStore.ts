import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { Todo } from '../models/todo';

export default class TodoStore {
    todosMap = new Map<number, Todo>();
    selectedTodo: Todo | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = true;

    constructor() {
        makeAutoObservable(this)
    }

    get todosByDate() {
        return Array.from(this.todosMap.values()).sort((a, b) => {
            return Date.parse(a.Date) - Date.parse(b.Date);
        });
    }

    loadTodos = async () => {
        if (this.loadingInitial == false) this.loadingInitial = true;
        try {
            const todos = await agent.Todos.list();
            todos.forEach((todo) => {
                this.todosMap.set(todo.ID, todo);
            });
            this.setLoadingInitial(false)
        } catch (error) {
            console.log(error)
        } finally {
            this.setLoadingInitial(false)
        }
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    openForm = (id?: number) => {
        this.closeForm();
        if (id !== undefined) {
            this.selectedTodo = this.todosMap.get(id);
        } else {
            this.selectedTodo = undefined
        }

        this.editMode = true;
    }

    closeForm = () => {
        this.editMode = false;
    }

    createTodo = async (todo: Todo) => {
        this.loading = true;
        try {
            await agent.Todos.create(todo)
            runInAction(() => {
                this.loadTodos()
                this.selectedTodo = undefined;
                this.closeForm();
            });

        } catch (error) {
            console.log(error)
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }

    }
    updateTodo = async (todo: Todo) => {
        this.loading = true;
        try {
            await agent.Todos.update(todo)
            runInAction(() => {
                this.todosMap.set(todo.ID, todo);
                this.selectedTodo = undefined;
                this.closeForm();
            });

        } catch (error) {
            console.log(error)
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    deleteTodo = async (id: number) => {
        this.loading = true;
        try {
            await agent.Todos.delete(id)
            runInAction(() => {
                this.todosMap.delete(id);
            })
        } catch (error) {
            console.log(error)
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }

    }
}