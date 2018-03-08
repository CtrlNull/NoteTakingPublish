using Microsoft.Practices.Unity;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Services;
using Sabio.Services.Cryptography;
using Sabio.Services.Interfaces;
using Sabio.Web.Core.Services;
using System.Configuration;
using System.Security.Principal;
using System.Threading;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using Unity.WebApi;

namespace Sabio.Web
{
    public static class UnityConfig
    {
        public static void RegisterComponents()
        {
            var container = new UnityContainer();

            // register all your components with the container here
            // it is NOT necessary to register your controllers

            // e.g. container.RegisterType<ITestService, TestService>();
            

            //this should be per request
            container.RegisterType<IAuthenticationService, OwinAuthenticationService>();

            container.RegisterType<ICryptographyService, Base64StringCryptographyService>(new ContainerControlledLifetimeManager());

            // In English, this means:
            // "when someone asks for a IExampleEntityService, give them a new instance of ExampleEntityService"
            container.RegisterType<IExampleEntityService, ExampleEntityService>();

            container.RegisterType<IDataProvider, SqlDataProvider>(
                new InjectionConstructor(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString));

            container.RegisterType<IPrincipal>(new TransientLifetimeManager(),
                     new InjectionFactory(con => HttpContext.Current.User));


            container.RegisterType<IUserService, UserService>(new ContainerControlledLifetimeManager());

            container.RegisterType<IBackupService, BackupService>();
     
            container.RegisterType<INoteClientSyncService, NoteClientSyncService>(new ContainerControlledLifetimeManager());
            GlobalConfiguration.Configuration.DependencyResolver = new UnityDependencyResolver(container);

            DependencyResolver.SetResolver(new Unity.Mvc5.UnityDependencyResolver(container));


        }
    }
}
