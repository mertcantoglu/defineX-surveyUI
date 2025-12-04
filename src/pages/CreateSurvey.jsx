import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import QuestionItem from "@/components/survey/QuestionItem"
import QuestionModal from "@/components/survey/QuestionModal"
import ParticipantsModal from "@/components/survey/ParticipantsModal"
import { useCreateSurveyMutation } from "@/store/services/api"
import {
  setSurveyName,
  setExpireDate,
  setParticipants,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  copyQuestion,
  reorderQuestions,
  setDraggedIndex,
  openQuestionModal,
  closeQuestionModal,
  openParticipantsModal,
  closeParticipantsModal,
  resetForm,
  selectSurveyForm,
  selectSurveyData,
} from "@/store/slices/surveyFormSlice"

// create survey page component
export default function CreateSurvey() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  // redux state
  const {
    surveyName,
    expireDate,
    questions,
    participants,
    draggedIndex,
    isQuestionModalOpen,
    isParticipantsModalOpen,
    editingQuestion,
    editingIndex,
  } = useSelector(selectSurveyForm)
  
  const surveyData = useSelector(selectSurveyData)
  const [createSurvey, { isLoading: isCreating }] = useCreateSurveyMutation()

  // reset form on mount
  useEffect(() => {
    dispatch(resetForm())
  }, [dispatch])

  // drag and drop handlers
  const handleDragStart = (e, index) => {
    dispatch(setDraggedIndex(index))
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex) return
    dispatch(reorderQuestions({ fromIndex: draggedIndex, toIndex: dropIndex }))
    dispatch(setDraggedIndex(null))
  }

  // question actions
  const handleDeleteQuestion = (index) => {
    dispatch(deleteQuestion(index))
  }

  const handleEditQuestion = (index) => {
    dispatch(openQuestionModal({ question: questions[index], index }))
  }

  const handleCopyQuestion = (index) => {
    dispatch(copyQuestion(index))
  }

  const handleAddNewQuestion = () => {
    dispatch(openQuestionModal())
  }

  const handleSaveQuestion = (question) => {
    if (editingIndex !== null) {
      dispatch(updateQuestion({ index: editingIndex, question }))
    } else {
      dispatch(addQuestion(question))
    }
    dispatch(closeQuestionModal())
  }

  const handleSaveParticipants = (emails) => {
    dispatch(setParticipants(emails))
    dispatch(closeParticipantsModal())
  }

  // save survey
  const handleSaveSurvey = async () => {
    try {
      await createSurvey(surveyData).unwrap()
      alert("Anket başarıyla kaydedildi!")
      dispatch(resetForm())
      navigate("/dashboard")
    } catch (error) {
      alert("Anket kaydedilirken hata oluştu: " + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* survey name input */}
        <div className="mb-6">
          <input
            type="text"
            value={surveyName}
            onChange={(e) => dispatch(setSurveyName(e.target.value))}
            placeholder="Anket adını giriniz..."
            className="text-2xl font-medium text-gray-800 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-gray-400 focus:outline-none w-full py-2 transition-colors"
          />
        </div>

        {/* title and actions */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-medium text-gray-600">Sorular</h2>
          
          <div className="flex items-center gap-4">
            {/* expire date */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Bitiş Tarihi</span>
              <input
                type="date"
                value={expireDate}
                onChange={(e) => dispatch(setExpireDate(e.target.value))}
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:border-gray-400"
              />
            </div>

            {/* participants button */}
            <Button
              variant="outline"
              onClick={() => dispatch(openParticipantsModal())}
              className="border-gray-300 text-gray-700"
            >
              Katılımcılar ({participants.length})
            </Button>

            {/* save survey button */}
            <Button
              variant="outline"
              onClick={handleSaveSurvey}
              disabled={isCreating}
              className="border-gray-300 text-gray-700"
            >
              {isCreating ? "Kaydediliyor..." : "Anketi Kaydet"}
            </Button>

            {/* add new question button */}
            <Button
              variant="outline"
              onClick={handleAddNewQuestion}
              className="border-gray-300 text-gray-700"
            >
              + Yeni Soru
            </Button>
          </div>
        </div>

        {/* questions list */}
        <div className="space-y-4">
          {questions.length === 0 ? (
            <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl">
              <p>Henüz soru eklenmedi.</p>
              <p className="text-sm mt-2">İlk sorunuzu eklemek için "+ Yeni Soru" butonuna tıklayın.</p>
            </div>
          ) : (
            questions.map((question, index) => (
              <QuestionItem
                key={index}
                question={question}
                index={index}
                onDelete={handleDeleteQuestion}
                onEdit={handleEditQuestion}
                onCopy={handleCopyQuestion}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                isDragging={draggedIndex === index}
              />
            ))
          )}
        </div>
      </div>

      {/* question modal */}
      {isQuestionModalOpen && (
        <QuestionModal
          isOpen={isQuestionModalOpen}
          onClose={() => dispatch(closeQuestionModal())}
          onSave={handleSaveQuestion}
          question={editingQuestion}
        />
      )}

      {/* participants modal */}
      {isParticipantsModalOpen && (
        <ParticipantsModal
          isOpen={isParticipantsModalOpen}
          onClose={() => dispatch(closeParticipantsModal())}
          participants={participants}
          onSave={handleSaveParticipants}
        />
      )}
    </div>
  )
}
