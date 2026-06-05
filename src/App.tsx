import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "@/pages/Home";
import { AnnualReport } from "@/pages/AnnualReport";
import { TagManager } from "@/pages/TagManager";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/annual-report" element={<AnnualReport />} />
        <Route path="/tags" element={<TagManager />} />
      </Routes>
    </Router>
  );
}
