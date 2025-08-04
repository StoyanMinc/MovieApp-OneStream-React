interface ConfirmModalProps {
    text: string;
    cancelHandler: () => void;
    actionHandler: () => void;
}

export default function ConfirmModal({ text, cancelHandler, actionHandler }: ConfirmModalProps) {
    return (
        <div className="modal-container">
            <div className="modal">
                <p>{text}</p>
                <div className="modal-buttons-container">
                    <button onClick={cancelHandler}>Cancel</button>
                    <button className="modal-action-button" onClick={actionHandler}>Confirm</button>
                </div>
            </div>
        </div>
    );
}