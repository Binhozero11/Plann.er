import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { login, register, resetPassword } from "./pages/auth";
import { CreateTripPage } from "./pages/create-trip";
import { TripDetailsPage } from "./pages/trip-details";
 
const router = createBrowserRouter([
  {
    path: "/"
  },
  // antes era path: "/", caso eu faça alguma besteira
  {
    path: "/",
    element: <CreateTripPage />,
  },
  {
    path: "/trips/:tripId",
    element: <TripDetailsPage />,
  },
]);

export function App() {
    return <RouterProvider router={router} />
}
