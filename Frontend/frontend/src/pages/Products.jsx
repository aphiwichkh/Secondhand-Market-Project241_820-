import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import api from "../lib/api";

function formatPrice(price) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(Number(price || 0));
}

function Products() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [messageError, setMessageError] = useState("");
  const [messageSuccess, setMessageSuccess] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const loadProducts = async (keyword = "") => {
    try {
      setLoading(true);
      setError("");

      const endpoint = keyword.trim()
        ? `/products/search?q=${encodeURIComponent(keyword.trim())}`
        : "/products";

      const response = await api.get(endpoint);
      setProducts(response.data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to load products right now."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) {
      return;
    }

    try {
      setDeletingId(id);
      await api.delete(`/products/${id}`);
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== id)
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to delete this product."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    loadProducts(search);
  };

  const openMessageComposer = (product) => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/" } } });
      return;
    }

    setActiveProduct(product);
    setMessageText("");
    setMessageError("");
    setMessageSuccess("");
  };

  const closeMessageComposer = () => {
    setActiveProduct(null);
    setMessageText("");
    setMessageError("");
    setMessageSuccess("");
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();

    if (!activeProduct) {
      return;
    }

    try {
      setIsSendingMessage(true);
      setMessageError("");
      setMessageSuccess("");

      await api.post("/messages", {
        receiver_id: activeProduct.user_id,
        product_id: activeProduct.id,
        message: messageText,
      });

      setMessageSuccess("Your message has been sent to the seller.");
      setMessageText("");
    } catch (requestError) {
      setMessageError(
        requestError.response?.data?.message || "Unable to send the message right now."
      );
    } finally {
      setIsSendingMessage(false);
    }
  };

  return (
    <section className="stack-lg">
      <div className="hero-card">
        <div>
          <p className="eyebrow">ตลาดสินค้า</p>
          <h2>ค้นหาสินค้ามือสองล่าสุด / Browse latest secondhand listings.</h2>
          <p className="muted">
            ค้นหาประกาศสินค้าและติดต่อผู้ขายได้ทันที / Browse listings and contact sellers immediately.
          </p>
        </div>

        <form className="search-row" onSubmit={handleSearch}>
          <input
            className="input"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ค้นหาด้วยชื่อหรือคำอธิบาย / Search by title or description"
            type="text"
            value={search}
          />
          <button className="primary-button" type="submit">
            ค้นหา / Search
          </button>
        </form>
      </div>

      {error ? <div className="error-banner">{error}</div> : null}

      {loading ? <div className="card">Loading products...</div> : null}

      {!loading && products.length === 0 ? (
        <div className="card">
          <h3>No products found</h3>
          <p className="muted">Add a listing or try a different search keyword.</p>
        </div>
      ) : null}

      <div className="product-grid">
        {products.map((product) => {
          const isOwner = user && Number(product.user_id) === Number(user.id);

          return (
            <article className="product-card" key={product.id}>
              <div className="product-card-head">
                <span className="product-id">#{String(product.id).padStart(4, "0")}</span>
                {product.category_name ? (
                  <span className="tag">{product.category_name}</span>
                ) : null}
              </div>

              <div className="stack-sm">
                <h3>{product.title}</h3>
                <p className="muted">{product.description}</p>
              </div>

              <div className="product-meta">
                <span className="price">{formatPrice(product.price)}</span>
                <span className="muted">
                  ผู้ขาย / Seller: {product.username || "Unknown seller"}
                </span>
              </div>

              {isOwner ? (
                <div className="button-row">
                  <button
                    className="ghost-button"
                    onClick={() => navigate(`/edit-product/${product.id}`)}
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    className="danger-button"
                    disabled={deletingId === product.id}
                    onClick={() => handleDelete(product.id)}
                    type="button"
                  >
                    {deletingId === product.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              ) : (
                <button
                  className="ghost-button"
                  onClick={() => openMessageComposer(product)}
                  type="button"
                >
                  ติดต่อผู้ขาย / Contact seller
                </button>
              )}
            </article>
          );
        })}
      </div>

      {activeProduct ? (
        <div className="modal-overlay" onClick={closeMessageComposer} role="presentation">
          <section
            aria-label="Contact seller"
            className="message-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="message-modal-head">
              <div>
                <p className="eyebrow">Message seller</p>
                <h3>{activeProduct.title}</h3>
                <p className="muted">
                  Send a message to {activeProduct.username || "the seller"} about this item.
                </p>
              </div>

              <button className="ghost-button" onClick={closeMessageComposer} type="button">
                ปิด / Close
              </button>
            </div>

            <form className="stack-md" onSubmit={handleSendMessage}>
              <label className="field">
                <span>Your message</span>
                <textarea
                  className="input textarea"
                  onChange={(event) => setMessageText(event.target.value)}
                  placeholder="Hi, is this item still available?"
                  required
                  value={messageText}
                />
              </label>

              {messageError ? <div className="error-banner">{messageError}</div> : null}
              {messageSuccess ? <div className="success-banner">{messageSuccess}</div> : null}

              <button
                className="primary-button"
                disabled={isSendingMessage || !messageText.trim()}
                type="submit"
              >
                {isSendingMessage ? "Sending..." : "Send message"}
              </button>
            </form>
          </section>
        </div>
      ) : null}
    </section>
  );
}

export default Products;
