import { Button, Profile, mq } from '@ensdomains/thorin'
import { useAccountModal, useConnectModal } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import toast from 'react-hot-toast'
import styled, { css } from 'styled-components'
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'

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

const StyledButton = styled(Button)(
  ({ theme }) => css`
    padding: ${theme.space['3']} ${theme.space['6']};
    width: fit-content;
  `
)

const sharedStyles = css(
  ({ theme }) => css`
    width: fit-content;
    padding: ${theme.space['1']};

    & > div:first-child {
      width: 2.625rem;
    }

    h3 {
      font-size: ${theme.fontSizes.base};
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

  ${mq.xs.max(css`
      display: none;
    `)}
  `
)

const ProfileMobile = styled(Profile)`
  ${sharedStyles}

  ${mq.xs.min(css`
    display: none;
  `)}
`

export function Nav() {
  const { address } = useAccount()
  const { data: ensName } = useEnsName({ address: address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName })

  const { openConnectModal } = useConnectModal()
  const { openAccountModal } = useAccountModal()

  const { disconnect } = useDisconnect()

  return (
    <Wrapper>
      <Name href="/">Bubbles</Name>

      {address ? (
        <>
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

          <ProfileMobile
            size="small"
            address={address}
            ensName={ensName || undefined}
            avatar={ensAvatar ? ensAvatar : undefined}
            onClick={openAccountModal}
          />
        </>
      ) : (
        <StyledButton shape="circle" onClick={openConnectModal}>
          Connect
        </StyledButton>
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
