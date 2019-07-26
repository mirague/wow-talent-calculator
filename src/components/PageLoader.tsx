import React, { FC } from 'react'
import { LoadingComponentProps as Props } from 'react-loadable'

export const PageLoader: FC<Props> = ({ isLoading, pastDelay, error, retry, timedOut }) => {
  const retryButton = <button onClick={retry}>retry</button>

  if (error) {
    return <div>Something went awry... do you wish to {retryButton}?</div>
  } else if (timedOut) {
    return <div>Taking some time... {retryButton}?</div>
  } else if (pastDelay) {
    return <div>Loading...</div>
  } else {
    return null
  }
}