import { Button, Profile, mq } from '@ensdomains/thorin'
import { useAccountModal } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import toast from 'react-hot-toast'
import styled, { css } from 'styled-components'
import { useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'

import { useIsMounted } from '@/hooks/useIsMounted'
import { useGlobalContext } from '@/hooks/useGlobalContext'
import { SiweButton } from './SiweButton'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
`

const Name = styled(Link)`
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 3rem;
`

const sharedStyles = css(
  ({ theme }) => css`
    width: fit-content;
    padding: ${theme.space['1']};

    & > div:first-child {
      width: 2.625rem;
    }

    h3 {
      font-size: ${theme.fontSizes.body};
    }

    h4 {
      font-size: 0.85rem;
    }
  `
)

const ProfileMedium = styled(Profile)(
  ({ theme }) => css`
    ${sharedStyles}
    ${theme.space['3']}

  ${mq.sm.min(css`
      max-width: 15rem;
    `)}
  `
)

const ProfileMobile = styled(Profile)`
  ${sharedStyles}

  ${mq.sm.min(css`
    display: none;
  `)}
`

const HideMobile = styled.div`
  ${mq.sm.max(css`
    display: none;
  `)}
`

export function Nav() {
  const { address, token } = useGlobalContext()
  const { data: ensName } = useEnsName({ address: address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName })

  const { openAccountModal } = useAccountModal()

  const { disconnect } = useDisconnect()
  const isMounted = useIsMounted()

  return (
    <Wrapper>
      <Name href="/">Bubbles</Name>

      {address && token && isMounted ? (
        <div style={{ display: 'flex', gap: '1rem' }}>
          <HideMobile>
            {token && (
              <Button as="a" shape="rounded" href="/create">
                Create Bubble
              </Button>
            )}
          </HideMobile>

          <HideMobile>
            <ProfileMedium
              address={address}
              ensName={ensName || undefined}
              avatar={ensAvatar ? ensAvatar : undefined}
              dropdownItems={[
                {
                  label: 'Copy Address',
                  color: 'text',
                  onClick: async () => {
                    await copyToClipBoard(address)
                  },
                },
                {
                  label: 'Disconnect',
                  color: 'red',
                  onClick: () => disconnect(),
                },
              ]}
            />
          </HideMobile>

          <ProfileMobile
            size="small"
            address={address}
            ensName={ensName || undefined}
            avatar={ensAvatar ? ensAvatar : undefined}
            onClick={openAccountModal}
          />
        </div>
      ) : (
        <SiweButton />
      )}
    </Wrapper>
  )
}

const copyToClipBoard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  } catch (err) {
    console.error('Failed to copy text: ', err)
    toast.error('Failed to copy to clipboard')
  }
}
