import { User, X } from "lucide-react"
import { FormEvent } from "react"
import { Button } from "../../components/button"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"

interface ConfirmTripModalProps {
    closeConfirmTripModal: () => void
    createTrip: (e: FormEvent<HTMLFormElement>) => void
    setOwnerEmail: (email: string) => void
    setOwnerName: (name: string) => void
    destination: string
    eventStartAndEndDates: DateRange | undefined
    emailsToInvite: string[]
    isGuestInputOpen: boolean
}

export function ConfirmTripModal({
    closeConfirmTripModal,
    createTrip,
    setOwnerEmail,
    setOwnerName,
    destination,
    eventStartAndEndDates,
    emailsToInvite,
    isGuestInputOpen,
} : ConfirmTripModalProps) {

  const displayedDate = eventStartAndEndDates ? `${format(eventStartAndEndDates.from!, "d 'de' LLL")} até ${format(eventStartAndEndDates.to!, "d 'de' LLL")}` : null;
    
    return (
        <div className='fixed inset-0 bg-black/60 flex items-center justify-center px-4 md:px-0'>
          <div className='w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5'>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <h2 className='text-lg font-semibold'>Confirmar criação de viagem</h2>
                <button type='button' onClick={closeConfirmTripModal}>
                  <X className='size-5 text-zinc-400' />
                </button>
              </div>
              {eventStartAndEndDates && destination && emailsToInvite.length > 0 ? (
                <p className='text-sm text-zinc-400'>
                  Para concluir a criação da viagem para <span className='font-semibold text-zinc-100'>{destination}</span> nas datas de <span className='font-semibold text-zinc-100'>{displayedDate}</span> preencha seus dados abaixo:
                </p>

              ) : (
                  <p className="text-sm">Faltando alguma das informações anteriores...</p>
              )}
            </div>
            

            <form
            onSubmit={createTrip}
            className='space-y-3'
            >
              <div className='h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
                <User className='text-zinc-400 size-5' />
                <input
                name='name'
                required
                placeholder="Seu nome completo" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" 
                onChange={event => setOwnerName(event.target.value)}
                />
              </div>

              <div className='h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
                <User className='text-zinc-400 size-5' />
                <input 
                type="email" 
                name='email'
                required
                placeholder="Seu e-mail pessoal" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
                onChange={event => setOwnerEmail(event.target.value)}
                />
              </div>

              {eventStartAndEndDates && destination && emailsToInvite.length > 0 ? (
                <Button type='submit' variant="primary" size="full">
                Confirmar criação da viagem
                </Button>
              ) : (
                <Button disabled={isGuestInputOpen} variant="secondary" size="full">
                  Insira as informações restantes
                </Button>
              )}

            </form>
          </div>
        </div>
    )
}