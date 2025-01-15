import { useAuth0 } from "@auth0/auth0-react";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function LoginButton() {
  const {
    loginWithPopup,
    logout,
    isAuthenticated,
    user,
    getAccessTokenSilently,
  } = useAuth0();

  async function handleAuth() {
    await (async () => {
      await loginWithPopup();

      const token = await getAccessTokenSilently();
      cookies.set("api_token", `Bearer ${token}`);
    })();
  }

  return (
    <>
      {!isAuthenticated && <button onClick={() => handleAuth()}>Log In</button>}
      {isAuthenticated && (
        <div>
          <p>{user?.email}</p>
          <button onClick={() => logout()}>Log Out</button>
        </div>
      )}
    </>
  );
}
