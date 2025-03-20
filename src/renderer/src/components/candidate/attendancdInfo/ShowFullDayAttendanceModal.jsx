import { ModalBody, ModalDialog, ModalFooter, ModalHeader } from '../../modals/BasicModal'

const ShowFullDayAttendanceModal = ({
  children,
  isOpen,
  setIsOpen,
  title = 'Modal Title',
  onConfirm = () => {},
  onClose = () => {
    setIsOpen(false)
  },
  isScrollable = false
}) => {
  const connectionData = useSelector((state) => state.connectionData)
  
  const [labwiseAttendanceCount, setLabwiseAttendanceCount] = useState(null)
  const handleFetchLabwiseAttendance = async () => {
    try {
      let url = `${connectionData.backendUrl}/api/attendence/v1/lab-wise-count`
      const { data: resData } = await axios.get(url)
      const { success, data, message } = resData

      if (success) {
        let { _labWiseCount } = data
        setLabwiseAttendanceCount(_labWiseCount)
      } else {
        setLabwiseAttendanceCount([])
        showErrorToast(message)
      }
    } catch (err) {
      console.log(err)
      showErrorToast(err)
    }
  }

  useEffect(() => {
    if (isOpen) {
      handleFetchLabwiseAttendance()
    }

    return () => {
      //clean
      setLabwiseAttendanceCount(null)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <ModalDialog width="w-[60rem]" height="h-[32rem]">
        <ModalHeader title={title} onClose={onClose} />

        {!labwiseAttendanceCount ? (
          <>
            <ModalBody>
              <h1 className="h-full py-4 text-indigo-500 text-4xl text-center font-bold tracking-wider">
                Loading..
              </h1>
            </ModalBody>
          </>
        ) : (
          <>
            {!labwiseAttendanceCount.length ? (
              <>
                <h1 className="h-full py-4 text-rose-500 italic text-4xl text-center font-bold tracking-wider">
                  No entry found in the labs list
                </h1>
              </>
            ) : (
              <>
                <div className="relative  shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <div className="sticky top-0">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr className="divide-x divide-gray-200 font-extrabold tracking-wider">
                          <th className="w-[16%] py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            Lab Details
                          </th>
                          <th className="w-[16%] px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Shift
                          </th>
                          <th className="w-[16%] px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Present
                          </th>
                          <th className="w-[16%] py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pr-6">
                            Absent
                          </th>
                          <th className="w-[17.5%] py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pr-6">
                            Total
                          </th>
                        </tr>
                      </thead>
                    </table>
                  </div>
                </div>
                <ModalBody isScrollable={isScrollable}>
                  <div className="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    {/* <div style={{ position:"absolute"}} className="sticky top-0">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                          <tr className="divide-x divide-gray-200 font-extrabold tracking-wider">
                            <th className="w-[20%] py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                              Lab Details
                            </th>
                            <th className="w-[20%] px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Shift
                            </th>
                            <th className="w-[20%] px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Present
                            </th>
                            <th className="w-[20%] py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pr-6">
                              Absent
                            </th>
                            <th className="w-[20%] py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pr-6">
                              Total
                            </th>
                          </tr>
                        </thead>
                      </table>
                    </div> */}
                    <div className="grow">
                      <table className="relative  min-w-full divide-y divide-gray-300">
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {labwiseAttendanceCount.map((sinlgeLab) => (
                            <tr key={sinlgeLab.email} className="divide-x divide-gray-200">
                              <td className="w-[20%] whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-6">
                                {sinlgeLab.lab_name}
                              </td>
                              <td className="w-[20%] whitespace-nowrap p-4 text-sm text-gray-500">
                                {sinlgeLab.shift || '-'}
                              </td>
                              <td className="w-[20%] whitespace-nowrap p-4 text-sm text-gray-500">
                                {sinlgeLab.lab_present_count}
                              </td>
                              <td className="w-[20%] whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                                {sinlgeLab.lab_attendance_not_marked}
                              </td>
                              <td className="w-[20%] whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                                {sinlgeLab.lab_total_students}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <table className="relative min-w-full divide-y divide-gray-300">
                      <tfoot>
                        <tr className="divide-x divide-gray-200">
                          <td className="w-[20%] whitespace-nowrap py-4 pl-4 pr-4 text-sm font-bold text-gray-900 sm:pl-6 ">
                            All Labs
                          </td>
                          <td className="w-[20%] whitespace-nowrap p-4 text-sm text-gray-500"></td>
                          <td className="w-[20%] whitespace-nowrap p-4 text-sm text-emerald-500 font-bold">
                            {labwiseAttendanceCount.reduce(
                              (acc, curr) => acc + curr.lab_present_count,
                              0
                            )}
                          </td>
                          <td className="w-[20%] whitespace-nowrap py-4 pl-4 pr-4 text-sm text-rose-500 font-bold sm:pr-6">
                            {labwiseAttendanceCount.reduce(
                              (acc, curr) => acc + curr.lab_attendance_not_marked,
                              0
                            )}
                          </td>
                          <td className="w-[20%] whitespace-nowrap py-4 pl-4 pr-4 text-sm text-sky-500 font-bold sm:pr-6">
                            {labwiseAttendanceCount.reduce(
                              (acc, curr) => acc + curr.lab_total_students,
                              0
                            )}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </ModalBody>
              </>
            )}
          </>
        )}

        <ModalFooter onClose={onClose} />
      </ModalDialog>
    </div>
  )
}
