import { useState } from 'react'
import { CaptureControl } from '../capture/CaptureControl'
import { UploadControl } from '../upload/UploadControl'
import { uInt8ArrayToBase64 } from './helper'

export const Dashboard = () => {
  const [cache, setCache] = useState<string[]>()
  const handleOnCaptureClicked = async (sourceId: string) => {
    console.log(sourceId)
    await window.api.captureSource(sourceId)
  }

  const handleOnRefreshClicked = async () => {
    const data = await window.api.getAllCaptureBuffer()
    console.log(data)
    setCache(data.map((x) => uInt8ArrayToBase64(x)))
  }

  const CacheImages = () => {
    return cache?.map((x, i) => {
      return (
        <div className="w-full h-full">
          <div className="h-52 w-auto">
            <img
              id={`cache-${i}`}
              src={`data:image/png;base64, ${x}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )
    })
  }

  return (
    <div className="flex flex-col h-screen">
      <CaptureControl onCaptureClicked={handleOnCaptureClicked} />
      <button type="button" className="w-fit" onClick={handleOnRefreshClicked}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      </button>
      <div
        className="flex-1 w-full grid overflow-y-scroll"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 13rem), 1fr))'
        }}
      >
        <CacheImages />
      </div>
      <UploadControl />
    </div>
  )
}
