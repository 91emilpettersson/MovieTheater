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
        Task<List<SeatData>> GetSeats();

        Task<List<SeatData>> BookSeats(List<int> seatNumbers);
    }
}
