// Component for individual attendance card
export const AttendanceCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-[#fff] shadow-md p-3 rounded-lg flex flex-col justify-center hover:bg-gray-100 cursor-">
      <div className="flex items-end justify-center gap-2">
        <p className={`value text-4xl ${color}`}>{value}</p>
        <i className={`fa-solid ${icon} mb-1 ${color}`} />
      </div>
      <div className="label total-status text-md text-[#555] font-semibold">{title}</div>
    </div>
  )
}