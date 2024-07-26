import { ArrowRight, UserRoundPlus } from "lucide-react";
import { Button } from "../../../components/button";

interface InviteGuestsStepProps {
    openGuestModal: () => void
    emailsToInvite: string[]
    openConfirmTripModal: () => void
}

export function InviteGuestsStep({
    emailsToInvite,
    openConfirmTripModal,
    openGuestModal
} : InviteGuestsStepProps) {
    return (
        <div className="bg-zinc-900 rounded-xl flex flex-col shadow-shape md:flex-row md:items-center md:gap-3 md:h-16 md:px-4">
              <button 
              type='button'
              onClick={openGuestModal}
              className='flex items-center gap-2 flex-1 text-left my-5 px-4 md:my-0 md:px-0'>
                <UserRoundPlus className='size-5 text-zinc-400' />
                {emailsToInvite.length > 0 ? (
                  <span className='text-zinc-100 text-lg flex-1'>
                    {emailsToInvite.length} pessoa(s) convidada(s)
                  </span>
                ): (
                  <span className="text-zinc-400 text-lg flex-1">
                    Quem estará na viagem?
                  </span>
                )}
              </button>
              
              <div className='w-px bg-zinc-800 md:h-6' />

              <Button onClick={openConfirmTripModal} variant="primary">
                Confirmar viagem 
                <ArrowRight className='size-5' />
              </Button>
            </div>
    )
}