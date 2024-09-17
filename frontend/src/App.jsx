import { Navigate, Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import TransactionPage from "./pages/TransactionPage";
import NotFoundPage from "./pages/NotFoundPage";
import Header from "./components/ui/Header";
import { useQuery } from "@apollo/client";
import { GET_AUTHENTICATED_USER } from "./graphql/queries/user.query";
import { Toaster } from "react-hot-toast";
export default function App() {
  const {loading,data,error} = useQuery(GET_AUTHENTICATED_USER);

  if(loading){
    return null
  }
  return (
    <>
      {data?.authUser && <Header />}
      <Routes>
        <Route path="/" element={data?.authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={data?.authUser ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/signup" element={data?.authUser? <Navigate to="/" /> : <SignUpPage />} />
        <Route path="/transaction/:id" element={data?.authUser ? <TransactionPage /> : <Navigate to="/login" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  )
}