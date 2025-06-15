import { createBrowserRouter } from "react-router-dom";
import HomeLayOut from "../layouts/HomeLayOut";
import AskModal from "../components/Modals/AskModal";
import AnswerModel from "../components/Modals/AnswerModel";
import SavedPosts from "../pages/SavedPosts";
import ProfilePage from "../pages/ProfilePage";
import About from "../pages/AboutPage";
import ComposeAnswer from "../pages/ComposeAnswer";
import ProfileEditModal from "../components/Modals/ProfileEditModal";
import ProfileAsks from "../components/ProfileAsks";
import Discussions from "../components/Discussions";
import Materials from "../components/Materials";
import SignInSignUp from "../pages/SignInSignUp";
import ProtectedRoute from "../components/ProtectedRoute"; 
import GuestRoute from "../components/GuestRoute";
import SelectTags from "../components/SelectTags";
import OtherUserProfile from "../pages/OtherUserProfile"
import ModerateModel from "../components/Modals/ModerateModel";
import MaterialUpload from "../components/Modals/MaterialUpload";
import ChatsPage from "../pages/ChatsPage";
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <HomeLayOut />
      </ProtectedRoute>
    ),
    children: [
      { path: 'ask', element: <AskModal /> },
      { path: 'answer/:answerid', element: <AnswerModel /> },
      { path: 'moderate', element: <ModerateModel /> },
    ],
  },
  {
    path: '/saved-posts',
    element: (
      <ProtectedRoute>
        <SavedPosts />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile/:userId',
    element: (
      <ProtectedRoute>
        <OtherUserProfile />
      </ProtectedRoute>
    ),
    children: [
      { path: 'asks', element: <ProfileAsks /> },
      { path: 'discussions', element: <Discussions /> },
      { path: 'materials', element: <Materials /> },
    ],
  },
  {
    path: '/compose/:questionId',
    element: (
      <ProtectedRoute>
        <ComposeAnswer />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
    children: [
      { path: 'edit', element: <ProfileEditModal /> },
      { path: 'asks', element: <ProfileAsks /> },
      { path: 'discussions', element: <Discussions /> },
      { path: 'materials', element: <Materials /> },
      { path: 'upload', element: <MaterialUpload /> },
    ],
  },
  {
    path: '/about',
    element: (
      <ProtectedRoute>
        <About />
      </ProtectedRoute>
    ),
  },
  {
  path: '/select-tags',
  element: <SelectTags />
},
  {
    path: '/authenticate',
             
    element: (<GuestRoute>
               <SignInSignUp />
              </GuestRoute>),
  },
  {
    path: '/moderate',
    element: (
      <ProtectedRoute>
        <ModerateModel />
      </ProtectedRoute>
    ),
  },
  {
    path: '/chats',
    element: (
      <ProtectedRoute>
          <ChatsPage />
      </ProtectedRoute>
    ),
  },
]);

export default router;
