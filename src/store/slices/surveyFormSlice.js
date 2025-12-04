import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  // survey data
  surveyName: "",
  expireDate: "",
  questions: [],
  participants: [],
  
  // ui states
  isQuestionModalOpen: false,
  isParticipantsModalOpen: false,
  editingQuestion: null,
  editingIndex: null,
  draggedIndex: null,
}

const surveyFormSlice = createSlice({
  name: "surveyForm",
  initialState,
  reducers: {
    // survey data actions
    setSurveyName: (state, action) => {
      state.surveyName = action.payload
    },
    
    setExpireDate: (state, action) => {
      state.expireDate = action.payload
    },
    
    setParticipants: (state, action) => {
      state.participants = action.payload
    },
    
    // question actions
    addQuestion: (state, action) => {
      state.questions.push(action.payload)
    },
    
    updateQuestion: (state, action) => {
      const { index, question } = action.payload
      state.questions[index] = { ...state.questions[index], ...question }
    },
    
    deleteQuestion: (state, action) => {
      state.questions.splice(action.payload, 1)
    },
    
    copyQuestion: (state, action) => {
      const index = action.payload
      const questionToCopy = { ...state.questions[index] }
      delete questionToCopy.id // remove id for copied question
      state.questions.splice(index + 1, 0, questionToCopy)
    },
    
    reorderQuestions: (state, action) => {
      const { fromIndex, toIndex } = action.payload
      const [draggedItem] = state.questions.splice(fromIndex, 1)
      state.questions.splice(toIndex, 0, draggedItem)
    },
    
    // drag state
    setDraggedIndex: (state, action) => {
      state.draggedIndex = action.payload
    },
    
    // modal actions
    openQuestionModal: (state, action) => {
      const { question = null, index = null } = action.payload || {}
      state.isQuestionModalOpen = true
      state.editingQuestion = question
      state.editingIndex = index
    },
    
    closeQuestionModal: (state) => {
      state.isQuestionModalOpen = false
      state.editingQuestion = null
      state.editingIndex = null
    },
    
    openParticipantsModal: (state) => {
      state.isParticipantsModalOpen = true
    },
    
    closeParticipantsModal: (state) => {
      state.isParticipantsModalOpen = false
    },
    
    // load existing survey (for edit)
    loadSurvey: (state, action) => {
      const { name, expireDate, questions, participants } = action.payload
      state.surveyName = name || ""
      state.expireDate = expireDate || ""
      state.questions = questions || []
      state.participants = participants || []
    },
    
    // reset form
    resetForm: () => initialState,
  },
})

export const {
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
  loadSurvey,
  resetForm,
} = surveyFormSlice.actions

// selectors
export const selectSurveyForm = (state) => state.surveyForm
export const selectSurveyData = (state) => ({
  name: state.surveyForm.surveyName,
  expireDate: state.surveyForm.expireDate,
  questions: state.surveyForm.questions,
  participants: state.surveyForm.participants,
})

export default surveyFormSlice.reducer

