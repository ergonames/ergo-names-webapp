import Footer from "./components/footer";
import Navbar from "./components/navbar";
import SearchBox from "./components/searchbox";

function App() {
  return (
    <div className="bg-slate-900 h-screen">
      <Navbar />
      <SearchBox />
      <Footer />
    </div>
  );
}

export default App;
