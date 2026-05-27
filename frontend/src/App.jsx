import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    fetch('http://your-backend-ec2-ip/api/dishes')
      .then(res => res.json())
      .then(data => setDishes(data));
  }, []);

  return (
    <div className="App">
      <h1>Ẩm thực Việt Nam</h1>
      <div className="dishes">
        {dishes.map(dish => (
          <div key={dish.id} className="card">
            <h2>{dish.name}</h2>
            <p>{dish.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default App;
