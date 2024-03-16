interface ModalProps {
  fileName: string
  doCreateCopy: () => void
  onFileNameChange: (name: string) => void
  show: boolean
  onClose: () => void
}

const CreateCopyModal = ({ fileName, doCreateCopy, onFileNameChange, show, onClose }: ModalProps) =>
  show ? (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[1000px]">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-3xl font-semibold">Create a Copy</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={onClose}
              >
                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6">
              <input
                className="py-2 px-4 border-2 border-slate-700 rounded-lg"
                placeholder="File Name"
                value={fileName}
                onChange={(event) => onFileNameChange(event.target.value)}
              />
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                className="bg-slate-800 text-white active:bg-slate-600 font-semibold py-2 px-4 rounded-lg"
                type="button"
                onClick={doCreateCopy}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  ) : null

export default CreateCopyModal
