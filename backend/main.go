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
	dbUrl := os.Getenv("DATABASE_URL")
	if dbUrl == "" {
		dbUrl = "postgresql://neondb_owner:npg_OJhbeoAUL3z1@ep-winter-hat-apac7jra.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"
	}
	
	log.Println("Đang kết nối tới DB bằng chuỗi:", dbUrl)
	
	db, err := sql.Open("postgres", dbUrl)
	if err != nil {
		log.Fatal("Lỗi mở kết nối:", err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Println("CẢNH BÁO: Không thể PING tới Database! Lỗi:", err)
	} else {
		log.Println("✅ Đã kết nối thành công tới PostgreSQL!")
	}

	http.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		err := db.Ping()
		if err != nil {
			http.Error(w, "Database Connection Failed: "+err.Error(), 500)
			return
		}
		w.Write([]byte("Database Connected Successfully!"))
	})

	http.HandleFunc("/api/dishes", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		if r.Method == "POST" {
			var d Dish
			if err := json.NewDecoder(r.Body).Decode(&d); err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}

			err := db.QueryRow("INSERT INTO dishes (name, description) VALUES ($1, $2) RETURNING id", d.Name, d.Description).Scan(&d.ID)
			if err != nil {
				log.Println("Insert error:", err)
				http.Error(w, "Lỗi khi lưu món ăn", http.StatusInternalServerError)
				return
			}

			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusCreated)
			json.NewEncoder(w).Encode(d)
			return
		}

		// Xử lý GET mặc định
		w.Header().Set("Content-Type", "application/json")
		rows, err := db.Query("SELECT id, name, description FROM dishes ORDER BY id DESC")
		if err != nil {
			log.Println("Database error:", err)
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
