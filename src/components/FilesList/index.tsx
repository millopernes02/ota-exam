import { FileProps } from '../../App'

const FilesList = ({ files }: { files: Array<FileProps> | null }) => (
  <table className="table-auto text-slate-200 border-collapse">
    <thead>
      <tr>
        <th>Files</th>
      </tr>
    </thead>
    <tbody>
      {files?.map((file, index) => (
        <tr key={index} className="">
          <td className="py-2">{file.name}</td>
        </tr>
      ))}
    </tbody>
  </table>
)

export default FilesList
