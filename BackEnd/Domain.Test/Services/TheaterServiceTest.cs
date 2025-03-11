using AutoFixture;
using Data.Data;
using Domain.Services.TheaterService;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Test
{
    [TestClass]
    public class TheaterServiceTest
    {
        private readonly Fixture fixture;
        private readonly Mock<ITheaterDataService> theaterDataServiceMock;
        private readonly TheaterService theaterService;

        public TheaterServiceTest()
        {
            fixture = new Fixture();

            theaterDataServiceMock = new Mock<ITheaterDataService>(MockBehavior.Strict);

            theaterService = new TheaterService(theaterDataServiceMock.Object);
        }

        [TestMethod]
        public void GetSeatsReturnSeats()
        {
            // Arrange 
            var seatData = fixture.Create<Dictionary<int, bool>>();
            theaterDataServiceMock.Setup(m => m.GetSeats()).Returns(seatData);

            // Act
            var result = theaterService.GetSeats();

            // Assert
            theaterDataServiceMock.Verify(m => m.GetSeats(), Times.Once);
        }

        [TestMethod]
        public void TooLargeBookingThrowsException()
        {
            // Arrange 
            var seatNumbers = new List<int>() { 1, 2, 3, 4, 5, 6, 7 };

            // Act & Assert
            Assert.ThrowsExceptionAsync<ArgumentException>(() => theaterService.BookSeats(seatNumbers));
        }

        [TestMethod]
        public void TooLargeSeatNumberThrowsException()
        {
            // Arrange 
            var seatNumbers = new List<int>() { 0, 1, 2, Common.Constants.NUMBER_OF_SEATS };

            // Act & Assert
            Assert.ThrowsExceptionAsync<ArgumentException>(() => theaterService.BookSeats(seatNumbers));
        }

        [TestMethod]
        public void NegativeSeatNumberThrowsException()
        {
            // Arrange 
            var seatNumbers = new List<int>() { -1, 0, 1, 2 };

            // Act & Assert
            Assert.ThrowsExceptionAsync<ArgumentException>(() => theaterService.BookSeats(seatNumbers));
        }

        [TestMethod]
        public async Task DoesNotDoubleBook()
        {
            // Arrange 
            var seatData = new Dictionary<int, bool>
            {
                { 0, false },
                { 1, true },
                { 2, true }
            };

            theaterDataServiceMock.Setup(m => m.GetSeats()).Returns(seatData);

            var seatNumbers = new List<int>() { 0, 1 };

            // Act
            var result = await theaterService.BookSeats(seatNumbers);

            // Assert
            Assert.IsNull(result);
            theaterDataServiceMock.Verify(m => m.Save(It.IsAny<Dictionary<int, bool>>()), Times.Never);
        }

        [TestMethod]
        public async Task SuccesfullyBooks()
        {
            // Arrange 
            var seatData = new Dictionary<int, bool>
            {
                { 0, true },
                { 1, true },
                { 2, true }
            };

            theaterDataServiceMock.Setup(m => m.GetSeats()).Returns(seatData);


            var seatNumbers = new List<int>() { 0, 1 };

            var expected = new Dictionary<int, bool>
            {
                { 0, false },
                { 1, false },
                { 2, true }
            };

            theaterDataServiceMock.Setup(m => m.Save(expected)).Returns(expected);

            // Act
            var result = await theaterService.BookSeats(seatNumbers);

            // Assert
            Assert.IsNotNull(result);
            theaterDataServiceMock.Verify(m => m.Save(expected), Times.Once);
        }
    }
}
