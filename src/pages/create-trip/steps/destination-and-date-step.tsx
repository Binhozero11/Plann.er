import { ArrowRight, Calendar, MapPin, Settings2, X } from "lucide-react";
import { Button } from "../../../components/button";
import { useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import { format } from "date-fns"
import "react-day-picker/dist/style.css";

interface DestinationAndDateStepProps {
    isGuestInputOpen: boolean
    closeGuestInput: () => void
    openGuestInput: () => void
    setDestination: (destination: string) => void
    setEventStartAndEndDates: (dates: DateRange | undefined) => void
    eventStartAndEndDates: DateRange | undefined
}

export function DestinationAndDateStep({
    closeGuestInput,
    isGuestInputOpen,
    openGuestInput,
    setDestination,
    setEventStartAndEndDates,
    eventStartAndEndDates,
} : DestinationAndDateStepProps) {
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    function openDatePicker() {
      setIsDatePickerOpen(true);
    }

    function closeDatePicker() {
      setIsDatePickerOpen(false);
    }

    const displayedDate = eventStartAndEndDates && eventStartAndEndDates.from && eventStartAndEndDates.to ? format(eventStartAndEndDates.from, "d' de 'LLL").concat(` até `).concat(format(eventStartAndEndDates.to, "d' de 'LLL")) : null
    
    return (
        <div className="bg-zinc-900 rounded-xl flex flex-col shadow-shape md:h-16 md:px-4 md:flex-row md:items-center md:gap-3">

          <div className='flex items-center gap-2 flex-1 my-5 px-4 md:my-0 md:px-0'>
            <MapPin className='size-5 text-zinc-400' />
            <input 
            disabled={isGuestInputOpen} 
            type="text" 
            placeholder="Para onde você vai?" 
            className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
            onChange={event => setDestination(event.target.value)}
            />
          </div>
          
          <button onClick={openDatePicker} disabled={isGuestInputOpen} className='flex items-center gap-2 text-left px-4 md:w-[240px] md:px-0'>
            <Calendar className='size-5 text-zinc-400' />
            <span className="text-lg text-zinc-400 w-40 flex-1">
              {displayedDate || "Quando?"}
            </span>
          </button>

          {isDatePickerOpen && (
            <div className='fixed inset-0 bg-black/60 flex items-center justify-center px-1'>
              <div className='rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5'>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <h2 className='text-lg font-semibold'>Selecione a data</h2>
                    <button type='button' onClick={closeDatePicker}>
                      <X className='size-5 text-zinc-400' />
                    </button>
                  </div>
                </div>

                <DayPicker className="--rdp-accent-color " mode="range" selected={eventStartAndEndDates} onSelect={setEventStartAndEndDates} />
              </div>
            </div>
          )}


          <div className='w-px h-6 bg-zinc-800' />
            {isGuestInputOpen ? (
              <Button onClick={closeGuestInput} variant="secondary">
                Alterar local/data
                <Settings2 className='size-5' />
              </Button>
            ) : (
              <Button onClick={openGuestInput} variant="primary">
                Continuar
                <ArrowRight className='size-5' />
              </Button>
            )}
          </div>
  ) 
}