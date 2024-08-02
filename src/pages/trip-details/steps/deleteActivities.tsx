import { Button } from "../../../components/button";
import { X } from "lucide-react";

interface DeleteActivityProps {
    isOpen: boolean;
    activityTitle: string;
    onConfirm: () => void;
    onCancel: () => void;
    onClose: () => void;
}

export function DeleteActivity({
    isOpen,
    activityTitle,
    onCancel,
    onClose,
    onConfirm,
}: DeleteActivityProps) {
    if (!isOpen) {
        return null;
    }

    const actionMessage = `Você realmente deseja excluir a tarefa "${activityTitle}"?`;

    const titleMessage = 'Excluir Atividade?';

    return (
        <div className='fixed inset-0 bg-black/60 flex items-center justify-center px-4 md:px-0'>
            <div className='w-[400px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5'>
                <div className='flex items-center justify-between'>
                    <h2 className='text-lg font-semibold'>{titleMessage}</h2>
                    <button type='button' onClick={onClose}>
                        <X className='size-5 text-zinc-400' />
                    </button>
                </div>
                <p className='text-sm text-zinc-400'>
                    {actionMessage}
                </p>
                <div className='flex justify-between gap-3'>
                    <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
                    <Button variant="alert" onClick={onConfirm}>Excluir</Button>
                </div>
            </div>
        </div>
    )
}