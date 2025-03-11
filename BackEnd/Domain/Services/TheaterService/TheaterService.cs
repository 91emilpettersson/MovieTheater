using Common.Types;
using Data.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.Services.TheaterService
{
    internal class TheaterService : ITheaterService
    {
        private const int BOOKING_LIMIT = 6;
        private static readonly object _lock = new object();

        private readonly ITheaterDataService theaterDataService;
        
        public TheaterService(ITheaterDataService theaterDataService)
        {
            this.theaterDataService = theaterDataService;
        }

        /// <returns>May return null.</returns>
        public async Task<List<Seat>> BookSeats(List<int> seatNumbers)
        {
            if(seatNumbers.Count > BOOKING_LIMIT)
            {
                throw new ArgumentException("Too large booking.");
            }

            if(seatNumbers.Any(s => s < 0 || s >= Common.Constants.NUMBER_OF_SEATS))
            {
                throw new ArgumentException("Invalid seat number(s)");
            }

            List<Seat> savedDatabase = null;

            lock (_lock)
            {
                var bookingsDatabase = theaterDataService.GetSeats();

                if (seatNumbers.Any(key => bookingsDatabase.TryGetValue(key, out bool value) && !value))
                {
                    return null;
                }

                foreach (int seat in seatNumbers)
                {
                    if (bookingsDatabase.ContainsKey(seat))//Bör kunna ta bort
                    {
                        bookingsDatabase[seat] = false;
                    }
                }

                var savedDatabaseDict = theaterDataService.Save(bookingsDatabase);
                savedDatabase = savedDatabaseDict
                    .Select(keyValuePair => new Seat
                    {
                        SeatNumber = keyValuePair.Key,
                        IsAvailable = keyValuePair.Value
                    })
                    .ToList();
            }

            return savedDatabase;
        }

        public async Task<List<Seat>> GetSeats()
        {
            var concurrentDictionary = theaterDataService.GetSeats();

            var seats = new List<Seat>();

            return concurrentDictionary
                .Select(keyValuePair => new Seat {
                    SeatNumber = keyValuePair.Key,
                    IsAvailable = keyValuePair.Value })
                .ToList();
        }
    }
}
