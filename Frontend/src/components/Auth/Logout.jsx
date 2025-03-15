import { signOutUser } from "../../firebase/auth";
import Button from "../../components/ui/Button";

const Logout = ({ setUser }) => {
  const handleLogout = async () => {
    await signOutUser();
    setUser(null);
  };

  return <Button onClick={handleLogout}>Sign Out</Button>;
};

export default Logout;
