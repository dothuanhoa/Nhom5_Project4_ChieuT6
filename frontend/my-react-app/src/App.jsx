import "./App.css";
import AllRoute from "./components/AllRoute";
import { Toaster } from 'sonner';
function App() {
  return (
    <>
      <Toaster position="top-right" richColors duration={3000} />
      <AllRoute />
    </>
  );
}

export default App;
