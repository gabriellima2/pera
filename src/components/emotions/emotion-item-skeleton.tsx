import { Box, type BoxProps } from '@/components/ui/box'
import { Skeleton, type SkeletonProps } from '@/components/ui/skeleton'

export function EmotionItemSkeleton(props: BoxProps) {
  return <Box alignItems="center" gap="sm" {...props} />
}

export function EmotionItemSkeletonBadge(props: SkeletonProps) {
  return (
    <Skeleton
      width={60}
      height={60}
      borderRadius="full"
      backgroundColor="background"
      {...props}
    />
  )
}

export function EmotionItemSkeletonLabel(props: SkeletonProps) {
  return (
    <Skeleton width={50} height={16} backgroundColor="background" {...props} />
  )
}
