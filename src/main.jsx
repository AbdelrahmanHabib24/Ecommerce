// src/index.jsx (or src/main.jsx)
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import {store} from "./Store/Store"; // Adjusted case to match typical file naming conventions
import App from "./App";
import "./index.css";

// Get the root element
const rootElement = document.getElementById("root");


  ReactDOM.createRoot(rootElement).render(
    <Provider store={store}>
      <App />
    </Provider>
  );
