import { ChangeEvent, Suspense, useEffect, useRef, useState } from 'react'
import JSzip, { JSZipObject } from 'jszip'

import FilesList from './components/FilesList'
import CreateCopyModal from './components/CreateCopyModal'

export interface FileProps {
  name: string
  content: Blob | undefined
}

function App() {
  const [zipFile, setZipFile] = useState<File | null>(null)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [extractedFiles, setExtractedFiles] = useState<Array<JSZipObject> | null>(null)
  const [processedFiles, setProcessedFiles] = useState<Array<FileProps>>([])
  const [error, setError] = useState<unknown | string | null>(null)
  const [startExtracting, setStartExtracting] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [totalFiles, setTotalFiles] = useState<number>(0)
  const [progressPercentage, setProgressPercentage] = useState<number>(0)
  const [copyFileName, setCopyFileName] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)
  const timeout = useRef<number | undefined>()

  const onSelectZipFile = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event?.target?.files?.[0] || null
      setProgress(0)
      setProcessedFiles([])
      setProgressPercentage(0)
      setZipFile(file)

      if (file) {
        const zip = await JSzip.loadAsync(file)
        // Excluding folders
        const extractedFilesLength = zip.filter((_relativePath, file) => !file.dir).length
        const files: JSZipObject[] = []

        await zip.forEach(async (_relativePath, file) => {
          if (!file.dir) {
            files.push(file)
          }
        })

        setExtractedFiles(files)
        setTotalFiles(extractedFilesLength)
        setCopyFileName(`new_${file?.name?.replace('.zip', '')}`)
      }
    } catch (error) {
      setError(error)
    }
  }

  const doStartExtracting = () => {
    setStartExtracting(true)
    setProgress(0)
    setProcessedFiles([])
    setProgressPercentage(0)
  }

  const doProcessFiles = async () => {
    try {
      const file = extractedFiles?.[progress]
      const splittedFileName = file?.name?.split('/')
      const fileContent = await file?.async('blob')

      if (fileContent && !file?.dir) {
        setProcessedFiles((oldState) => [
          ...oldState,
          {
            name: splittedFileName?.[splittedFileName?.length - 1] || '',
            content: fileContent,
          },
        ])
        setProgress((oldState) => (oldState += 1))
      }
    } catch (error: unknown | string) {
      setError(error)
    }
  }

  const doCreateACopy = () => {
    if (zipFile) {
      try {
        const copiedFile = new File([zipFile], copyFileName, {
          type: zipFile.type,
        })

        const blob = new Blob([copiedFile], { type: copiedFile.type })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${copyFileName}.zip`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        setShowModal(false)
      } catch (error) {
        setError(error)
      }
    }
  }

  useEffect(() => {
    if (startExtracting && !isPaused && progressPercentage < 100) {
      timeout.current = setTimeout(() => doProcessFiles(), 50)
    } else if (isPaused) clearTimeout(timeout.current)
  }, [startExtracting, progress, isPaused, totalFiles])

  useEffect(() => {
    const percentage: number = Math.round((progress / totalFiles) * 100)
    if (progress && totalFiles) {
      setProgressPercentage(percentage)
      if (percentage === 100) setStartExtracting(false)
    }
  }, [progress, totalFiles])

  return (
    <>
      <CreateCopyModal
        onFileNameChange={setCopyFileName}
        fileName={copyFileName}
        doCreateCopy={doCreateACopy}
        onClose={() => setShowModal(false)}
        show={showModal}
      />
      <main className="grid grid-flow-row gap-6 place-items-center">
        <h1 className="text-4xl font-semibold text-slate-200 mb-6">File System Exam</h1>
        <input
          onChange={onSelectZipFile}
          type="file"
          accept=".zip"
          className="bg-slate-100 border-2 border-slate-700 rounded-lg"
        />
        {Boolean(error) && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-tr-lg rounded-ee-lg"
            role="alert"
          >
            <p>Something went wrong.</p>
          </div>
        )}

        <div className="grid grid-flow-col place-items-center gap-4">
          <button
            className="bg-slate-800 text-white py-2 px-4 rounded-lg font-semibold capitalize disabled:opacity-50"
            onClick={doStartExtracting}
            disabled={startExtracting || !zipFile}
          >
            {isPaused ? 'paused' : startExtracting ? 'extracting...' : 'start extracting'}
          </button>
          {startExtracting && (
            <button
              onClick={() => setIsPaused((oldValue) => !oldValue)}
              className="bg-white text-slate-800 border-slate-800 py-2 px-4 rounded-lg capitalize font-semibold"
            >
              {isPaused ? 'continue' : 'pause'}
            </button>
          )}
          {progressPercentage === 100 && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-slate-800 border-slate-800 py-2 px-4 rounded-lg capitalize font-semibold"
            >
              Create a Copy
            </button>
          )}
        </div>
        {Boolean(progress) && (
          <div className="w-[23%] bg-gray-200 rounded-full dark:bg-gray-300">
            <div
              className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
              style={{ width: `${progressPercentage}%` }}
            >
              {progressPercentage}%
            </div>
          </div>
        )}
        {Boolean(processedFiles?.length) && (
          <Suspense fallback={<p className="text-slate-200 italic">Loading...</p>}>
            <FilesList files={processedFiles} />
          </Suspense>
        )}
      </main>
    </>
  )
}

export default App
