using Common.Types;
using Domain.Services;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Handlers.TheaterHandlers
{
    public class GetSeatsHandler : IRequestHandler<GetSeatsRequest, List<Seat>>
    {
        private readonly ITheaterService theaterService;
        
        public GetSeatsHandler(ITheaterService theaterService)
        {
            this.theaterService = theaterService;
        }

        public async Task<List<Seat>> Handle(GetSeatsRequest request, CancellationToken cancellationToken)
        {
            return await theaterService.GetSeats();
        }
    }
}
