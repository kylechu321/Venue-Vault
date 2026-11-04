import {PropsWithChildren} from "react";
import {cn} from "@/lib/utils"

// Set of components to build the table of hirers
function HirerTable({children}: PropsWithChildren) {
    return (
        <table className="w-full">
            {children}
        </table>
    )
}

function HirerTableHeader({children}: PropsWithChildren) {
    return (
        <thead className="bg-gray-200">{children}</thead>
    )
}

function HirerTableRow({children, ...props}: PropsWithChildren) {
    return (
        <tr {...props}>{children}</tr>
    )
}

function HirerTableHead({children, ...props}: PropsWithChildren){
    return (<th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider" {...props}>{children}</th>)
}

function HirerTableCell({className, children, ...props}: PropsWithChildren & {className?: string}) {
    return (<td className={cn("px-4 py-3 text-sm text-gray-800", className)} {...props}>{children}</td>)
}

function HirerTableBody({children, ...props}: PropsWithChildren){
    return (
        <tbody className="divide-y divide-gray-300" {...props}>
            {children}
         </tbody>
    );
}

export {HirerTable, HirerTableHeader, HirerTableRow, HirerTableHead, HirerTableCell, HirerTableBody};