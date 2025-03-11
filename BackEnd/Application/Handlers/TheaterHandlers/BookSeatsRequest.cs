using Common.Types;
using MediatR;
using System.Collections.Generic;

namespace Application.Handlers.TheaterHandlers
{
    public class BookSeatsRequest : IRequest<List<SeatData>>
    {
        public List<int> SeatNumbers {get; set; }
    }
}
