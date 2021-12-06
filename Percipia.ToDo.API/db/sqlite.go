package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

const dbName string = "todo-database.db"

var SqliteDatabase *sql.DB

func CreateDb() {
	_, err := os.Stat(dbName)
	if os.IsNotExist(err) {
		log.Println(fmt.Sprintf("Creating %s...", dbName))

		file, err := os.Create(dbName)
		if err != nil {
			log.Fatal(err.Error())
		}
		file.Close()

		log.Println(fmt.Sprintf("%s created", dbName))

		SqliteDatabase, err = sql.Open("sqlite3", fmt.Sprintf("./%s", dbName))
		if err != nil {
			log.Fatal(err.Error())
		}

		SqliteDatabase.SetConnMaxIdleTime(10)
		SqliteDatabase.SetMaxIdleConns(10)
		SqliteDatabase.SetConnMaxLifetime(60 * time.Second)

		createTable(SqliteDatabase)
	} else if err != nil {
		log.Fatal(err.Error())
	} else {
		SqliteDatabase, err = sql.Open("sqlite3", fmt.Sprintf("./%s", dbName))
		if err != nil {
			log.Fatal(err.Error())
		}
		log.Println("Database already exists.")
	}
}

func createTable(db *sql.DB) {
	log.Println("Creating tables...")

	createStudentTableSQL := `CREATE TABLE Todo (
		"id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,		
		"title" TEXT,
		"description" TEXT,
		"date" TEXT ,
		"priority" INTEGER,
		"completed" INTEGER		
	  );`

	statement, err := db.Prepare(createStudentTableSQL)
	if err != nil {
		log.Fatal(err.Error())
	}
	statement.Exec() // Execute SQL Statements
	log.Println("Table created")
}

func CloseDB() error {
	return SqliteDatabase.Close()
}
