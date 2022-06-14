import * as msal from "@azure/msal-browser";

export interface IUserLoginProps {
  loggedIn: boolean;
  name: string;
  login: (name: string, userName: string, idToken: string) => void;
  logout: () => void;
};

export const UserLogin = (props: IUserLoginProps) => {    

  const msalConfig = {
    auth: {
        clientId: process.env.REACT_APP_CLIENTID!, // Use ID of your AZ Func app, redirectUri necessary...
        redirectUri: process.env.REACT_APP_REDIRECTURI!
    }
  };

  const msalInstance = new msal.PublicClientApplication(msalConfig);

  const loginUser = async () => {
    const loginResponse = await msalInstance.loginPopup({ scopes:[] });
    props.login(loginResponse.account?.name!, loginResponse.account?.username!, loginResponse.idToken);
  };

  const logoutUser = async () => {
    msalInstance.logoutPopup();
    props.logout();
  };

  return (
    <div>
      {!props.loggedIn && <button title="Login" onClick={loginUser}>Login</button>}
      {props.loggedIn && 
      <div>
        <text>{props.name}</text>
        <button title="Logout" onClick={logoutUser}>Logout</button>
      </div>}
    </div>
  );
}