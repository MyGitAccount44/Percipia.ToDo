import TodoStore from "./todoStore";
import { createContext, useContext } from "react";

interface Store {
    todoStore: TodoStore
}

export const store: Store = {
    todoStore: new TodoStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext)
}