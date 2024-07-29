import { Calendar, NotebookPen, Tag, X } from "lucide-react"
import { Button } from "../../components/button"
import { FormEvent } from "react"
import { api } from "../../lib/axios"
import { useParams } from "react-router-dom"

interface CreateActivityModalProps {
    closeCreateActivityModal: () => void
}

export function CreateActivityModal({
    closeCreateActivityModal
} : CreateActivityModalProps) {
    const { tripId } = useParams()

    async function createActivity(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
    
        const data = new FormData(e.currentTarget)
    
        const title = data.get('title')?.toString()
        const occurs_at = data.get('occurs_at')?.toString()
        const description = data.get('description')?.toString()
        
        await api.post(`/trips/${tripId}/activities`, {
            title,
            occurs_at,
            description,
        })

        window.document.location.reload()

    }

    return (
        <div className='fixed inset-0 bg-black/60 flex items-center justify-center px-4 md:px-0'>
                    <div className='w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5'>
                        <div className='space-y-2'>
                            <div className='flex items-center justify-between'>
                                <h2 className='text-lg font-semibold'>Cadastrar atividade</h2>
                                <button type='button' onClick={closeCreateActivityModal}>
                                    <X className='size-5 text-zinc-400' />
                                </button>
                            </div>
                            <p className='text-sm text-zinc-400'>
                                Todos convidados podem visualizar as atividades.
                            </p>
                            <p className='text-xs text-zinc-400'>
                                Obs: Só é possível cadastrar atividades para as datas selecionadas.
                            </p>
                        </div>
            
                        <form
                        onSubmit={createActivity}
                        className='space-y-3'
                        >
                            <div className='h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
                                <Tag className='text-zinc-400 size-5' />
                                <input 
                                name='title' 
                                placeholder="Qual a atividade?" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" 
                                />
                            </div>

                            <div className='h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
                                <NotebookPen className='text-zinc-400 size-5' />
                                <input 
                                name='description' 
                                placeholder="Descrição da atividade" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" 
                                />
                            </div>
            
                            <div className='h-14 flex-1 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
                                <Calendar className='text-zinc-400 size-5' />
                                <input
                                type="datetime-local"
                                name='occurs_at'
                                placeholder="Data e horário da atividade" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
                                />
                            </div>
                            
                            <Button variant="primary" size="full">
                                Salvar atividade
                            </Button>
                        </form>
                    </div>
                </div>
    )
}