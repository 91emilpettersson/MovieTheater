using Application.Handlers.TheaterHandlers;
using Common.Types;
using MediatR;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;

namespace MovieTheaterBackend.Controllers
{
    [RoutePrefix("api/theater")]
    public class TheaterController : ApiController
    {
        private readonly IMediator mediator;

        public TheaterController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet]
        [Route("seats")]
        public async Task<List<Seat>> Get()
        {
            return await mediator.Send(new GetSeatsRequest());
        }


        [HttpPatch]
        [Route("book")]
        public async Task<IHttpActionResult> Patch([FromBody] List<int> seatNumbers)
        {
            if(seatNumbers == null)
            {
                return BadRequest("Invalid input");
            }

            if(seatNumbers.Count == 0)
            {
                return BadRequest("No seats in input.");
            }

            try
            {
                var newSeatData = await mediator.Send(new BookSeatsRequest()
                {
                    SeatNumbers = seatNumbers,
                });

                if (newSeatData == null)
                {
                    return BadRequest("At least one of these seats are taken.");
                }

                //Why is this needed here when it is set in webApiConfig?
                var jsonFormatter = GlobalConfiguration.Configuration.Formatters.JsonFormatter;
                jsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

                return Json(newSeatData, jsonFormatter.SerializerSettings);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
