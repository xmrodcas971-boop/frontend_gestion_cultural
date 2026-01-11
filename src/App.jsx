import { RouterProvider } from "react-router/dom";
import { createBrowserRouter } from "react-router";

import Inicio from "./components/Inicio";
//museos
import ListadoMuseos from "./components/ListadoMuseos";
import AltaMuseo from "./components/AltaMuseo";

//salas
import ListadoSalas from "./components/ListadoSalas";
import AltaSala from "./components/AltaSala";


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
        element: <AltaSala />,
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
