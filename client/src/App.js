import { BrowserRouter as Router, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import routes from './routes/mainRoutes'

function App() {
  return (
    <div className="">
      <Router>
        <Toaster toastOptions={{ duration: 2000, style: { borderRadius: '25px', border: "1px solid black" } }} />
        <Routes>
          {routes}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
