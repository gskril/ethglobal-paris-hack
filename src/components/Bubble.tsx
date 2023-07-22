import { Tag, Typography } from '@ensdomains/thorin'
import Link from 'next/link'
import styled, { css } from 'styled-components'

import { Card } from '@/components/atoms'
import { Bubble as BubbleType } from '@/types'

export const BubbleGrid = styled.div(
  ({ theme }) => css`
    display: grid;
    gap: ${theme.space['4']};
    grid-template-columns: repeat(auto-fill, minmax(18rem, 4fr));
  `
)

const Title = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.extraLarge};
    font-weight: ${theme.fontWeights.bold};
  `
)

type BubbleProps = BubbleType

export const Bubble = ({ title, slug, gate, people }: BubbleProps) => {
  return (
    <Link href={`/b/${slug}`}>
      <Card>
        <Tag tone="accent">{gate}</Tag>
        <Title as="span" size="base">
          {title}
        </Title>
      </Card>
    </Link>
  )
}
