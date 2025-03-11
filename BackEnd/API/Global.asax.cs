using Application.Handlers.TheaterHandlers;
using Autofac;
using Autofac.Integration.WebApi;
using Data.Data;
using Data.Data.TheaterDataService;
using Domain.Services;
using Domain.Services.TheaterService;
using MediatR.Extensions.Autofac.DependencyInjection;
using MediatR.Extensions.Autofac.DependencyInjection.Builder;
using System.Reflection;
using System.Web.Http;


namespace MovieTheaterBackend
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);

            var formatters = GlobalConfiguration.Configuration.Formatters;

            var builder = new ContainerBuilder();

            var assembly = Assembly.GetExecutingAssembly();

            builder.RegisterApiControllers(assembly);

            //Måste kanske göra för varje request??
            var configuration = MediatRConfigurationBuilder
                .Create(typeof(GetSeatsRequest).Assembly)
                .WithAllOpenGenericHandlerTypesRegistered()
                .Build();

            builder.RegisterMediatR(configuration);

            builder.RegisterType<TheaterService>().As<ITheaterService>().InstancePerLifetimeScope();
            builder.RegisterType<TheaterDataService>().As<ITheaterDataService>().SingleInstance();


            var container = builder.Build();

            var resolver = new AutofacWebApiDependencyResolver(container);
            GlobalConfiguration.Configuration.DependencyResolver = resolver;
        }
    }
}
