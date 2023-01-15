using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Infrastructure.Database.Models
{
    public class UndevvedGames
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public required int Id { get; set; }

        [Required]
        public required string Title { get; set; }

        [Required]
        public required GameConsoles GameConsole { get; set; }

        public string? Developer { get; set; } = null;
    }
}
