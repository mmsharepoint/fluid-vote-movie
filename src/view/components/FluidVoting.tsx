import React from "react";
import { SharedMap } from "fluid-framework";

export interface IFluidVotingProps {
  votingMap: SharedMap;
};

export const FluidVoting = (props: IFluidVotingProps) => {
  const [votes1, setVotes1] = React.useState<number>(props.votingMap.get("votes1")!);
  const [votes2, setVotes2] = React.useState<number>(props.votingMap.get("votes2")!);
  const [votes3, setVotes3] = React.useState<number>(props.votingMap.get("votes3")!);

  const videoSrc1 = `https://ia904503.us.archive.org/5/items/windows-7-sample-video/Wildlife.mp4`;
  const videoSrc2 = `https://adaptivecardsblob.blob.core.windows.net/assets/AdaptiveCardsOverviewVideo.mp4`;
  const videoSrc3 = `https://jsoncompare.org/LearningContainer/SampleFiles/Video/MP4/Sample-MP4-Video-File-for-Testing.mp4`;

  React.useEffect(() => {
    const updateVotes = () => {
      setVotes1(props.votingMap.get("votes1")!);
      setVotes2(props.votingMap.get("votes2")!);
      setVotes3(props.votingMap.get("votes3")!);
    };

    props.votingMap.on("valueChanged", updateVotes);

    return () => {
      props.votingMap.off("valueChanged", updateVotes);
    };
  });
    return (
        <div className='appContainer' >
          <div className="videoFrame">
            <video src={videoSrc1} controls width={260}></video>
          </div>
          <button onClick={() => { props.votingMap.set("votes1", votes1! + 1); }}>Vote Movie 1</button>
          <div className="videoFrame">
            <video src={videoSrc2} controls width={260}></video>
          </div>
          <button onClick={() => { props.votingMap.set("votes2", votes2! + 1); }}>Vote Movie 2</button>
          <div className="videoFrame">
            <video src={videoSrc3} controls width={260}></video>
          </div>
          <button onClick={() => { props.votingMap.set("votes3", votes3! + 1); }}>Vote Movie 3</button>
          <div>
              <span className="votesResult"><text>{`Votes Movie 1: ${votes1}`} </text></span>
              <span className="votesResult"><text>{`Votes Movie 2: ${votes2}`} </text></span>
              <span className="votesResult"><text>{`Votes Movie 3: ${votes3}`} </text></span>
          </div>
        </div>
      );
};