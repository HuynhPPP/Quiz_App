import React from 'react'

const Resutl = (props) => {
  return (
    <div>
        <h2>Kết quả</h2>
        <p className='result'>Bạn đã trả lời đúng {props.score}/{props.totalQuestions} câu 🎉🎉🎉</p>
        <div className='resultButtonsContainer'>
            <button className='result-button'>Quay lại</button>
            <button className='result-button'>Làm lại</button>
        </div>
    </div>
  )
}

export default Resutl