using System.Collections.Generic;

namespace Data.Data
{
    public interface ITheaterDataService
    {
        Dictionary<int, bool> GetSeats();

        Dictionary<int, bool> Save(Dictionary<int, bool> newBookingDatabase);
    }
}
