import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { CartProvider } from './Modules/Cart/CartContext.jsx';
ReactDOM.createRoot(document.getElementById("SGS")).render(
      <CartProvider>
 <App />
     
      </CartProvider>
     
);


// ReactDOM.render(<App />, document.getElementById("root"));


