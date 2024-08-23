// 'use strict';
// import * as path from 'path';
// import Server from './server';

// async function startTwoServers(): Promise<string[]> {
//     const server1 = new Server();
//     const server2 = new Server();

//     const binPath = path.resolve('../cmd/anytype-heart/cmd/grpcserver'); // Path to your Go script or binary
//     const workingDir = path.resolve('../cmd/anytype-heart'); // Path to your working directory, typically the project root

//     try {
//         const address1 = await server1.start(binPath, workingDir);
//         console.log('Server 1 started at address:', address1);

//         const address2 = await server2.start(binPath, workingDir);
//         console.log('Server 2 started at address:', address2);

//         return [address1, address2];
//     } catch (err) {
//         console.error('Failed to start one or both servers:', err);
//         throw err;
//     }
// }

// startTwoServers().then(addresses => {
//     if (addresses) {
//         console.log('Both servers started successfully:', addresses);
//     } else {
//         console.error('There was an issue starting the servers.');
//     }
// });
