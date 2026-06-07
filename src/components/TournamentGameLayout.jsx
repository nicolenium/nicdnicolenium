
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MoveHistoryPanel from './MoveHistoryPanel.jsx';
import PlayerInfoPanel from './PlayerInfoPanel.jsx';
import TournamentAccessPanel from './TournamentAccessPanel.jsx';
import GameStatisticsDisplay from './GameStatisticsDisplay.jsx';
import GameTimerDisplay from './GameTimerDisplay.jsx';

const TournamentGameLayout = ({ 
  boardComponent, 
  gameState, 
  callbacks 
}) => {
  const {
    moves = [],
    player1,
    player2,
    currentTurn,
    player1Time,
    player2Time,
    increment = 0,
    isRunning = true,
    status = "In Progress",
    moveCount = 0,
    captured1 = 0,
    captured2 = 0,
    duration = "00:00"
  } = gameState;

  const { onMoveClick } = callbacks || {};

  const [activeMobileTab, setActiveMobileTab] = useState('board');

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background p-2 md:p-4 lg:p-6 flex flex-col">
      
      {/* Desktop & Tablet Layout */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-[280px_1fr_300px] xl:grid-cols-[320px_1fr_320px] gap-4 lg:gap-6 flex-1 max-w-[1600px] mx-auto w-full">
        
        {/* Left Column: History & Stats */}
        <div className="hidden lg:flex flex-col gap-4 h-full max-h-[85vh]">
          <MoveHistoryPanel moves={moves} onMoveClick={onMoveClick} />
          <GameStatisticsDisplay 
            status={status}
            moveCount={moveCount}
            captured1={captured1}
            captured2={captured2}
            duration={duration}
          />
        </div>

        {/* Center Column: Board & Timers */}
        <div className="flex flex-col gap-4 items-center justify-start h-full">
          <div className="w-full max-w-[600px] xl:max-w-[700px] h-24 shrink-0">
            <GameTimerDisplay 
              player1Time={player1Time}
              player2Time={player2Time}
              player1Name={player1?.name}
              player2Name={player2?.name}
              activePlayer={currentTurn}
              increment={increment}
              isRunning={isRunning}
            />
          </div>
          
          <div className="w-full max-w-[600px] xl:max-w-[700px] aspect-square shrink-0 flex items-center justify-center">
            {boardComponent}
          </div>

          {/* Tablet Only: Stacked Panels below board */}
          <div className="lg:hidden grid grid-cols-2 gap-4 w-full max-w-[600px] mt-4">
            <MoveHistoryPanel moves={moves} onMoveClick={onMoveClick} />
            <PlayerInfoPanel player1={player1} player2={player2} currentTurn={currentTurn} />
          </div>
        </div>

        {/* Right Column: Players & Tournaments */}
        <div className="hidden lg:flex flex-col gap-4 h-full max-h-[85vh]">
          <PlayerInfoPanel player1={player1} player2={player2} currentTurn={currentTurn} />
          <TournamentAccessPanel />
        </div>

      </div>

      {/* Mobile Layout (Tabs) */}
      <div className="md:hidden flex flex-col flex-1 w-full max-w-md mx-auto">
        <div className="mb-4 h-20 shrink-0">
          <GameTimerDisplay 
            player1Time={player1Time}
            player2Time={player2Time}
            player1Name={player1?.name}
            player2Name={player2?.name}
            activePlayer={currentTurn}
            increment={increment}
            isRunning={isRunning}
          />
        </div>

        <Tabs value={activeMobileTab} onValueChange={setActiveMobileTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mb-4 bg-card border border-border">
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="board" className="flex-1 flex items-center justify-center mt-0 outline-none">
            <div className="w-full aspect-square">
              {boardComponent}
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="flex-1 mt-0 outline-none">
            <MoveHistoryPanel moves={moves} onMoveClick={onMoveClick} />
          </TabsContent>
          
          <TabsContent value="info" className="flex-1 flex flex-col gap-4 mt-0 outline-none">
            <PlayerInfoPanel player1={player1} player2={player2} currentTurn={currentTurn} />
            <GameStatisticsDisplay 
              status={status}
              moveCount={moveCount}
              captured1={captured1}
              captured2={captured2}
              duration={duration}
            />
          </TabsContent>
        </Tabs>
      </div>

    </div>
  );
};

export default TournamentGameLayout;
