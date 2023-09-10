import { useEffect, useState } from 'react'

export interface CaptureControlProps {
  onCaptureClicked: (sourceId: string) => void
}

export interface Source {
  id: string
  name: string
}

export const CaptureControl = ({ onCaptureClicked }: CaptureControlProps) => {
  const [sources, setSources] = useState<Source[]>([])
  const [selectedSource, setSelectedSource] = useState<Source | undefined>(undefined)

  const getSources = async () => {
    const electronSources = await window.api.getSources()
    console.log(electronSources)
    setSources(
      electronSources.map((source): Source => {
        return { id: source.id, name: source.name }
      })
    )
  }
  useEffect(() => {
    getSources()
    setSelectedSource(sources[0])
  }, [])

  const SourceList = ({ s }: { s: Source[] }) => {
    return s.map((source) => {
      return (
        <button
          key={source.id}
          type="button"
          className={`hover:bg-neutral-800 transition-colors text-left p-1 ${
            source.id === selectedSource?.id ? 'bg-neutral-700' : ''
          }`}
          onClick={() => setSelectedSource(source)}
        >
          {source.id}
          {' | '}
          {source.name}
        </button>
      )
    })
  }

  return (
    <div className="h-20 flex flex-row p-2 gap-2">
      <button
        type="button"
        className="bg-neutral-800 w-1/3 hover:bg-indigo-600 border border-neutral-700 hover:border-indigo-500  transition-colors rounded-md font-bold"
        onClick={() => (selectedSource ? onCaptureClicked(selectedSource?.id) : () => {})}
      >
        Capture
      </button>
      <div className="w-80 overflow-y-auto whitespace-pre-line text-left">
        {!selectedSource
          ? 'No Source Selected'
          : `Current source:\n${selectedSource.name} (${selectedSource.id})`}
      </div>
      <div className="flex flex-col border rounded-md border-neutral-800 overflow-y-scroll">
        <SourceList s={sources} />
      </div>
    </div>
  )
}
