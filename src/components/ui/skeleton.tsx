import { theme, type Theme } from '@/theme'
import { Fragment, ReactNode, type ComponentProps } from 'react'
import { Box, BoxProps } from './box'

export function Skeleton(props: BoxProps) {
  return <Box backgroundColor="surface" borderRadius="lg" {...props} />
}

export type SkeletonProps = ComponentProps<typeof Skeleton>

export function TextSkeleton({
  variant,
  ...props
}: SkeletonProps & {
  variant: Exclude<keyof Theme['textVariants'], 'defaults'>
}) {
  return <Skeleton height={theme.textVariants[variant].lineHeight} {...props} />
}

export function EmotionSkeleton(props: SkeletonProps) {
  return <Skeleton height={72} {...props} />
}

export function EmotionListSkeleton({ count = 7 }: { count?: number }) {
  return (
    <>
      {[...new Array(count)].map((_, index) => (
        <EmotionSkeleton key={index} mb="sm" />
      ))}
    </>
  )
}

export function ListSkeleton({
  count = 7,
  item,
}: {
  count?: number
  item: ReactNode
}) {
  return (
    <>
      {[...new Array(count)].map((_, index) => (
        <Fragment key={index}>{item}</Fragment>
      ))}
    </>
  )
}

export function ListItemSkeleton(props: SkeletonProps) {
  return <Skeleton height={72} mb="sm" {...props} />
}
