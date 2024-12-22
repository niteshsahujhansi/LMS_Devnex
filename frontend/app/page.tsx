import Authors from "./components/author";
import Books from "./components/books";
import BorrowRecords from "./components/borrowrecords";
import Reports from "./components/reports";
import ProtectedRoute from "./components/ProtectRoute";
import LogoutButton from "./components/logout";

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center my-6">
          Library Management System
        </h1>
        <LogoutButton/>
        <Authors />
        <Books />
        <BorrowRecords />
        <Reports />
      </div>
    </ProtectedRoute>
  );
}
