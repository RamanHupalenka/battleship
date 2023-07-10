// export const handleAddShipsRequest = (_data: string) => {
// const { gameId, ships, indexPlayer } = JSON.parse(data) as AddShipsReqData;

// updateGameUserShips(gameId, ships, indexPlayer);

// if (isUsersReadyForGameStart(gameId)) {
//     const { gameUsers } = gamesDB[String(gameId)]!;
//     const randomIndex = Math.floor(Math.random() * 2);
//     const currentPlayerIndex = gameUsers[randomIndex]!.userIdx;

//     gamesDB[String(gameId)]!.currentPlayerIndex = currentPlayerIndex;

//     gameUsers.forEach((u) => {
//         const userSocket = sockets[u.userIdx]!;

//         userSocket.send(
//             JSON.stringify({
//                 type: RequestType.StartGame,
//                 data: JSON.stringify({
//                     ships: u.ships,
//                     currentPlayerIndex,
//                 }),
//                 id: 0,
//             }),
//         );
//     });
// }
// };
