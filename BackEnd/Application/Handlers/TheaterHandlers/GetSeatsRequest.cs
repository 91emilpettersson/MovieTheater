using Common.Types;
using MediatR;
using System.Collections.Generic;

namespace Application.Handlers.TheaterHandlers
{
    public class GetSeatsRequest : IRequest<List<SeatData>>
    {

    }
}
