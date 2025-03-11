using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using System;
using System.Diagnostics;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Net;
using System.Collections.Generic;
using System.Linq;

namespace MovieTheaterBackend.Tests.Controllers
{
    [TestClass]
    public class TheaterIntegrationTest
    {
        private static HttpClient client;
        private static Process webAppProcess;

        [ClassInitialize]
        public static void Setup(TestContext context)
        {
            // Start IIS Express (or another server where your API is running)
            string baseDirectory = AppDomain.CurrentDomain.BaseDirectory;
            string relativePath = @"..\..\..\.vs\MovieTheaterBackend\config\applicationhost.config";
            string absolutePath = Path.GetFullPath(Path.Combine(baseDirectory, relativePath));
            Console.WriteLine($"Using applicationhost.config at: {absolutePath}");

            var startInfo = new ProcessStartInfo
            {
                FileName = @"C:\Program Files (x86)\IIS Express\iisexpress.exe",
                Arguments = $"/site:MovieTheaterBackend /config:\"{absolutePath}\"",
                RedirectStandardOutput = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            // Start IIS Express for your API
            webAppProcess = Process.Start(startInfo);
            Thread.Sleep(5000); // Wait for the API to start
        }

        [TestInitialize]
        public void TestSetup()
        {
            // Reset the HttpClient before each test
            client = new HttpClient { BaseAddress = new Uri("http://localhost:49531/") };
        }

        [TestMethod]
        public async Task GetSeatsSuccesful()
        {
            // Act
            var response = await client.GetAsync("api/theater/seats");

            // Assert
            Assert.IsTrue(response.IsSuccessStatusCode);
            var content = await response.Content.ReadAsStringAsync();
            Assert.IsTrue(content.Contains("0"));
            Assert.IsTrue(content.Contains("true"));

        }

        //Improvement: NUnuit or XUnit, do Repeat(n)
        [TestMethod]
        public async Task ConcurrentBookings()
        {
            // Arrange
            var requests = new List<HttpRequestMessage>();

            for(int i = 0; i < 20; i++)
            {
                int[] data = new int[] { 1, 2, 3 };
                var json = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");
                var request = new HttpRequestMessage(new HttpMethod("PATCH"), "api/theater/book")
                {
                    Content = json
                };

                requests.Add(request);
            }

            // Act
            var tasks = new List<Task<HttpResponseMessage>>();

            foreach(var request in requests)
            {
                tasks.Add(client.SendAsync(request));
            }

            var responses = await Task.WhenAll(tasks);

            var succesfulResponses = responses.Where(res => res.StatusCode == HttpStatusCode.OK);

            // Assert
            //Improvement: There are multiple reasons BadRequest are sent back, not just because of seat being taken.
            Assert.AreEqual(1, succesfulResponses.Count());
        }

        [TestCleanup]
        public void TestCleanup()
        {
            // Dispose of the HttpClient after each test
            client?.Dispose();
        }

        [ClassCleanup]
        public static void Cleanup()
        {
            client.Dispose();
            if (!webAppProcess.HasExited)
            {
                webAppProcess.Kill();
            }
        }

    }
}
