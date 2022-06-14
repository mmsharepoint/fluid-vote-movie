import React from 'react';
// import { TinyliciousClient } from '@fluidframework/tinylicious-client';
import { IFluidContainer, SharedMap } from 'fluid-framework';
import { FluidVoting } from './components/FluidVoting';
import { getFluidContainer } from "../utils";
import { UserLogin } from './components/UserLogin';

const App = () => {
  const [fluidContainer, setFluidContainer] = React.useState<IFluidContainer>();
  const [fluidContainerMap, setFluidContainerMap] = React.useState<SharedMap>();
  const [userDisplayName, setUserDisplayName] = React.useState<string>("");
  const [userID, setUserID] = React.useState<string>();
  const [userLoggedin, setUserLoggedin] = React.useState<boolean>(false);
  
  const login = async (name: string, userName: string, idToken: string) => {
    setUserDisplayName(name);    
    setUserLoggedin(true);
    setUserID(userName);
    const container: IFluidContainer = await getFluidContainer(userName, idToken);
    setFluidContainer(container);
  };

  const logout = () => {
    setUserDisplayName("");
    setUserLoggedin(false);
  };

  React.useEffect(() => {
    if (userID === "") {
      getFluidContainer(userID)
        .then(c => setFluidContainer(c));
    }
  }, [userID]); // Will login with user "" as long as initialized that way

  React.useEffect(() => {
    if (fluidContainer !== undefined) {
      const sharedVotes = fluidContainer.initialObjects.sharedVotes as SharedMap;
      setFluidContainerMap(sharedVotes);
    }
  }, [fluidContainer]);

  if (fluidContainerMap !== undefined ||
      !userLoggedin) { // Comment this if your token provider does not require authentication
    return (
      <div>
        <UserLogin loggedIn={userLoggedin} name={userDisplayName} login={login} logout={logout} />
        {userLoggedin && // Comment this if your token provider does not require authentication
        <FluidVoting votingMap={fluidContainerMap!} />
        }
      </div>
    );
  }
  else {
    return (
      <div >Loading votings...</div>
    );
  }
};

export default App;
