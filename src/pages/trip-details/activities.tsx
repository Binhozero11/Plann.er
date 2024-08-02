import { CircleCheck, CircleDashed, X } from "lucide-react";
import { api } from "../../lib/axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format, isPast, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ConfirmationModal } from "./steps/confirmationModal ";
import { DeleteActivity } from "./steps/deleteActivities";

interface Activities {
    date: string
    activities: {
        id: string
        title: string
        occurs_at: string
        description: string
        completed?: boolean
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
    const [expandedActivity, setExpandedActivity] = useState<string | null>(null);
    const [ expiredActivities, setExpiredActivities ] = useState<Set<string>>(new Set());

    useEffect(() => {
        api.get(`/trips/${tripId}/activities`).then(response => {
            const activitiesData: Activities[] = response.data.activities;
            setActivities(activitiesData);

            const completedActivitiesFromServer = new Set(
                activitiesData
                  .flatMap(category => category.activities)
                  .filter(activity => activity.completed)
                  .map(activity => activity.id)
              );
          
              setCompletedActivities(completedActivitiesFromServer);

            const expiredSet = new Set<string>();

            activitiesData.forEach(category => {
                category.activities.forEach(activity => {
                    const activityDate = parseISO(activity.occurs_at);
                    if (isPast(activityDate) && !completedActivitiesFromServer.has(activity.id)) {
                        expiredSet.add(activity.id);
                    }
                });
            });

            setExpiredActivities(expiredSet);

        });
        
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

    function toggleActivityDescription(activityId: string) {
        setSelectedActivity(activityId);
        setExpandedActivity(prev => prev === activityId ? null : activityId)
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

    async function handleConfirm() {
        if (selectedActivity === null || actionType === null) return;

        if (actionType === 'complete') {
            await api.post(`/activities/${selectedActivity}/complete`);
        } else {
            await api.post(`/activities/${selectedActivity}/incomplete`);
        }

        setCompletedActivities(prevState => {
            const newState = new Set(prevState);
            if (actionType === 'complete') {
                newState.add(selectedActivity);

                setExpiredActivities(prevExpired => {
                    const updateExpired = new Set(prevExpired);
                    updateExpired.delete(selectedActivity);
                    return updateExpired;
                })
            } else if (actionType === 'incomplete' /*algo aqui*/) {
                newState.delete(selectedActivity);
                
                setExpiredActivities(prevExpired => {
                    const updateExpired = new Set(prevExpired);
                    const activity = activities.flatMap(category => category.activities).find(activity => activity.id === selectedActivity);
                    if (activity) {
                        const activityDate = parseISO(activity.occurs_at)
                        if (isPast(activityDate)) {
                            updateExpired.add(selectedActivity);        
                        } else {
                            updateExpired.delete(selectedActivity);
                        }
                    }
                    
                    return updateExpired;
                })
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
                                    const isExpanded = expandedActivity === activity.id;
                                    const isPastDue = expiredActivities.has(activity.id);
                                    const activityDueButton = isPastDue ? 'text-red-400 size-5 shrink-0 cursor-pointer' : 'text-zinc-400 size-5 shrink-0 cursor-pointer';
                                    return (
                                        <div key={activity.id} className='space-y-2.5'>
                                            <div className={'my-2 bg-zinc-900 rounded-xl shadow-shape flex flex-col'}>
                                                {isPastDue && (
                                                    <div className="text-sm p-2 bg-red-500 text-white font-semibold rounded-t-lg">
                                                        <p>Atividade vencida!</p>
                                                    </div>
                                                )}
                                                
                                                <div className=" px-4 py-2.5 bg-zinc-900 rounded-xl flex items-center gap-3">
                                                    <div title="Marcar como concluído" onClick={() => toggleActivityCompletion(activity.id)}>
                                                        {isCompleted ? (
                                                            <CircleCheck className="size-5 text-lime-300 cursor-pointer" />
                                                        ) : (
                                                            <CircleDashed className={activityDueButton} />
                                                        )}
                                                    </div>
                                                    
                                                    <div title="Ver descrição" className="cursor-pointer" onClick={() => toggleActivityDescription(activity.id)}>
                                                        <span className="select-none flex-1 text-zinc-50">{activity.title}</span>
                                                    </div>

                                                    <span className="text-zinc-400 text-sm ml-auto">{format(activity.occurs_at, 'HH:mm')}h</span>

                                                    <button title="Apagar atividade" type='button' onClick={() => deleteActivity(activity.id)}>
                                                        <X className='size-5 text-zinc-400' />
                                                    </button>
                                                </div>
                                                {isExpanded && (
                                                    <div className="px-4 py-2 text-zinc-300">
                                                        {/* Substitua o texto abaixo pelo botão de criar descrição caso não tenha e caso tenha exiba ela em vez do botão  */}
                                                        {activity.description !== null ? (
                                                            activity.description
                                                        ) : (
                                                            <p className="text-zinc-500 text-sm">Nenhuma descrição disponível</p>
                                                        )}
                                                    </div>
                                                )}
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