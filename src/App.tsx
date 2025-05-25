import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Main from "./Chats/Main.tsx";
import Welcome from "./Welcome.tsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
      </Routes>
    </Router>
  );
};

export default App;
