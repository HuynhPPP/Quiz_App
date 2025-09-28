import React from 'react'

const Resutl = ({score, totalQuestions, handleResetQuiz, handleResetQuizResult}) => {
  return (
    <div>
        <h2>Kết quả</h2>
        <p className='result'>Bạn đã trả lời đúng {score}/{totalQuestions} câu 🎉🎉🎉</p>
        <div className='resultButtonsContainer'>
            <button className='result-button' onClick={handleResetQuiz}>Xem lại</button>
            <button className='result-button' onClick={handleResetQuiz}>Làm lại</button>
        </div>
    </div>
  )
}

export default Resutl