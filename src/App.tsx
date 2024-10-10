import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import { Building2, Users, Calendar, FileText } from 'lucide-react'
import Patients from './components/Patients'
import MedicalRecords from './components/MedicalRecords'
import Prescriptions from './components/Prescriptions'
import Appointments from './components/Appointments'

export interface Patient {
  id: number
  name: string
  age: number
  gender: string
}

function App() {
  const [patients, setPatients] = useState<Patient[]>([
    { id: 1, name: 'John Doe', age: 35, gender: 'Male' },
    { id: 2, name: 'Jane Smith', age: 28, gender: 'Female' },
  ])

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex">
        {/* Sidebar */}
        <nav className="bg-blue-600 text-white w-64 space-y-6 py-7 px-2">
          <div className="flex items-center space-x-2 px-4">
            <Building2 className="w-8 h-8" />
            <span className="text-2xl font-extrabold">Hospital CRM</span>
          </div>
          <ul className="space-y-2">
            <li>
              <Link to="/patients" className="flex items-center space-x-2 py-2 px-4 hover:bg-blue-700 rounded">
                <Users className="w-5 h-5" />
                <span>Patients</span>
              </Link>
            </li>
            <li>
              <Link to="/medical-records" className="flex items-center space-x-2 py-2 px-4 hover:bg-blue-700 rounded">
                <FileText className="w-5 h-5" />
                <span>Medical Records</span>
              </Link>
            </li>
            <li>
              <Link to="/prescriptions" className="flex items-center space-x-2 py-2 px-4 hover:bg-blue-700 rounded">
                <FileText className="w-5 h-5" />
                <span>Prescriptions</span>
              </Link>
            </li>
            <li>
              <Link to="/appointments" className="flex items-center space-x-2 py-2 px-4 hover:bg-blue-700 rounded">
                <Calendar className="w-5 h-5" />
                <span>Appointments</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Main content */}
        <main className="flex-1 p-10">
          <Routes>
            <Route path="/patients" element={<Patients patients={patients} setPatients={setPatients} />} />
            <Route path="/medical-records" element={<MedicalRecords patients={patients} />} />
            <Route path="/prescriptions" element={<Prescriptions patients={patients} />} />
            <Route path="/appointments" element={<Appointments patients={patients} />} />
            <Route path="/" element={<h1 className="text-3xl font-bold">Welcome to Hospital CRM</h1>} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App