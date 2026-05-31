package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func main() {
	dbUrl := "postgresql://neondb_owner:npg_OJhbeoAUL3z1@ep-winter-hat-apac7jra.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"
	db, err := sql.Open("postgres", dbUrl)
	if err != nil {
		log.Fatal("Open:", err)
	}
	defer db.Close()

	query := `
	CREATE TABLE IF NOT EXISTS dishes (
		id SERIAL PRIMARY KEY,
		name VARCHAR(100),
		description TEXT
	);

	INSERT INTO dishes (name, description) VALUES
	('Phở Bò', 'Món phở nổi tiếng của Hà Nội với nước dùng đậm đà.'),
	('Bún Chả', 'Bún với chả thịt heo nướng than hoa thơm lừng.'),
	('Bánh Mì', 'Bánh mì giòn rụm với pate, thịt nguội và rau sống.')
	ON CONFLICT DO NOTHING;
	`
	_, err = db.Exec(query)
	if err != nil {
		log.Fatal("Exec:", err)
	}
	fmt.Println("Khởi tạo Database trên Neon.tech thành công!")
}
