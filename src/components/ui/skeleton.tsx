import { Box } from './box'

export function Skeleton(props: React.ComponentProps<typeof Box>) {
  return <Box backgroundColor="surface" borderRadius="lg" {...props} />
}

export function EmotionSkeleton(props: React.ComponentProps<typeof Skeleton>) {
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
