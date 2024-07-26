import { MapPin, Calendar, Settings2 } from "lucide-react";
import { Button } from "../../components/button";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";
import { useEffect, useState } from "react";
import { format } from "date-fns";

interface Trip {
    id: string,
    destination: string,
    starts_at: string,
    ends_at: string,
    is_confirm: boolean,
}

export function DestinationAndDateHeader() {
    const { tripId } = useParams()
    const [ trip, setTrip ] = useState<Trip | undefined>()

    useEffect(() => {
        api.get(`/trips/${tripId}`).then(response => setTrip(response.data.trip)
        )
    }, [tripId])

    const displayedDate = trip ? format(trip.starts_at, "d' de 'LLL").concat(` até `).concat(format(trip.ends_at, "d' de 'LLL")) : null

    return (
        <div className="py-3 px-2 rounded-xl bg-zinc-900 shadow-shape flex flex-col justify-between gap-3 sm:items-center md:gap-0 md:py-0 md:px-4 md:h-16 md:flex-row">
            <div className="flex items-center gap-2">
                <MapPin className="size-5 text-zinc-400" />
                <span className="text-zinc-100">{trip?.destination}</span>
            </div>

            <div className="flex flex-col sm:items-center gap-1.5 sm:gap-5 sm:flex-row">
                <div className="flex items-center gap-2">
                    <Calendar className="size-5 text-zinc-400" />
                    <span className="text-zinc-100">{displayedDate}</span>
                </div>

                <div className='bg-zinc-800 sm:mt-2 sm:mb-1 sm:w-px sm:h-6' />

                <Button variant="secondary">
                    Alterar local/data
                    <Settings2 className='size-5' />
                </Button>
            </div>
        </div>
    )
}