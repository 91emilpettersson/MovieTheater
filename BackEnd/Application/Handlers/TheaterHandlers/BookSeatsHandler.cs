using Common.Types;
using Domain.Services;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Handlers.TheaterHandlers
{
    public class BookSeatsHandler : IRequestHandler<BookSeatsRequest, List<Seat>>
    {
        private readonly ITheaterService theaterService;

        public BookSeatsHandler(ITheaterService theaterService)
        {
            this.theaterService = theaterService;
        }

        public async Task<List<Seat>> Handle(BookSeatsRequest request, CancellationToken cancellationToken)
        {
            return await theaterService.BookSeats(request.SeatNumbers);
        }
    }
}
