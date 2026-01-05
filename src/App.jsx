import { RouterProvider } from "react-router/dom";
import { createBrowserRouter } from "react-router";

import Inicio from "./components/Inicio";
import ListadoMuseos from "./components/ListadoMuseos";
import AltaMuseo from "./components/AltaMuseo";
//poner alta salas
import ListadoSalas from "./components/ListadoSalas";


import Home from "./pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
    children: [
      // Todo esto se ve en el Outlet
      { index: true, Component: Inicio }, // Esto se ve en la ruta padre
      {
        path: "/museums",
        element: <ListadoMuseos />,
      },
      {
        path: "/museums/new",
        element: <AltaMuseo />,
      },
      {
        path: "/rooms",
        element: <ListadoSalas />,
      },
      {
        path: "/rooms/new",
        element: <h1>Alta de salas</h1>,
      },
    ],
  },
]);
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
