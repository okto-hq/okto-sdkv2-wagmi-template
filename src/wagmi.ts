import { okto } from '@okto_web3/wagmi-adapter';
import { cookieStorage, createConfig, createStorage, http } from 'wagmi';
import { mainnet, optimism, polygon } from 'wagmi/chains';
 
export function getConfig() {
  return createConfig({
    chains: [polygon],
    connectors: [
      okto({
        environment: 'sandbox',
        clientPrivateKey: process.env.NEXT_PUBLIC_CLIENT_PRIVATE_KEY as `0x${string}`,
        clientSWA: process.env.NEXT_PUBLIC_CLIENT_SWA as `0x${string}`,
      }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [polygon.id]: http(),
    },
  });
}
 
declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}