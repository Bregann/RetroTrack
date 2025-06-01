using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Database.Context
{
    public class PostgresqlContext : AppDbContext
    {
        public PostgresqlContext(DbContextOptions<PostgresqlContext> options) : base(options) { }
    }
}
