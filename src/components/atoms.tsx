import { Card as ThorinCard, mq } from '@ensdomains/thorin'
import styled, { css } from 'styled-components'

export const Layout = styled.div<{ $verticalCenter?: boolean }>(
  ({ theme, $verticalCenter = true }) => css`
    width: 100%;
    min-height: 100svh;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    padding: ${theme.space['4']};
    gap: ${theme.space['12']};

    ${!$verticalCenter &&
    css`
      gap: ${theme.space['24']};

      & > *:nth-child(2) {
        flex: 1;
      }
    `}

    ${mq.sm.min(css`
      padding: ${theme.space['8']};
    `)}
  `
)

export const Container = styled.div(
  ({ theme }) => css`
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    max-width: ${theme.space['224']};
  `
)

export const Card = styled(ThorinCard)(
  ({ theme }) => css`
    padding: ${theme.space['4']};
    display: flex;
    flex-direction: column;
    gap: ${theme.space['2']};
    width: 100%;
    border-radius: ${theme.radii.extraLarge};
  `
)
