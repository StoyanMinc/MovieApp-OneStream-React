interface ActionButtonProps {
    text: string;
    action: () => void;
}
export default function ActionButton({ text, action }: ActionButtonProps) {
    return (
        <div className="action-button">
            <button onClick={action}>{text}</button>
        </div>
    );
}