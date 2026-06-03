// Trigger CI
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newDish, setNewDish] = useState({ name: '', description: '' });

  const apiUrl = import.meta.env.VITE_API_URL || 'https://devopsfinal-4zx3.onrender.com';

  const fetchDishes = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/dishes`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setDishes(data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dishes:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  const handleAddDish = async (e) => {
    e.preventDefault();
    if (!newDish.name.trim() || !newDish.description.trim()) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/api/dishes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDish),
      });
      if (res.ok) {
        const addedDish = await res.json();
        setDishes([addedDish, ...dishes]); // Thêm món mới lên đầu
        setNewDish({ name: '', description: '' });
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error adding dish:", error);
    }
    setIsSubmitting(false);
  };

  // Link ảnh dự phòng không bị die
  const getImageUrl = (name) => {
    const images = {
      'Phở Bò': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&q=80&w=800',
      'Bún Chả': 'https://images.unsplash.com/photo-1551024506-0cb9842f0dd4?auto=format&fit=crop&q=80&w=800',
      'Bánh Mì': 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&q=80&w=800'
    };
    return images[name] || `https://placehold.co/800x600/2a2a2a/ffffff?text=${encodeURIComponent(name)}`;
  };

  return (
    <>
      <div className="background-glow"></div>
      <div className="App">
        <header>
          <h1>Tinh Hoa Ẩm Thực</h1>
          <p className="subtitle">Khám phá hương vị truyền thống Việt Nam</p>
        </header>

        <div className="header-actions">
          <button className="btn-add" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Đóng' : '+ Thêm món ăn mới'}
          </button>
        </div>

        {showForm && (
          <form className="add-dish-form" onSubmit={handleAddDish}>
            <h3>Món Ngon Mới</h3>
            <input
              type="text"
              placeholder="Tên món ăn..."
              value={newDish.name}
              onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
              required
            />
            <textarea
              placeholder="Mô tả hấp dẫn về món ăn..."
              rows="3"
              value={newDish.description}
              onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
              required
            ></textarea>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu Món Ăn'}
            </button>
          </form>
        )}

        {loading ? (
          <div className="loading">Đang tải món ngon...</div>
        ) : (
          <div className="dishes">
            {dishes.length === 0 ? (
              <div className="empty-state">
                <h3>Chưa có món ăn nào</h3>
                <p>Hãy là người đầu tiên thêm món ăn!</p>
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
