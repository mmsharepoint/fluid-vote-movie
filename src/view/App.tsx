import React from 'react';
import { TinyliciousClient } from '@fluidframework/tinylicious-client';
import { IFluidContainer, SharedMap } from 'fluid-framework';
import { FluidVoting } from './components/FluidVoting';

const client = new TinyliciousClient();
const containerSchema = {
  initialObjects: { sharedVotes: SharedMap }
};

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
