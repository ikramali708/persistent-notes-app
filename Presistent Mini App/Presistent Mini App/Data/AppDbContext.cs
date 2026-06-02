using Microsoft.EntityFrameworkCore;
using Presistent_Mini_App.Models;

namespace Presistent_Mini_App.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Note> Notes { get; set; }
    }
}