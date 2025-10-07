import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

const AlertMessage = ({
    type = "info",
    message,
    onClose,
    className = ""
}) => {
    const config = {
        info: {
            bg: "bg-blue-50",
            border: "border-blue-200",
            text: "text-blue-700",
            icon: <Info size={20} className="text-blue-600" />
        },
        success: {
            bg: "bg-green-50",
            border: "border-green-200",
            text: "text-green-700",
            icon: <CheckCircle2 size={20} className="text-green-600" />
        },
        warning: {
            bg: "bg-amber-50",
            border: "border-amber-200",
            text: "text-amber-700",
            icon: <AlertCircle size={20} className="text-amber-600" />
        },
        error: {
            bg: "bg-red-50",
            border: "border-red-200",
            text: "text-red-700",
            icon: <AlertCircle size={20} className="text-red-600" />
        }
    };

    const { bg, border, text, icon } = config[type];

    return (
        <div className={`flex items-center gap-3 ${bg} border ${border} ${text} p-4 rounded-lg ${className} relative`}>
            {icon}
            <span className="flex-1">{message}</span>
            {onClose && (
                <button
                    onClick={onClose}
                    className="p-1 hover:opacity-70 transition-opacity absolute top-2 right-2"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
};

export default AlertMessage;