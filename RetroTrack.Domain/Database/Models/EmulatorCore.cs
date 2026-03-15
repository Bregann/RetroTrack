using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Domain.Database.Models
{
    public class EmulatorCore
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public required int EmulatorId { get; set; }

        [ForeignKey(nameof(EmulatorId))]
        public virtual Emulator Emulator { get; set; } = null!;

        [Required]
        public required string CoreName { get; set; }

        [Required]
        public required string CoreFileName { get; set; }

        public virtual ICollection<EmulatorCoreConsole> EmulatorCoreConsoles { get; set; } = null!;
    }
}
