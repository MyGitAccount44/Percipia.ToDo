import axios, { AxiosResponse } from 'axios';
import { Todo } from '../models/todo'

axios.defaults.baseURL = 'http://localhost:5000/api';

const responseBody = <T>(r: AxiosResponse<T>) => r.data

const request = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}

const Todos = {
    list: () => request.get<Todo[]>('/todo'),
    create: (todo: Todo) => axios.post('/todo', todo),
    update: (todo: Todo) => axios.put(`/todo/${todo.ID}`, todo),
    delete: (id: number) => axios.delete(`/todo/${id}`)
}

const agent = {
    Todos
}

export default agent;