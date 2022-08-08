function RestartButton({
    triggerRestart
}: {
    triggerRestart: () => void
}) {
    return <button
            type="button"
            onClick={triggerRestart}
        >
            Restart
        </button>
}

export default RestartButton;