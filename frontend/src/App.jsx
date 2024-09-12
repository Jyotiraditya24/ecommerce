import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import NavBar from "./pages/components/NavBar";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
function App() {
  const user = useUserStore((state) => state.user);
  console.log(user);
  return (
    <div className="bg-gray-200 min-h-screen">
      <NavBar />
      <Routes>
        <Route path="/" element={user ? <Home /> : <Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={user ? <Home /> : <Login />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
