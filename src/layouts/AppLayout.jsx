import { Navbar } from "../components/Navbar";
export default function AppLayout({ children }) {
  return (
    <div className="relative w-full ">
      <Navbar />
      {children}
    </div>
  );
}
