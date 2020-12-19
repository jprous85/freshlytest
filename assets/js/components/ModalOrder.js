import React from 'react';

const ModalOrder = () => {
    return (
        <div className="modal fade" tabIndex="-1" id="myModal">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Description of Order</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"/>
                    </div>
                    <div className="modal-body" id={"modal-body"}>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalOrder;