using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Domain.Database.Models
{
    public class EmulatorCoreConsole
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        public required int EmulatorCoreId { get; set; }

        [ForeignKey(nameof(EmulatorCoreId))]
        public virtual EmulatorCore EmulatorCore { get; set; } = null!;

        [Required]
        public required int ConsoleId { get; set; }

        [ForeignKey(nameof(ConsoleId))]
        public virtual GameConsole GameConsole { get; set; } = null!;
    }
}
