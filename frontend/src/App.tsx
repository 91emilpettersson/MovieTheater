import SeatGrid from "./components/SeatGrid";
import "./App.css";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="App">
      <SeatGrid />
      <Toaster />
    </div>
  );
}

export default App;
