import { ThorinGlobalStyles, lightTheme } from '@ensdomains/thorin'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import PlausibleProvider from 'next-plausible'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import { WagmiConfig } from 'wagmi'

import { GlobalContextProvider } from '@/context'
import { chains, wagmiConfig } from '@/providers'
import '@/styles/style.scss'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PlausibleProvider domain="example.com" trackOutboundLinks>
      <WagmiConfig config={wagmiConfig}>
        <ThemeProvider theme={lightTheme}>
          <ThorinGlobalStyles />
          <RainbowKitProvider chains={chains} modalSize="compact">
            <GlobalContextProvider>
              <Component {...pageProps} />
            </GlobalContextProvider>
          </RainbowKitProvider>
        </ThemeProvider>
      </WagmiConfig>
    </PlausibleProvider>
  )
}
