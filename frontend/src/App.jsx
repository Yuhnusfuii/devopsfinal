import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://devopsfinal-4zx3.onrender.com';
        const res = await fetch(`${apiUrl}/api/dishes`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        // Cố tình delay một chút để thấy animation loading đẹp mắt
        setTimeout(() => {
          setDishes(data || []);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching dishes:", error);
        setLoading(false);
      }
    };
    
    fetchDishes();
  }, []);

  // Map tên món ăn với ảnh thực tế (hoặc dùng Unsplash API)
  const getImageUrl = (name) => {
    const images = {
      'Phở Bò': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&q=80&w=800',
      'Bún Chả': 'https://images.unsplash.com/photo-1626244434712-421731174917?auto=format&fit=crop&q=80&w=800',
      'Bánh Mì': 'https://images.unsplash.com/photo-1550507992-eb63ffee0224?auto=format&fit=crop&q=80&w=800'
    };
    return images[name] || `https://source.unsplash.com/800x600/?vietnam,food,${encodeURIComponent(name)}`;
  };

  return (
    <>
      <div className="background-glow"></div>
      <div className="App">
        <header>
          <h1>Tinh Hoa Ẩm Thực</h1>
          <p className="subtitle">Khám phá hương vị truyền thống Việt Nam</p>
        </header>

        {loading ? (
          <div className="loading">Đang tải món ngon...</div>
        ) : (
          <div className="dishes">
            {dishes.length === 0 ? (
              <div className="empty-state">
                <h3>Chưa có món ăn nào</h3>
                <p>Vui lòng kiểm tra lại kết nối Database!</p>
              </div>
            ) : (
              dishes.map(dish => (
                <div key={dish.id} className="card">
                  <img src={getImageUrl(dish.name)} alt={dish.name} className="card-image" />
                  <div className="card-content">
                    <h2>{dish.name}</h2>
                    <p>{dish.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
