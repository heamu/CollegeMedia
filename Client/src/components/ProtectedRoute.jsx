import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

   useEffect(()=>{
       if(!loading&&!user){
         navigate("/authenticate",{replace:true});
       }
   },[user,loading,navigate]);

  // i will create Loading component 

  if (loading) return <p>Loading...</p>;
  
  if (!user) return <Navigate to="/authenticate" replace />;


  // if the user has 0 tags then we can confirm that he is signed up just now 
  // every signed up user must have atleast one tag selected
  
  if (user && user.tags.length === 0 && location.pathname !== '/select-tags') {
    console.log(user);
  return <Navigate to="/select-tags" />;
  }

  return children;
};

export default ProtectedRoute;




// import { useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/useAuth";

// const ProtectedRoute = ({ children }) => {
//   const { user, loading } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     if (!loading && !user) {
//       navigate("/authenticate", { replace: true });
//     }
//   }, [user, loading, navigate]);

//   useEffect(() => {
//     if (!loading && user?.tags?.length === 0 && location.pathname !== "/select-tags") {
//       navigate("/select-tags", { replace: true });
//     }
//   }, [user, loading, location.pathname, navigate]);

//   if (loading || !user) return null;

//   return children;
// };

// export default ProtectedRoute;

