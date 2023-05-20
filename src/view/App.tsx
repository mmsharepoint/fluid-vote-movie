import React from 'react';
import { AzureClient, AzureClientProps } from "@fluidframework/azure-client";
import { InsecureTokenProvider } from "@fluidframework/test-client-utils";
import { IFluidContainer, SharedMap } from 'fluid-framework';
import { FluidVoting } from './components/FluidVoting';

// const client = new TinyliciousClient();
const containerSchema = {
  initialObjects: { sharedVotes: SharedMap }
};

const createClient = () => {
  const userID = "";
  const connectionConfig: AzureClientProps = { connection: {
    tenantId: process.env.REACT_APP_TENANT_ID!,
    tokenProvider: new InsecureTokenProvider(process.env.REACT_APP_PRIMARY_KEY!, { id: userID }),
    endpoint: process.env.REACT_APP_FLUID_SERVICE_ENDPOINT!,
    type: "remote"
  }} ;
  const client = new AzureClient(connectionConfig);
  return client;
}

const client = createClient();

const createContainer = async () => {
  const { container } = await client.createContainer(containerSchema);
  const containerId = await container.attach();

  // Initialize votes
  const sharedVotes = container.initialObjects.sharedVotes as SharedMap;
  sharedVotes.set("votes1", 0);
  sharedVotes.set("votes2", 0);
  sharedVotes.set("votes3", 0);
  return containerId;
};

const getContainer = async (containerId: string) => {
  const { container } = await client.getContainer(containerId, containerSchema);
  return container;
}

const getFluidContainer = async () => {
  let containerId: string = window.location.hash.substring(1);
  if (!containerId) {
    containerId = await createContainer();
    window.location.hash = containerId;
  }
  const container = await getContainer(containerId);

  return container;
};

const App = () => {
  const [fluidContainer, setFluidContainer] = React.useState<IFluidContainer>();
  const [fluidContainerMap, setFluidContainerMap] = React.useState<SharedMap>();
  
  React.useEffect(() => {
    getFluidContainer()
     .then(c => setFluidContainer(c));
  }, []);

  React.useEffect(() => {
    if (fluidContainer !== undefined) {
      const sharedVotes = fluidContainer.initialObjects.sharedVotes as SharedMap;
      setFluidContainerMap(sharedVotes);
    }
  }, [fluidContainer]);

  if (fluidContainerMap !== undefined) {
    return (
      <FluidVoting votingMap={fluidContainerMap!} />
    );
  }
  else {
    return (
      <div >Loading votings...</div>
    );
  }
};

export default App;
