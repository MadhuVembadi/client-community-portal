import React from 'react'

function Toast(props) {
  return (
    <div className="toast-container position-fixed top-25 end-0 p-3">
        <div id="liveToast" className="toast text-bg-primary" role="alert" aria-live="assertive" aria-atomic="true">
            {/* <div className="toast-header">
                <strong class="me-auto">Bootstrap</strong>
                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div> */}
            <div className="toast-body" id="toastBody">
                {props.toastMsg}
            </div>
        </div>
    </div>
  )
}

export default Toast