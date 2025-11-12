import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-4 ">
        {children}
      </main>
    </div>
  );
};

export default Layout;
