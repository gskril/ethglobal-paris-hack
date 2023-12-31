import { Spinner, Typography } from '@ensdomains/thorin'
import Link from 'next/link'
import styled, { css } from 'styled-components'

import { Card } from '@/components/atoms'
import { Bubble as BubbleType } from '@/lib/db/interfaces/bubble'
import { User } from '@/lib/db/interfaces/user'

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

type BubbleProps = BubbleType & {
  listenersCount: number | undefined
}

export const Bubble = ({
  name,
  slug,
  conditions: _conditions,
  listenersCount,
}: BubbleProps) => {
  const condition = _conditions?.[0]

  return (
    <Link href={`/b/${slug}`}>
      <Card>
        <GateTag
          token={condition.token}
          poapEvent={condition.poapEvent}
          sismoGroups={condition.sismoGroups}
          gate={condition.type}
        />

        <Title asProp="span">{name}</Title>

        {listenersCount !== undefined ? (
          <p>
            {listenersCount} listener{listenersCount !== 1 && 's'}
          </p>
        ) : (
          <Spinner />
        )}

        {/* TODO: add preview of listeners */}
        {/* <Listeners people={[]} /> */}
      </Card>
    </Link>
  )
}

export const Listeners = ({ people }: { people: User[] }) => (
  <div style={{ display: 'flex' }}>
    {people.map((person) => (
      // eslint-disable-next-line @next/next/no-img-element
      <Listener
        key={person.ensLabel || person.farcasterFName}
        src={person.avatarUrl}
        alt=""
      />
    ))}
  </div>
)
