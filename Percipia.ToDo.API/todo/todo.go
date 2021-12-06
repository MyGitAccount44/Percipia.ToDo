package todo

type Todo struct {
	ID          int    `json: "id"`
	Title       string `json: "title"`
	Description string `json: "description"`
	Date        string `json: "date"`
	Priority    bool   `json: "priority"`
	Completed   bool   `json: "completed"`
}
