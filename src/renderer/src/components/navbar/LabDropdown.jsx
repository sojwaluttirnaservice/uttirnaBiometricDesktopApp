import React, { useEffect, useRef, useState } from 'react'

const LabDropdown = ({ labs, handleSetSelectedLab, selectedLabs }) => {
  const [isOpen, setIsOpen] = useState(false)

  const dropdownRef = useRef(null)

  const toggleDropdown = () => setIsOpen(!isOpen)

  const handleCheckboxChange = (lab) => {
    handleSetSelectedLab(lab)
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    window.addEventListener('click', handleClickOutside)

    return () => {
      window.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <div ref={dropdownRef} className="relative ">
      <button
        type="button"
        onClick={toggleDropdown}
        className="w-full px-4 py-2 text-left border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {selectedLabs.length > 0
          ? selectedLabs.map((lab) => lab.lab_name).join(',')
          : '--Select Lab--'}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {labs.map((lab) => (
            <label
              key={lab.lab_name}
              className="flex items-center px-4 py-2 hover:bg-purple-100 cursor-pointer"
            >
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedLabs.some((_lab) => _lab.lab_no === lab.lab_no)}
                onChange={() => handleCheckboxChange(lab)}
              />
              {lab.lab_name}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default LabDropdown
