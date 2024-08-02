import { Calendar, NotebookPen, Tag, X } from "lucide-react"
import { Button } from "../../components/button"
import { FormEvent, useEffect, useState } from "react"
import { api } from "../../lib/axios"
import { useParams } from "react-router-dom"

interface CreateActivityModalProps {
    closeCreateActivityModal: () => void
}

interface Trip {
    starts_at: string,
    ends_at: string,
}

export function CreateActivityModal({
    closeCreateActivityModal
} : CreateActivityModalProps) {
    const { tripId } = useParams()
    const [trip, setTrip] = useState<Trip | undefined>()
    const [isInvalidDate, setIsInvalidDate] = useState(false)
    const [title, setTitle] = useState('')
    const [occurs_at, setOccursAt] = useState('')
    const [description, setDescription] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (name === 'title') setTitle(value)
        if (name === 'occurs_at') setOccursAt(value)
        if (name === 'description') setDescription(value)
    }

    useEffect(() => {
        api.get(`/trips/${tripId}`).then(response => setTrip(response.data.trip)
        )
    }, [tripId])

    
    

    async function createActivity(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
    
        if (!title && !occurs_at) {
            return
        }

        const activityDate = new Date(occurs_at).toISOString();
        const currentDate = new Date().toISOString();
        const tripStartDate = trip?.starts_at.slice(0, 10)
        const tripEndDate = trip?.ends_at.slice(0, 10)
        
    
        if (activityDate < currentDate ) {
            setIsInvalidDate(true)
            setTimeout(() => setIsInvalidDate(false), 1200)
            return
        }

        if (tripStartDate === undefined || tripEndDate === undefined) {
            return
        }

        if (activityDate.slice(0, 10) < tripStartDate) {
            alert('Por favor verifique a data de início da viagem!')
            return
        }

        if (activityDate.slice(0, 10) > tripEndDate) {
            alert('Por favor verifique a data do término da viagem!')
            return
        }
        
        
        await api.post(`/trips/${tripId}/activities`, {
            title,
            occurs_at,
            description,
        })
        

        closeCreateActivityModal()
        window.document.location.reload()

    }

    const isFormValid = title && occurs_at

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
                                value={title}
                                onChange={handleChange}
                                minLength={4}
                                placeholder="Qual a atividade?" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" 
                                />
                            </div>

                            <div className='h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
                                <NotebookPen className='text-zinc-400 size-5' />
                                <input 
                                name='description'
                                value={description}
                                onChange={handleChange}
                                placeholder="Descrição da atividade" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" 
                                />
                            </div>
            
                            <div className='h-14 flex-1 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
                                <Calendar className='text-zinc-400 size-5' />
                                <input
                                type="datetime-local"
                                name='occurs_at'
                                value={occurs_at}
                                onChange={handleChange}
                                placeholder="Data e horário da atividade" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
                                />
                            </div>

                            {!isFormValid ? (
                                <Button disabled={!isFormValid} variant="secondary" size="full">
                                    Insira as informações restantes
                                </Button>
                            ) : (
                                <Button variant={isInvalidDate ? "alert" : "primary"} size="full">
                                    {isInvalidDate ? "Data inválida!" : "Salvar atividade"}
                                </Button>
                            )}

                        </form>
                    </div>
                </div>
    )
}