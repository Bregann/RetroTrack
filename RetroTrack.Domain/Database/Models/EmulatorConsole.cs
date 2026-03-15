using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Domain.Database.Models
{
    public class EmulatorConsole
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        public required int EmulatorId { get; set; }

        [ForeignKey(nameof(EmulatorId))]
        public virtual Emulator Emulator { get; set; } = null!;

        [Required]
        public required int ConsoleId { get; set; }

        [ForeignKey(nameof(ConsoleId))]
        public virtual GameConsole GameConsole { get; set; } = null!;
    }
}
