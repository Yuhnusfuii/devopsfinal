package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"

	_ "github.com/lib/pq"
)

type Dish struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

func main() {
	db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	http.HandleFunc("/api/dishes", func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("SELECT id, name, description FROM dishes")
		if err != nil {
			http.Error(w, "Query failed", 500)
			return
		}
		defer rows.Close()

		var dishes []Dish
		for rows.Next() {
			var d Dish
			rows.Scan(&d.ID, &d.Name, &d.Description)
			dishes = append(dishes, d)
		}
		json.NewEncoder(w).Encode(dishes)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Println("Backend running on port", port)
	http.ListenAndServe(":"+port, nil)
}
