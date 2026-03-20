import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/api";

const initialForm = {
  title: "",
  description: "",
  price: "",
  category_id: "",
};

function AddProduct() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      setCategoryLoading(true);
      try {
        const response = await api.get("/categories");
        setCategories(response.data);
      } catch (requestError) {
        console.error("Unable to load categories", requestError);
      } finally {
        setCategoryLoading(false);
      }
    };

    loadCategories();

    if (!isEditing) {
      return;
    }

    const loadProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get(`/products/${id}`);
        setFormData({
          title: response.data.title || "",
          description: response.data.description || "",
          price: response.data.price || "",
          category_id: response.data.category_id || "",
        });
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load product for editing."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, isEditing]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      setIsSubmitting(true);

      if (isEditing) {
        await api.put(`/products/${id}`, {
          ...formData,
          category_id: formData.category_id ? Number(formData.category_id) : null,
          price: Number(formData.price),
        });

        setSuccess("Product updated successfully.");
      } else {
        await api.post("/products", {
          ...formData,
          category_id: formData.category_id ? Number(formData.category_id) : null,
          price: Number(formData.price),
        });

        setFormData(initialForm);
        setSuccess("Product added successfully.");
      }

      window.setTimeout(() => {
        navigate("/");
      }, 700);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          (isEditing ? "Unable to update the product." : "Unable to create the product.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="card card-narrow">
      <div className="stack-sm">
        <p className="eyebrow">เครื่องมือผู้ขาย / Seller Tools</p>
        <h2>{isEditing ? "แก้ไขประกาศ / Edit listing" : "สร้างประกาศใหม่ / Create a new listing"}</h2>
        <p className="muted">
          ผู้ใช้ที่เข้าสู่ระบบสามารถสร้างและแก้ไขสินค้าของตนเองได้ / Logged-in users can create and edit their own products.
        </p>
      </div>

      {loading ? (
        <div className="card">กำลังโหลดข้อมูลสินค้า... / Loading product...</div>
      ) : (
        <form className="stack-md" onSubmit={handleSubmit}>
        <label className="field">
          <span>ชื่อสินค้า / Title</span>
          <input
            className="input"
            name="title"
            onChange={handleChange}
            placeholder="เช่น กล้องฟิล์ม / e.g. vintage camera"
            required
            type="text"
            value={formData.title}
          />
        </label>

        <label className="field">
          <span>รายละเอียด / Description</span>
          <textarea
            className="input textarea"
            name="description"
            onChange={handleChange}
            placeholder="สภาพสินค้า, ยี่ห้อ, การรับสินค้า, และข้อมูลสำคัญอื่น ๆ / Condition, brand, pickup details, etc."
            required
            value={formData.description}
          />
        </label>

        <div className="form-grid">
          <label className="field">
            <span>ราคา / Price (บาท)</span>
            <input
              className="input"
              min="0"
              name="price"
              onChange={handleChange}
              placeholder="1500"
              required
              type="number"
              value={formData.price}
            />
          </label>

          <label className="field">
            <span>ประเภทสินค้า / Category (optional)</span>
            <select
              className="input"
              name="category_id"
              onChange={handleChange}
              value={formData.category_id || ""}
            >
              <option value="">เลือกประเภท (ไม่บังคับ) / Optional category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error ? <div className="error-banner">{error}</div> : null}
        {success ? <div className="success-banner">{success}</div> : null}

        <button className="primary-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Saving..." : isEditing ? "Update product" : "Add Product"}
        </button>
      </form>
      )}
    </section>
  );
}

export default AddProduct;
