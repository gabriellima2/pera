import { Box } from '@/components/ui/box'
import type { ComponentProps, ReactNode } from 'react'
import { Pressable } from 'react-native'

type PressableFeedbackProps = Omit<
  ComponentProps<typeof Pressable>,
  'children'
> & {
  children: ReactNode | ComponentProps<typeof Pressable>['children']
}

export function PressableFeedback({
  children,
  ...props
}: PressableFeedbackProps) {
  return (
    <Pressable {...props}>
      {(state) => {
        if (typeof children === 'function') {
          return children(state)
        }

        return <Box opacity={state.pressed ? 0.8 : 1}>{children}</Box>
      }}
    </Pressable>
  )
}
