using System.Collections.Generic;

namespace Data.Data.TheaterDataService
{
    internal class TheaterDataService : ITheaterDataService
    {
        private Dictionary<int, bool> bookingsDatabase;

        //Improvment for a real database: Associate userId to bookings.
        //Improvement: keep seperate bookings for seperate movies.

        public TheaterDataService()
        {
            SetupDatabase();
        }

        public Dictionary<int, bool> Save(Dictionary<int, bool> newBookingDatabase)
        {
            bookingsDatabase = newBookingDatabase;
            return bookingsDatabase;
        }

        public Dictionary<int, bool> GetSeats()
        {
            return bookingsDatabase;
        }

        private void SetupDatabase()
        {
            bookingsDatabase = new Dictionary<int, bool>();

            for (int i = 0; i < Common.Constants.NUMBER_OF_SEATS; i++)
            {
                bookingsDatabase.Add(i, true);
            }
        }
    }
}
