using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Domain.Database.Models
{
    public class Emulator
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required]
        public required string DefaultExe { get; set; }

        [Required]
        public required bool IsEnabled { get; set; }

        [Required]
        public required int SortOrder { get; set; }

        public virtual ICollection<EmulatorConsole> EmulatorConsoles { get; set; } = null!;
        public virtual ICollection<EmulatorCore> EmulatorCores { get; set; } = null!;
    }
}
