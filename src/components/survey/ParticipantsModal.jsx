import { useState, useEffect } from "react"
import { X, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

// modal component for managing survey participants
export default function ParticipantsModal({ isOpen, onClose, participants, onSave }) {
  const [emails, setEmails] = useState([])
  const [newEmail, setNewEmail] = useState("")

  useEffect(() => {
    setEmails(participants || [])
  }, [participants])

  const handleAddEmail = () => {
    const email = newEmail.trim()
    if (!email) return
    
    // basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      alert("Lütfen geçerli bir e-posta adresi giriniz")
      return
    }

    if (emails.includes(email)) {
      alert("Bu e-posta zaten eklenmiş")
      return
    }

    setEmails([...emails, email])
    setNewEmail("")
  }

  const handleRemoveEmail = (index) => {
    setEmails(emails.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    onSave(emails)
    onClose()
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddEmail()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-xl">
        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Katılımcıları Yönet
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* add email input */}
        <div className="flex gap-2 mb-4">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Katılımcı e-postası giriniz..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:border-gray-400"
          />
          <Button
            onClick={handleAddEmail}
            className="bg-slate-700 hover:bg-slate-800 text-white"
          >
            <Plus className="w-4 h-4" />
            Ekle
          </Button>
        </div>

        {/* participant list */}
        <div className="max-h-64 overflow-y-auto mb-4">
          {emails.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Henüz katılımcı eklenmedi
            </div>
          ) : (
            <ul className="space-y-2">
              {emails.map((email, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-700">{email}</span>
                  <button
                    onClick={() => handleRemoveEmail(index)}
                    className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* participant count */}
        <div className="text-sm text-gray-500 mb-4">
          Toplam katılımcı: {emails.length}
        </div>

        {/* actions */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            İptal
          </Button>
          <Button
            onClick={handleSave}
            className="bg-slate-700 hover:bg-slate-800 text-white"
          >
            Katılımcıları Kaydet
          </Button>
        </div>
      </div>
    </div>
  )
}

