import { createHashRouter } from 'react-router-dom'; // Import HashRouter instead of BrowserRouter
import IndexPage from '@/pages/Index';
import SettingsPage from '@/pages/Settings';
import StretchingPage from '@/pages/Stretching';
import NotFoundPage from '@/pages/NotFound';

export const router = createHashRouter([ // Export the router object
  {
    path: '/',
    element: <IndexPage />,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
  },
  {
    path: '/stretching',
    element: <StretchingPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
