using Common.Types;
using MediatR;
using System.Collections.Generic;

namespace Application.Handlers.TheaterHandlers
{
    public class BookSeatsRequest : IRequest<List<Seat>>
    {
        public List<int> SeatNumbers {get; set; }
    }
}
