import { okto } from '@okto_web3/wagmi-adapter';
import { cookieStorage, createConfig, createStorage, http } from 'wagmi';
import { mainnet, optimism, polygon, baseSepolia } from 'wagmi/chains';
 
export function getConfig() {
  return createConfig({
    chains: [baseSepolia],
    connectors: [
      okto({
        environment: 'sandbox',
        clientPrivateKey: process.env.NEXT_PUBLIC_CLIENT_PRIVATE_KEY as `0x${string}`,
        clientSWA: process.env.NEXT_PUBLIC_CLIENT_SWA as `0x${string}`,
        googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [baseSepolia.id]: http(),
    },
  });
}
 
declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}