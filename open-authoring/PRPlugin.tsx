import React, { useState } from 'react'
import { Modal, ModalPopup, ModalHeader, ModalBody } from 'tinacms'
import PrIconSvg from '../public/svg/pr-icon.svg'
import { PRModal } from './PRModal'
import { DesktopLabel } from '../components/ui/inline/DesktopLabel'
import { ToolbarButton } from '../components/ui/inline/ToolbarButton'
import { isGithubTokenValid } from './github/api'
import OpenAuthoringError from './OpenAuthoringError'

interface PullRequestButtonOptions {
  baseRepoFullName: string
  forkRepoFullName: string
  sendError?
}

export const PRPlugin = (
  baseRepoFullName: string,
  forkRepoFullName: string,
  sendError?: (error: any) => void
) => ({
  __type: 'toolbar:git',
  name: 'create-pr',
  component: () => {
    return (
      <PullRequestButton
        baseRepoFullName={baseRepoFullName}
        forkRepoFullName={forkRepoFullName}
        sendError={sendError}
      />
    )
  },
})

function PullRequestButton({
  baseRepoFullName,
  forkRepoFullName,
  sendError
}: PullRequestButtonOptions) {

  const open = async () => {
    if (await isGithubTokenValid()) {
      setOpened(p => !p)
      return
    }
    sendError(new OpenAuthoringError("Not Authenticated", 401)) 
  }

  const [opened, setOpened] = useState(false)
  const close = () => setOpened(false)
  return (
    <>
      <ToolbarButton onClick={open}>
        <PrIconSvg />
        <DesktopLabel> Pull Request</DesktopLabel>
      </ToolbarButton>
      {opened && (
        <Modal>
          <ModalPopup>
            <ModalHeader close={close}>Pull Request</ModalHeader>
            <ModalBody>
              <PRModal
                baseRepoFullName={baseRepoFullName}
                forkRepoFullName={forkRepoFullName}
              />
            </ModalBody>
          </ModalPopup>
        </Modal>
      )}
    </>
  )
}
