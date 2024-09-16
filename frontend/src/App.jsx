import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Category from "./pages/Category";
import NavBar from "./pages/components/NavBar";
import Cart from "./pages/Cart";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import { useEffect } from "react";
import LoadingSpinner from "./pages/components/LoadingSpinner";
import AdminPage from "./pages/admin/AdminPage";
import PurchaseSuccess from "./pages/PurchaseSuccess";
import PurchaseCancelPage from "./pages/PurchaseCancel";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkingAuth) return <LoadingSpinner />;

  const hiddenNavBarRoutes = ["/signup", "/login"];
  return (
    <div className="bg-gray-200 min-h-screen">
      {!hiddenNavBarRoutes.includes(location.pathname) && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/admin/dashboard"
          element={user?.role === "admin" ? <AdminPage /> : <Navigate to="/" />}
        />
        <Route path="/category/:category" element={<Category />} />
        <Route
          path="/cart"
          element={user ? <Cart /> : <Navigate to="/login" />}
        />
        <Route
          path="/purchase-success"
          element={user ? <PurchaseSuccess /> : <Navigate to="/login" />}
        />

        <Route
          path="/purchase-cancel"
          element={user ? <PurchaseCancelPage /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
