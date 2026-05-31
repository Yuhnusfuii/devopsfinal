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
