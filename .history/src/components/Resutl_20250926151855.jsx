import React from 'react'

const Resutl = (props) => {
  return (
    <div>
        <h2>Kết quả</h2>
        <p className='result'>Bạn đã hoàn thành Quiz 🎉🎉🎉</p>
        <div className='resultButtonsContainer'>
            <button className='result-button'>Quay lại</button>
            <button className='result-button'>Làm lại</button>
        </div>
    </div>
  )
}

export default Resutl