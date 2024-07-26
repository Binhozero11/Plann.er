import { CircleCheck, CircleDashed, X } from "lucide-react";
import { api } from "../../lib/axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ConfirmationModal } from "./steps/confirmationModal ";
import { DeleteActivity } from "./steps/deleteActivities";

interface Activities {
    date: string
    activities: {
        id: string
        title: string
        occurs_at: string
    }[]
}

export function Activities() {
    const { tripId } = useParams()
    const [ activities, setActivities ] = useState<Activities[]>([])
    const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set())
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedActivity, setSelectedActivity] = useState<string | null>(null)
    const [actionType, setActionType] = useState<'complete' | 'incomplete' | null>(null)

    useEffect(() => {
        api.get(`/trips/${tripId}/activities`).then(response => setActivities(response.data.activities)
        )
    }, [tripId])

    function toggleActivityCompletion(activityId: string) {
        const isCompleted = completedActivities.has(activityId);
        setSelectedActivity(activityId);
        setActionType(isCompleted ? 'incomplete' : 'complete');
        setIsModalOpen(true);
    }

    function deleteActivity(activityId: string) {
        setSelectedActivity(activityId);
        setIsDeleteModalOpen(true);
    }

    async function handleConfirmDelete() {
        if (selectedActivity === null) return;
    
        try {
            // Enviar solicitação de exclusão para o servidor
            await api.delete(`activities/${selectedActivity}`);
    
            // Atualizar o estado local
            setActivities(prevActivities => {
                return prevActivities.map(category => ({
                    ...category,
                    activities: category.activities.filter(activity => activity.id !== selectedActivity)
                }))
            });
    
            // Fechar o modal
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error("Failed to delete activity:", error);
            // Opcionalmente, você pode mostrar uma mensagem de erro para o usuário aqui
        }
    }

    function handleDeleteCancel() {
        setIsDeleteModalOpen(false);
    }

    function handleConfirm() {
        if (selectedActivity === null || actionType === null) return;

        setCompletedActivities(prevState => {
            const newState = new Set(prevState);
            if (actionType === 'complete') {
                newState.add(selectedActivity);
            } else {
                newState.delete(selectedActivity);
            }
            return newState;
        });

        setIsModalOpen(false);
        setSelectedActivity(null);
        setActionType(null);
    }

    function handleCancel() {
        setIsModalOpen(false);
        setSelectedActivity(null);
        setActionType(null);
    }
    
    return (
        <div className="space-y-8">
            {activities.map(category => {
                return (
                    <div key={category.date} className="space-y-2.5">
                        <div className="flex gap-2 items-baseline">
                            <span className="text-xl text-zinc-300 font-semibold">Dia {format(category.date, 'd')}</span>
                            <span className="text-xs text-zinc-500">{format(category.date, 'EEEE', { locale: ptBR })}</span>
                        </div>
                        {category.activities.length > 0 ? (
                            <div>
                                {category.activities.map(activity => {
                                    const isCompleted = completedActivities.has(activity.id);
                                    return (
                                        <div key={activity.id} className="space-y-2.5">
                                            <div className="my-2 px-4 py-2.5 bg-zinc-900 rounded-xl shadow-shape flex items-center gap-3">
                                                <div onClick={() => toggleActivityCompletion(activity.id)}>
                                                    {isCompleted ? (
                                                        <CircleCheck className="size-5 text-lime-300" />
                                                    ) : (
                                                        <CircleDashed className="text-zinc-400 size-5 shrink-0" />
                                                    )}
                                                </div>
                                                
                                                <span className="flex-1 text-zinc-100">{activity.title}</span>

                                                <span className="text-zinc-400 text-sm ml-auto">{format(activity.occurs_at, 'HH:mm')}h</span>

                                                <button type='button' onClick={() => deleteActivity(activity.id)}>
                                                    <X className='size-5 text-zinc-400' />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                                
                            </div>
                        ) : (
                            <p className="text-zinc-500 text-sm">Nenhuma atividade cadastrada nessa data.</p>
                        )}
                    </div>
                )
            })}

            <ConfirmationModal
                isOpen={isModalOpen}
                activityTitle={selectedActivity ? activities.flatMap(category => category.activities).find(activity => activity.id === selectedActivity)?.title || '' : ''}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                onClose={handleCancel}
                actionType={actionType}
            />

            <DeleteActivity 
                isOpen={isDeleteModalOpen}
                activityTitle={selectedActivity ? activities.flatMap(category => category.activities).find(activity => activity.id === selectedActivity)?.title || '' : ''}
                onConfirm={handleConfirmDelete}
                onCancel={handleDeleteCancel}
                onClose={handleDeleteCancel}
            />
        </div>
    )
}