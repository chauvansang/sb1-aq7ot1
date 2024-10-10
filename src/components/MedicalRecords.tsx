import React, { useState } from 'react'
import { FileText, Plus, Edit, Trash } from 'lucide-react'
import { Patient } from '../App'

interface MedicalRecord {
  id: number
  patientId: number
  date: string
  diagnosis: string
  treatment: string
}

interface MedicalRecordsProps {
  patients: Patient[]
}

const MedicalRecords: React.FC<MedicalRecordsProps> = ({ patients }) => {
  const [records, setRecords] = useState<MedicalRecord[]>([
    { id: 1, patientId: 1, date: '2024-03-15', diagnosis: 'Common Cold', treatment: 'Rest and fluids' },
    { id: 2, patientId: 2, date: '2024-03-14', diagnosis: 'Sprained Ankle', treatment: 'RICE therapy' },
  ])

  const [newRecord, setNewRecord] = useState<Omit<MedicalRecord, 'id'>>({
    patientId: 0,
    date: '',
    diagnosis: '',
    treatment: '',
  })

  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null)
  const [selectedPatientId, setSelectedPatientId] = useState<number | 'all'>('all')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (editingRecord) {
      setEditingRecord({ ...editingRecord, [name]: name === 'patientId' ? parseInt(value) : value })
    } else {
      setNewRecord((prev) => ({ ...prev, [name]: name === 'patientId' ? parseInt(value) : value }))
    }
  }

  const handleAddRecord = () => {
    if (newRecord.patientId && newRecord.date && newRecord.diagnosis && newRecord.treatment) {
      setRecords((prev) => [
        ...prev,
        { ...newRecord, id: prev.length > 0 ? Math.max(...prev.map(r => r.id)) + 1 : 1 },
      ])
      setNewRecord({ patientId: 0, date: '', diagnosis: '', treatment: '' })
    }
  }

  const handleEditRecord = (record: MedicalRecord) => {
    setEditingRecord(record)
  }

  const handleUpdateRecord = () => {
    if (editingRecord) {
      setRecords((prev) => prev.map((r) => (r.id === editingRecord.id ? editingRecord : r)))
      setEditingRecord(null)
    }
  }

  const handleDeleteRecord = (id: number) => {
    setRecords((prev) => prev.filter((r) => r.id !== id))
  }

  const filteredRecords = selectedPatientId === 'all'
    ? records
    : records.filter((record) => record.patientId === selectedPatientId)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Medical Records</h2>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">{editingRecord ? 'Edit Medical Record' : 'Add New Medical Record'}</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <select
            name="patientId"
            value={editingRecord ? editingRecord.patientId : newRecord.patientId}
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
            value={editingRecord ? editingRecord.date : newRecord.date}
            onChange={handleInputChange}
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            name="diagnosis"
            value={editingRecord ? editingRecord.diagnosis : newRecord.diagnosis}
            onChange={handleInputChange}
            placeholder="Diagnosis"
            className="border rounded px-3 py-2"
          />
          <textarea
            name="treatment"
            value={editingRecord ? editingRecord.treatment : newRecord.treatment}
            onChange={handleInputChange}
            placeholder="Treatment"
            className="border rounded px-3 py-2"
          />
        </div>
        <button
          onClick={editingRecord ? handleUpdateRecord : handleAddRecord}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
        >
          {editingRecord ? <Edit className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
          {editingRecord ? 'Update Record' : 'Add Record'}
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Filter Records</h3>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosis</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Treatment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRecords.map((record) => (
              <tr key={record.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-400 mr-3" />
                    <div className="text-sm font-medium text-gray-900">
                      {patients.find((p) => p.id === record.patientId)?.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{record.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{record.diagnosis}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{record.treatment}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEditRecord(record)}
                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteRecord(record.id)}
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

export default MedicalRecords