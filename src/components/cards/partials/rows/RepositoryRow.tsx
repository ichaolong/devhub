import React, { SFC } from 'react'
import { Text, View } from 'react-native'

import { Octicons as Icon } from '../../../../libs/vector-icons'
import Avatar from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import cardStyles from '../../styles'
import { getRepositoryURL } from './helpers'
import rowStyles from './styles'

export interface RepositoryRowProps {
  isForcePush?: boolean
  isFork?: boolean
  isPush?: boolean
  isRead: boolean
  ownerName: string
  repositoryName: string
  showMoreItemsIndicator?: boolean
}

export interface RepositoryRowState {}

const RepositoryRow: SFC<RepositoryRowProps> = ({
  isForcePush,
  isFork,
  isPush,
  isRead,
  ownerName,
  repositoryName,
  showMoreItemsIndicator,
}) => {
  const repoIcon =
    (isForcePush && 'repo-force-push') ||
    (isPush && 'repo-push') ||
    (isFork && 'repo-forked') ||
    'repo'

  const isBot = Boolean(ownerName && ownerName.indexOf('[bot]') >= 0)

  return (
    <View style={rowStyles.container}>
      <View style={cardStyles.leftColumn}>
        <Avatar
          isBot={isBot}
          linkURL=""
          small
          style={cardStyles.avatar}
          username={ownerName}
        />
      </View>

      <View style={cardStyles.rightColumn}>
        <Link
          href={
            showMoreItemsIndicator
              ? undefined
              : getRepositoryURL(ownerName, repositoryName)
          }
          style={rowStyles.mainContentContainer}
        >
          <Text
            numberOfLines={1}
            style={[cardStyles.normalText, isRead && cardStyles.mutedText]}
          >
            <Icon name={repoIcon} />{' '}
            <Text
              style={[rowStyles.repositoryText, isRead && cardStyles.mutedText]}
            >
              {showMoreItemsIndicator ? '' : repositoryName}
            </Text>
            <Text
              style={[
                rowStyles.repositorySecondaryText,
                (isRead || showMoreItemsIndicator) && cardStyles.mutedText,
              ]}
            >
              {showMoreItemsIndicator ? '...' : ` ${ownerName}`}
            </Text>
          </Text>
        </Link>
      </View>
    </View>
  )
}

export default RepositoryRow
