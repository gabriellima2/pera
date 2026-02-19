import React from 'react'
import { Box } from './box'

type SectionProps = React.ComponentProps<typeof Box>

export function Section({ children, ...props }: SectionProps) {
  return (
    <Box marginVertical="sm" {...props}>
      {children}
    </Box>
  )
}
