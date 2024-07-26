import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { InviteGuestModal } from './invite-guest-modal';
import { ConfirmTripModal } from './confirm-trip-modal';
import { DestinationAndDateStep } from './steps/destination-and-date-step';
import { InviteGuestsStep } from './steps/invite-guests-step';
import { DateRange } from 'react-day-picker';
import { api } from '../../lib/axios';
import { LoadingTrip } from './steps/loadingTrip';

export function CreateTripPage() {
  const navigate = useNavigate();

  const [isGuestInputOpen, setIsGuestInputOpen] = useState(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [destination, setDestination] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [eventStartAndEndDates, setEventStartAndEndDates] = useState<DateRange | undefined>();

  const [emailsToInvite, setEmailsToInvite] = useState<string[]>([]);

  function openGuestInput() {
    setIsGuestInputOpen(true);
  }

  function closeGuestInput() {
    setIsGuestInputOpen(false);
  }

  function openGuestModal() {
    setIsGuestModalOpen(true);
  }

  function closeGuestModal() {
    setIsGuestModalOpen(false);
  }

  function openConfirmTripModal() {
    setIsConfirmTripModalOpen(true);
  }

  function closeConfirmTripModal() {
    setIsConfirmTripModalOpen(false);
  }

  function addNewEmailToInvite(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const data = new FormData(e.currentTarget)
    const email = data.get('email')?.toString()

    if (!email) {
      return
    }

    if (emailsToInvite.includes(email)) {
      return
    }

    setEmailsToInvite([
      ...emailsToInvite,
      email
    ])

    e.currentTarget.reset();
  }

  function removeEmailFromInvites(emailToRemove: string) {
    const newEmailList = emailsToInvite.filter(email => email !== emailToRemove)

    setEmailsToInvite(newEmailList)
  }

  async function createTrip(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); 
    

    if (!destination || !eventStartAndEndDates?.from ||  !eventStartAndEndDates?.to || emailsToInvite.length === 0 || !ownerName || !ownerEmail || eventStartAndEndDates.from === undefined || eventStartAndEndDates.from === null || eventStartAndEndDates.to === undefined || eventStartAndEndDates.to === null) {
      console.error('Preencha todos os campos obrigatórios.');
      return;
    }

    const dataAtual = new Date()
    dataAtual.setHours(0, 0, 0, 0);
    
    if (eventStartAndEndDates.from < dataAtual) {
      alert('Data inválida! dica: verifique o dia de hoje e o dia que foi colocado para iniciar a viagem')
      return 
    }

    setIsLoading(true);
      
    const response = await api.post('/trips', {
        destination,
        starts_at: eventStartAndEndDates.from,
        ends_at: eventStartAndEndDates.to,
        emails_to_invite: emailsToInvite,
        owner_name: ownerName,
        owner_email: ownerEmail,
    })

    const body = document.querySelector('body')
    body?.addEventListener('click', () => {
       setIsLoading(false) 
    })

    if (response) {
      setIsLoading(false);
    }
      
    const { tripId } = response.data
    
    navigate(`/trips/${tripId}`)
  }

  return (
    <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
      <div className="max-w-3xl w-full px-6 text-center space-y-10">
        <div className='flex flex-col items-center gap-3'>
          <img src="./logo.svg" alt="plann.er" />
          <p className="text-zinc-300 text-lg">Convide seus amigos e planeje sua próxima viagem!</p>
        </div>

        <div className='space-y-4'>
          <DestinationAndDateStep 
            closeGuestInput={closeGuestInput}
            isGuestInputOpen={isGuestInputOpen}
            openGuestInput={openGuestInput}
            setDestination={setDestination}
            eventStartAndEndDates={eventStartAndEndDates}
            setEventStartAndEndDates={setEventStartAndEndDates}
          />

          {isGuestInputOpen && (
            <InviteGuestsStep
              emailsToInvite={emailsToInvite}
              openConfirmTripModal={openConfirmTripModal}
              openGuestModal={openGuestModal}
            />
          )}
        </div>

        <p className="text-sm text-zinc-500">
          Ao planejar sua viagem pelo plann.er você automaticamente concorda <br />
          com nossos <a href="#" className="text-zinc-300 underline">termos de uso</a> e <a href="#" className="text-zinc-300 underline">políticas de privacidade</a>.
        </p>
      </div>

      {isGuestModalOpen && (
        <InviteGuestModal 
          emailsToInvite={emailsToInvite}
          addNewEmailToInvite={addNewEmailToInvite}
          closeGuestModal={closeGuestModal}
          removeEmailFromInvites={removeEmailFromInvites}
        />
      )}

      {isConfirmTripModalOpen && (
        <ConfirmTripModal 
          closeConfirmTripModal={closeConfirmTripModal}
          createTrip={createTrip}
          setOwnerEmail={setOwnerEmail}
          setOwnerName={setOwnerName}
          destination={destination}
          eventStartAndEndDates={eventStartAndEndDates}
          emailsToInvite={emailsToInvite}
          isGuestInputOpen={isGuestInputOpen}
        />
      )}

      {isLoading && (
        <LoadingTrip />
      )}
    </div>
  )
}
