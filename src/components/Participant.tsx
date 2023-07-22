import { User } from '@/types'
import { Typography } from '@ensdomains/thorin'
import styled, { css } from 'styled-components'

export const ParticipantGrid = styled.div(
  ({ theme }) => css`
    display: grid;
    gap: ${theme.space['3']};
    grid-template-columns: repeat(auto-fill, minmax(6.5rem, 5fr));
  `
)

const ParticipantWrapper = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['2']};
    padding: ${theme.space['3']} ${theme.space['2']};
    justify-content: center;
    align-items: center;
    border-radius: ${theme.radii.large};
    background-color: transparent;
    transition: background-color 0.1s ease-in-out;

    span {
      overflow: hidden;
      max-width: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    @media (hover: hover) {
      &:hover {
        background-color: ${theme.colors.accentSurface};
      }
    }
  `
)

const Image = styled.img(
  ({ theme }) => css`
    width: ${theme.space['14']};
    height: ${theme.space['14']};
    object-fit: cover;
    border-radius: ${theme.radii.full};
    box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.05);
  `
)

export function Participant({ person }: { person: User }) {
  return (
    <ParticipantWrapper>
      <Image src={person.avatar} alt={person.name} />
      <Typography asProp="span">{person.name}</Typography>
    </ParticipantWrapper>
  )
}
