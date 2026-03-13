import { useState, useEffect } from "react";
import "./App.css";

const API_BASE_URL = "https://api-backend-spring-nhom5-chieut6.onrender.com/";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: "", mssv: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/users`);
      if (!res.ok) throw new Error(`Lỗi ${res.status}: ${res.statusText}`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.mssv.trim()) return;
    setSubmitting(true);
    setSubmitMsg(null);
    try {
      const res = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, mssv: form.mssv }),
      });
      if (!res.ok) throw new Error(`Lỗi ${res.status}: ${res.statusText}`);
      setForm({ name: "", mssv: "" });
      setSubmitMsg("Tạo user thành công!");
      fetchUsers();
    } catch (err) {
      setSubmitMsg(`Thất bại: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Quản lý User</h1>

      {/* Form tạo user */}
      <section className="card">
        <h2>Tạo User Mới</h2>
        <form className="create-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Họ tên</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Nhập họ tên..."
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="mssv">MSSV</label>
            <input
              id="mssv"
              name="mssv"
              type="text"
              placeholder="Nhập MSSV..."
              value={form.mssv}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Đang tạo..." : "Tạo User"}
          </button>
        </form>
        {submitMsg && (
          <p
            className={
              submitMsg.startsWith("Thất bại") ? "msg-error" : "msg-success"
            }
          >
            {submitMsg}
          </p>
        )}
      </section>

      {/* Danh sách user */}
      <section className="card">
        <div className="list-header">
          <h2>Danh Sách User</h2>
          <button
            className="btn-secondary"
            onClick={fetchUsers}
            disabled={loading}
          >
            {loading ? "Đang tải..." : "Làm mới"}
          </button>
        </div>

        {error && <p className="msg-error">{error}</p>}

        {!loading && !error && users.length === 0 && (
          <p className="empty-msg">Chưa có user nào.</p>
        )}

        {users.length > 0 && (
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ tên</th>
                <th>MSSV</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.mssv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default App;
