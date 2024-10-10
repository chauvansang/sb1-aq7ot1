import React, { useState } from 'react'
import { Calendar, Clock, Plus, Edit, Trash } from 'lucide-react'
import { Patient } from '../App'

interface Appointment {
  id: number
  patientId: number
  date: string
  time: string
  reason: string
}

interface AppointmentsProps {
  patients: Patient[]
}

const Appointments: React.FC<AppointmentsProps> = ({ patients }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, patientId: 1, date: '2024-03-20', time: '10:00', reason: 'Annual checkup' },
    { id: 2, patientId: 2, date: '2024-03-21', time: '14:30', reason: 'Follow-up appointment' },
  ])

  const [newAppointment, setNewAppointment] = useState<Omit<Appointment, 'id'>>({
    patientId: 0,
    date: '',
    time: '',
    reason: '',
  })

  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [selectedPatientId, setSelectedPatientId] = useState<number | 'all'>('all')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (editingAppointment) {
      setEditingAppointment({ ...editingAppointment, [name]: name === 'patientId' ? parseInt(value) : value })
    } else {
      setNewAppointment((prev) => ({ ...prev, [name]: name === 'patientId' ? parseInt(value) : value }))
    }
  }

  const handleAddAppointment = () => {
    if (newAppointment.patientId && newAppointment.date && newAppointment.time && newAppointment.reason) {
      setAppointments((prev) => [
        ...prev,
        { ...newAppointment, id: prev.length> 0 ? Math.max(...prev.map(a => a.id)) + 1 : 1 },
      ])
      setNewAppointment({ patientId: 0, date: '', time: '', reason: '' })
    }
  }

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment)
  }

  const handleUpdateAppointment = () => {
    if (editingAppointment) {
      setAppointments((prev) => prev.map((a) => (a.id === editingAppointment.id ? editingAppointment : a)))
      setEditingAppointment(null)
    }
  }

  const handleDeleteAppointment = (id: number) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id))
  }

  const filteredAppointments = selectedPatientId === 'all'
    ? appointments
    : appointments.filter((appointment) => appointment.patientId === selectedPatientId)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Appointments</h2>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">{editingAppointment ? 'Edit Appointment' : 'Schedule New Appointment'}</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <select
            name="patientId"
            value={editingAppointment ? editingAppointment.patientId : newAppointment.patientId}
            onChange={handleInputChange}
            className="border rounded px-3 py-2"
          >
            <option value="">Select Patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            name="date"
            value={editingAppointment ? editingAppointment.date : newAppointment.date}
            onChange={handleInputChange}
            className="border rounded px-3 py-2"
          />
          <input
            type="time"
            name="time"
            value={editingAppointment ? editingAppointment.time : newAppointment.time}
            onChange={handleInputChange}
            className="border rounded px-3 py-2"
          />
          <textarea
            name="reason"
            value={editingAppointment ? editingAppointment.reason : newAppointment.reason}
            onChange={handleInputChange}
            placeholder="Reason for appointment"
            className="border rounded px-3 py-2"
          />
        </div>
        <button
          onClick={editingAppointment ? handleUpdateAppointment : handleAddAppointment}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
        >
          {editingAppointment ? <Edit className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
          {editingAppointment ? 'Update Appointment' : 'Schedule Appointment'}
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Filter Appointments</h3>
        <select
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
          className="border rounded px-3 py-2"
        >
          <option value="all">All Patients</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name}
            </option>
          ))}
        </select>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAppointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <div className="text-sm font-medium text-gray-900">
                      {patients.find((p) => p.id === appointment.patientId)?.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{appointment.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                    <div className="text-sm text-gray-900">{appointment.time}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{appointment.reason}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEditAppointment(appointment)}
                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteAppointment(appointment.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Appointments