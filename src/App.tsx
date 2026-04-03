import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Vocabulary from "./pages/Vocabulary";
import Grammar from "./pages/Grammar";
import Speaking from "./pages/Speaking";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/learn/vocabulary" element={<Vocabulary />} />
        <Route path="/learn/grammar" element={<Grammar />} />
        <Route path="/learn/speaking" element={<Speaking />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}
