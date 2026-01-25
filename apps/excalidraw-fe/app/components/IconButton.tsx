import { ReactNode } from "react";

export function IconButton({
    icon, onClick, isActivated
}: {
    icon: ReactNode,
    onClick: () => void,
    isActivated: boolean
}) {
    return <div onClick={onClick} className={`pointer rounded-lg ${!isActivated ? "hover:bg-[#2E2D39]" : ""} p-2.5 size-9 ${isActivated ? "bg-[#403E6A]" : ""}`}>
        {icon}
    </div>
}

