
import { ServerConnectionProvider, useServerConnection } from './context/ServerConnectionContext'
import { RoomControls } from './components/RoomControls'
import { PlayerList } from './components/PlayerList'
import { GameView } from './components/GameView'
import { UserProvider, useUser } from './context/UserContext'
import { UserNamePrompt } from './components/UserNamePrompt'

const MainContent = () => {
  const { username } = useUser();

  if (!username) {
    return <UserNamePrompt />;
  }

  return (
    <ServerConnectionProvider>
      <div className="h-screen w-full overflow-hidden flex flex-col items-center justify-center p-4 md:p-8 bg-black">
        <InnerContent />
      </div>
    </ServerConnectionProvider>
  );
};

import { useState, useEffect } from 'react';
import { CountdownView } from './components/CountdownView';
import { useRoom } from './context/ServerConnectionContext';
const InnerContent = () => {
  const room = useRoom();
  const { isGameStarted, isConnected } = useServerConnection();
  const [showCountdown, setShowCountdown] = useState(false);
  const [showGame, setShowGame] = useState(false);

  useEffect(() => {
    if (isGameStarted) {
      setShowCountdown(true);
    }
  }, [isGameStarted]);

  const handleCountdownComplete = () => {
    room?.send("readyToCollect");
    setShowCountdown(false);
    setShowGame(true);
  };

  return (
    <>
      {showCountdown ? (
        <CountdownView onComplete={handleCountdownComplete} />
      ) : showGame ? (
        <GameView />
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full max-h-screen">
          <h1 className="text-4xl md:text-5xl mb-6 text-center uppercase tracking-[0.2em] text-shadow-glow border-b-4 border-retro-green pb-4 w-full max-w-4xl">
            Emotional Knight
          </h1>

          {!isConnected ? (
            <div className="w-full max-w-xl animate-fade-in">
              <RoomControls />
            </div>
          ) : (
            <div className="flex flex-row items-stretch justify-center gap-8 w-full max-w-7xl overflow-hidden p-4 animate-fade-in">
              <div className="flex-1 max-w-2xl">
                <RoomControls />
              </div>
              <div className="flex-1 max-w-sm">
                <PlayerList />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

function App() {
  return (
    <UserProvider>
      <MainContent />
    </UserProvider>
  )
}

export default App
