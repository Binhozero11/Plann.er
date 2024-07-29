import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateActivityModal } from "./create-activity-modal";
import { ImportantLinks } from "./important-links";
import { Guests } from "./guests";
import { Activities } from "./activities";
import { DestinationAndDateHeader } from "./destination-and-date-header";

export function TripDetailsPage() {
    const [isCreateActivityModalOpen, setIsCreateActivityModalOpen] = useState(false);

    function openCreateActivityModal() {
        setIsCreateActivityModalOpen(true);
    }

    function closeCreateActivityModal() {
        setIsCreateActivityModalOpen(false);
    }

    return (
        <div className="max-w-7xl px-1 space-y-8 sm:px-2 md:px-6 py-4 mx-auto md:py-10">
            <DestinationAndDateHeader />

            <main className="flex flex-col gap-10 px-4 md:gap-16 lg:flex-row">
                <div className="flex-1 space-y-6">
                    <div className="flex flex-col gap-4 sm:gap-0 sm:justify-between sm:flex-row sm:items-center">
                        <h2 className="select-none text-3xl text-center font-semibold sm:text-left">Atividades</h2>
                        <button
                        onClick={openCreateActivityModal}
                        className='select-none bg-lime-300 text-lime-950 rounded-lg px-5 py-2 font-medium flex items-center gap-2 justify-center hover:bg-lime-400'>
                            <Plus className='size-5' />
                            Cadastrar atividade
                        </button>
                    </div>

                    <Activities />
                </div>

                <div className='w-full h-px lg:hidden bg-zinc-800' />

                <div className="md:flex lg:block lg:space-y-6 lg:w-80">
                    <ImportantLinks />
                    <div className='w-full h-px bg-zinc-800 md:w-0 md:h-0 lg:w-full lg:h-px' />
                    <Guests />
                </div>
            </main>


            {isCreateActivityModalOpen && (
                <CreateActivityModal
                    closeCreateActivityModal={closeCreateActivityModal}
                />
            )}
        </div>
    )
}