import { CaptureControl } from '../capture/CaptureControl'
import { UploadControl } from '../upload/UploadControl'

export const Dashboard = () => {
  return (
    <div className="flex flex-col h-screen">
      <CaptureControl screens={[]} onCaptureClicked={() => {}} />
      <div className="flex-1">contents</div>
      <UploadControl />
    </div>
  )
}
