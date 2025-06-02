using Microsoft.EntityFrameworkCore;

namespace RetroTrack.Domain.Database.Context
{
    public class PostgresqlContext : AppDbContext
    {
        public PostgresqlContext(DbContextOptions<PostgresqlContext> options) : base(options) { }
    }
}
