import { useState } from "react";
import axios from "axios";

function AddProduct() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await axios.post("http://localhost:5000/api/products", {
        title,
        description,
        price
      });

      alert("Product added");

      setTitle("");
      setDescription("");
      setPrice("");

    } catch (error) {
      console.error(error);
      alert("Error adding product");
    }
  };

  return (
    <div style={{ textAlign:"center", marginTop:"50px" }}>

      <h2>Add Product</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Product name"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
        />

        <br/><br/>

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
        />

        <br/><br/>

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e)=>setPrice(e.target.value)}
        />

        <br/><br/>

        <button type="submit">
          Add Product
        </button>

      </form>

    </div>
  );
}

export default AddProduct;