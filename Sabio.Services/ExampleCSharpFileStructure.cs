using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// using statements always go above ^^^^

namespace Sabio.Services
{
    namespace InnerNameSpace
    {
        class SomethingElse
        {
            // you CAN'T put namespaces inside of classes or structs or anything else
            // (except another namespace)

            //namespace Bad
            //{
            //}
        }
    }

    // you cannot put methods, properties, fields, variables, code here
    // you CAN put: class, enum, struct

    class ExampleCSharpFileStructure
    {
        // you can put fields:
        public int x;

        // you can put properties (simple version):
        public int Thing { get; set; }

        // you can put properties (more complex version):
        private int _stuff;
        public int Stuff
        {
            // inside of a property, you can ONLY have get and set methods

            get
            {
                // you can put any code in here 
                return _stuff;
            }

            set
            {
                // you can put any code in here 

                if (value < 100)
                    throw new ArgumentException("can't be less than 100");

                _stuff = value;
            }
        }

        // you can put methods:
        public void DoSomething()
        {
            // in here, you can put code than runs

            // you CANNOT put: fields, properties, other methods*
        }

        // this is an error because code cannot appear outside of a method
        // Console.WriteLine("hello");

        // you can also put classes/structs inside of classes/structs
    }
}
