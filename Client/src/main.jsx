import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import router from './routes/router.jsx';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx'; 
import { QueryClient, QueryClientProvider } from 'react-query';
import { ChatProvider } from './context/chatContext.jsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChatProvider>
          <RouterProvider router={router} />
        </ChatProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
