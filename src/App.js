// import Login from "./pages/login/Login";
import AdminLayout from "./component/admin-layout/AdminLayout";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/admin/admin-dashboard/AdminDashboard";
import AdminDaftarPustaka from "./pages/admin/admin-daftar-pustaka/AdminDaftarPustaka";
import AdminPeminjaman from "./pages/admin/admin-peminjaman/AdminPeminjaman";
import AdminDataAnggota from "./pages/admin/admin-dataAnggota/AdminDataAnggota";
import Detail from "./pages/Detail/Detail";
import Home from "./pages/Home/Home";
import Pdf_viewer from "./pages/Pdf_viewer/Pdf_viewer";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/daftarpustaka" element={<AdminDaftarPustaka />} />
        <Route path="/peminjaman" element={<AdminPeminjaman />} />
        <Route path="/dataAnggota" element={<AdminDataAnggota />} />
      </Route>
      <Route path="/Home" element={<Home />} />
      <Route path="/Detail" element={<Detail />} />
      <Route path="/Pdf_viewer" element={<Pdf_viewer />} />
    </Routes>
  );
}

export default App;
