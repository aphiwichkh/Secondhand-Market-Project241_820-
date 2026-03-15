import { useEffect, useState } from "react";

function Products() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const deleteProduct = async (id) => {
    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE"
    });

    location.reload();
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Secondhand Products</h1>

      {products.map(product => (
        <div
          key={product.id}
          style={{
            border: "1px solid #ccc",
            margin: "10px",
            padding: "10px",
            width: "px"
          }}
        >
          <p className="text-gray-600 text-sm"> 
             #{product.id.toString().padStart(4, '0')}
          </p>

          <h3>{product.title}</h3>
          <p>{product.description}</p>
          <p>{product.price} บาท</p>

          <button onClick={() => deleteProduct(product.id)}>
            Delete
          </button>

        </div>
      ))}

    </div>
  );
}

export default Products;
