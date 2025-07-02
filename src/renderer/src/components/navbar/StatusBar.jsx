import { FaServer } from 'react-icons/fa6'
import { useSelector } from 'react-redux'

function StatusBar() {
  const connectionData = useSelector((state) => state.connectionData)
  return (
    <>
      {/* RIGHT */}

      <div className="fixed bottom-0 left-0 bg-gray-300 w-full text-end px-3 text-[#333] flex items-center justify-end gap-3">
        <FaServer className="text-sm" />
        <span className="text-sm">Connected To: {connectionData.backendUrl}</span>
      </div>
    </>
  )
}

export default StatusBar
