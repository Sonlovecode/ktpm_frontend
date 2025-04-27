import { useNavigate } from "react-router-dom";
import { LuPenLine } from "react-icons/lu";
import { useAuth } from "../context/auth";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Profile = () => {
    const [auth] = useAuth();
    const navigate = useNavigate();

    if (!auth?.user) {
        return (
            <div
                style={{
                    height: "50vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "1.5rem",
                    fontWeight: "500",
                    color: "#fff",
                    background: "linear-gradient(135deg, #007bff, #0056b3)",
                    borderRadius: "10px",
                    margin: "2rem",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                }}
            >
                Vui lòng đăng nhập để xem thông tin cá nhân
            </div>
        );
    }

    const { name, email, phone, address, photoURL } = auth.user;

    return (
        <div
            style={{
                maxWidth: "600px",
                margin: "2rem auto",
                padding: "2rem",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
        >
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <img
                    src={
                        photoURL ||
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReKDEDRFLZSg8L4espaX5JVqaUnYc0veH34Q&s"
                    }
                    alt="Avatar"
                    style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "4px solid #007bff",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    }}
                />
                <h2 style={{ marginTop: "1rem", fontWeight: "600" }}>{name}</h2>
                <p style={{ color: "#888", fontSize: "14px" }}>{address || "Chưa có địa chỉ"}</p>
            </div>

            <div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1.5rem",
                        borderBottom: "1px solid #eee",
                        paddingBottom: "0.5rem",
                    }}
                >
                    <h3 style={{ margin: 0 }}>Thông tin cá nhân</h3>
                    <LuPenLine
                        style={{ fontSize: "22px", cursor: "pointer", color: "#007bff" }}
                        onClick={() => navigate("/update-profile")}

                    />
                </div>

                <div style={infoStyle}>
                    <strong>Họ và tên:</strong>
                    <span>{name}</span>
                </div>
                <div style={infoStyle}>
                    <strong>Email:</strong>
                    <span>{email}</span>
                </div>
                <div style={infoStyle}>
                    <strong>Số điện thoại:</strong>
                    <span>{phone || "Chưa có số điện thoại"}</span>
                </div>
                <div style={infoStyle}>
                    <strong>Địa chỉ:</strong>
                    <span>{address || "Chưa có địa chỉ"}</span>
                </div>
            </div>
        </div>
    );
};

const infoStyle = {
    marginBottom: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    color: "#333",
};

export default Profile;
