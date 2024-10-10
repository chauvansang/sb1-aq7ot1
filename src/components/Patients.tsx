import React, { useState } from 'react'
import { User, Plus, Edit, Trash } from 'lucide-react'
import { Patient } from '../App'

interface PatientsProps {
  patients: Patient[]
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>
}

const Patients: React.FC<PatientsProps> = ({ patients, setPatients }) => {
  const [newPatient, setNewPatient] = useState<Omit<Patient, 'id'>>({
    name: '',
    age: 0,
    gender: '',
  })
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (editingPatient) {
      setEditingPatient({ ...editingPatient, [name]: name === 'age' ? parseInt(value) : value })
    } else {
      setNewPatient((prev) => ({ ...prev, [name]: name === 'age' ? parseInt(value) : value }))
    }
  }

  const handleAddPatient = () => {
    if (newPatient.name && newPatient.age && newPatient.gender) {
      setPatients((prev) => [
        ...prev,
        { ...newPatient, id: prev.length > 0 ? Math.max(...prev.map(p => p.id)) + 1 : 1 },
      ])
      setNewPatient({ name: '', age: 0, gender: '' })
    }
  }

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient)
  }

  const handleUpdatePatient = () => {
    if (editingPatient) {
      setPatients((prev) => prev.map((p) => (p.id === editingPatient.id ? editingPatient : p)))
      setEditingPatient(null)
    }
  }

  const handleDeletePatient = (id: number) => {
    setPatients((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Patients</h2>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">{editingPatient ? 'Edit Patient' : 'Add New Patient'}</h3>
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            name="name"
            value={editingPatient ? editingPatient.name : newPatient.name}
            onChange={handleInputChange}
            placeholder="Name"
            className="border rounded px-3 py-2 w-1/3"
          />
          <input
            type="number"
            name="age"
            value={editingPatient ? editingPatient.age : newPatient.age || ''}
            onChange={handleInputChange}
            placeholder="Age"
            className="border rounded px-3 py-2 w-1/6"
          />
          <input
            type="text"
            name="gender"
            value={editingPatient ? editingPatient.gender : newPatient.gender}
            onChange={handleInputChange}
            placeholder="Gender"
            className="border rounded px-3 py-2 w-1/6"
          />
          <button
            onClick={editingPatient ? handleUpdatePatient : handleAddPatient}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
          >
            {editingPatient ? <Edit className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
            {editingPatient ? 'Update Patient' : 'Add Patient'}
          </button>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-gray-400 mr-3" />
                    <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{patient.age}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{patient.gender}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEditPatient(patient)}
                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeletePatient(patient.id)}
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

export default Patients