import React from 'react'
import { Text, TextStyle, View, ViewStyle } from 'react-native'

import { LoadState } from '@devhub/core'
import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { useReduxAction } from '../../hooks/use-redux-action'
import * as actions from '../../redux/actions'
import { contentPadding } from '../../styles/variables'
import { AnimatedActivityIndicator } from '../animated/AnimatedActivityIndicator'
import { AnimatedText } from '../animated/AnimatedText'
import { Button } from '../common/Button'

const clearMessages = [
  'All clear!',
  'Awesome!',
  'Good job!',
  "You're doing great!",
  'You rock!',
]

const emojis = ['👍', '👏', '💪', '🎉', '💯']

const getRandomClearMessage = () => {
  const randomIndex = Math.floor(Math.random() * clearMessages.length)
  return clearMessages[randomIndex]
}

const getRandomEmoji = () => {
  const randomIndex = Math.floor(Math.random() * emojis.length)
  return emojis[randomIndex]
}

// only one message per app running instance
// because a chaning message is a bit distractive
const clearMessage = getRandomClearMessage()
const emoji = getRandomEmoji()

export interface EmptyCardsProps {
  clearedAt: string | undefined
  columnId: string
  errorMessage?: string
  errorTitle?: string
  fetchNextPage: ((params?: { perPage?: number }) => void) | undefined
  loadState: LoadState
  refresh: (() => void | Promise<void>) | undefined
}

export function EmptyCards(props: EmptyCardsProps) {
  const {
    clearedAt,
    columnId,
    errorMessage,
    errorTitle = 'Something went wrong',
    fetchNextPage,
    loadState,
    refresh,
  } = props

  const theme = useAnimatedTheme()
  const setColumnClearedAtFilter = useReduxAction(
    actions.setColumnClearedAtFilter,
  )

  const hasError = errorMessage || loadState === 'error'

  const renderContent = () => {
    if (loadState === 'loading_first') {
      return <AnimatedActivityIndicator color={theme.foregroundColor as any} />
    }

    const containerStyle: ViewStyle = { width: '100%', padding: contentPadding }
    const textStyle = {
      lineHeight: 20,
      fontSize: 14,
      color: theme.foregroundColorMuted50,
      textAlign: 'center',
    } as TextStyle

    if (hasError) {
      return (
        <View style={containerStyle}>
          <AnimatedText style={textStyle}>
            {`⚠️\n${errorTitle}`}
            {!!errorMessage && (
              <Text style={{ fontSize: 13 }}>{`\n${errorMessage}`}</Text>
            )}
          </AnimatedText>

          {!!refresh && (
            <View style={{ padding: contentPadding }}>
              <Button
                analyticsLabel="try_again"
                children="Try again"
                disabled={loadState !== 'error'}
                loading={loadState === 'loading'}
                onPress={() => refresh()}
              />
            </View>
          )}
        </View>
      )
    }

    return (
      <View style={containerStyle}>
        <AnimatedText style={textStyle}>
          {clearMessage} {emoji}
        </AnimatedText>
      </View>
    )
  }

  const headerOrFooterHeight = 40 + 2 * contentPadding

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: headerOrFooterHeight }} />

      <View
        style={{
          flex: 1,
          alignContent: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          padding: contentPadding,
        }}
      >
        {renderContent()}
      </View>

      <View style={{ minHeight: headerOrFooterHeight }}>
        {hasError || loadState === 'loading_first' ? null : fetchNextPage ? (
          <View style={{ padding: contentPadding }}>
            <Button
              analyticsLabel="load_more"
              children="Load more"
              disabled={loadState !== 'loaded'}
              loading={loadState === 'loading_more'}
              onPress={() => fetchNextPage()}
            />
          </View>
        ) : clearedAt ? (
          <View style={{ padding: contentPadding }}>
            <Button
              analyticsLabel="show_cleared"
              borderOnly
              children="Show cleared items"
              disabled={loadState !== 'loaded'}
              onPress={() => {
                setColumnClearedAtFilter({ clearedAt: null, columnId })
                if (refresh) refresh()
              }}
            />
          </View>
        ) : null}
      </View>
    </View>
  )
}
