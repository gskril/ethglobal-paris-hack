import { mq } from '@ensdomains/thorin'
import styled, { css } from 'styled-components'

import { GithubIcon } from '@/assets/icons'

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;

  ${mq.sm.max(css`
    gap: 0.75rem;
    flex-direction: column-reverse;
  `)}
`

export const Links = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
`

const Link = styled.a`
  color: rgba(0, 0, 0, 0.5);
  font-weight: 600;
  transition: color 0.15s ease-in-out;

  @media (hover: hover) {
    &:hover {
      color: rgba(0, 0, 0, 1);
    }
  }
`

const HideMobile = styled.div`
  ${mq.sm.max(css`
    display: none;
  `)}
`

const HideDesktop = styled.div`
  ${mq.sm.min(css`
    display: none;
  `)}
`

export function Footer() {
  return (
    <Wrapper>
      <HideMobile>
        <Links>
          <Link href="https://warpcast.com/greg" target="_blank">
            gregskril.eth
          </Link>
          <Link href="https://warpcast.com/limone-eth" target="_blank">
            limone.eth
          </Link>
        </Links>
      </HideMobile>

      <HideDesktop>
        <Links>
          <Link href="/create">Create a Bubble</Link>
        </Links>
      </HideDesktop>

      <Links>
        <Link
          href="https://github.com/gskril/ethglobal-paris-hack"
          target="_blank"
        >
          <GithubIcon />
        </Link>
      </Links>
    </Wrapper>
  )
}
