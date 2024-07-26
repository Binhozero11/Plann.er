export function LoadingTrip() {
    return (
        <div className='fixed inset-0 bg-black/60 flex items-center justify-center'>
            <button type="button" className="bg-zinc-900 p-4 rounded-md flex items-center gap-2" disabled>
                <div className="h-5 w-5 border-[3px] rounded-3xl border-l-gray-200 border-r-gray-200 border-b-gray-200 border-t-zinc-600 animate-spin ease-linear"></div>
                Carregando...
            </button>
        </div>
    )
}