import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";


export default function BotonEditar( {ruta, id} ) {

  const navigate = useNavigate();

  async function handleEditar() {
    navigate(ruta + id);
  }

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleEditar()}
      >
        <EditIcon />
      </Button>
    </>
  );
}