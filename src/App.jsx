import { RouterProvider } from "react-router/dom";
import { createBrowserRouter } from "react-router";

import Inicio from "./components/Inicio";
//museos
import ListadoMuseos from "./components/ListadoMuseos";
import AltaMuseo from "./components/AltaMuseo";
import EditarMuseo from "./components/EditarMuseo";
import BusquedaMuseos from "./components/BusquedaMuseos";
import BusquedaMuseosFecha from "./components/BusquedaMuseosFecha";
//salas
import ListadoSalas from "./components/ListadoSalas";
import AltaSala from "./components/AltaSala";
import EditarSala from "./components/EditarSala";
import BusquedaSalas from "./components/BusquedaSalas";

import Home from "./pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
    children: [
      { index: true, Component: Inicio },
      {
        path: "/museums/new",
        element: <AltaMuseo />,
      },
      {
        path: "/museums",
        element: <ListadoMuseos />,
      },
      {
        path: "/museums/editar/:id",
        element: <EditarMuseo />,
      },
      {
        path: "/museums/buscar",
        element: <BusquedaMuseos />,
      },
      {
        path: "/museums/buscar-fecha",
        element: <BusquedaMuseosFecha />,
      },
      {
        path: "/rooms/new",
        element: <AltaSala />,
      },
      {
        path: "/rooms",
        element: <ListadoSalas />,
      },
      {
        path: "/rooms/editar/:id",
        element: <EditarSala />,
      },
      {
        path: "/rooms/buscar",
        element: <BusquedaSalas />,
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
