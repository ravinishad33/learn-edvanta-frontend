import useLogout from "../../utils/Logout";

const LogoutButton = () => {
  const handleLogout = useLogout();

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
