import React from 'react'
import { Box } from './box'

type ContainerProps = React.ComponentProps<typeof Box>

export function Container({ children, ...props }: ContainerProps) {
  return (
    <Box
      flex={1}
      backgroundColor="background"
      paddingHorizontal="md"
      {...props}
    >
      {children}
    </Box>
  )
}
