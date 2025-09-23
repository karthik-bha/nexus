import Navbar from "./Navbar";

const Layout = ({ children }) => {
    return (
        <div>
            <Navbar />
            <main className="max-w-[1200px] mx-auto">{children}</main>
        </div>
    );
};

export default Layout;