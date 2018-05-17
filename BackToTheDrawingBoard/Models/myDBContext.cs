using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace BackToTheDrawingBoard.Models
{
    public partial class myDBContext : DbContext
    {
        public virtual DbSet<Canvas> Canvas { get; set; }
        public virtual DbSet<CavasUser> CavasUser { get; set; }
        public virtual DbSet<LoginTable> LoginTable { get; set; }
        public virtual DbSet<UserTypeTable> UserTypeTable { get; set; }

        public myDBContext(DbContextOptions<myDBContext> options)
   : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Canvas>(entity =>
            {
                entity.Property(e => e.Name)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.String).IsUnicode(false);
            });

            modelBuilder.Entity<CavasUser>(entity =>
            {
                entity.ToTable("Cavas-User");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.CanvasId).HasColumnName("canvasId");

                entity.Property(e => e.UserId).HasColumnName("userId");

                entity.HasOne(d => d.Canvas)
                    .WithMany(p => p.CavasUser)
                    .HasForeignKey(d => d.CanvasId)
                    .HasConstraintName("FK__Table__canvasId__5DCAEF64");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.CavasUser)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK__Table__userId__5CD6CB2B");
            });

            modelBuilder.Entity<LoginTable>(entity =>
            {
                entity.Property(e => e.Login)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.UserType).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.UserTypeNavigation)
                    .WithMany(p => p.LoginTable)
                    .HasForeignKey(d => d.UserType)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_LoginTable_ToUserTypeTable");
            });

            modelBuilder.Entity<UserTypeTable>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(10);
            });
        }
    }
}
