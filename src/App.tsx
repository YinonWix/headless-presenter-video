import { HashRouter, Route, Routes } from "react-router-dom";
import Stage from "./components/Stage";
import { CartProvider } from "./store/CartContext";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Cart from "./pages/Cart";

export default function App() {
  return (
    <CartProvider>
      <HashRouter>
        <Stage>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </Stage>
      </HashRouter>
    </CartProvider>
  );
}
