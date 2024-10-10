import React, { useState } from 'react'
import { FileText, Plus, Edit, Trash } from 'lucide-react'
import { Patient } from '../App'

interface Prescription {
  id: number
  patientId: number
  date: string
  medication: string
  dosage: string
  instructions: string
}

interface PrescriptionsProps {
  patients: Patient[]
}

const Prescriptions: React.FC<PrescriptionsProps> = ({ patients }) => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    { id: 1, patientId: 1, date: '2024-03-15', medication: 'Amoxicillin', dosage: '500mg', instructions: 'Take 3 times a day with food' },
    { id: 2, patientId: 2, date: '2024-03-14', medication: 'Ibuprofen', dosage: '400mg', instructions: 'Take as needed for pain, not exceeding 4 doses per day' },
  ])

  const [newPrescription, setNewPrescription] = useState<Omit<Prescription, 'id'>>({
    patientId: 0,
    date: '',
    medication: '',
    dosage: '',
    instructions: '',
  })

  const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null)
  const [selectedPatientId, setSelectedPatientId] = useState<number | 'all'>('all')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (editingPrescription) {
      setEditingPrescription({ ...editingPrescription, [name]: name === 'patientId' ? parseInt(value) : value })
    } else {
      setNewPrescription((prev) => ({ ...prev, [name]: name === 'patientId' ? parseInt(value) : value }))
    }
  }

  const handleAddPrescription = () => {
    if (newPrescription.patientId && newPrescription.date && newPrescription.medication && newPrescription.dosage && newPrescription.instructions) {
      setPrescriptions((prev) => [
        ...prev,
        { ...newPrescription, id: prev.length > 0 ? Math.max(...prev.map(p => p.id)) + 1 : 1 },
      ])
      setNewPrescription({ patientId: 0, date: '', medication: '', dosage: '', instructions: '' })
    }
  }

  const handleEditPrescription = (prescription: Prescription) => {
    setEditingPrescription(prescription)
  }

  const handleUpdatePrescription = () => {
    if (editingPrescription) {
      setPrescriptions((prev) => prev.map((p) => (p.id === editingPrescription.id ? editingPrescription : p)))
      setEditingPrescription(null)
    }
  }

  const handleDeletePrescription = (id: number) => {
    setPrescriptions((prev) => prev.filter((p) => p.id !== id))
  }

  const filteredPrescriptions = selectedPatientId === 'all'
    ? prescriptions
    : prescriptions.filter((prescription) => prescription.patientId === selectedPatientId)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Prescriptions</h2>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">{editingPrescription ? 'Edit Prescription' : 'Add New Prescription'}</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <select
            name="patientId"
            value={editingPrescription ? editingPrescription.patientId : newPrescription.patientId}
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
            value={editingPrescription ? editingPrescription.date : newPrescription.date}
            onChange={handleInputChange}
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            name="medication"
            value={editingPrescription ? editingPrescription.medication : newPrescription.medication}
            onChange={handleInputChange}
            placeholder="Medication"
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            name="dosage"
            value={editingPrescription ? editingPrescription.dosage : newPrescription.dosage}
            onChange={handleInputChange}
            placeholder="Dosage"
            className="border rounded px-3 py-2"
          />
          <textarea
            name="instructions"
            value={editingPrescription ? editingPrescription.instructions : newPrescription.instructions}
            onChange={handleInputChange}
            placeholder="Instructions"
            className="border rounded px-3 py-2 col-span-2"
          />
        </div>
        <button
          onClick={editingPrescription ? handleUpdatePrescription : handleAddPrescription}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
        >
          {editingPrescription ? <Edit className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
          {editingPrescription ? 'Update Prescription' : 'Add Prescription'}
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Filter Prescriptions</h3>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPrescriptions.map((prescription) => (
              <tr key={prescription.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-400 mr-3" />
                    <div className="text-sm font-medium text-gray-900">
                      {patients.find((p) => p.id === prescription.patientId)?.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{prescription.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{prescription.medication}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{prescription.dosage}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{prescription.instructions}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEditPrescription(prescription)}
                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeletePrescription(prescription.id)}
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

export default Prescriptions