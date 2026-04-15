import { theme } from '@/theme'
import { useEffect, useState } from 'react'
import { Modal, Pressable, StyleSheet, View } from 'react-native'
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type BottomSheetProps = {
  isVisible: boolean
  onClose: () => void
  children: React.ReactNode
}

const SHEET_HEIGHT = 300
const DISMISS_THRESHOLD = 80

export function BottomSheet({
  isVisible,
  onClose,
  children,
}: BottomSheetProps) {
  const insets = useSafeAreaInsets()
  const translateY = useSharedValue(SHEET_HEIGHT)
  const backdropOpacity = useSharedValue(0)
  const [modalVisible, setModalVisible] = useState(false)

  const closeWithAnimation = () => {
    backdropOpacity.value = withTiming(0, { duration: 200 })
    translateY.value = withTiming(SHEET_HEIGHT, { duration: 250 }, () => {
      runOnJS(setModalVisible)(false)
      runOnJS(onClose)()
    })
  }

  useEffect(() => {
    if (isVisible) {
      setModalVisible(true)
      backdropOpacity.value = withTiming(1, { duration: 250 })
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 200,
        mass: 0.8,
      })
    }
  }, [isVisible, backdropOpacity, translateY])

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY
      }
    })
    .onEnd((e) => {
      if (e.translationY > DISMISS_THRESHOLD) {
        runOnJS(closeWithAnimation)()
      } else {
        translateY.value = withSpring(0, {
          damping: 20,
          stiffness: 200,
          mass: 0.8,
        })
      }
    })

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }))

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={closeWithAnimation}
    >
      <GestureHandlerRootView style={styles.root}>
        <View style={styles.container}>
          <Animated.View style={[styles.backdrop, backdropStyle]}>
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={closeWithAnimation}
            />
          </Animated.View>

          <GestureDetector gesture={panGesture}>
            <Animated.View
              style={[
                styles.sheet,
                sheetStyle,
                { paddingBottom: insets.bottom + theme.spacing.lg },
              ]}
            >
              <View style={styles.handle} />
              {children}
            </Animated.View>
          </GestureDetector>
        </View>
      </GestureHandlerRootView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadii.lg,
    borderTopRightRadius: theme.borderRadii.lg,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    minHeight: SHEET_HEIGHT,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
    alignSelf: 'center',
    marginBottom: theme.spacing.lg,
  },
})
