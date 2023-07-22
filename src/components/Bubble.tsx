import { Typography } from '@ensdomains/thorin'
import Link from 'next/link'
import styled, { css } from 'styled-components'

import { Card } from '@/components/atoms'
import { Bubble as BubbleType, User } from '@/types'

import { GateTag } from './GateTag'

export const BubbleGrid = styled.div(
  ({ theme }) => css`
    display: grid;
    gap: ${theme.space['4']};
    grid-template-columns: repeat(auto-fill, minmax(18rem, 4fr));
  `
)

const Title = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.headingFour};
    line-height: 1.2;
    font-weight: ${theme.fontWeights.bold};
  `
)

const Listener = styled.img(
  ({ theme }) => css`
    width: ${theme.space['8']};
    height: ${theme.space['8']};
    object-fit: cover;
    border-radius: ${theme.radii.full};
    margin-right: -${theme.space['2']};
    box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.05);

    &:last-child {
      margin-right: 0;
    }
  `
)

type BubbleProps = BubbleType

export const Bubble = ({ title, slug, gate, people }: BubbleProps) => {
  return (
    <Link href={`/b/${slug}`}>
      <Card>
        <GateTag gate={gate} />

        <Title asProp="span">{title}</Title>

        <Listeners people={people} />
      </Card>
    </Link>
  )
}

export const Listeners = ({ people }: { people: User[] }) => (
  <div style={{ display: 'flex' }}>
    {people.map((person) => (
      // eslint-disable-next-line @next/next/no-img-element
      <Listener key={person.name} src={person.avatar} alt={person.name} />
    ))}
  </div>
)
