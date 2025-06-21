import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { CartProvider } from './Modules/Cart/CartContext.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';

ReactDOM.createRoot(document.getElementById("SGS")).render(
  <ErrorBoundary>
    <CartProvider>
      <App />
    </CartProvider>
  </ErrorBoundary>
);



// ReactDOM.render(<App />, document.getElementById("root"));


