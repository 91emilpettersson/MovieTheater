using Common.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services
{
    public interface ITheaterService
    {
        Task<List<Seat>> GetSeats();

        Task<List<Seat>> BookSeats(List<int> seatNumbers);
    }
}
